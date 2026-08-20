/** Shared Resend helpers — 429 retry like rustmelbourne. */

export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const ESC: Record<string, string> = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;",
};

export function esc(s: string): string {
  return (s || "").replace(/[&<>"']/g, (c) => ESC[c]);
}

export function nl2br(s: string): string {
  return esc(s).replace(/\r?\n/g, "<br/>");
}

export function fromHeader(): string {
  const fromEmail = process.env.RESEND_FROM_EMAIL ?? "hello@reactmelbourne.com";
  const fromName = process.env.RESEND_FROM_NAME || "React Melbourne";
  return `${fromName} <${fromEmail}>`;
}

export function notifyDest(): string {
  return process.env.NOTIFY_EMAIL || "gm@metasal.xyz";
}

export type SendTemplateOpts = {
  apiKey: string;
  from: string;
  to: string;
  replyTo?: string;
  templateId: string;
  variables?: Record<string, string>;
  tags?: { name: string; value: string }[];
};

export async function sendTemplate(
  opts: SendTemplateOpts,
): Promise<{ ok: boolean; detail?: string }> {
  const body: Record<string, unknown> = {
    from: opts.from,
    to: [opts.to],
    template: {
      id: opts.templateId,
      variables: opts.variables ?? {},
    },
  };
  if (opts.replyTo) body.reply_to = opts.replyTo;
  if (opts.tags) body.tags = opts.tags;

  for (let attempt = 0; ; attempt++) {
    try {
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${opts.apiKey}`,
          "Content-Type": "application/json",
          "User-Agent": "reactmelbourne/1.2",
        },
        body: JSON.stringify(body),
      });
      if (res.ok) return { ok: true };
      if (res.status === 429 && attempt < 3) {
        await new Promise((r) => setTimeout(r, 700 * (attempt + 1)));
        continue;
      }
      const detail = await res.text().catch(() => "");
      return { ok: false, detail: detail.slice(0, 300) };
    } catch (err) {
      if (attempt < 2) {
        await new Promise((r) => setTimeout(r, 500 * (attempt + 1)));
        continue;
      }
      return {
        ok: false,
        detail: err instanceof Error ? err.message : "send failed",
      };
    }
  }
}

export async function hasContact(
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
          "User-Agent": "reactmelbourne/1.2",
        },
        cache: "no-store",
      },
    );
    if (res.ok) return true;
    if (res.status === 404) return false;
    return "error";
  } catch {
    return "error";
  }
}

export async function addContact(opts: {
  apiKey: string;
  audienceId: string;
  email: string;
}): Promise<"new" | "existing" | "error"> {
  try {
    const res = await fetch(
      `https://api.resend.com/audiences/${opts.audienceId}/contacts`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${opts.apiKey}`,
          "Content-Type": "application/json",
          "User-Agent": "reactmelbourne/1.2",
        },
        body: JSON.stringify({ email: opts.email, unsubscribed: false }),
      },
    );
    if (res.ok) return "new";
    const body = (await res.json().catch(() => ({}))) as {
      message?: string;
      name?: string;
    };
    const msg = (body.message ?? "").toLowerCase();
    const name = (body.name ?? "").toLowerCase();
    if (
      res.status === 409 ||
      res.status === 422 ||
      msg.includes("already") ||
      name.includes("already") ||
      name.includes("exists")
    ) {
      return "existing";
    }
    return "error";
  } catch {
    return "error";
  }
}
