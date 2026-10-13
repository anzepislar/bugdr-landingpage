"use client";

import { useState } from "react";
import { Container } from "@/components/landing/container";
import { ChevronDown } from "@/components/landing/icons";

// FAQ — accordion.
//
// Earlier versions used framer-motion's `whileInView` to slide each
// row in from alternating sides, and a `motion.p` for the open/close
// answer animation. On the static export the SSR HTML rendered the
// section header and rows at `opacity:0` with a translate, and the
// IntersectionObserver only fired for content that was actually in the
// viewport. Off-screen content stayed invisible in fullPage screenshots,
// for crawlers, and for anyone trying to print the page. The fix:
// render plain HTML for the section chrome and the row entries. The
// open/close answer uses a CSS grid-row transition (no framer-motion
// needed for that), so the accordion still feels smooth.

const faqs = [
  {
    q: "Can I use AI?",
    a: "Yes. There's an AI assistant in the workspace. Use it to explore the code, ask questions, and work on your fix. You still need to understand the changes and check that they work.",
  },
  {
    q: "Are these real production codebases?",
    a: "They're practice codebases built around bugs and failures you could encounter at work. You get the context of a production incident in an environment where you can investigate and make changes.",
  },
  {
    q: "Which languages and tools are covered?",
    a: "The library covers cases using Node.js, TypeScript, Python, Go, React, Next.js, PostgreSQL, Redis, JWT, and WebSockets. Check each case for its stack before you start.",
  },
  {
    q: "Do I need to install anything?",
    a: "No. The editor, terminal, AI assistant, and tests run in your browser.",
  },
  {
    q: "What affects my score?",
    a: "A working, reliable fix matters most. We also look at code quality, how you test your changes, time, and AI usage. Using fewer tokens or writing fewer lines doesn't automatically make a fix better.",
  },
  {
    q: "Can I retry a case for a better score?",
    a: "Your first successful result is final. You can learn from it and take that experience into your next case.",
  },
  {
    q: "What's included in Pro?",
    a: "Pro adds a personalized AI debrief after each solve and structured career paths. It costs €12.99 a month or €99 a year.",
  },
  {
    q: "Will completing a path get me a job?",
    a: "No platform can promise that. A path helps you build experience and see how your work compares with its benchmarks. Hiring decisions still belong to employers.",
  },
  {
    q: "When can I try it?",
    a: "October 21, 2026. Join the waitlist and we'll send you the link when we open.",
  },
  {
    q: "I'm hiring. Can we talk?",
    a: <>Yes. Join the waitlist and we&apos;ll reach out about using <span className="brand">bug.dr</span> with your team.</>,
  },
];

export function Faq() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section
      id="faq"
      aria-labelledby="faq-heading"
      className="lower-section relative divider-top"
    >
      <Container>
        <div className="max-w-2xl">
          <h2
            id="faq-heading"
            className="mt-3 text-3xl sm:text-4xl font-semibold text-headline"
          >
            A few things you might be wondering.
          </h2>
        </div>

        <div className="faq-list">
          {faqs.map((item, i) => (
            <div
              key={item.q}
              className="glass overflow-hidden"
            >
              <button
                type="button"
                onClick={() => setOpen(open === i ? null : i)}
                aria-expanded={open === i}
                aria-controls={`faq-panel-${i}`}
                className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left hover:bg-white/[0.04] transition-colors"
              >
                <span className="text-[15px] font-medium">{item.q}</span>
                <ChevronDown
                  size={18}
                  className={[
                    "shrink-0 text-muted transition-transform duration-300",
                    open === i ? "rotate-180 text-action" : "",
                  ].join(" ")}
                />
              </button>
              <div
                id={`faq-panel-${i}`}
                role="region"
                className={[
                  "grid transition-[grid-template-rows] duration-300 ease-out",
                  open === i ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
                ].join(" ")}
              >
                <div className="overflow-hidden">
                  <p className="px-6 pb-6 text-muted leading-relaxed">
                    {item.a}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
