# React Melbourne

The official landing page for [reactmelbourne.com](https://reactmelbourne.com) — Melbourne's React community meetup.

Built with **Next.js 15** (App Router) and deployed to **Cloudflare Workers** via the [OpenNext adapter](https://opennext.js.org/cloudflare).

## Stack

- Next.js 15 · React 19 · TypeScript
- `next/font/google` — Fraunces (display) + JetBrains Mono (body)
- `@opennextjs/cloudflare` — runs Next.js on the Workers runtime
- **Resend** — mailing list (Audiences) + transactional email
- **Meetup API** — events pulled live, daily-cron refresh
- **Telegram bot** — submission/signup pings
- **Google Analytics 4** — page views

## Getting started

```bash
npm install
npm run dev
```

Opens at [http://localhost:3000](http://localhost:3000) (or 3001/3002 if 3000 is busy).

## Preview on the Workers runtime

`npm run dev` uses the Node dev server. To preview exactly how it'll run in production:

```bash
npm run preview
```

## Deploy to Cloudflare

```bash
npx wrangler login   # one-time
npm run deploy
```

Custom domains `reactmelbourne.com` and `www.reactmelbourne.com` are wired in `wrangler.toml`.

## Environment

Local dev reads `.env.local` (gitignored). Production reads Cloudflare Worker secrets — set them with `wrangler secret put NAME` or in the dashboard.

| Var | Purpose | Required |
|---|---|---|
| `RESEND_API_KEY` | Resend full-access key | yes |
| `RESEND_AUDIENCE_ID` | Mailing list audience UUID | yes |
| `RESEND_FROM_EMAIL` | Verified sender (e.g. `hello@reactmelbourne.com`) | yes |
| `RESEND_FROM_NAME` | Display name in `From:` | optional, defaults to "React Melbourne" |
| `NOTIFY_EMAIL` | Where talk/sponsor submissions get emailed | optional, defaults to `gm@metasal.xyz` |
| `TELEGRAM_BOT_TOKEN` | Bot for organizer notifications | optional |
| `TELEGRAM_CHAT_ID` | Chat to ping | optional |
| `MEETUP_GROUP_URLNAME` | Defaults to `react-melbourne` | optional |

After changing `wrangler.toml` bindings, regenerate types:

```bash
npm run cf-typegen
```

## Pages and flows

- **`/`** — landing page. Hero, events, community, speakers, sponsors, newsletter signup.
- **`/talk`** — Typeform-style talk submission flow (replaces old Google Form). Sends notification + auto-confirmation via Resend.
- **`/sponsor`** — Same Typeform flow for sponsorship inquiries.
- **Join modal** — opens from the nav `Join →` button. Adds email to Resend Audience, fires welcome email, then opens Meetup in a new tab.
- **Subscribe section** — inline signup on the landing page (same Resend Audience).

All form submissions log a Telegram message if the bot is configured.

## Project layout

```
app/
  components/       Hero, Nav, JoinModal, Subscribe, Events, About,
                    Community, Speakers, Sponsors, Stats, Footer,
                    ScrollReveal, GoogleAnalytics, TypeformFlow
  actions/
    subscribe.ts    Mailing list signup (Resend Audiences + welcome email)
    submissions.ts  /talk + /sponsor handlers (Resend notify + confirm)
  lib/
    meetup.ts       Meetup API client (fetched daily via cron)
  events.ts         Static event metadata
  sponsors.ts       Sponsor data
  layout.tsx        Fonts, metadata, GA
  page.tsx          Landing-page composition
  globals.css       Design system
  talk/page.tsx     Talk submission page
  sponsor/page.tsx  Sponsor inquiry page
wrangler.toml       Cloudflare Workers config (custom domains, observability)
open-next.config.ts OpenNext adapter config
next.config.ts      Next.js config
```

## Updating events

Static events live in `app/events.ts`. Live events come from Meetup via `app/lib/meetup.ts` — refreshed daily by a Cloudflare cron. To force a refresh, redeploy.

## Adding Cloudflare bindings

To use KV, D1, R2, Queues, etc., add them to `wrangler.toml`, run `npm run cf-typegen`, and access via `getCloudflareContext()` from `@opennextjs/cloudflare`.

## License

MIT
