import type { Metadata } from "next";
import { TypeformFlow, type Step } from "../components/TypeformFlow";
import { submitSponsor } from "../actions/submissions";

export const metadata: Metadata = {
  title: "Sponsor a meetup",
  description:
    "Back the Melbourne React community — pizza, drinks, venue, or money. Your name in front of 6,070 developers who actually ship.",
  alternates: { canonical: "/sponsor" },
  robots: { index: true, follow: true },
};

const steps: Step[] = [
  {
    id: "company",
    type: "text",
    question: "Who's sponsoring?",
    help: "Company, team, or just you — whoever's putting their name on it.",
    placeholder: "Acme Corp",
    required: true,
    maxLength: 200,
  },
  {
    id: "name",
    type: "text",
    question: "Your name?",
    placeholder: "Ada Lovelace",
    required: true,
    maxLength: 200,
  },
  {
    id: "email",
    type: "email",
    question: "Best email to reach you at?",
    help: "We'll reply from hello@reactmelbourne.com.",
    placeholder: "you@example.dev",
    required: true,
  },
  {
    id: "kind",
    type: "choice",
    question: "What kind of sponsorship?",
    help: "Pick what's easiest — we can mix and match.",
    required: true,
    choices: [
      { value: "pizza", label: "Feed the room (pizza / food)" },
      { value: "drinks", label: "Drinks / bar tab" },
      { value: "venue", label: "Host at your office" },
      { value: "cash", label: "Just give us money" },
      { value: "swag", label: "Swag / giveaways" },
      { value: "other", label: "Something else" },
    ],
  },
  {
    id: "notes",
    type: "textarea",
    question: "Anything you'd like us to know?",
    help: "Budget range, timing preferences, whether you'd also want to give a short pitch — whatever's useful.",
    placeholder: "e.g. Q2 2026, budget around $1k, happy for a 5-min company intro...",
    required: false,
    maxLength: 4000,
  },
];

export default function SponsorPage() {
  return (
    <TypeformFlow
      title="SPONSOR"
      lede="Pizza, drinks, venue, or money — your name in front of 6,070 developers who actually ship."
      steps={steps}
      submitLabel="Send it"
      action={submitSponsor}
    />
  );
}
