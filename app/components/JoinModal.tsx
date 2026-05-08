"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { subscribe, type SubscribeState } from "../actions/subscribe";

const MEETUP_URL = "https://www.meetup.com/react-melbourne/";

export function JoinModal() {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [pending, setPending] = useState(false);
  const [state, setState] = useState<SubscribeState>({ ok: false, message: "" });
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    const t = setTimeout(() => inputRef.current?.focus(), 30);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      clearTimeout(t);
      document.body.style.overflow = "";
    };
  }, [open]);

  function close() {
    setOpen(false);
    setTimeout(() => {
      setState({ ok: false, message: "" });
      setPending(false);
    }, 200);
  }

  const submitWith = async (form: FormData) => {
    if (pending || state.ok) return;
    setPending(true);
    form.set("source", "join");
    const next = await subscribe({ ok: false, message: "" }, form);
    setState(next);
    setPending(false);
    if (next.ok) {
      setTimeout(() => {
        window.open(MEETUP_URL, "_blank", "noopener,noreferrer");
      }, 600);
    }
  };

  return (
    <>
      <button
        type="button"
        className="nav-cta"
        onClick={() => setOpen(true)}
        aria-haspopup="dialog"
      >
        Join →
      </button>

      {open && mounted
        ? createPortal(
            <div
              className="join-backdrop"
              role="dialog"
              aria-modal="true"
              aria-labelledby="join-title"
              onClick={(e) => {
                if (e.target === e.currentTarget) close();
              }}
            >
          <div className="join-modal">
            <button
              type="button"
              className="join-close"
              aria-label="Close"
              onClick={close}
            >
              ×
            </button>
            <div className="section-label mono">JOIN THE COMMUNITY</div>
            <h3 id="join-title" className="join-title">
              Get on the list, then RSVP on Meetup.
            </h3>
            <p className="join-tag">
              We&apos;ll email you once when the next meetup drops. After signup
              we&apos;ll open Meetup so you can RSVP.
            </p>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                void submitWith(new FormData(e.currentTarget));
              }}
              className="subscribe-form"
              noValidate
            >
              <input
                type="text"
                name="website"
                tabIndex={-1}
                autoComplete="off"
                aria-hidden="true"
                style={{ position: "absolute", left: "-9999px", width: 1, height: 1 }}
              />
              <input
                ref={inputRef}
                type="email"
                name="email"
                required
                autoComplete="email"
                placeholder="you@example.dev"
                disabled={pending || state.ok}
                aria-label="Email address"
              />
              <button type="submit" disabled={pending || state.ok}>
                {pending ? "..." : state.ok ? "✓" : "Join →"}
              </button>
            </form>

            {state.message ? (
              <p
                className="subscribe-msg mono"
                style={{ color: state.ok ? "var(--cyan)" : "var(--accent)" }}
                role="status"
              >
                {state.ok ? `${state.message} Opening Meetup…` : state.message}
              </p>
            ) : null}

            {state.ok ? (
              <a
                href={MEETUP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="join-fallback mono"
              >
                Continue to Meetup →
              </a>
            ) : null}
          </div>
        </div>,
            document.body,
          )
        : null}
    </>
  );
}
