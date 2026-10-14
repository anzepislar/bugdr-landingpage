"use client";

import { useState } from "react";
import { Container } from "@/components/landing/container";
import { joinWaitlist } from "@/lib/supabase";
import { assetPath } from "@/lib/asset-path";

// "Be there day one" — the waitlist section.
//
// Earlier versions used framer-motion's `whileInView` to slide the
// copy block and the form card in from opposite sides, and a continuous
// "pop" animation on the submit button. On the static export the SSR
// HTML rendered them at `opacity:0` with a translate, and the
// IntersectionObserver only fired for content that were actually in the
// viewport. Off-screen content stayed invisible in fullPage screenshots,
// for crawlers, and for anyone trying to print the page. The fix:
// render plain HTML. The content is always visible.

const WAITLIST_COUNT: number | null = null;

export function Waitlist() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "ok" | "err">(
    "idle",
  );

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!email.includes("@")) return;
    setStatus("sending");

    const result = await joinWaitlist({
      // Normalize so the unique index on lower(email) catches dupes.
      email: email.trim().toLowerCase(),
      reason: null,
    });

    setStatus(result.ok ? "ok" : "err");
  }

  return (
    <section
      id="waitlist"
      aria-labelledby="waitlist-heading"
      className="relative py-24 md:py-32"
    >
      <Container>
        <div className="max-w-2xl mx-auto text-center">
          <h2
            id="waitlist-heading"
            className="text-3xl sm:text-4xl font-semibold text-text leading-tight tracking-[-0.02em]"
          >
            Your first case is coming.
          </h2>
          <p className="mt-4 text-muted text-lg leading-relaxed">
            We&apos;re opening <span className="brand">bug.dr</span> on October 21. Leave your email and we&apos;ll send
            you a reminder the night before and a link when it&apos;s live.
          </p>
        </div>

        <form
          onSubmit={submit}
          className="glass-heavy rounded-2xl overflow-hidden max-w-lg mx-auto mt-10"
          aria-label="Join the bug.dr waitlist"
        >
          <div className="accent-stripe" />
          <div className="p-8">
            <div className="font-mono text-xs uppercase tracking-widest text-action/70">
              Get the launch link
            </div>

            <div className="mt-6">
              <Field
                label="Email"
                required
                htmlFor="wl-email"
                input={
                  <input
                    id="wl-email"
                    name="email"
                    type="email"
                    required
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    disabled={status === "sending" || status === "ok"}
                    className="w-full bg-white/[0.04] border border-white/[0.08] rounded-lg px-4 py-3 text-text text-sm placeholder:text-muted/40 focus:outline-none focus:border-action/45 focus:ring-1 focus:ring-action/[0.12] transition-all disabled:opacity-60"
                  />
                }
              />
            </div>

            <button
              type="submit"
              className="glass-action mt-6 w-full rounded-lg py-3 text-action font-semibold disabled:opacity-60 disabled:cursor-not-allowed"
              disabled={status === "sending" || status === "ok"}
            >
              {status === "sending"
                ? "Sending…"
                : status === "ok"
                  ? "You're on the list"
                  : "Join the waitlist"}
            </button>

            <div
              className={
                "mt-3 font-mono text-[11px] " +
                (status === "ok"
                  ? "text-passed"
                  : status === "err"
                    ? "text-failed"
                    : "text-muted")
              }
              role="status"
            >
              {status === "ok"
                ? "You're on the list. We'll email you before launch."
                : status === "err"
                  ? "We couldn't save your email. Please try again in a moment."
                  : "Two launch emails. No spam. See our Privacy Policy for how we handle your details."}
            </div>

            <p className="mt-2 font-mono text-[11px] text-muted">
              By joining you agree to our{" "}
              <a
                href={assetPath("/privacy/")}
                className="text-text underline underline-offset-2 decoration-text/30 hover:decoration-text"
              >
                Privacy Policy
              </a>
              .
            </p>
          </div>
        </form>
      </Container>
    </section>
  );
}

function Field({
  label,
  required,
  optional,
  htmlFor,
  input,
  tone = "dark",
}: {
  label: string;
  required?: boolean;
  optional?: boolean;
  htmlFor: string;
  input: React.ReactNode;
  tone?: "dark" | "light";
}) {
  // Two label colorways: "dark" for forms on the page background (muted
  // gray label, blue "required" pill) and "light" for forms inside the
  // bright blue card (full-dark label and "required" pill for max
  // contrast against the blue).
  const labelClass = tone === "light" ? "text-bg" : "text-muted";
  const requiredClass = tone === "light" ? "text-bg" : "text-action";
  return (
    <div>
      <label
        htmlFor={htmlFor}
        className={`flex items-center justify-between font-mono text-[11px] uppercase tracking-wider ${labelClass}`}
      >
        <span>{label}</span>
        {required ? (
          <span className={requiredClass}>required</span>
        ) : optional ? (
          <span>optional</span>
        ) : null}
      </label>
      <div className="mt-1.5">{input}</div>
    </div>
  );
}
