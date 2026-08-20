"use server";

import { headers } from "next/headers";
import { RESEND_TEMPLATE_IDS } from "../lib/resend-templates";
import {
  EMAIL_RE,
  addContact,
  fromHeader,
  hasContact,
  notifyDest,
  sendTemplate,
} from "../lib/resend";

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

  const existing = await hasContact(apiKey, audienceId, email);
  if (existing === "error") {
    return { ok: false, message: "Couldn't save right now. Try again?" };
  }
  if (existing === true) {
    return {
      ok: true,
      message: "You're already on the list — see you there.",
    };
  }

  const add = await addContact({ apiKey, audienceId, email });
  if (add === "error") {
    return { ok: false, message: "Couldn't save right now. Try again?" };
  }
  if (add === "existing") {
    return {
      ok: true,
      message: "You're already on the list — see you there.",
    };
  }

  const h = await headers();
  const country = h.get("cf-ipcountry") ?? "";
  const ip = h.get("cf-connecting-ip") ?? "";
  const meta = `${country || "-"} · ${ip || "-"}`;

  await sendTemplate({
    apiKey,
    from: fromHeader(),
    to: email,
    templateId: RESEND_TEMPLATE_IDS.subscribeConfirm,
    tags: [
      { name: "category", value: "subscribe" },
      { name: "product", value: "reactmelbourne" },
    ],
  });

  await sendTemplate({
    apiKey,
    from: fromHeader(),
    to: notifyDest(),
    templateId: RESEND_TEMPLATE_IDS.subscribeNotify,
    variables: {
      CONTACT_EMAIL: email,
      SOURCE: source,
      META: meta,
    },
    tags: [
      { name: "category", value: "subscribe-notify" },
      { name: "product", value: "reactmelbourne" },
    ],
  });

  const tgToken = process.env.TELEGRAM_BOT_TOKEN;
  const tgChat = process.env.TELEGRAM_CHAT_ID;
  if (tgToken && tgChat) {
    const text = `🆕 react_melbourne subscriber [${source}]\n\n${email}\n${meta}`;
    await fetch(`https://api.telegram.org/bot${tgToken}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: tgChat,
        text,
        disable_web_page_preview: true,
      }),
    }).catch(() => {});
  }

  return {
    ok: true,
    message: "You're in. Welcome.",
  };
}
