const BODY = `# React Melbourne — full reference

React Melbourne (reactmelbourne.com) is a JavaScript / React meetup community in Melbourne, Australia (Naarm).

## Purpose
Quarterly in-person meetups for people building with React, React Native, and the broader web/mobile JS ecosystem. No gatekeeping, no brand pitches dressed as talks.

## Pages
| Path | Purpose |
|------|---------|
| / | Landing: events, about, community, speakers CTA, sponsors, email dispatch |
| /talk | Typeform-style talk pitch form |
| /sponsor | Typeform-style sponsorship inquiry |
| /llms.txt | Short LLM summary |
| /sitemap.xml | Sitemap |
| /robots.txt | Crawl rules |

## Community entry points
- Meetup: https://www.meetup.com/react-melbourne/
- Dispatch email list (on-site subscribe) via Resend audience "React Melbourne Dispatch"
- Contact: hello@reactmelbourne.com

## Forms
- Subscribe: honeypot + Resend audience contact + welcome email
- Talk / Sponsor: Resend notify to operators + confirmation to submitter (reply-to set)

## Analytics
- GA4 measurement ID G-TNTPNXFF9E

## Hosting
- Next.js App Router on Cloudflare Workers (OpenNext)
- Canonical host: https://reactmelbourne.com (www should redirect to apex)
`;

export function GET() {
  return new Response(BODY, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=86400",
    },
  });
}
