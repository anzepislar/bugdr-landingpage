"use client";

import { useState } from "react";
import { joinWaitlist } from "@/lib/supabase";
import { assetPath } from "@/lib/asset-path";
import { Paras, Section } from "@/components/landing/section";

export function Waitlist() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "ok" | "err">("idle");

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");
    const result = await joinWaitlist({
      // Normalize so the unique index on lower(email) catches dupes.
      email: email.trim().toLowerCase(),
      reason: null,
    });
    setStatus(result.ok ? "ok" : "err");
  }

  const busy = status === "sending" || status === "ok";

  return (
    <Section
      id="waitlist"
      label="Waitlist"
      heading="Your first case is coming."
      intro={
        <Paras>
          {[
            "Bugdr opens October 21, 2026.",
            "Leave your email for a reminder the night before and a link when it's live.",
          ]}
        </Paras>
      }
    >
      <form
        onSubmit={submit}
        aria-label="Join the Bugdr waitlist"
        className="glass mt-10 max-w-[560px] rounded-card p-5 md:p-6"
      >
        <div className="flex flex-col gap-3 sm:flex-row">
          <label htmlFor="wl-email" className="sr-only">Email</label>
          <input
            id="wl-email"
            name="email"
            type="email"
            required
            autoComplete="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={busy}
            className="min-w-0 flex-1 rounded-btn border border-white/[0.09] bg-canvas/60 px-4 py-3 text-sm text-text placeholder:text-muted2 focus:border-action/50 focus:outline-none disabled:opacity-60"
          />
          <button type="submit" disabled={busy} className="btn-action shrink-0 disabled:cursor-not-allowed disabled:opacity-60">
            {status === "sending" ? "Sending…" : "Send me the launch link"}
          </button>
        </div>

        <p
          role="status"
          className={`mt-4 text-sm ${status === "ok" ? "text-passed" : status === "err" ? "text-failed" : "text-muted"}`}
        >
          {status === "ok"
            ? "You're on the list."
            : status === "err"
              ? "We couldn't save your email. Please try again in a moment."
              : "Two launch emails. No spam."}
        </p>
        <p className="mt-1 text-xs text-muted2">
          By joining, you agree to our{" "}
          <a href={assetPath("/privacy/")} className="underline underline-offset-2 hover:text-muted">
            Privacy Policy
          </a>
          .
        </p>
      </form>
    </Section>
  );
}
