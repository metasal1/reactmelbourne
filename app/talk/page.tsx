import type { Metadata } from "next";
import { TypeformFlow, type Step } from "../components/TypeformFlow";
import { submitTalk } from "../actions/submissions";

export const metadata: Metadata = {
  title: "Submit a talk",
  description:
    "Pitch a talk for the next React Melbourne meetup. Real-world lessons beat slide perfection. 5, 15, or 25 minutes.",
  alternates: { canonical: "/talk" },
  robots: { index: true, follow: true },
};

const steps: Step[] = [
  {
    id: "name",
    type: "text",
    question: "What should we call you?",
    placeholder: "Ada Lovelace",
    required: true,
    maxLength: 200,
  },
  {
    id: "email",
    type: "email",
    question: "Where can we reach you?",
    help: "We'll reply from talk@reactmelbourne.com.",
    placeholder: "you@example.dev",
    required: true,
  },
  {
    id: "title",
    type: "text",
    question: "Talk title?",
    help: "A working title is fine — we'll iterate together.",
    placeholder: "Rebuilding our design system in public",
    required: true,
    maxLength: 200,
  },
  {
    id: "abstract",
    type: "textarea",
    question: "What's the talk about?",
    help: "A paragraph or two. What's the real lesson? What will people walk away with?",
    placeholder:
      "We migrated a 40k-line design system from styled-components to vanilla-extract over six months. Here's what broke, what didn't, and what I'd do differently.",
    required: true,
    maxLength: 4000,
  },
  {
    id: "length",
    type: "choice",
    question: "How long are you thinking?",
    required: true,
    choices: [
      { value: "5", label: "⚡ 5 min lightning" },
      { value: "15", label: "🎯 15 min focused" },
      { value: "25", label: "🎤 25 min deep-dive" },
      { value: "flexible", label: "Flexible — you pick" },
    ],
  },
  {
    id: "notes",
    type: "textarea",
    question: "Anything else?",
    help: "First time speaking? Prefer a specific quarter? Got a link to past talks? Drop it in.",
    placeholder: "",
    required: false,
    maxLength: 4000,
  },
];

export default function TalkPage() {
  return (
    <TypeformFlow
      title="TALK"
      lede="Real-world lessons beat slide perfection. If you've shipped it, learned it, or lived it — we want to hear it."
      steps={steps}
      submitLabel="Send it"
      action={submitTalk}
    />
  );
}
