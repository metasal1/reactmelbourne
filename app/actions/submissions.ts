"use server";

import { headers } from "next/headers";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type TursoArg = { type: "text" | "integer" | "null"; value?: string | number };

type TursoResult = {
  results: Array<
    | { type: "ok"; response: { type: string; result?: unknown } }
    | { type: "error"; error: { message: string; code?: string } }
  >;
};

async function tursoExecute(
  url: string,
  authToken: string,
  sql: string,
  args: TursoArg[],
): Promise<TursoResult> {
  const httpUrl = url.replace(/^libsql:\/\//, "https://");
  const res = await fetch(`${httpUrl}/v2/pipeline`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${authToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      requests: [
        { type: "execute", stmt: { sql, args } },
        { type: "close" },
      ],
    }),
  });
  if (!res.ok) throw new Error(`Turso HTTP ${res.status}`);
  return (await res.json()) as TursoResult;
}

async function notifyTelegram(text: string) {
  const tgToken = process.env.TELEGRAM_BOT_TOKEN;
  const tgChat = process.env.TELEGRAM_CHAT_ID;
  if (!tgToken || !tgChat) return;
  await fetch(`https://api.telegram.org/bot${tgToken}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: tgChat,
      text,
      parse_mode: "HTML",
      disable_web_page_preview: true,
    }),
  }).catch(() => {});
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

export type ActionState = { ok: boolean; message: string };

export async function submitSponsor(
  data: Record<string, string>,
): Promise<ActionState> {
  const company = (data.company ?? "").trim();
  const name = (data.name ?? "").trim();
  const email = (data.email ?? "").trim().toLowerCase();
  const kind = (data.kind ?? "").trim();
  const notes = (data.notes ?? "").trim();

  if (!company || !name || !email) {
    return { ok: false, message: "A few answers are still empty." };
  }
  if (!EMAIL_RE.test(email) || email.length > 254) {
    return { ok: false, message: "That email doesn't look right." };
  }
  if (company.length > 200 || name.length > 200 || notes.length > 4000) {
    return { ok: false, message: "Some answers are longer than we can store." };
  }

  const url = process.env.TURSO_URL;
  const authToken = process.env.TURSO_AUTH_TOKEN;
  if (!url || !authToken) {
    return { ok: false, message: "Server not configured." };
  }

  const h = await headers();
  const userAgent = h.get("user-agent") ?? "";
  const ip = h.get("cf-connecting-ip") ?? "";
  const country = h.get("cf-ipcountry") ?? "";

  try {
    const r = await tursoExecute(
      url,
      authToken,
      "INSERT INTO sponsor_requests (company, name, email, kind, notes, user_agent, ip, country) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
      [
        { type: "text", value: company },
        { type: "text", value: name },
        { type: "text", value: email },
        { type: "text", value: kind },
        { type: "text", value: notes },
        { type: "text", value: userAgent },
        { type: "text", value: ip },
        { type: "text", value: country },
      ],
    );
    const err = r.results.find((x) => x.type === "error");
    if (err && err.type === "error") {
      return { ok: false, message: "Couldn't save right now. Try again?" };
    }
  } catch {
    return { ok: false, message: "Couldn't save right now. Try again?" };
  }

  await notifyTelegram(
    [
      "💰 <b>Sponsor inquiry</b> → hello@reactmelbourne.com",
      "",
      `<b>${escapeHtml(company)}</b>`,
      `${escapeHtml(name)} · <a href="mailto:${escapeHtml(email)}">${escapeHtml(email)}</a>`,
      kind ? `Type: ${escapeHtml(kind)}` : "",
      "",
      notes ? escapeHtml(notes) : "(no notes)",
      "",
      `${country || "-"} · ${ip || "-"}`,
    ]
      .filter(Boolean)
      .join("\n"),
  );

  return {
    ok: true,
    message:
      "We'll be in touch from hello@reactmelbourne.com. In the meantime, a copy of this is on its way to the organiser.",
  };
}

export async function submitTalk(
  data: Record<string, string>,
): Promise<ActionState> {
  const name = (data.name ?? "").trim();
  const email = (data.email ?? "").trim().toLowerCase();
  const title = (data.title ?? "").trim();
  const abstract = (data.abstract ?? "").trim();
  const length = (data.length ?? "").trim();
  const notes = (data.notes ?? "").trim();

  if (!name || !email || !title || !abstract) {
    return { ok: false, message: "A few answers are still empty." };
  }
  if (!EMAIL_RE.test(email) || email.length > 254) {
    return { ok: false, message: "That email doesn't look right." };
  }
  if (
    name.length > 200 ||
    title.length > 200 ||
    abstract.length > 4000 ||
    notes.length > 4000
  ) {
    return { ok: false, message: "Some answers are longer than we can store." };
  }

  const url = process.env.TURSO_URL;
  const authToken = process.env.TURSO_AUTH_TOKEN;
  if (!url || !authToken) {
    return { ok: false, message: "Server not configured." };
  }

  const h = await headers();
  const userAgent = h.get("user-agent") ?? "";
  const ip = h.get("cf-connecting-ip") ?? "";
  const country = h.get("cf-ipcountry") ?? "";

  try {
    const r = await tursoExecute(
      url,
      authToken,
      "INSERT INTO talk_submissions (name, email, title, abstract, length, notes, user_agent, ip, country) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [
        { type: "text", value: name },
        { type: "text", value: email },
        { type: "text", value: title },
        { type: "text", value: abstract },
        { type: "text", value: length },
        { type: "text", value: notes },
        { type: "text", value: userAgent },
        { type: "text", value: ip },
        { type: "text", value: country },
      ],
    );
    const err = r.results.find((x) => x.type === "error");
    if (err && err.type === "error") {
      return { ok: false, message: "Couldn't save right now. Try again?" };
    }
  } catch {
    return { ok: false, message: "Couldn't save right now. Try again?" };
  }

  await notifyTelegram(
    [
      "🎤 <b>Talk submission</b> → talk@reactmelbourne.com",
      "",
      `<b>${escapeHtml(title)}</b>`,
      `${escapeHtml(name)} · <a href="mailto:${escapeHtml(email)}">${escapeHtml(email)}</a>`,
      length ? `Length: ${escapeHtml(length)}` : "",
      "",
      escapeHtml(abstract),
      notes ? "\n" + escapeHtml(notes) : "",
      "",
      `${country || "-"} · ${ip || "-"}`,
    ]
      .filter(Boolean)
      .join("\n"),
  );

  return {
    ok: true,
    message:
      "Thanks — we'll review and reply from talk@reactmelbourne.com. Real talks beat slide perfection.",
  };
}
