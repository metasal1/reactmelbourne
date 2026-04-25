export type SponsorTier = "venue" | "pizza" | "drinks" | "swag" | "supporter";

export interface Sponsor {
  name: string;
  displayName: string;
  url: string;
  tier: SponsorTier;
  blurb: string;
  since?: string;
  brandColor: string;
  brandInk?: string;
}

export const sponsors: Sponsor[] = [
  {
    name: "kogan",
    displayName: "kogan.com",
    url: "https://www.kogan.com",
    tier: "venue",
    blurb:
      "Hosts every meetup at Kogan HQ in South Melbourne. Australia's biggest online retailer, run by engineers who actually ship.",
    since: "2023",
    brandColor: "#E30613",
    brandInk: "#ffffff",
  },
];
