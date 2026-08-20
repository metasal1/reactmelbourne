"use server";

import { headers } from "next/headers";
import { RESEND_TEMPLATE_IDS } from "../lib/resend-templates";
import {
  EMAIL_RE,
  esc,
  fromHeader,
  notifyDest,
  sendTemplate,
} from "../lib/resend";

export type ActionState = { ok: boolean; message: string };

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

  const apiKey = process.env.RESEND_API_KEY;
  const fromEmail = process.env.RESEND_FROM_EMAIL;
  if (!apiKey || !fromEmail) {
    return { ok: false, message: "Server not configured." };
  }

  const h = await headers();
  const country = h.get("cf-ipcountry") ?? "";
  const ip = h.get("cf-connecting-ip") ?? "";
  const meta = `${country || "-"} · ${ip || "-"}`;

  const notified = await sendTemplate({
    apiKey,
    from: fromHeader(),
    to: notifyDest(),
    replyTo: email,
    templateId: RESEND_TEMPLATE_IDS.sponsorNotify,
    variables: {
      COMPANY: company,
      CONTACT_NAME: name,
      CONTACT_EMAIL: email,
      KIND: kind || "—",
      NOTES: notes || "—",
      META: meta,
    },
    tags: [
      { name: "category", value: "sponsor" },
      { name: "product", value: "reactmelbourne" },
    ],
  });

  if (!notified.ok) {
    return {
      ok: false,
      message: "Couldn't send right now. Try again in a bit?",
    };
  }

  await sendTemplate({
    apiKey,
    from: fromHeader(),
    to: email,
    templateId: RESEND_TEMPLATE_IDS.sponsorConfirm,
    variables: { CONTACT_NAME: name },
    tags: [
      { name: "category", value: "sponsor-confirm" },
      { name: "product", value: "reactmelbourne" },
    ],
  });

  await notifyTelegram(
    [
      "💰 <b>Sponsor inquiry</b>",
      "",
      `<b>${esc(company)}</b>`,
      `${esc(name)} · <a href="mailto:${esc(email)}">${esc(email)}</a>`,
      kind ? `Type: ${esc(kind)}` : "",
      "",
      notes ? esc(notes) : "(no notes)",
      "",
      meta,
    ]
      .filter(Boolean)
      .join("\n"),
  );

  return {
    ok: true,
    message:
      "We'll be in touch from hello@reactmelbourne.com. A confirmation is on its way to your inbox.",
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

  const apiKey = process.env.RESEND_API_KEY;
  const fromEmail = process.env.RESEND_FROM_EMAIL;
  if (!apiKey || !fromEmail) {
    return { ok: false, message: "Server not configured." };
  }

  const h = await headers();
  const country = h.get("cf-ipcountry") ?? "";
  const ip = h.get("cf-connecting-ip") ?? "";
  const meta = `${country || "-"} · ${ip || "-"}`;

  const notified = await sendTemplate({
    apiKey,
    from: fromHeader(),
    to: notifyDest(),
    replyTo: email,
    templateId: RESEND_TEMPLATE_IDS.talkNotify,
    variables: {
      TITLE: title,
      CONTACT_NAME: name,
      CONTACT_EMAIL: email,
      LENGTH: length || "—",
      ABSTRACT: abstract,
      NOTES: notes || "—",
      META: meta,
    },
    tags: [
      { name: "category", value: "talk" },
      { name: "product", value: "reactmelbourne" },
    ],
  });

  if (!notified.ok) {
    return {
      ok: false,
      message: "Couldn't send right now. Try again in a bit?",
    };
  }

  await sendTemplate({
    apiKey,
    from: fromHeader(),
    to: email,
    templateId: RESEND_TEMPLATE_IDS.talkConfirm,
    variables: {
      CONTACT_NAME: name,
      TITLE: title,
    },
    tags: [
      { name: "category", value: "talk-confirm" },
      { name: "product", value: "reactmelbourne" },
    ],
  });

  await notifyTelegram(
    [
      "🎤 <b>Talk submission</b>",
      "",
      `<b>${esc(title)}</b>`,
      `${esc(name)} · <a href="mailto:${esc(email)}">${esc(email)}</a>`,
      length ? `Length: ${esc(length)}` : "",
      "",
      esc(abstract),
      notes ? "\n" + esc(notes) : "",
      "",
      meta,
    ]
      .filter(Boolean)
      .join("\n"),
  );

  return {
    ok: true,
    message:
      "Thanks — we'll review and reply from hello@reactmelbourne.com. A confirmation is on its way to your inbox.",
  };
}
