"use client";

import { Container } from "@/components/landing/container";
import { Check, Sparkle } from "@/components/landing/icons";

const metrics = [
  { label: "Prompts", you: "12", top: "4" },
  { label: "Tokens", you: "3,840", top: "1,200" },
  { label: "First-run pass", you: "No", top: "68%" },
];

const advice = [
  "Read the full stack trace.",
  "Find the likely failure point.",
  "Ask for one targeted change, then test it.",
];

export function AIFeedback() {
  return (
    <section
      id="feedback"
      aria-labelledby="feedback-heading"
      className="relative py-24 md:py-32"
    >
      <Container>
        <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16 lg:items-start">
          <div className="lg:pt-8">
            <h2
              id="feedback-heading"
              className="text-3xl sm:text-4xl font-semibold text-text leading-tight tracking-[-0.02em]"
            >
              You fixed it. Now learn from it.
            </h2>
            <p className="mt-4 text-muted text-lg leading-relaxed">
              After each solve, get a debrief based on your session. See how many prompts,
              tokens, and test runs you used, how you compare with other people on that
              case, and what you could try differently next time.
            </p>
            <p className="mt-6 font-mono text-[11px] text-muted">
              Generated automatically after every solve. Free tier includes
              feedback on Easy solves.
            </p>
          </div>

          <div className="glass-heavy rounded-2xl p-6" aria-label="Example AI feedback conversation">
            <header className="flex items-center justify-between mb-4">
              <span className="flex items-center gap-2 text-text font-semibold">
                <Sparkle size={18} className="text-action" />
                Session debrief
              </span>
              <span className="text-muted text-sm">Example session</span>
            </header>

            <div className="flex items-center justify-between gap-3 rounded-lg bg-white/[0.03] border border-white/[0.06] px-4 py-2.5 font-mono text-[11px]">
              <span className="text-muted">Payment retries</span>
              <span className="flex items-center gap-1.5 text-passed">
                <Check size={13} />7 / 7 checks passed
              </span>
            </div>

            <div className="mt-6 flex flex-col items-end text-right">
              <span className="text-[11px] text-muted mb-2">You</span>
              <p className="max-w-[85%] rounded-lg rounded-br-sm bg-action/[0.12] border border-action/20 px-4 py-3 text-left text-sm text-text">
                It passes. What could I have done better?
              </p>
            </div>

            <div className="mt-6">
              <div className="flex items-center gap-2 text-[11px] text-muted mb-3">
                <Sparkle size={14} className="text-action" />
                <span><span className="brand">bug.dr</span> coach</span>
              </div>
              <div className="space-y-4 text-sm leading-relaxed text-muted">
                <p>
                  <strong className="text-text font-semibold">You fixed it.</strong> Your change passed every acceptance check. The next thing to work on is how you get to the fix.
                </p>

                <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
                  <div className="grid grid-cols-3 text-[10px] font-mono uppercase tracking-widest text-muted border-b border-white/[0.06] pb-2 mb-2">
                    <span>This session</span>
                    <span>You</span>
                    <span>Top performers</span>
                  </div>
                  {metrics.map((m) => (
                    <div key={m.label} className="grid grid-cols-3 py-2 text-sm border-b border-white/[0.04] last:border-b-0">
                      <span className="text-muted">{m.label}</span>
                      <strong className="text-action font-semibold">{m.you}</strong>
                      <span className="text-passed">{m.top}</span>
                    </div>
                  ))}
                </div>

                <p>
                  You ran tests <strong className="text-text font-semibold">8 times before your first passing run.</strong> Next time, spend a little longer on the logs before asking AI for a change.
                </p>

                <div>
                  <h3 className="text-text font-semibold">Try this on your next case</h3>
                  <ul className="mt-1">
                    {advice.map((item) => (
                      <li key={item} className="flex items-start gap-2 py-2 text-sm text-muted">
                        <span aria-hidden className="w-1.5 h-1.5 rounded-full bg-action/50 mt-1.5 flex-shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                <p className="text-text">A working fix is the start. A repeatable approach is what you take into the next problem.</p>
              </div>
            </div>

            <footer className="mt-6 border-t border-white/[0.06] pt-4 font-mono text-[10px] text-muted/60">
              Illustrative feedback and benchmark data.
            </footer>
          </div>
        </div>
      </Container>
    </section>
  );
}
