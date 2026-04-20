export type EventStatus = "upcoming" | "past";

export interface MeetupEvent {
  day: string;
  year: string;
  time: string;
  title: string;
  location: string;
  address?: string;
  attendees: string;
  description: string;
  status: EventStatus;
}

export const events: MeetupEvent[] = [
  {
    day: "APR 1",
    year: "2026",
    time: "6:00 PM AEDT",
    title: "Kicking Off 2026 🎉",
    location: "Kogan HQ",
    address: "139 Gladstone St, South Melbourne",
    attendees: "44 attending",
    description:
      "We're back. If you've solved a gnarly problem, improved performance, redesigned architecture, or learned something the hard way — we want to hear it. Real-world lessons beat slide perfection.",
    status: "upcoming",
  },
  {
    day: "DEC 3",
    year: "2025",
    time: "6:00 PM AEDT",
    title: "Final One for 2025",
    location: "Kogan HQ",
    address: "South Melbourne",
    attendees: "113 attended",
    description:
      "Packed room, three speakers, end-of-year vibes. Sent 2025 off with talks on state management, testing strategies, and one very cursed bug war-story.",
    status: "past",
  },
  {
    day: "SEP 24",
    year: "2025",
    time: "6:00 PM AEST",
    title: "React Meetup · Q3",
    location: "Kogan HQ",
    address: "South Melbourne",
    attendees: "130 attended",
    description:
      "Biggest turnout of the year. Talks spanned React Server Components in production, a migration from Redux, and the quiet joy of tiny build tools.",
    status: "past",
  },
];
