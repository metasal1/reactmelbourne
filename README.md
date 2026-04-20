# React Melbourne

The official landing page for [reactmelbourne.com](https://reactmelbourne.com) — Melbourne's React community meetup.

Built with **Next.js 15** (App Router) and deployed to **Cloudflare Workers** via the [OpenNext adapter](https://opennext.js.org/cloudflare).

## Stack

- Next.js 15 · React 19 · TypeScript
- `next/font/google` — Fraunces (display) + JetBrains Mono (body)
- `@opennextjs/cloudflare` — runs Next.js on the Workers runtime
- Zero runtime dependencies beyond React/Next

## Getting started

```bash
npm install
npm run dev
```

Opens at [http://localhost:3000](http://localhost:3000).

## Preview on the Workers runtime

`npm run dev` uses the Node dev server. To preview exactly how it'll run in production (on Cloudflare's `workerd` runtime via wrangler):

```bash
npm run preview
```

## Deploy to Cloudflare

### One-time setup

```bash
npx wrangler login
```

### Every deploy

```bash
npm run deploy
```

This builds with OpenNext and pushes to Workers. First deploy gives you `https://reactmelbourne.<your-subdomain>.workers.dev`.

### Custom domain (reactmelbourne.com)

1. Add `reactmelbourne.com` as a Cloudflare zone (dashboard → Add site).
2. Update your registrar's nameservers to Cloudflare's.
3. Uncomment the `[[routes]]` block in `wrangler.toml`.
4. Run `npm run deploy` again.

## Project layout

```
app/
  components/       UI — Nav, Hero, Stats, Events, About,
                    Community, Speakers, Footer, ScrollReveal
  events.ts         Event data (single source of truth)
  globals.css       Design system
  layout.tsx        Fonts, metadata
  page.tsx          Composes the landing page
wrangler.toml       Cloudflare Workers config
open-next.config.ts OpenNext adapter config
next.config.ts      Next.js config (+ dev bindings hook)
```

## Updating events

Edit `app/events.ts`. Events render in order. Set `status: "upcoming"` for the next meetup and `"past"` for the rest.

## Adding Cloudflare bindings

To use KV, D1, R2, Queues, etc., add them to `wrangler.toml`, run `npm run cf-typegen`, and access via `getCloudflareContext()` from `@opennextjs/cloudflare`.

## License

MIT
