const BODY = `# React Melbourne

> Melbourne's React community meetup. Real talks from working engineers. Pizza. Drinks. Quarterly since 2015.

## Site
- Homepage: https://reactmelbourne.com
- Submit a talk: https://reactmelbourne.com/talk
- Sponsor a meetup: https://reactmelbourne.com/sponsor
- Meetup RSVPs: https://www.meetup.com/react-melbourne/

## Contact
- hello@reactmelbourne.com

## Facts
- ~6,070 Meetup members
- Venue partner: Kogan HQ, South Melbourne
- Topics: React, React Native, TypeScript, performance, architecture
- Organizers include Goran Stefkovski and Anita Rajalingam

## Optional
- Sitemap: https://reactmelbourne.com/sitemap.xml
- Full reference: https://reactmelbourne.com/llms-full.txt
`;

export function GET() {
  return new Response(BODY, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=86400",
    },
  });
}
