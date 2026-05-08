"use server";

import { headers } from "next/headers";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const RESEND_URL = "https://api.resend.com/emails";

export type ActionState = { ok: boolean; message: string };

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function nl2br(s: string): string {
  return escapeHtml(s).replace(/\n/g, "<br/>");
}

async function resendSend(opts: {
  apiKey: string;
  from: string;
  to: string;
  replyTo?: string;
  subject: string;
  text: string;
  html: string;
}): Promise<boolean> {
  try {
    const res = await fetch(RESEND_URL, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${opts.apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: opts.from,
        to: [opts.to],
        ...(opts.replyTo ? { reply_to: opts.replyTo } : {}),
        subject: opts.subject,
        text: opts.text,
        html: opts.html,
      }),
    });
    if (!res.ok) {
      console.error("Resend send failed", res.status, await res.text());
      return false;
    }
    return true;
  } catch (err) {
    console.error("Resend send threw", err);
    return false;
  }
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

function fromHeader(): string {
  const fromEmail = process.env.RESEND_FROM_EMAIL ?? "";
  const fromName = process.env.RESEND_FROM_NAME || "React Melbourne";
  return `${fromName} <${fromEmail}>`;
}

function notifyDest(): string {
  return process.env.NOTIFY_EMAIL || "gm@metasal.xyz";
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

  const notifySubject = `💰 Sponsor inquiry: ${company}`;
  const notifyText = [
    `Company: ${company}`,
    `Contact: ${name} <${email}>`,
    kind ? `Type: ${kind}` : "",
    "",
    notes || "(no notes)",
    "",
    `Source: ${country || "-"} · ${ip || "-"}`,
  ]
    .filter(Boolean)
    .join("\n");
  const notifyHtml = `
<p><strong>${escapeHtml(company)}</strong></p>
<p>${escapeHtml(name)} · <a href="mailto:${escapeHtml(email)}">${escapeHtml(email)}</a></p>
${kind ? `<p>Type: ${escapeHtml(kind)}</p>` : ""}
<hr/>
<p>${notes ? nl2br(notes) : "<em>(no notes)</em>"}</p>
<hr/>
<p style="color:#999;font-size:12px;">${escapeHtml(country || "-")} · ${escapeHtml(ip || "-")}</p>
`.trim();

  const notified = await resendSend({
    apiKey,
    from: fromHeader(),
    to: notifyDest(),
    replyTo: email,
    subject: notifySubject,
    text: notifyText,
    html: notifyHtml,
  });

  if (!notified) {
    return {
      ok: false,
      message: "Couldn't send right now. Try again in a bit?",
    };
  }

  await resendSend({
    apiKey,
    from: fromHeader(),
    to: email,
    subject: "We got your sponsorship inquiry",
    text:
      `Hi ${name},\n\n` +
      `Thanks for reaching out about sponsoring React Melbourne. We've got your message and we'll reply from hello@reactmelbourne.com soon.\n\n` +
      `If anything's missing, just reply to this email.\n\n` +
      `— React Melbourne`,
    html: `
<p>Hi ${escapeHtml(name)},</p>
<p>Thanks for reaching out about sponsoring <strong>React Melbourne</strong>. We've got your message and we'll reply from <a href="mailto:hello@reactmelbourne.com">hello@reactmelbourne.com</a> soon.</p>
<p>If anything's missing, just reply to this email.</p>
<p>— React Melbourne</p>
`.trim(),
  }).catch(() => {});

  await notifyTelegram(
    [
      "💰 <b>Sponsor inquiry</b>",
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

  const notifySubject = `🎤 Talk submission: ${title}`;
  const notifyText = [
    `Title: ${title}`,
    `Speaker: ${name} <${email}>`,
    length ? `Length: ${length}` : "",
    "",
    "Abstract:",
    abstract,
    notes ? "\nNotes:\n" + notes : "",
    "",
    `Source: ${country || "-"} · ${ip || "-"}`,
  ]
    .filter(Boolean)
    .join("\n");
  const notifyHtml = `
<p><strong>${escapeHtml(title)}</strong></p>
<p>${escapeHtml(name)} · <a href="mailto:${escapeHtml(email)}">${escapeHtml(email)}</a></p>
${length ? `<p>Length: ${escapeHtml(length)}</p>` : ""}
<hr/>
<p><strong>Abstract</strong></p>
<p>${nl2br(abstract)}</p>
${notes ? `<hr/><p><strong>Notes</strong></p><p>${nl2br(notes)}</p>` : ""}
<hr/>
<p style="color:#999;font-size:12px;">${escapeHtml(country || "-")} · ${escapeHtml(ip || "-")}</p>
`.trim();

  const notified = await resendSend({
    apiKey,
    from: fromHeader(),
    to: notifyDest(),
    replyTo: email,
    subject: notifySubject,
    text: notifyText,
    html: notifyHtml,
  });

  if (!notified) {
    return {
      ok: false,
      message: "Couldn't send right now. Try again in a bit?",
    };
  }

  await resendSend({
    apiKey,
    from: fromHeader(),
    to: email,
    subject: `We got your talk: ${title}`,
    text:
      `Hi ${name},\n\n` +
      `Thanks for pitching "${title}" to React Melbourne. We'll review and reply from hello@reactmelbourne.com.\n\n` +
      `If anything's missing, just reply to this email.\n\n` +
      `— React Melbourne`,
    html: `
<p>Hi ${escapeHtml(name)},</p>
<p>Thanks for pitching <strong>${escapeHtml(title)}</strong> to React Melbourne. We'll review and reply from <a href="mailto:hello@reactmelbourne.com">hello@reactmelbourne.com</a>.</p>
<p>If anything's missing, just reply to this email.</p>
<p>— React Melbourne</p>
`.trim(),
  }).catch(() => {});

  await notifyTelegram(
    [
      "🎤 <b>Talk submission</b>",
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
      "Thanks — we'll review and reply from hello@reactmelbourne.com. A confirmation is on its way to your inbox.",
  };
}
