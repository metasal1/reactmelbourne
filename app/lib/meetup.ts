import { events as fallbackEvents, type MeetupEvent } from "../events";

const GROUP = "react-melbourne";

const MONTHS = [
  "JAN", "FEB", "MAR", "APR", "MAY", "JUN",
  "JUL", "AUG", "SEP", "OCT", "NOV", "DEC",
];

function parseNextData(html: string): unknown | null {
  const m = html.match(
    /<script id="__NEXT_DATA__"[^>]*>([\s\S]*?)<\/script>/,
  );
  if (!m) return null;
  try {
    return JSON.parse(m[1]);
  } catch {
    return null;
  }
}

type RawMeetupEvent = {
  __typename?: string;
  id?: string;
  title?: string;
  description?: string;
  dateTime?: string;
  endTime?: string;
  eventUrl?: string;
  going?: { count?: number; totalCount?: number } | number;
  rsvps?: { totalCount?: number };
  status?: string;
  venue?: { name?: string; address?: string; city?: string } | { __ref?: string };
  timezone?: string;
};

type ApolloState = Record<string, unknown>;

function deref(state: ApolloState, ref: unknown): unknown {
  if (ref && typeof ref === "object" && "__ref" in (ref as object)) {
    const k = (ref as { __ref: string }).__ref;
    return state[k];
  }
  return ref;
}

function formatDay(dateTime: string): string {
  const d = new Date(dateTime);
  return `${MONTHS[d.getMonth()]} ${d.getDate()}`;
}

function formatYear(dateTime: string): string {
  return new Date(dateTime).getFullYear().toString();
}

function formatTime(dateTime: string, timezone?: string): string {
  const d = new Date(dateTime);
  const opts: Intl.DateTimeFormatOptions = {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
    timeZone: timezone || "Australia/Melbourne",
  };
  const time = new Intl.DateTimeFormat("en-AU", opts).format(d);
  // detect AEDT vs AEST by month for Melbourne tz
  const month = d.getMonth();
  const tzAbbr = month >= 3 && month <= 8 ? "AEST" : "AEDT";
  return `${time.toUpperCase()} ${tzAbbr}`;
}

function normalize(
  raw: RawMeetupEvent,
  state: ApolloState,
  isPast: boolean,
): MeetupEvent | null {
  if (!raw.dateTime || !raw.title) return null;
  const venue = deref(state, raw.venue) as
    | { name?: string; address?: string; city?: string }
    | undefined;
  const going =
    typeof raw.going === "number"
      ? raw.going
      : raw.going?.totalCount ?? raw.going?.count;
  const attendeesNum = going ?? raw.rsvps?.totalCount;
  const startDate = new Date(raw.dateTime);
  const endDate = raw.endTime
    ? new Date(raw.endTime)
    : new Date(startDate.getTime() + 3 * 60 * 60 * 1000);

  // Strip leading "React Meetup - Kogan HQ - " noise
  let title = raw.title;
  title = title.replace(/^react meetup\s*[-·–]\s*kogan hq\s*[-·–]?\s*/i, "");
  title = title.replace(/^react x melb js meetup\s*[-·–]\s*/i, "");
  title = title.trim();
  if (!title) title = raw.title;

  const description =
    (raw.description ?? "")
      .split(/\n\n+/)
      .find((p) => p.trim().length > 60) ?? "";

  return {
    day: formatDay(raw.dateTime),
    year: formatYear(raw.dateTime),
    time: formatTime(raw.dateTime),
    title,
    location: venue?.name ?? "Kogan HQ",
    address: venue?.address ?? venue?.city ?? "South Melbourne",
    attendees: isPast
      ? `${attendeesNum ?? "?"} attended`
      : `${attendeesNum ?? "?"} attending`,
    description: description.slice(0, 320),
    status: isPast ? "past" : "upcoming",
    startISO: startDate.toISOString(),
    endISO: endDate.toISOString(),
  };
}

async function fetchPage(type: "upcoming" | "past"): Promise<MeetupEvent[]> {
  const url = `https://www.meetup.com/${GROUP}/events/${type === "past" ? "?type=past" : ""}`;
  const res = await fetch(url, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (compatible; reactmelbourne.com/1.0; +https://reactmelbourne.com)",
      "Accept": "text/html",
    },
    next: { revalidate: 3600 },
  });
  if (!res.ok) throw new Error(`Meetup ${type} ${res.status}`);
  const html = await res.text();
  const next = parseNextData(html) as
    | { props?: { pageProps?: { __APOLLO_STATE__?: ApolloState } } }
    | null;
  const state = next?.props?.pageProps?.__APOLLO_STATE__;
  if (!state) return [];
  const events = Object.entries(state)
    .filter(([k]) => k.startsWith("Event:"))
    .map(([, v]) => normalize(v as RawMeetupEvent, state, type === "past"))
    .filter((e): e is MeetupEvent => e !== null);
  return events;
}

export async function getEvents(): Promise<MeetupEvent[]> {
  try {
    const [upcoming, past] = await Promise.all([
      fetchPage("upcoming").catch(() => [] as MeetupEvent[]),
      fetchPage("past").catch(() => [] as MeetupEvent[]),
    ]);
    const combined = [
      ...upcoming.sort((a, b) => a.startISO.localeCompare(b.startISO)),
      ...past.sort((a, b) => b.startISO.localeCompare(a.startISO)).slice(0, 3),
    ];
    if (combined.length === 0) return fallbackEvents;
    return combined;
  } catch {
    return fallbackEvents;
  }
}
