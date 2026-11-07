import type { CSSProperties } from "react";
import { FeatureSection, Heading, Label } from "@/components/landing/feature-sections";

// Native <details name="faq"> gives a one-open-at-a-time accordion with no
// JS (browsers without exclusive-details support just allow several open).

const faqs = [
  {
    q: "Can I use AI?",
    a: "Yes. Use the workspace assistant to explore code, ask questions, and work on a fix. You still need to understand the changes and check that they work. Use AI. Own the code.",
  },
  {
    q: "Are these actual production codebases?",
    a: "They're practice codebases built around failures you could encounter at work. You get incident context and room to investigate without touching a live customer system.",
  },
  {
    q: "Which languages and tools are covered?",
    a: "The listed library stacks include Node.js, TypeScript, Python, Go, React, Next.js, PostgreSQL, Redis, JWT, and WebSockets. Check the individual case before starting.",
  },
  {
    q: "Do I need to install anything?",
    a: "No. The editor, terminal, AI assistant, and tests run in your browser.",
  },
  {
    q: "What affects my score?",
    a: "A working, reliable fix matters most. Scoring also considers code quality, testing, time, and AI usage. Fewer tokens or fewer lines do not automatically mean better engineering.",
  },
  {
    q: "Can I retry for a better score?",
    a: "Your first successful result is final. Take the lesson into your next case.",
  },
  {
    q: "What does Pro include?",
    a: "Career paths, AI feedback after each solve, a higher daily token limit, and the listed Pro model options. €21.99 monthly or €189.99 yearly.",
  },
  {
    q: "Will a path get me a job?",
    a: "A path gives you relevant practice and benchmarks. It cannot promise employment. Hiring decisions belong to employers.",
  },
];

export function Faq() {
  return (
    <FeatureSection id="faq" bg="fs-bg-faq">
      <div className="grid gap-12 lg:grid-cols-[1fr_1.6fr] lg:gap-16">
        <div className="rv" style={{ "--i": 0 } as CSSProperties}>
          <Label dot="blue">FAQ</Label>
          <Heading>Questions, answered.</Heading>
        </div>
        <div className="rv space-y-3" style={{ "--i": 1 } as CSSProperties}>
          {faqs.map((f) => (
            <details
              key={f.q}
              name="faq"
              className="faq group rounded-2xl border border-border bg-surface transition-colors open:border-[color-mix(in_srgb,var(--action)_35%,transparent)]"
            >
              <summary className="flex cursor-pointer items-center justify-between gap-6 rounded-2xl px-6 py-5 text-left text-base font-medium text-text transition-colors hover:text-action focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-action md:text-[17px]">
                {f.q}
                <span aria-hidden className="faq-icon text-xl leading-none text-muted">+</span>
              </summary>
              <p className="max-w-[65ch] px-6 pb-6 text-[15px] leading-[1.65] text-muted">{f.a}</p>
            </details>
          ))}
        </div>
      </div>
    </FeatureSection>
  );
}
