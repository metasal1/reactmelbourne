#!/usr/bin/env python3
"""Publish React Melbourne on-brand Resend templates.

  python3 scripts/publish-resend-templates.py

Writes: ~/.credentials/resend-reactmelbourne-templates.json
Also prints RESEND_TEMPLATE_IDS map for app/lib/resend-templates.ts
"""
from __future__ import annotations

import json
import pathlib
import sys
import urllib.error
import urllib.request

API = "https://api.resend.com"
UA = "reactmelbourne-templates/2.0"
KEY_PATH = pathlib.Path.home() / ".credentials" / "resend-reactmelbourne.txt"
OUT = pathlib.Path.home() / ".credentials" / "resend-reactmelbourne-templates.json"

# Brand tokens (match app/globals.css + OG)
BG = "#0a0d10"
CARD = "#111418"
BORDER = "#1e252b"
LINE2 = "#2a343c"
CYAN = "#61dafb"
ACCENT = "#ff5e3a"
YELLOW = "#f5d547"
TEXT = "#e8eef2"
MUTED = "#8a949c"
DIM = "#5a646c"

# Live assets (App Router generated routes — always on apex)
ICON = "https://reactmelbourne.com/apple-icon"
SITE = "https://reactmelbourne.com"
MEETUP = "https://www.meetup.com/react-melbourne/"
MEETUP_EVENTS = "https://www.meetup.com/react-melbourne/events/"
TALK = "https://reactmelbourne.com/talk"
SPONSOR = "https://reactmelbourne.com/sponsor"
FROM = "React Melbourne <hello@reactmelbourne.com>"
# Email-safe stacks that echo Fraunces (serif display) + JetBrains Mono
SERIF = "Georgia,'Times New Roman',Times,serif"
MONO = "ui-monospace,SFMono-Regular,'JetBrains Mono',Menlo,Monaco,Consolas,monospace"
SANS = "Inter,system-ui,-apple-system,'Segoe UI',Roboto,sans-serif"


def load_key() -> str:
    if not KEY_PATH.exists():
        sys.exit(f"missing {KEY_PATH}")
    k = KEY_PATH.read_text().strip()
    if not k.startswith("re_"):
        sys.exit("bad resend key")
    return k


def api(key: str, method: str, path: str, body: dict | None = None) -> tuple[int, dict]:
    data = None if body is None else json.dumps(body).encode()
    req = urllib.request.Request(
        API + path,
        data=data,
        method=method,
        headers={
            "Authorization": f"Bearer {key}",
            "User-Agent": UA,
            "Content-Type": "application/json",
        },
    )
    try:
        with urllib.request.urlopen(req, timeout=60) as res:
            raw = res.read().decode()
            return res.status, (json.loads(raw) if raw else {})
    except urllib.error.HTTPError as e:
        raw = e.read().decode()
        try:
            payload = json.loads(raw) if raw else {}
        except Exception:
            payload = {"raw": raw}
        return e.code, payload


def wordmark() -> str:
    return (
        f'<span style="font-family:{MONO};font-size:18px;font-weight:700;'
        f'letter-spacing:-0.02em;color:{TEXT}">'
        f'react<span style="color:{CYAN}">_</span>melbourne</span>'
    )


def pill(label: str) -> str:
    return (
        f'<span style="display:inline-block;font-family:{MONO};font-size:10px;'
        f"letter-spacing:0.18em;text-transform:uppercase;color:{CYAN};"
        f'border:1px solid {LINE2};border-radius:999px;padding:6px 12px;'
        f'background:rgba(97,218,251,0.06)">{label}</span>'
    )


def field_row(label: str, value_html: str) -> str:
    return (
        f'<tr><td style="padding:12px 0;border-bottom:1px solid {BORDER}">'
        f'<div style="font-family:{MONO};font-size:10px;letter-spacing:0.16em;'
        f'text-transform:uppercase;color:{MUTED};margin:0 0 6px">{label}</div>'
        f'<div style="font-family:{SANS};font-size:15px;line-height:1.5;color:{TEXT}">'
        f"{value_html}</div></td></tr>"
    )


def shell(
    *,
    preheader: str,
    eyebrow: str,
    title: str,
    body: str,
    cta_label: str | None = None,
    cta_href: str | None = None,
    secondary_label: str | None = None,
    secondary_href: str | None = None,
) -> str:
    buttons = ""
    if cta_label and cta_href:
        buttons += (
            f'<a href="{cta_href}" target="_blank" rel="noopener noreferrer" '
            f'style="display:inline-block;background:{CYAN};color:{BG};text-decoration:none;'
            f"font-weight:700;font-size:13px;letter-spacing:0.04em;"
            f'font-family:{MONO};padding:14px 22px;border-radius:999px;margin:0 10px 10px 0">'
            f"{cta_label}</a>"
        )
    if secondary_label and secondary_href:
        buttons += (
            f'<a href="{secondary_href}" target="_blank" rel="noopener noreferrer" '
            f'style="display:inline-block;background:transparent;color:{CYAN};'
            f"text-decoration:none;font-weight:600;font-size:13px;letter-spacing:0.04em;"
            f"font-family:{MONO};padding:13px 20px;border-radius:999px;"
            f'border:1px solid {CYAN};margin:0 0 10px 0">{secondary_label}</a>'
        )
    cta_row = ""
    if buttons:
        cta_row = (
            f'<tr><td style="padding:8px 32px 28px" align="left">{buttons}</td></tr>'
        )

    return f"""<!DOCTYPE html>
<html lang="en-AU">
<head>
  <meta charset="utf-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1"/>
  <meta name="color-scheme" content="dark light"/>
  <meta name="supported-color-schemes" content="dark light"/>
  <title>{title}</title>
</head>
<body style="margin:0;padding:0;background:{BG};color:{TEXT}">
  <div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent">{preheader}</div>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:{BG};background-image:radial-gradient(circle at 18% 0%,rgba(97,218,251,0.14),transparent 42%),radial-gradient(circle at 88% 100%,rgba(255,94,58,0.10),transparent 40%);padding:40px 14px">
    <tr><td align="center">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:580px;background:{CARD};border:1px solid {BORDER};border-radius:20px;overflow:hidden">
        <tr><td style="height:5px;background:linear-gradient(90deg,{CYAN} 0%,{YELLOW} 48%,{ACCENT} 100%);font-size:0;line-height:0">&nbsp;</td></tr>
        <tr><td style="padding:28px 32px 10px" align="left">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr>
            <td style="vertical-align:middle;width:48px;padding-right:14px">
              <img src="{ICON}" width="44" height="44" alt="React Melbourne" style="display:block;border-radius:12px;border:1px solid {BORDER};background:{BG}"/>
            </td>
            <td style="vertical-align:middle">
              {wordmark()}
              <div style="font-family:{MONO};font-size:11px;color:{MUTED};margin-top:4px;letter-spacing:0.06em">SINCE 2015 · NAARM / MELBOURNE</div>
            </td>
          </tr></table>
        </td></tr>
        <tr><td style="padding:18px 32px 0">{pill(eyebrow)}</td></tr>
        <tr><td style="padding:16px 32px 6px">
          <h1 style="margin:0;font-family:{SERIF};font-size:30px;line-height:1.15;color:{TEXT};font-weight:600;letter-spacing:-0.02em">{title}</h1>
        </td></tr>
        <tr><td style="padding:10px 32px 8px;font-family:{SANS};font-size:16px;line-height:1.65;color:{MUTED}">
          {body}
        </td></tr>
        {cta_row}
        <tr><td style="padding:0 32px 28px">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-top:1px solid {BORDER}">
            <tr><td style="padding-top:20px;font-family:{MONO};font-size:11px;line-height:1.7;color:{MUTED};letter-spacing:0.04em">
              <a href="{MEETUP}" style="color:{CYAN};text-decoration:none">Meetup</a>
              &nbsp;·&nbsp;
              <a href="{MEETUP_EVENTS}" style="color:{CYAN};text-decoration:none">Events</a>
              &nbsp;·&nbsp;
              <a href="{TALK}" style="color:{CYAN};text-decoration:none">Speak</a>
              &nbsp;·&nbsp;
              <a href="{SPONSOR}" style="color:{CYAN};text-decoration:none">Sponsor</a>
              &nbsp;·&nbsp;
              <a href="{SITE}" style="color:{CYAN};text-decoration:none">reactmelbourne.com</a>
            </td></tr>
            <tr><td style="padding-top:14px;font-family:{SANS};font-size:12px;line-height:1.5;color:{DIM}">
              Built for devs who ship. Low-frequency, high-signal.
              <br/>React Melbourne · <a href="mailto:hello@reactmelbourne.com" style="color:{MUTED};text-decoration:none">hello@reactmelbourne.com</a>
            </td></tr>
          </table>
        </td></tr>
      </table>
      <p style="margin:18px 0 0;font-family:{MONO};font-size:10px;letter-spacing:0.14em;text-transform:uppercase;color:{DIM}">STATUS · ONLINE</p>
    </td></tr>
  </table>
</body>
</html>"""


def v(name: str) -> str:
    """Resend template variable placeholder {{{NAME}}}."""
    return "{{{" + name + "}}}"


# Bodies use v() so braces never fight f-strings.
SUBSCRIBE_CONFIRM_BODY = (
    f'<p style="margin:0 0 14px;color:{TEXT}">You\'re on the <strong style="color:{TEXT}">dispatch</strong> — '
    "one email when the next meetup drops. No spam, no roundups, no “10 things we learned.”</p>"
    f'<p style="margin:0 0 14px">RSVP on Meetup so we can save you a seat (and a slice).</p>'
    f'<p style="margin:0;color:{MUTED}">See you in the room.<br/>— React Melbourne</p>'
)

SUBSCRIBE_NOTIFY_BODY = (
    f'<p style="margin:0 0 16px;color:{MUTED}">New dispatch signup from the landing form.</p>'
    f'<table role="presentation" width="100%" cellpadding="0" cellspacing="0">'
    + field_row("Email", f"<strong>{v('CONTACT_EMAIL')}</strong>")
    + field_row("Source", v("SOURCE"))
    + field_row("Meta", f'<span style="color:{MUTED}">{v("META")}</span>')
    + "</table>"
)

TALK_NOTIFY_BODY = (
    f'<p style="margin:0 0 16px;color:{MUTED}">Talk pitch via <a href="{TALK}" style="color:{CYAN}">/talk</a>. Reply-to is the speaker.</p>'
    f'<table role="presentation" width="100%" cellpadding="0" cellspacing="0">'
    + field_row("Title", f"<strong>{v('TITLE')}</strong>")
    + field_row(
        "Speaker",
        f'{v("CONTACT_NAME")} · <a href="mailto:{v("CONTACT_EMAIL")}" style="color:{CYAN}">{v("CONTACT_EMAIL")}</a>',
    )
    + field_row("Length", v("LENGTH"))
    + field_row(
        "Abstract",
        f'<div style="margin-top:2px;white-space:pre-wrap;color:{TEXT}">{v("ABSTRACT")}</div>',
    )
    + field_row(
        "Notes",
        f'<div style="margin-top:2px;white-space:pre-wrap;color:{TEXT}">{v("NOTES")}</div>',
    )
    + field_row("Meta", f'<span style="color:{MUTED}">{v("META")}</span>')
    + "</table>"
)

TALK_CONFIRM_BODY = (
    f'<p style="margin:0 0 14px;color:{TEXT}">Hi {v("CONTACT_NAME")},</p>'
    f'<p style="margin:0 0 14px">Thanks for pitching <strong style="color:{TEXT}">{v("TITLE")}</strong> '
    "to React Melbourne. Real-world lessons beat slide perfection — we'll review and reply from "
    f'<a href="mailto:hello@reactmelbourne.com" style="color:{CYAN}">hello@reactmelbourne.com</a>.</p>'
    f'<p style="margin:0;color:{MUTED}">If anything\'s missing, just reply to this email.<br/>— React Melbourne</p>'
)

SPONSOR_NOTIFY_BODY = (
    f'<p style="margin:0 0 16px;color:{MUTED}">Sponsor inquiry via <a href="{SPONSOR}" style="color:{CYAN}">/sponsor</a>. Reply-to is the contact.</p>'
    f'<table role="presentation" width="100%" cellpadding="0" cellspacing="0">'
    + field_row("Company", f"<strong>{v('COMPANY')}</strong>")
    + field_row(
        "Contact",
        f'{v("CONTACT_NAME")} · <a href="mailto:{v("CONTACT_EMAIL")}" style="color:{CYAN}">{v("CONTACT_EMAIL")}</a>',
    )
    + field_row("Type", v("KIND"))
    + field_row(
        "Notes",
        f'<div style="margin-top:2px;white-space:pre-wrap;color:{TEXT}">{v("NOTES")}</div>',
    )
    + field_row("Meta", f'<span style="color:{MUTED}">{v("META")}</span>')
    + "</table>"
)

SPONSOR_CONFIRM_BODY = (
    f'<p style="margin:0 0 14px;color:{TEXT}">Hi {v("CONTACT_NAME")},</p>'
    f'<p style="margin:0 0 14px">Thanks for reaching out about backing <strong style="color:{TEXT}">React Melbourne</strong>. '
    "We've got your message — pizza, drinks, venue, or cash all keep the lights on for 6,000+ builders.</p>"
    f'<p style="margin:0 0 14px">We\'ll reply from '
    f'<a href="mailto:hello@reactmelbourne.com" style="color:{CYAN}">hello@reactmelbourne.com</a> soon.</p>'
    f'<p style="margin:0;color:{MUTED}">If anything\'s missing, just reply to this email.<br/>— React Melbourne</p>'
)


DEFS = [
    {
        "alias": "rm-subscribe-confirm",
        "name": "RM Subscribe Confirm",
        "subject": "You're on the React Melbourne dispatch",
        "html": shell(
            preheader="Low-frequency, high-signal. One email when the next meetup drops.",
            eyebrow="Dispatch",
            title="You're in.",
            body=SUBSCRIBE_CONFIRM_BODY,
            cta_label="RSVP on Meetup →",
            cta_href=MEETUP,
            secondary_label="Site",
            secondary_href=SITE,
        ),
        "text": (
            "You're on the React Melbourne dispatch — one email when the next meetup drops.\n\n"
            f"RSVP: {MEETUP}\n\n— React Melbourne"
        ),
        "variables": [],
    },
    {
        "alias": "rm-subscribe-notify",
        "name": "RM Subscribe Notify",
        "subject": "[RM] New dispatch signup · {{{CONTACT_EMAIL}}}",
        "html": shell(
            preheader="New React Melbourne dispatch signup",
            eyebrow="Internal · Signup",
            title="New list signup",
            body=SUBSCRIBE_NOTIFY_BODY,
            cta_label="Open site →",
            cta_href=SITE,
        ),
        "text": "New signup: {{{CONTACT_EMAIL}}} · {{{SOURCE}}} · {{{META}}}",
        "variables": [
            {"key": "CONTACT_EMAIL", "type": "string", "fallbackValue": ""},
            {"key": "SOURCE", "type": "string", "fallbackValue": "landing"},
            {"key": "META", "type": "string", "fallbackValue": ""},
        ],
    },
    {
        "alias": "rm-talk-notify",
        "name": "RM Talk Notify",
        "subject": "[RM] Talk · {{{TITLE}}}",
        "html": shell(
            preheader="New React Melbourne talk submission",
            eyebrow="Internal · Talk",
            title="Talk submission",
            body=TALK_NOTIFY_BODY,
            cta_label="Open /talk →",
            cta_href=TALK,
        ),
        "text": "Talk: {{{TITLE}}} by {{{CONTACT_NAME}}} <{{{CONTACT_EMAIL}}}>\n{{{ABSTRACT}}}",
        "variables": [
            {"key": "TITLE", "type": "string", "fallbackValue": ""},
            {"key": "CONTACT_NAME", "type": "string", "fallbackValue": ""},
            {"key": "CONTACT_EMAIL", "type": "string", "fallbackValue": ""},
            {"key": "LENGTH", "type": "string", "fallbackValue": "—"},
            {"key": "ABSTRACT", "type": "string", "fallbackValue": ""},
            {"key": "NOTES", "type": "string", "fallbackValue": "—"},
            {"key": "META", "type": "string", "fallbackValue": ""},
        ],
    },
    {
        "alias": "rm-talk-confirm",
        "name": "RM Talk Confirm",
        "subject": "We got your talk · {{{TITLE}}}",
        "html": shell(
            preheader="We got your React Melbourne talk pitch",
            eyebrow="Talk pitch",
            title="Talk received.",
            body=TALK_CONFIRM_BODY,
            cta_label="Browse events →",
            cta_href=MEETUP_EVENTS,
            secondary_label="Site",
            secondary_href=SITE,
        ),
        "text": (
            "Hi {{{CONTACT_NAME}}},\n\nThanks for pitching {{{TITLE}}} to React Melbourne. "
            "We'll review and reply from hello@reactmelbourne.com.\n\n— React Melbourne"
        ),
        "variables": [
            {"key": "CONTACT_NAME", "type": "string", "fallbackValue": "there"},
            {"key": "TITLE", "type": "string", "fallbackValue": "your talk"},
        ],
    },
    {
        "alias": "rm-sponsor-notify",
        "name": "RM Sponsor Notify",
        "subject": "[RM] Sponsor · {{{COMPANY}}}",
        "html": shell(
            preheader="New React Melbourne sponsor inquiry",
            eyebrow="Internal · Sponsor",
            title="Sponsor inquiry",
            body=SPONSOR_NOTIFY_BODY,
            cta_label="Open /sponsor →",
            cta_href=SPONSOR,
        ),
        "text": "Sponsor: {{{COMPANY}}} · {{{CONTACT_NAME}}} <{{{CONTACT_EMAIL}}}> · {{{KIND}}}",
        "variables": [
            {"key": "COMPANY", "type": "string", "fallbackValue": ""},
            {"key": "CONTACT_NAME", "type": "string", "fallbackValue": ""},
            {"key": "CONTACT_EMAIL", "type": "string", "fallbackValue": ""},
            {"key": "KIND", "type": "string", "fallbackValue": "—"},
            {"key": "NOTES", "type": "string", "fallbackValue": "—"},
            {"key": "META", "type": "string", "fallbackValue": ""},
        ],
    },
    {
        "alias": "rm-sponsor-confirm",
        "name": "RM Sponsor Confirm",
        "subject": "We got your sponsorship note",
        "html": shell(
            preheader="We got your React Melbourne sponsorship inquiry",
            eyebrow="Sponsor",
            title="Message received.",
            body=SPONSOR_CONFIRM_BODY,
            cta_label="Sponsor page →",
            cta_href=SPONSOR,
            secondary_label="Meetup",
            secondary_href=MEETUP,
        ),
        "text": (
            "Hi {{{CONTACT_NAME}}},\n\nThanks for reaching out about sponsoring React Melbourne. "
            "We'll reply from hello@reactmelbourne.com soon.\n\n— React Melbourne"
        ),
        "variables": [
            {"key": "CONTACT_NAME", "type": "string", "fallbackValue": "there"},
        ],
    },
]


def list_templates(key: str) -> list[dict]:
    code, payload = api(key, "GET", "/templates")
    if code >= 400:
        print("list failed", code, payload)
        return []
    data = payload.get("data") or []
    return data if isinstance(data, list) else []


def upsert(key: str, definition: dict) -> dict:
    alias = definition["alias"]
    existing = {t.get("alias"): t for t in list_templates(key) if t.get("alias")}
    body = {
        "name": definition["name"],
        "alias": alias,
        "from": FROM,
        "subject": definition["subject"],
        "html": definition["html"],
        "text": definition.get("text") or "",
        "variables": definition.get("variables") or [],
    }
    if alias in existing:
        tid = existing[alias]["id"]
        code, payload = api(key, "PATCH", f"/templates/{tid}", body)
        if code >= 400:
            sys.exit(f"PATCH {alias} failed {code} {payload}")
        print(f"updated {alias} {tid}")
    else:
        code, payload = api(key, "POST", "/templates", body)
        if code >= 400:
            sys.exit(f"POST {alias} failed {code} {payload}")
        tid = payload.get("id")
        print(f"created {alias} {tid}")
    tid = payload.get("id") or existing[alias]["id"]
    pcode, ppayload = api(key, "POST", f"/templates/{tid}/publish", {})
    if pcode >= 400:
        sys.exit(f"publish {alias} failed {pcode} {ppayload}")
    print(f"published {alias}")
    return {
        "id": tid,
        "alias": alias,
        "name": definition["name"],
        "from": FROM,
        "subject": definition["subject"],
    }


def main() -> None:
    key = load_key()
    out: dict[str, dict] = {}
    for d in DEFS:
        out[d["alias"]] = upsert(key, d)
    OUT.write_text(json.dumps(out, indent=2) + "\n")
    OUT.chmod(0o600)
    print(f"wrote {OUT}")
    # map for TS
    ts_map = {
        "subscribeConfirm": out["rm-subscribe-confirm"]["id"],
        "subscribeNotify": out["rm-subscribe-notify"]["id"],
        "talkNotify": out["rm-talk-notify"]["id"],
        "talkConfirm": out["rm-talk-confirm"]["id"],
        "sponsorNotify": out["rm-sponsor-notify"]["id"],
        "sponsorConfirm": out["rm-sponsor-confirm"]["id"],
    }
    print("TS_IDS=" + json.dumps(ts_map))
    print(json.dumps(out, indent=2))


if __name__ == "__main__":
    main()
