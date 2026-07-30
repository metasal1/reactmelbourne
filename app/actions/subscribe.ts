"use server";

import { headers } from "next/headers";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MEETUP_URL = "https://www.meetup.com/react-melbourne/";

export type SubscribeState = {
  ok: boolean;
  message: string;
};

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

  const rawSource = String(formData.get("source") ?? "landing").trim();
  const source = /^[a-z0-9_-]{1,32}$/i.test(rawSource) ? rawSource : "landing";

  const apiKey = process.env.RESEND_API_KEY;
  const audienceId = process.env.RESEND_AUDIENCE_ID;
  if (!apiKey || !audienceId) {
    return { ok: false, message: "Server not configured." };
  }

  const existing = await resendHasContact(apiKey, audienceId, email);
  if (existing === "error") {
    return { ok: false, message: "Couldn't save right now. Try again?" };
  }
  if (existing === true) {
    return {
      ok: true,
      message: "You're already on the list — see you there.",
    };
  }

  const add = await resendAddContact(apiKey, audienceId, email);
  if (add.status === "error") {
    return { ok: false, message: "Couldn't save right now. Try again?" };
  }
  if (add.status === "existing") {
    return {
      ok: true,
      message: "You're already on the list — see you there.",
    };
  }

  await resendSendWelcome(apiKey, email).catch(() => {});

  const h = await headers();
  const country = h.get("cf-ipcountry") ?? "";
  const ip = h.get("cf-connecting-ip") ?? "";
  const tgToken = process.env.TELEGRAM_BOT_TOKEN;
  const tgChat = process.env.TELEGRAM_CHAT_ID;
  if (tgToken && tgChat) {
    const text = `🆕 react_melbourne subscriber [${source}]\n\n${email}\n${country || "-"} · ${ip || "-"}`;
    await fetch(`https://api.telegram.org/bot${tgToken}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: tgChat, text, disable_web_page_preview: true }),
    }).catch(() => {});
  }

  return {
    ok: true,
    message: "You're in. Welcome.",
  };
}

type AddResult = { status: "new" | "existing" | "error" };

async function resendHasContact(
  apiKey: string,
  audienceId: string,
  email: string,
): Promise<boolean | "error"> {
  try {
    const res = await fetch(
      `https://api.resend.com/audiences/${audienceId}/contacts/${encodeURIComponent(email)}`,
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "User-Agent": "reactmelbourne/1.0",
        },
        cache: "no-store",
      },
    );
    if (res.ok) return true;
    if (res.status === 404) return false;
    console.error("Resend get contact failed", res.status, await res.text());
    return "error";
  } catch (err) {
    console.error("Resend get contact threw", err);
    return "error";
  }
}

async function resendAddContact(
  apiKey: string,
  audienceId: string,
  email: string,
): Promise<AddResult> {
  try {
    const res = await fetch(
      `https://api.resend.com/audiences/${audienceId}/contacts`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
          "User-Agent": "reactmelbourne/1.0",
        },
        body: JSON.stringify({ email, unsubscribed: false }),
      },
    );

    if (res.ok) return { status: "new" };

    const body = (await res.json().catch(() => ({}))) as {
      message?: string;
      name?: string;
    };
    const msg = (body.message ?? "").toLowerCase();
    const name = (body.name ?? "").toLowerCase();
    if (
      res.status === 409 ||
      res.status === 422 ||
      msg.includes("already exists") ||
      msg.includes("contact already") ||
      name.includes("contact_exists") ||
      name.includes("already_exists")
    ) {
      return { status: "existing" };
    }

    console.error("Resend add contact failed", res.status, body);
    return { status: "error" };
  } catch (err) {
    console.error("Resend add contact threw", err);
    return { status: "error" };
  }
}

async function resendSendWelcome(apiKey: string, email: string): Promise<void> {
  const fromEmail = process.env.RESEND_FROM_EMAIL;
  if (!fromEmail) return;
  const fromName = process.env.RESEND_FROM_NAME || "React Melbourne";
  const text = `Welcome to React Melbourne.\n\nYou're on the dispatch list — one email when the next meetup drops.\n\nRSVP on Meetup so we can save you a slice:\n${MEETUP_URL}\n\nSee you there.\n— React Melbourne`;
  const html = `<p>Welcome to <strong>React Melbourne</strong>.</p>
<p>You're on the dispatch list — one email when the next meetup drops.</p>
<p>RSVP on Meetup so we can save you a slice: <a href="${MEETUP_URL}">${MEETUP_URL}</a></p>
<p>See you there.<br/>— React Melbourne</p>`;
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: `${fromName} <${fromEmail}>`,
      to: [email],
      subject: "Welcome to React Melbourne",
      text,
      html,
    }),
  });
  if (!res.ok) {
    console.error("Resend mail send failed", res.status, await res.text());
  }
}
