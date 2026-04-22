"use client";

import { useActionState } from "react";
import { subscribe, type SubscribeState } from "../actions/subscribe";

const initial: SubscribeState = { ok: false, message: "" };

export function Subscribe() {
  const [state, formAction, pending] = useActionState(subscribe, initial);

  return (
    <section id="subscribe" className="reveal subscribe">
      <div className="section-label mono">GET THE DISPATCH</div>
      <h2 style={{ textAlign: "center", maxWidth: 720 }}>
        Low-frequency, high-signal.
      </h2>
      <p className="subscribe-tag">
        One email when the next meetup drops. No spam, no roundups, no "10 things
        we learned." Just the date, the talks, and the RSVP link.
      </p>

      <form action={formAction} className="subscribe-form" noValidate>
        <input
          type="text"
          name="website"
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
          style={{ position: "absolute", left: "-9999px", width: 1, height: 1 }}
        />
        <input
          type="email"
          name="email"
          required
          autoComplete="email"
          placeholder="you@example.dev"
          disabled={pending || state.ok}
          aria-label="Email address"
        />
        <button type="submit" disabled={pending || state.ok}>
          {pending ? "..." : state.ok ? "✓" : "Subscribe →"}
        </button>
      </form>

      {state.message ? (
        <p
          className="subscribe-msg mono"
          style={{ color: state.ok ? "var(--cyan)" : "var(--accent)" }}
          role="status"
        >
          {state.message}
        </p>
      ) : null}
    </section>
  );
}
