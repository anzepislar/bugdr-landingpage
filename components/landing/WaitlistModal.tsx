"use client";

import { useEffect, useState } from "react";
import { joinWaitlist } from "@/lib/supabase";
import { assetPath } from "@/lib/asset-path";

// Waitlist modal opened from the hero CTA. Submits through the same
// joinWaitlist() Supabase insert as the Waitlist section form.
// Keyframes (modal-in, pulse-dot, fade-up) live in globals.css.

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const AVATARS = [
  { letter: "A", bg: "#3b5bdb" },
  { letter: "J", bg: "#2f9e44" },
  { letter: "M", bg: "#c2255c" },
  { letter: "K", bg: "#e67700" },
];

export function WaitlistModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [closing, setClosing] = useState(false);

  // Fade the overlay out, then tell the parent.
  const close = () => {
    setClosing(true);
    setTimeout(() => {
      setClosing(false);
      onClose();
    }, 200);
  };

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  if (!isOpen) return null;

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const value = email.trim();
    if (!EMAIL_RE.test(value)) {
      setError("Please enter a valid email address.");
      return;
    }
    setLoading(true);
    const result = await joinWaitlist({
      // Normalize so the unique index on lower(email) catches dupes.
      email: value.toLowerCase(),
      reason: null,
    });
    setLoading(false);
    if (result.ok) setSuccess(true);
    else setError("Something went wrong. Please try again.");
  }

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 bg-[rgba(8,10,12,0.75)] transition-opacity duration-200 ${closing ? "opacity-0" : "opacity-100"}`}
      style={{ backdropFilter: "blur(14px)", WebkitBackdropFilter: "blur(14px)" }}
      onClick={(e) => e.target === e.currentTarget && close()}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="waitlist-modal-title"
        className="relative w-full max-w-[420px] overflow-hidden rounded-[20px] border border-white/[0.13] bg-surface"
        style={{
          boxShadow:
            "0 0 0 1px rgba(139,172,255,0.05), 0 32px 80px rgba(0,0,0,0.65), 0 0 60px rgba(139,172,255,0.04)",
          animation: "modal-in 0.28s cubic-bezier(0.22, 1, 0.36, 1) both",
        }}
      >
        <div
          aria-hidden
          className="h-[3px]"
          style={{
            background:
              "linear-gradient(90deg, transparent 0%, rgba(139,172,255,0.5) 30%, rgba(139,172,255,0.8) 50%, rgba(139,172,255,0.5) 70%, transparent 100%)",
          }}
        />

        <div className="px-9 pt-8 pb-9">
          <button
            type="button"
            onClick={close}
            aria-label="Close"
            className="absolute top-4 right-4 flex h-[30px] w-[30px] items-center justify-center rounded-lg border border-white/[0.08] bg-[#26292f] text-muted transition-colors hover:border-white/[0.13] hover:bg-white/[0.06] hover:text-text focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-action"
          >
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
              <path d="M1 1l8 8M9 1L1 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>

          {success ? (
            <div
              className="flex flex-col items-center pt-2 pb-1 text-center"
              aria-live="polite"
              style={{ animation: "fade-up 0.3s ease both" }}
            >
              <div
                aria-hidden
                className="mb-4 flex h-[52px] w-[52px] items-center justify-center rounded-full border-[1.5px] border-[rgba(34,197,94,0.25)] bg-[rgba(34,197,94,0.08)] text-[22px] text-[#22c55e]"
                style={{ boxShadow: "0 0 24px rgba(34,197,94,0.15)" }}
              >
                ✓
              </div>
              <h3 className="mb-1.5 text-[1.3rem] font-extrabold tracking-[-0.02em] text-text">
                You&apos;re on the list.
              </h3>
              <p className="mb-5 text-[0.85rem] leading-[1.6] text-muted">
                We&apos;ll email <span className="text-action">{email.trim().toLowerCase()}</span> when access opens.
                <br />
                Don&apos;t let your title speak for you.
              </p>
              <button
                type="button"
                onClick={close}
                className="rounded-lg border border-white/[0.13] px-6 py-[9px] text-[0.85rem] font-medium text-muted transition-colors hover:text-text"
              >
                Got it
              </button>
            </div>
          ) : (
            <>
              <div className="mb-2.5 inline-flex items-center gap-1.5 font-mono text-[0.65rem] font-semibold uppercase tracking-[0.13em] text-action">
                <span
                  aria-hidden
                  className="h-[5px] w-[5px] rounded-full bg-[#22c55e]"
                  style={{ boxShadow: "0 0 6px #22c55e", animation: "pulse-dot 2s ease-in-out infinite" }}
                />
                Early Access
              </div>

              <h2
                id="waitlist-modal-title"
                className="mb-3 text-[1.75rem] font-extrabold leading-[1.25] tracking-[-0.02em] text-text [text-wrap:balance]"
              >
                Get in before the crash.
              </h2>

              <p className="mb-7 text-[0.925rem] leading-[1.75] text-muted">
                Join developers already on the list. We&apos;ll email you when your debugging environment is ready.
              </p>

              <form className="flex flex-col gap-2" onSubmit={submit} noValidate>
                <div className="group relative">
                  <input
                    type="email"
                    required
                    autoFocus
                    autoComplete="email"
                    aria-label="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@company.com"
                    className="w-full rounded-[10px] border border-white/[0.08] bg-white/[0.04] py-[13px] pr-4 pl-10 text-[0.9rem] text-text outline-none transition-[border-color,box-shadow,background] duration-150 placeholder:text-[#6B7280] focus:border-[rgba(139,172,255,0.45)] focus:bg-[rgba(139,172,255,0.04)] focus:shadow-[0_0_0_3px_rgba(139,172,255,0.08)]"
                  />
                  <span
                    aria-hidden
                    className="pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2 text-[#6B7280] transition-colors group-focus-within:text-action"
                  >
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                      <rect x="1" y="2.5" width="12" height="9" rx="1.5" stroke="currentColor" strokeWidth="1.3" />
                      <path d="M1 4.5l6 4 6-4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
                    </svg>
                  </span>
                </div>

                {error && (
                  <div role="alert" className="mt-0.5 flex items-center gap-[5px] text-[0.78rem] text-[#ef4444]">
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden>
                      <circle cx="6" cy="6" r="5" stroke="currentColor" strokeWidth="1.2" />
                      <path d="M6 4v3M6 8.5v.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
                    </svg>
                    <span>{error}</span>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="group/btn flex w-full items-center justify-center gap-2 rounded-[10px] border border-[rgba(139,172,255,0.30)] bg-[rgba(139,172,255,0.10)] px-5 py-[13px] text-[0.9rem] font-semibold tracking-[0.01em] text-action shadow-[0_0_20px_rgba(139,172,255,0.10)] transition-[background,border-color,box-shadow] duration-[180ms] hover:border-[rgba(139,172,255,0.52)] hover:bg-[rgba(139,172,255,0.18)] hover:shadow-[0_0_32px_rgba(139,172,255,0.20)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-action disabled:cursor-not-allowed disabled:opacity-[0.55]"
                >
                  {loading ? (
                    <>
                      Securing your spot...
                      <span
                        aria-hidden
                        className="h-3.5 w-3.5 animate-[spin_0.6s_linear_infinite] rounded-full border-2 border-[rgba(139,172,255,0.25)] border-t-action"
                      />
                    </>
                  ) : (
                    <>
                      Get early access
                      <span aria-hidden className="transition-transform duration-200 group-hover/btn:translate-x-[3px]">
                        →
                      </span>
                    </>
                  )}
                </button>

                <p className="text-[0.7rem] text-[#6B7280]">
                  By joining you agree to our{" "}
                  <a href={assetPath("/privacy/")} className="underline underline-offset-2 hover:text-muted">
                    Privacy Policy
                  </a>
                  .
                </p>
              </form>

              <div className="my-6 h-px bg-white/[0.08]" />

              <div className="flex items-center gap-2.5">
                <div className="flex">
                  {AVATARS.map((a) => (
                    <div
                      key={a.letter}
                      aria-hidden
                      className="-mr-[7px] flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 border-surface text-[11px] font-semibold text-white"
                      style={{ background: a.bg }}
                    >
                      {a.letter}
                    </div>
                  ))}
                </div>
                <p className="pl-[7px] text-[0.76rem] leading-[1.4] text-muted">
                  {/* ponytail: hardcoded count from the design; wire to a real count before launch */}
                  <strong className="font-semibold text-text">247 developers</strong> already on the list.
                  <br />
                  Spots are limited for the first cohort.
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
