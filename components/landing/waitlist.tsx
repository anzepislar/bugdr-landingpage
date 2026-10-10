"use client";

import { useState } from "react";
import { Container } from "@/components/landing/container";
import { Button } from "@/components/ui/button";
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
      className="lower-section relative divider-top"
    >
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
          <div className="lg:col-span-7">
            <h2
              id="waitlist-heading"
              className="mt-3 text-3xl sm:text-4xl font-semibold text-headline"
            >
              Your first case is coming.
            </h2>
            <p className="mt-4 text-muted text-lg leading-relaxed">
              We&apos;re opening bug.dr on October 21. Leave your email and we&apos;ll send
              you a reminder the night before and a link when it&apos;s live.
            </p>
          </div>

          <div className="lg:col-span-5">
            {/* Bright blue card — same look the old FinalCta had, now
                doing real work (writing to Supabase). Faint grid overlay
                sits behind the form for texture, like the FinalCta did. */}
            <form
              onSubmit={submit}
              className="signup-form relative overflow-hidden rounded-lg border border-action/30 bg-action text-bg p-6 sm:p-8"
              aria-label="Join the bug.dr waitlist"
            >
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0 opacity-20"
                style={{
                  backgroundImage:
                    "linear-gradient(rgba(21,22,24,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(21,22,24,0.3) 1px, transparent 1px)",
                  backgroundSize: "32px 32px",
                }}
              />

              <div className="relative">
                <div className="font-mono text-xs uppercase tracking-wider text-bg">
                  Get the launch link
                </div>

                <div className="mt-6 space-y-4">
                  <Field
                    tone="light"
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
                        className={inputClassLight}
                      />
                    }
                  />
                </div>

                <Button
                  type="submit"
                  size="md"
                  className="mt-6 w-full !bg-bg !text-action hover:!bg-surface"
                  disabled={status === "sending" || status === "ok"}
                >
                  {status === "sending"
                    ? "Sending…"
                    : status === "ok"
                      ? "You're on the list"
                      : "Join the waitlist"}
                </Button>

                <div
                  className={
                    "mt-3 font-mono text-[11px] " +
                    (status === "err" ? "text-bg" : "text-bg/80")
                  }
                  role="status"
                >
                  {status === "ok"
                    ? "You're on the list. We'll email you before launch."
                    : status === "err"
                      ? "We couldn't save your email. Please try again in a moment."
                      : "Two launch emails. No spam. See our Privacy Policy for how we handle your details."}
                </div>

                {/* Privacy agreement. Plain text + inline link. Sits
                    just under the submit button so it reads as the
                    consent attached to the action, not a separate
                    section. */}
                <p className="mt-2 font-mono text-[11px] text-bg/80">
                  By joining you agree to our{" "}
                  <a
                    href={assetPath("/privacy/")}
                    className="text-bg underline underline-offset-2 decoration-bg/40 hover:decoration-bg"
                  >
                    Privacy Policy
                  </a>
                  .
                </p>
              </div>
            </form>
          </div>
        </div>
      </Container>
    </section>
  );
}

// Input style for use INSIDE the bright blue card. Solid dark fill, light
// text for readability on the dark surface, with a subtle light border
// that defines the box against the blue.
const inputClassLight =
  "block w-full h-11 rounded-md border border-white/10 bg-bg/90 px-3 text-sm text-text placeholder:text-muted focus:border-white/40 focus:outline-none disabled:opacity-60";

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
