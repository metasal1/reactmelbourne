"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import Link from "next/link";

type ChoiceOption = { label: string; value: string };

export type Step =
  | {
      id: string;
      type: "text" | "email" | "textarea";
      question: string;
      help?: string;
      placeholder?: string;
      required?: boolean;
      maxLength?: number;
    }
  | {
      id: string;
      type: "choice";
      question: string;
      help?: string;
      required?: boolean;
      choices: ChoiceOption[];
    };

export type FlowState = {
  ok: boolean;
  message: string;
};

type Props = {
  title: string;
  lede?: string;
  steps: Step[];
  submitLabel?: string;
  action: (data: Record<string, string>) => Promise<FlowState>;
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function TypeformFlow({
  title,
  lede,
  steps,
  submitLabel = "Submit",
  action,
}: Props) {
  const [idx, setIdx] = useState(0);
  const [values, setValues] = useState<Record<string, string>>({});
  const [error, setError] = useState<string>("");
  const [result, setResult] = useState<FlowState | null>(null);
  const [pending, start] = useTransition();
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement | null>(null);

  const total = steps.length;
  const step = steps[idx];
  const isLast = idx === total - 1;

  useEffect(() => {
    setError("");
    if (inputRef.current) inputRef.current.focus();
  }, [idx]);

  function validate(): string | null {
    const v = (values[step.id] ?? "").trim();
    if (step.required !== false && !v) return "This one's required.";
    if (step.type === "email" && v && !EMAIL_RE.test(v))
      return "That email doesn't look right.";
    if ("maxLength" in step && step.maxLength && v.length > step.maxLength)
      return `Keep it under ${step.maxLength} characters.`;
    return null;
  }

  function advance() {
    const err = validate();
    if (err) {
      setError(err);
      return;
    }
    if (isLast) {
      submit();
    } else {
      setIdx((i) => Math.min(i + 1, total - 1));
    }
  }

  function back() {
    setError("");
    setIdx((i) => Math.max(i - 1, 0));
  }

  function submit() {
    start(async () => {
      const r = await action(values);
      setResult(r);
    });
  }

  function onKeyDown(e: { key: string; metaKey?: boolean; ctrlKey?: boolean; preventDefault: () => void }) {
    if (pending || result) return;
    if (step.type === "textarea") {
      if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        advance();
      }
      return;
    }
    if (e.key === "Enter") {
      e.preventDefault();
      advance();
    }
  }

  function onFormSubmit(e: { preventDefault: () => void }) {
    e.preventDefault();
    advance();
  }

  if (result) {
    return (
      <div className="tf-wrap">
        <div className="tf-step">
          <div className="tf-count mono">[ {result.ok ? "DONE" : "ERROR"} ]</div>
          <h1 className="tf-q" style={{ maxWidth: 820 }}>
            {result.ok ? "Thanks — we've got it." : "Hmm, something went sideways."}
          </h1>
          <p className="tf-help">{result.message}</p>
          <div className="tf-row" style={{ marginTop: 40 }}>
            {result.ok ? (
              <Link href="/" className="tf-btn">
                Back to reactmelbourne.com →
              </Link>
            ) : (
              <button
                type="button"
                className="tf-btn"
                onClick={() => setResult(null)}
              >
                Try again
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  const currentValue = values[step.id] ?? "";

  return (
    <div className="tf-wrap">
      <header className="tf-head">
        <Link href="/" className="tf-brand">
          react<span style={{ color: "var(--cyan)" }}>_</span>melbourne
        </Link>
        <div className="tf-progress mono">
          {String(idx + 1).padStart(2, "0")} / {String(total).padStart(2, "0")} · {title}
        </div>
      </header>

      <form className="tf-step" onSubmit={onFormSubmit} noValidate>
        <div className="tf-count mono">
          {String(idx + 1).padStart(2, "0")} →
        </div>
        <h1 className="tf-q">{step.question}</h1>
        {step.help ? <p className="tf-help">{step.help}</p> : null}
        {idx === 0 && lede ? <p className="tf-lede">{lede}</p> : null}

        {step.type === "choice" ? (
          <div className="tf-choices">
            {step.choices.map((c, i) => {
              const selected = currentValue === c.value;
              return (
                <button
                  type="button"
                  key={c.value}
                  className={`tf-choice ${selected ? "selected" : ""}`}
                  onClick={() => {
                    setValues((prev) => ({ ...prev, [step.id]: c.value }));
                    setError("");
                    if (!isLast) setTimeout(() => setIdx((x) => x + 1), 120);
                  }}
                >
                  <span className="tf-choice-key mono">
                    {String.fromCharCode(65 + i)}
                  </span>
                  <span>{c.label}</span>
                </button>
              );
            })}
          </div>
        ) : step.type === "textarea" ? (
          <textarea
            ref={(el) => {
              inputRef.current = el;
            }}
            className="tf-input tf-textarea"
            value={currentValue}
            placeholder={step.placeholder}
            onChange={(e) =>
              setValues((prev) => ({ ...prev, [step.id]: e.target.value }))
            }
            onKeyDown={onKeyDown}
            rows={5}
          />
        ) : (
          <input
            ref={(el) => {
              inputRef.current = el;
            }}
            className="tf-input"
            type={step.type === "email" ? "email" : "text"}
            value={currentValue}
            placeholder={step.placeholder}
            autoComplete={step.type === "email" ? "email" : "off"}
            onChange={(e) =>
              setValues((prev) => ({ ...prev, [step.id]: e.target.value }))
            }
            onKeyDown={onKeyDown}
            inputMode={step.type === "email" ? "email" : "text"}
          />
        )}

        {error ? <div className="tf-error mono">! {error}</div> : null}

        {step.type !== "choice" ? (
          <div className="tf-row">
            <button
              type="submit"
              className="tf-btn"
              disabled={pending}
            >
              {pending ? "..." : isLast ? submitLabel : "OK"}
              {!pending ? <span className="tf-check"> ✓</span> : null}
            </button>
            <div className="tf-hint mono">
              press <kbd>Enter</kbd>
              {step.type === "textarea" ? (
                <>
                  {" "}(⌘+Enter to advance)
                </>
              ) : null}
            </div>
          </div>
        ) : null}

        <div className="tf-nav mono">
          {idx > 0 ? (
            <button type="button" className="tf-nav-btn" onClick={back}>
              ↑ back
            </button>
          ) : null}
        </div>
      </form>

      <footer className="tf-foot mono">
        built by{" "}
        <a href="https://metasal.xyz" target="_blank" rel="noreferrer">
          metasal.xyz
        </a>
      </footer>
    </div>
  );
}
