"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./how-it-works.module.css";
import { Container } from "@/components/landing/container";
import { type Line, TONE_CLASS } from "@/components/landing/code-block";
import { Check } from "@/components/landing/icons";
import { ZoomableImage } from "@/components/ui/zoomable-image";
import Image from "next/image";
import { assetPath } from "@/lib/asset-path";

// How it works — three steps: Diagnose. Treat. Submit.
//
// Earlier versions used framer-motion's `whileInView` to slide each step
// in from alternating sides. On the static export the SSR HTML rendered
// each step at `opacity:0` with a translate, and the IntersectionObserver
// only fired for steps that were actually in the viewport. Off-screen
// steps stayed invisible in fullPage screenshots, for crawlers, and for
// anyone trying to print the page. The fix: render plain HTML. The
// content is always visible.

// Real acceptance checks from the Payment retries problem (problem-detail.png).
// Used by step 03 (the static checks card). HeroIDE exports its own copy so
// the two visuals can live independently; the labels here are the source of
// truth for the rest of the page.
const acceptanceChecks: { label: string }[] = [
  { label: "Retry transient failures" },
  { label: "Prevent duplicate charges" },
  { label: "Back off between retries" },
  { label: "Existing tests still pass" },
  { label: "Preserve successful payments" },
  { label: "Keep the worker healthy" },
  { label: "Keep failed jobs visible in the queue" },
];

export function HowItWorks() {
  const section = useRef<HTMLElement>(null);
  const [progress, setProgress] = useState(0);
  const active = progress >= .75 ? 2 : progress >= .375 ? 1 : 0;
  useEffect(() => {
    let frame = 0;
    const measure = () => {
      frame = 0;
      if (!section.current) return;
      const rect = section.current.getBoundingClientRect();
      setProgress(Math.max(0, Math.min(1, -rect.top / Math.max(1, rect.height - innerHeight))));
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(measure); };
    measure();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => { cancelAnimationFrame(frame); window.removeEventListener("scroll", schedule); window.removeEventListener("resize", schedule); };
  }, []);
  const items = [
    {
      n: "01",
      label: "Get the context",
      title: "Read the bug report and explore the codebase.",
      body:
        "You'll know what the app is supposed to do and where it's failing. Finding the cause is your job. The timer starts when you start the case.",
      visual: <ProblemDetailShot />,
    },
    {
      n: "02",
      label: "Work through the fix",
      title: "Use the editor, terminal, and AI assistant in your browser.",
      body:
        "Follow a stack trace, ask questions, try a change, and run the code. Your prompts, token usage, and test runs are recorded along the way.",
      visual: <WorkspaceShot />,
    },
    {
      n: "03",
      label: "Check your work",
      title: "Run the checks when you're ready.",
      body:
        "Your fix needs to solve the problem without breaking the rest of the app. Once you pass, your result is saved. You can't replay the same case to replace it with a better score.",
      visual: <StaticChecksCard />,
    },
  ];

  return (
    <section ref={section} id="how-it-works" aria-labelledby="how-heading" className={styles.section}>
      <div className={styles.sticky}>
        <Container>
          <h2 id="how-heading" className={styles.heading}>How it <span>works</span></h2>
          <div className={styles.layout}>
            <ol className={styles.steps}>
              {items.map((item, index) => (
                <li key={item.n} className={styles.step} data-active={active === index} data-reached={active >= index} aria-current={active === index ? "step" : undefined}>
                  <span className={styles.number}>{index + 1}</span>
                  {index < 2 && <span className={styles.track} aria-hidden="true"><span style={{ transform: `scaleY(${Math.max(0, Math.min(1, progress / .375 - index))})` }} /></span>}
                  <div className={styles.copy}>
                    <h3>{item.label}</h3>
                    <p className={styles.title}>{item.title}</p>
                    <p className={styles.body}>{item.body}</p>
                  </div>
                </li>
              ))}
            </ol>
            <div className={styles.visuals}>
              {items.map((item, index) => (
                <div key={item.n} className={styles.visual} data-active={active === index} inert={active !== index} aria-hidden={active !== index}>
                  {item.visual}
                </div>
              ))}
            </div>
          </div>
        </Container>
      </div>
    </section>
  );
}

function ProblemDetailShot() {
  // Real product screenshot for step 01 ("Read the incident"). The visitor
  // sees the real assignment, incident log and acceptance checks, not a
  // mock. Wrapped in ZoomableImage so the user can open it fullscreen to
  // read the assignment.
  return (
    <div className="rounded-xl border border-border bg-surface shadow-card overflow-hidden">
      <ZoomableImage
        src={assetPath("/screenshots/problem-detail.png")}
        alt="Payment retries problem page showing the assignment, incident log and acceptance checks."
        width={1570}
        height={1600}
        sizes="(min-width: 1024px) 700px, 100vw"
      />
    </div>
  );
}

function WorkspaceShot() {
  return (
    <div className="rounded-xl border border-border bg-surface shadow-card overflow-hidden">
      <Image
        src={assetPath("/solve-page-ai-chat.png")}
        alt="bug.dr workspace showing the editor, terminal and AI assistant"
        width={1600}
        height={900}
        className="w-full h-auto"
      />
    </div>
  );
}

// ── StaticDiffCard (step 02) ──────────────────────────────────────────────
//
// Small static card that shows the same two-line diff the user sees
// animated in the hero, without the editor chrome or the ask-ai line.
// Just the diff header and the two added lines that fix the retry loop
// (idempotency key on charge, exponential backoff after a failed attempt).
//
// The two lines are kept in lock-step with the hero's `addedCode` in
// `components/landing/hero.tsx`. If one is edited, the other must be too.

// Helper: token tone -> Tailwind class. Falls back to body text.
function cls(tone: Line["tokens"][number]["tone"]): string {
  return TONE_CLASS[tone ?? "muted"] ?? "text-text";
}

const diffLines: Line[] = [
  // + const result = await charge(order, { idempotencyKey: order.id });
  {
    tokens: [
      { text: "const", tone: "kw" },
      { text: " ", tone: "muted" },
      { text: "result", tone: "fn" },
      { text: " = ", tone: "muted" },
      { text: "await", tone: "kw" },
      { text: " ", tone: "muted" },
      { text: "charge", tone: "fn" },
      { text: "(", tone: "punct" },
      { text: "order", tone: "fn" },
      { text: ", ", tone: "punct" },
      { text: "{", tone: "punct" },
      { text: " ", tone: "muted" },
      { text: "idempotencyKey", tone: "fn" },
      { text: ": ", tone: "punct" },
      { text: "order", tone: "fn" },
      { text: ".", tone: "punct" },
      { text: "id", tone: "fn" },
      { text: " });", tone: "punct" },
    ],
  },
  // + await sleep(2 ** i * 100);
  {
    tokens: [
      { text: "await", tone: "kw" },
      { text: " ", tone: "muted" },
      { text: "sleep", tone: "fn" },
      { text: "(", tone: "punct" },
      { text: "2", tone: "num" },
      { text: " ** ", tone: "muted" },
      { text: "i", tone: "fn" },
      { text: " * ", tone: "muted" },
      { text: "100", tone: "num" },
      { text: ");", tone: "punct" },
    ],
  },
];

function StaticDiffCard() {
  return (
    <div
      className="rounded-xl border border-border bg-surface shadow-card overflow-hidden max-w-xl"
      data-testid="static-diff-card"
    >
      {/* Diff header. Matches the hero card's header so the two visuals
          read as the same diff at two different sizes. */}
      <div className="flex items-center justify-between border-b border-border bg-bg/40 px-4 py-2 font-mono text-[11px]">
        <span className="text-muted">diff · retry loop</span>
        <span className="text-diffEasy">+ 2</span>
      </div>
      <div className="bg-bg px-4 py-2.5 font-mono text-[12px] leading-[1.65] overflow-x-auto">
        {diffLines.map((line, i) => (
          <div key={i} className="flex">
            <span className="w-5 shrink-0 select-none pr-2 text-diffEasy">
              +
            </span>
            <span className="min-w-0 whitespace-pre">
              {line.tokens.map((tok, j) => (
                <span key={j} className={cls(tok.tone)}>
                  {tok.text}
                </span>
              ))}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── StaticChecksCard (step 03) ────────────────────────────────────────────
//
// Static acceptance-checks card. Lists the 7 real names from
// `acceptanceChecks`. No animation, no score-locked pill — the hero
// already shows the live "ticking in" version; this is the after-the-
// fact summary. The "first successful result is final" rule now lives
// in the scorecard section and the FAQ, not here.

function StaticChecksCard() {
  return (
    <div
      className="rounded-xl border border-border bg-surface shadow-card overflow-hidden max-w-xl"
      data-testid="static-checks-card"
    >
      <div className="border-b border-border bg-bg/30 px-4 py-3">
        <div className="flex items-center justify-between font-mono text-[11px]">
          <span className="uppercase tracking-wider text-muted">
            acceptance checks
          </span>
          <span className="text-action">7 / 7 passing</span>
        </div>
      </div>
      <div className="px-4 py-3 grid grid-cols-1 sm:grid-cols-2 gap-1.5 font-mono text-[11px]">
        {acceptanceChecks.map((c) => (
          <div
            key={c.label}
            className="flex items-center gap-2 rounded border border-border bg-surface/60 px-2 py-1.5 min-w-0"
          >
            <span className="inline-flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-full bg-action/15 text-action ring-1 ring-action/40">
              <Check size={9} />
            </span>
            <span className="text-text/85 min-w-0 break-words">{c.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
