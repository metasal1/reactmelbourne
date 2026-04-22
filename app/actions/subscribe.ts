"use server";

import { headers } from "next/headers";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export type SubscribeState = {
  ok: boolean;
  message: string;
};

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
  args: Array<{ type: "text" | "integer" | "null"; value?: string | number }>,
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

export async function subscribe(
  _prev: SubscribeState,
  formData: FormData,
): Promise<SubscribeState> {
  const honeypot = String(formData.get("website") ?? "");
  if (honeypot) return { ok: true, message: "Thanks!" };

  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  if (!email || !EMAIL_RE.test(email) || email.length > 254) {
    return { ok: false, message: "That email doesn't look right." };
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
    const result = await tursoExecute(
      url,
      authToken,
      "INSERT INTO subscribers (email, source, user_agent, ip, country) VALUES (?, ?, ?, ?, ?)",
      [
        { type: "text", value: email },
        { type: "text", value: "landing" },
        { type: "text", value: userAgent },
        { type: "text", value: ip },
        { type: "text", value: country },
      ],
    );
    const err = result.results.find((r) => r.type === "error");
    if (err && err.type === "error") {
      if (err.error.message.includes("UNIQUE") || err.error.message.includes("constraint")) {
        return { ok: true, message: "You're already on the list — see you there." };
      }
      return { ok: false, message: "Couldn't save right now. Try again?" };
    }
  } catch {
    return { ok: false, message: "Couldn't save right now. Try again?" };
  }

  const tgToken = process.env.TELEGRAM_BOT_TOKEN;
  const tgChat = process.env.TELEGRAM_CHAT_ID;
  if (tgToken && tgChat) {
    const text = `🆕 react_melbourne subscriber\n\n${email}\n${country || "-"} · ${ip || "-"}`;
    await fetch(`https://api.telegram.org/bot${tgToken}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: tgChat, text, disable_web_page_preview: true }),
    }).catch(() => {});
  }

  return { ok: true, message: "You're in. Welcome." };
}
