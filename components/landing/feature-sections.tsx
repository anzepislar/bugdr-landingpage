"use client";

import { useEffect, useRef, type CSSProperties, type ReactNode } from "react";
import { assetPath } from "@/lib/asset-path";
import { APP_URL } from "@/lib/site";
import { Brandify } from "@/components/landing/wordmark";

// Feature sections directly under the hero. Centered sections (problems,
// feedback, CV, hackathons) alternate with two-column sections. Each section
// gets its own faint background treatment (.fs-bg-* in globals.css).

// ── Scroll reveal ──────────────────────────────────────────────────────
// Content is visible by default (SSR, no JS, crawlers, reduced motion). It
// is only hidden after mount, and only if the section starts below the
// viewport, so nothing can get stuck invisible. Children marked `.rv`
// fade in staggered by their --i index (see globals.css).
function useReveal<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (el.getBoundingClientRect().top < innerHeight) return;
    el.dataset.reveal = "hidden";
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        el.dataset.reveal = "shown";
        io.disconnect();
      },
      { threshold: 0.15 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return ref;
}

// Stagger index for a revealed child.
const delay = (i: number) => ({ "--i": i }) as CSSProperties;

// ── Building blocks ────────────────────────────────────────────────────
const DOT = { blue: "bg-action", amber: "bg-[var(--cta)]", green: "bg-passed" } as const;

export function Label({ dot, glow, children }: { dot: keyof typeof DOT; glow?: boolean; children: ReactNode }) {
  return (
    <span className="mb-7 inline-flex items-center gap-2 rounded-full border border-border px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-[0.1em] text-muted">
      <span aria-hidden className={`h-1.5 w-1.5 rounded-full ${DOT[dot]} ${glow ? "shadow-[0_0_8px_var(--action)]" : ""}`} />
      {children}
    </span>
  );
}

export function Heading({ big, children }: { big?: boolean; children: ReactNode }) {
  return (
    <h2
      className={`font-display font-semibold leading-[1.08] tracking-[-0.025em] text-text ${
        big ? "text-[clamp(40px,6vw,72px)]" : "text-[clamp(32px,4.4vw,56px)]"
      }`}
    >
      {children}
    </h2>
  );
}

export function Body({ className = "max-w-[400px]", children }: { className?: string; children: ReactNode }) {
  return <p className={`mt-6 text-[clamp(15px,0.4vw+13.5px,17px)] leading-[1.65] text-muted ${className}`}>{children}</p>;
}

type Clip = [start: number, end: number];

// `clip` = [start, end] in seconds: plays and loops only that part of the file.
// `rate` = playback speed (1.5 = 1.5x).
function Video({ file, className, clip, rate = 1 }: { file: string; className: string; clip?: Clip; rate?: number }) {
  const ref = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    v.defaultPlaybackRate = rate;
    v.playbackRate = rate;
    // Looping motion is opt-out for reduced-motion users.
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) v.pause();
    if (!clip) return;
    // The #t= fragment stops playback at `end`; jump back to `start` from there.
    const loopClip = () => {
      if (v.currentTime < clip[1] - 0.05 && !v.ended) return;
      v.currentTime = clip[0];
      if (!matchMedia("(prefers-reduced-motion: reduce)").matches) v.play().catch(() => {});
    };
    v.addEventListener("timeupdate", loopClip);
    v.addEventListener("pause", loopClip);
    return () => {
      v.removeEventListener("timeupdate", loopClip);
      v.removeEventListener("pause", loopClip);
    };
  }, [clip, rate]);
  return (
    <video
      ref={ref}
      src={assetPath(`/screenshots/${encodeURIComponent(file)}`) + (clip ? `#t=${clip[0]},${clip[1]}` : "")}
      autoPlay
      muted
      loop={!clip}
      playsInline
      preload="metadata"
      aria-hidden
      className={className}
    />
  );
}

function FeatureVideo({ file, clip, rate }: { file: string; clip?: Clip; rate?: number }) {
  return (
    // Always 16:9 so the recording is never cropped.
    <div className="aspect-video w-full overflow-hidden rounded-[20px] border border-border shadow-[0_40px_80px_-20px_rgba(0,0,0,0.6)]">
      <Video file={file} clip={clip} rate={rate} className="block h-full w-full object-cover" />
    </div>
  );
}

// `bg` picks the section's ::before treatment; `decor` renders behind the content.
export function FeatureSection({
  id,
  bg = "",
  decor,
  className = "",
  children,
}: {
  id?: string;
  bg?: string;
  decor?: ReactNode;
  className?: string;
  children: ReactNode;
}) {
  const ref = useReveal<HTMLElement>();
  return (
    <section ref={ref} id={id} className={`feature-section relative isolate overflow-hidden ${bg} ${className}`}>
      {decor}
      <div className="relative z-[1] mx-auto w-full max-w-[1200px]">{children}</div>
    </section>
  );
}

// Centered column; each child fades in 80ms after the previous one.
export function Centered({ children }: { children: ReactNode[] }) {
  return (
    <div className="flex flex-col items-center text-center">
      {children.map((c, i) => (
        <div key={i} className="rv flex w-full flex-col items-center" style={delay(i)}>
          {c}
        </div>
      ))}
    </div>
  );
}

// Text + video side by side from xl (video column 2x wider so its text stays
// readable); below that they stack with the video under the text, full width.
function TwoCol({
  video,
  clip,
  rate,
  videoSide,
  children,
}: {
  video: string;
  clip?: Clip;
  rate?: number;
  videoSide: "left" | "right";
  children: ReactNode;
}) {
  const left = videoSide === "left";
  return (
    <div className={`grid items-center gap-10 xl:gap-12 ${left ? "xl:grid-cols-[2fr_1fr]" : "xl:grid-cols-[1fr_2fr]"}`}>
      <div className="rv" style={delay(left ? 1 : 0)}>
        {children}
      </div>
      <div className={`rv ${left ? "xl:order-first" : ""}`} style={delay(left ? 0 : 1)}>
        <FeatureVideo file={video} clip={clip} rate={rate} />
      </div>
    </div>
  );
}

function StatRow({ stats, className = "mt-12" }: { stats: string[][]; className?: string }) {
  return (
    <dl className={`flex justify-center gap-6 md:gap-12 ${className}`}>
      {stats.map(([value, label]) => (
        <div key={label} className="flex flex-col-reverse items-center gap-1">
          <dt className="text-[13px] text-muted">{label}</dt>
          <dd className="font-display text-[clamp(24px,2.6vw,32px)] font-bold tracking-[-0.02em] text-text">{value}</dd>
        </div>
      ))}
    </dl>
  );
}

// ── 1. Infinite problems ───────────────────────────────────────────────
const ROW_1: [string, string][] = [
  ["stripe/stripe-node", "Race condition in webhook handler"],
  ["vercel/next.js", "Hydration mismatch on dynamic routes"],
  ["supabase/supabase", "Auth session not persisting on refresh"],
  ["prisma/prisma", "N+1 query in nested includes"],
  ["airbnb/visx", "Tooltip flickers on fast mouse move"],
  ["facebook/react", "StrictMode double-invoke breaks refs"],
];
const ROW_2: [string, string][] = [
  ["shopify/hydrogen", "Cart state resets on page focus"],
  ["netflix/metaflow", "DAG visualizer crashes on cycles"],
  ["airbnb/lottie-web", "Animation stutters at 120hz"],
  ["google/zx", "Glob pattern fails on Windows paths"],
  ["microsoft/fluentui", "Focus trap escapes modal on Tab"],
];
// Third row reshuffles the first two so it reads differently.
const BUG_ROWS = [ROW_1, ROW_2, [...ROW_2.slice(2), ...ROW_1.slice(0, 3)]];
const ROW_CLASS = ["", "bug-marquee-row--rev", "bug-marquee-row--mid"];

function BugMarquee() {
  return (
    <div aria-hidden className="bug-marquee mt-14 w-full space-y-3">
      {BUG_ROWS.map((row, i) => (
        // Each row is rendered twice so translateX(-50%) loops seamlessly.
        <div key={i} className={`bug-marquee-row ${ROW_CLASS[i]}`}>
          {[...row, ...row].map(([repo, title], j) => (
            <span
              key={j}
              className="flex shrink-0 items-center gap-2.5 whitespace-nowrap rounded-[10px] border border-border bg-surface px-4 py-2.5 text-[13px] text-muted"
            >
              <span className={`h-[7px] w-[7px] rounded-full ${(i + j) % 2 ? "bg-[var(--cta)]" : "bg-passed"}`} />
              <b className="font-semibold text-text">{repo}</b>
              {title}
            </span>
          ))}
        </div>
      ))}
    </div>
  );
}

function InfiniteProblems() {
  return (
    <FeatureSection id="how-it-works" bg="fs-bg-problems" className="z-10 -mt-[100svh] bg-[linear-gradient(to_bottom,transparent,var(--canvas)_35vh)]" decor={<span aria-hidden className="ghost-infinity">∞</span>}>
      <Centered>
        <Label dot="blue">Infinite problems</Label>
        <Heading big>Never run out of problems.</Heading>
        <Body className="max-w-[480px]">
          New bugs from real repos every day. Pick a company, pick a repo, start fixing.
        </Body>
        <StatRow
          stats={[
            ["10,000+", "Bugs indexed"],
            ["240+", "Repos"],
            ["Daily", "New bugs"],
          ]}
        />
        <BugMarquee />
      </Centered>
    </FeatureSection>
  );
}

// ── 2. Real codebases ──────────────────────────────────────────────────
const STACK = ["Next.js", "Supabase", "Prisma", "Vercel", "Stripe"];

function StackChips() {
  return (
    <ul className="mt-6 flex flex-wrap gap-2">
      {STACK.map((s) => (
        <li key={s} className="rounded-lg border border-border bg-surface px-3 py-1.5 text-[11px] text-muted">
          <span aria-hidden className="mr-1.5 text-muted2">•</span>
          {s}
        </li>
      ))}
    </ul>
  );
}

// ── 3. AI problem solving ──────────────────────────────────────────────
function DiffHint() {
  return (
    <pre aria-label="Example fix" className="mt-6 max-w-[520px] overflow-x-auto rounded-[10px] border border-border bg-surface p-4 font-mono text-[12px] leading-[1.6]">
      <code>
        <span className="block text-[#f87171]">{"- await db.query(sql)"}</span>
        <span className="block text-[#4ade80]">{"+ await db.query(sql, { timeout: 5000 })"}</span>
        <span className="block text-muted">{"// connection pool timeout fix"}</span>
      </code>
    </pre>
  );
}

// ── 4. AI feedback ─────────────────────────────────────────────────────
function FeedbackCard({ dot, title, body, footer }: { dot: keyof typeof DOT; title: string; body: string; footer: ReactNode }) {
  return (
    <div className="flex min-h-[200px] flex-1 flex-col rounded-2xl border border-border bg-surface p-7">
      <p className="flex items-center gap-2 text-[13px] font-semibold text-text">
        <span aria-hidden className={`h-2 w-2 rounded-full ${DOT[dot]}`} />
        {title}
      </p>
      <p className="mt-4 flex-1 text-[15px] leading-[1.6] text-text">{body}</p>
      <div className="mt-6">{footer}</div>
    </div>
  );
}

// Parts of the solve recording (01-solve-hard-problem-with-ai.mp4) each section shows.
const SOLVE_VIDEO = "01-solve-hard-problem-with-ai.mp4";
const PICK_PROBLEM_CLIP: Clip = [0, 40]; // dashboard → problem → workspace
const AI_SOLVE_CLIP: Clip = [40, 102]; // asking the AI, applying the fix, results
const FEEDBACK_CLIP: Clip = [98, 102.4]; // AI feedback screen

// Parts of animated 3.0.mp4 for the two halves of the share section.
const SHARE_VIDEO = "animated 3.0.mp4";
const SHARE_CARD_CLIP: Clip = [6, 17]; // rank card → posting it
const VISIBILITY_CLIP: Clip = [19, 37]; // the post, recruiter messages, offer

function AiFeedback() {
  return (
    <FeatureSection bg="fs-bg-feedback">
      <Centered>
        <Label dot="amber">AI feedback</Label>
        <Heading big>Feedback that actually teaches.</Heading>
        <Body className="max-w-[520px]">
          After every fix, AI reviews your approach — what worked, what didn&apos;t, and what a senior engineer would
          have done differently.
        </Body>
        <div className="mt-12 w-full max-w-[1200px] overflow-hidden rounded-[20px] border border-border shadow-[0_40px_80px_-20px_rgba(0,0,0,0.6)]">
          {/* The AI feedback screen at the end of the solve recording (1:38–1:42). */}
          <Video file={SOLVE_VIDEO} clip={FEEDBACK_CLIP} className="block aspect-video w-full object-cover" />
        </div>
        <div className="mt-8 flex w-full max-w-[860px] flex-col gap-4 text-left md:flex-row md:gap-6">
          <FeedbackCard
            dot="blue"
            title="AI Analysis"
            body="The connection pool is exhausting under load. Add a timeout guard and retry logic."
            footer={<span className="text-[12px] font-semibold text-passed">Confidence: High</span>}
          />
          <div aria-hidden className="feedback-divider" />
          <FeedbackCard
            dot="amber"
            title="Mentor Feedback"
            body="Good catch. Also check the pool size config — default of 10 is likely too low for this traffic."
            footer={
              <span className="flex items-center gap-2 text-[12px] text-muted">
                <span aria-hidden className="grid h-6 w-6 place-items-center rounded-full border border-border bg-surface2 text-[10px] font-semibold text-text">
                  SE
                </span>
                Reviewed by Staff engineer
              </span>
            }
          />
        </div>
      </Centered>
    </FeatureSection>
  );
}

// ── 5. Ranks ───────────────────────────────────────────────────────────
// Progression track + rank-up card. Hidden-state animations (track stagger,
// card rise, progress fill) live in globals.css under .rank-*.
// Badge art from public/badges/; name colors match each badge's stroke.
const TRACK = [
  { name: "Junior", slug: "junior", pts: "500 pts", color: "text-[#60a5fa]", ptsColor: "text-muted" },
  { name: "Mid", slug: "mid", pts: "1,500 pts", color: "text-[#2dd4bf]", ptsColor: "text-muted" },
  { name: "Staff", slug: "staff", pts: "7,500 pts", color: "text-action", ptsColor: "text-[rgba(139,172,255,0.5)]", active: true },
  // Not reached yet: dimmed and desaturated.
  { name: "Principal", slug: "principal", pts: "15,000 pts", color: "text-[#565A63]", ptsColor: "text-[#565A63]", locked: true },
];

function RankTrack() {
  return (
    <div className="mt-10">
      <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.1em] text-muted">Your progression</p>
      <ol className="flex overflow-hidden rounded-[14px] border border-border">
        {TRACK.map((r, i) => (
          <li
            key={r.name}
            style={delay(i)}
            className={`rank-item flex flex-1 flex-col items-center gap-2 border-r border-border px-3 py-[18px] text-center last:border-r-0 ${
              r.active ? "bg-[rgba(139,172,255,0.08)] shadow-[inset_0_0_0_1px_rgba(139,172,255,0.35)]" : "bg-surface"
            }`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element -- static export */}
            <img
              src={assetPath(`/badges/${r.slug}.svg`)}
              alt=""
              width={46}
              height={40}
              className={`h-8 w-auto md:h-10 ${r.locked ? "opacity-40 grayscale" : ""} ${
                r.active ? "drop-shadow-[0_0_10px_rgba(139,172,255,0.45)]" : ""
              }`}
            />
            <span className={`text-[10px] font-semibold md:text-[13px] ${r.color}`}>{r.name}</span>
            <span className={`text-[10px] tabular-nums md:text-[11px] ${r.ptsColor}`}>{r.pts}</span>
          </li>
        ))}
      </ol>
      <div className="mt-5 flex items-center gap-4">
        <div className="relative h-[3px] flex-1 rounded-[2px] bg-border">
          <div className="rank-fill absolute inset-y-0 left-0 rounded-[2px] bg-[linear-gradient(90deg,rgba(139,172,255,0.35),var(--action))]" />
        </div>
        <p className="shrink-0 text-[12px] tabular-nums text-muted">
          <span className="text-action">9,328</span> / 15,000 pts to Principal
        </p>
      </div>
    </div>
  );
}

// 11 rays from (160,180) out to the card's top and side edges.
const RAYS: [number, number, number][] = [
  [0, 130, 0.1], [0, 60, 0.2], [30, 0, 0.3], [80, 0, 0.15], [125, 0, 0.4], [160, 0, 0.25],
  [195, 0, 0.4], [240, 0, 0.15], [290, 0, 0.3], [320, 60, 0.2], [320, 130, 0.1],
];

function RankUpCard() {
  return (
    <div className="rankup-wrap relative flex items-center justify-center">
      <div className="rankup-card relative w-full max-w-[340px] md:w-[320px]">
        <span className="absolute -right-5 -top-5 z-20 rounded-full bg-[linear-gradient(90deg,var(--action),#C5D5FF)] px-4 py-2 text-[12px] font-semibold text-[#1A1A1A] shadow-[0_8px_24px_rgba(139,172,255,0.4)]">
          🏆 Just ranked up
        </span>
        <div className="relative z-10 overflow-hidden rounded-[24px] border border-[rgba(139,172,255,0.25)] bg-[linear-gradient(145deg,#1D1F22_0%,#18191C_100%)] px-7 pb-7 pt-8 shadow-[0_0_0_1px_rgba(255,255,255,0.03),0_40px_80px_-20px_rgba(0,0,0,0.7),0_0_60px_-10px_rgba(139,172,255,0.12)]">
          <svg aria-hidden width="320" height="220" viewBox="0 0 320 220" className="pointer-events-none absolute left-1/2 top-0 -translate-x-1/2 [mask-image:linear-gradient(to_bottom,#000_55%,transparent)]">
            <defs>
              <radialGradient id="rankup-sun" cx="0.5" cy="0.82" r="0.7">
                <stop offset="0" stopColor="#8BACFF" stopOpacity="0.18" />
                <stop offset="1" stopColor="#8BACFF" stopOpacity="0" />
              </radialGradient>
            </defs>
            <rect width="320" height="220" fill="url(#rankup-sun)" />
            {RAYS.map(([x, y, o], i) => (
              <line key={i} x1="160" y1="180" x2={x} y2={y} stroke="#8BACFF" strokeWidth="0.5" opacity={o} />
            ))}
          </svg>

          <div className="relative flex items-center justify-between">
            <span className="font-mono text-[14px] font-semibold text-text">
              bug<span className="text-action">.</span>dr
            </span>
            <span aria-hidden className="flex gap-1">
              {[0, 1, 2].map((i) => (
                <span key={i} className="h-1 w-1 rounded-full bg-border" />
              ))}
            </span>
          </div>

          <div className="relative mt-6 flex flex-col items-center gap-2.5">
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-action">Ranked up</p>
            <svg aria-hidden width="100" height="100" viewBox="0 0 100 100">
              <defs>
                <linearGradient id="rankup-hex" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0" stopColor="#C5D5FF" />
                  <stop offset="1" stopColor="#8BACFF" />
                </linearGradient>
              </defs>
              <polygon points="50,4 90,27 90,73 50,96 10,73 10,27" fill="rgba(139,172,255,0.08)" stroke="url(#rankup-hex)" strokeWidth="2.5" />
              <polygon points="50,15 80,32.5 80,67.5 50,85 20,67.5 20,32.5" fill="rgba(255,213,128,0.08)" stroke="rgba(255,213,128,0.35)" />
              <text x="50" y="51" textAnchor="middle" dominantBaseline="central" fontSize="32" fontWeight="800" fill="url(#rankup-hex)">
                S
              </text>
            </svg>
            <p className="font-display text-[32px] font-extrabold leading-none text-action">Staff</p>
            <p className="rankup-sub flex items-center gap-2.5 text-[13px] text-muted">Senior → Staff</p>
          </div>

          <dl className="relative mt-6 grid grid-cols-3 gap-px overflow-hidden rounded-xl bg-border">
            {[
              ["Bug fixes", "32"],
              ["Points", "9,328"],
              ["Streak", "34d"],
            ].map(([label, value]) => (
              <div key={label} className="flex flex-col-reverse items-center gap-1 bg-[#1A1C1F] px-2 py-3.5">
                <dt className="text-[10px] uppercase tracking-[0.08em] text-muted">{label}</dt>
                <dd className="text-[18px] font-bold tabular-nums text-text">{value}</dd>
              </div>
            ))}
          </dl>

          <div className="relative mt-5 flex items-center justify-between border-t border-border pt-4">
            <span className="text-[12px] text-muted">
              bugdr.app/<span className="text-action">u/alexmorgan</span>
            </span>
            {/* Illustration only: not a real control. */}
            <span className="inline-flex items-center gap-1.5 rounded-lg bg-[var(--cta)] px-3.5 py-[7px] text-[12px] font-semibold text-[#1A1A1A]">
              Share
              <svg aria-hidden width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M7 17 17 7M8 7h9v9" />
              </svg>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

function Ranks() {
  return (
    <FeatureSection
      decor={
        // Ambient amber glow over the right half.
        <div
          aria-hidden
          className="pointer-events-none absolute right-0 top-1/2 h-[700px] w-[700px] -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(139,172,255,0.08),transparent_70%)]"
        />
      }
    >
      <div className="relative grid items-center gap-16 lg:grid-cols-2 lg:gap-20">
        <div className="rv" style={delay(0)}>
          <Label dot="blue" glow>
            Ranks
          </Label>
          <h2 className="font-display text-[clamp(36px,4.2vw,54px)] font-bold leading-[1.07] tracking-[-0.03em] text-text">
            You just
            <br />
            <span className="text-action">ranked up.</span>
          </h2>
          <Body>
            Every bug closed earns points. Climb from Junior to Staff to Principal. Your rank reflects real debugging
            ability, not quiz scores.
          </Body>
          <RankTrack />
        </div>
        <RankUpCard />
      </div>
    </FeatureSection>
  );
}

// ── 6. CV showcase ─────────────────────────────────────────────────────
// The CV video framed as a shareable profile page in a browser window.
function BrowserFrame({ file, url }: { file: string; url: string }) {
  return (
    <div className="mt-12 w-full max-w-[1200px] overflow-hidden rounded-[20px] border border-border bg-surface shadow-[0_40px_80px_-20px_rgba(0,0,0,0.6)]">
      <div className="flex items-center border-b border-border px-4 py-3">
        <span aria-hidden className="flex w-[42px] gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-failed" />
          <span className="h-2.5 w-2.5 rounded-full bg-pending" />
          <span className="h-2.5 w-2.5 rounded-full bg-passed" />
        </span>
        <span className="mx-auto rounded-md border border-border bg-canvas px-4 py-1 font-mono text-[12px] text-muted">{url}</span>
        {/* Balances the dots so the URL pill sits centered. */}
        <span aria-hidden className="w-[42px]" />
      </div>
      <Video file={file} className="block aspect-video w-full object-cover" />
    </div>
  );
}

function CvShowcase() {
  return (
    <FeatureSection bg="fs-bg-cv">
      <Centered>
        <Label dot="green">CV showcase</Label>
        <Heading>Your bugs become your CV.</Heading>
        <Body className="max-w-[480px]">
          Every fix is logged to your public profile. Drop bugdr.app/u/yourname in your resume — let employers see what
          you can actually do.
        </Body>
        <p className="mt-10 break-all font-mono text-[clamp(18px,2.6vw,32px)] font-semibold tracking-[-0.01em]">
          <span className="text-muted">bugdr.app/u/</span>
          <span className="text-action">yourname</span>
        </p>
        <StatRow
          className="mt-8"
          stats={[
            ["32", "Bugs fixed"],
            ["Staff", "Rank"],
            ["34-day", "Streak"],
          ]}
        />
        <BrowserFrame file="animated 1.0.mp4" url="bugdr.app/u/alex" />
      </Centered>
    </FeatureSection>
  );
}

// ── Company problems ───────────────────────────────────────────────────
const COMPANIES = [
  {
    name: "Netflix",
    domain: "netflix.com",
    bg: "#E50914",
    tagline: "Streaming infrastructure at scale",
    description:
      "Video delivery, resilience tooling, and the chaos engineering stack that keeps 260M subscribers watching.",
    stack: ["Java", "Python", "Node.js", "Go"],
  },
  {
    name: "Shopify",
    domain: "shopify.com",
    bg: "#96BF48",
    tagline: "Commerce platform for merchants",
    description:
      "Ruby monolith, React storefront, distributed checkout — bugs here affect millions of merchants and billions in GMV.",
    stack: ["Ruby", "Go", "React", "TypeScript"],
  },
  {
    name: "Google",
    domain: "google.com",
    bg: "#4285F4",
    tagline: "Search, cloud and open source",
    description:
      "Open source tooling from the team behind Go, Kubernetes, and gVisor. High-complexity, high-impact fixes.",
    stack: ["Go", "C++", "Python", "Java"],
  },
  {
    name: "Airbnb",
    domain: "airbnb.com",
    bg: "#FF5A5F",
    tagline: "Travel marketplace with strong OSS culture",
    description:
      "React Native, Ruby services, and an active open source culture. Broad surface area, real production exposure.",
    stack: ["React", "Ruby", "Java", "TypeScript"],
  },
];

const PRICING_URL = "https://app.bugdr.app/pricing";

function CompanyProblems() {
  return (
    <FeatureSection id="company-problems" bg="fs-bg-companies">
      <Centered>
        <Label dot="blue">Real codebases</Label>
        <Heading>
          Real companies.
          <br />
          Real bugs.
        </Heading>
        <Body className="max-w-[520px]">
          Pick a company, pick a codebase, start fixing. Every bug is pulled from real open source repos — the same code
          running in production.
        </Body>
      </Centered>
      <ul className="mx-auto mt-12 grid max-w-[900px] gap-5 md:grid-cols-2">
        {COMPANIES.map((c, i) => (
          <li key={c.name} className="company-reveal" style={delay(i)}>
            <a href={PRICING_URL} target="_blank" rel="noopener noreferrer" className="company-card">
              <div className="relative flex items-center gap-3.5">
                <span
                  aria-hidden
                  className="grid h-12 w-12 shrink-0 place-items-center overflow-hidden rounded-xl"
                  style={{ background: c.bg }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element -- external favicon, static export */}
                  <img
                    src={`https://www.google.com/s2/favicons?domain=${c.domain}&sz=64`}
                    alt=""
                    width={28}
                    height={28}
                    loading="lazy"
                    className="h-7 w-7 rounded-md bg-white/90 p-0.5"
                  />
                </span>
                <span className="flex flex-col">
                  <span className="text-[18px] font-semibold text-text">{c.name}</span>
                  <span className="text-[13px] text-muted">{c.tagline}</span>
                </span>
              </div>
              <p className="relative text-[14px] leading-[1.6] text-muted">{c.description}</p>
              <ul className="relative flex flex-wrap gap-2">
                {c.stack.map((t) => (
                  <li key={t} className="rounded-md border border-border px-2.5 py-1 text-[11px] text-muted">
                    {t}
                  </li>
                ))}
              </ul>
              <div className="relative mt-auto flex items-center justify-between border-t border-border pt-4">
                <span className="flex items-center gap-1.5 text-[12px] text-muted">
                  <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-passed" />
                  Open for fixes
                </span>
                <span className="text-[12px] font-medium text-action">View problems →</span>
              </div>
            </a>
          </li>
        ))}
      </ul>
    </FeatureSection>
  );
}

// ── 7. Hackathons ──────────────────────────────────────────────────────
const FOCUS = "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--cta)]";

function Hackathons() {
  return (
    <FeatureSection bg="fs-bg-hackathons">
      <Centered>
        <Label dot="amber">Hackathons</Label>
        <Heading big>Compete. Win. Get noticed.</Heading>
        <Body className="max-w-[480px]">
          Monthly hackathons where the best debuggers go head to head. Top finishers get featured, some get hired.
        </Body>
        <div className="mt-12 w-full max-w-[520px] text-left">
          <article className="flex flex-col rounded-[20px] border border-border bg-surface p-8">
            <span className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.1em] text-action">
              <span aria-hidden className="h-2 w-2 rounded-full bg-action" />
              Dec 1
            </span>
            <h3 className="mt-5 text-[clamp(20px,2vw,24px)] font-bold text-text">Open Source Rescue</h3>
            <p className="mt-3 text-[15px] leading-[1.6] text-muted">
              Fix critical bugs in 3 OSS projects. Top fixers get offers.
            </p>
            <div className="mt-auto pt-8">
              <a
                href={APP_URL}
                className={`inline-flex rounded-lg border border-border px-5 py-2.5 text-[14px] font-semibold text-text transition-colors hover:border-action ${FOCUS}`}
              >
                Get notified
              </a>
            </div>
          </article>
        </div>
      </Centered>
    </FeatureSection>
  );
}

// ── Page order ─────────────────────────────────────────────────────────
export function FeatureSections() {
  const sections = [
    <InfiniteProblems key="problems" />,
    <FeatureSection key="codebases" bg="fs-bg-codebases">
      <TwoCol video={SOLVE_VIDEO} clip={PICK_PROBLEM_CLIP} rate={1.5} videoSide="left">
        <Label dot="blue">Real codebases</Label>
        <Heading>Real codebases. Real stakes.</Heading>
        <Body>
          Paste any public GitHub repo and we&apos;ll surface open issues from actual production code. No toy examples, no
          made-up scenarios.
        </Body>
        <StackChips />
      </TwoCol>
    </FeatureSection>,
    <FeatureSection key="ai" bg="fs-bg-ai">
      <TwoCol video={SOLVE_VIDEO} clip={AI_SOLVE_CLIP} rate={1.5} videoSide="right">
        <Label dot="blue">AI problem solving</Label>
        <Heading>Debug with AI, not Google.</Heading>
        <Body>
          Work through bugs with an AI assistant that knows the codebase. It guides you toward the fix — it doesn&apos;t
          hand it to you.
        </Body>
        <DiffHint />
      </TwoCol>
    </FeatureSection>,
    <AiFeedback key="feedback" />,
    <Ranks key="ranks" />,
    <FeatureSection key="share" bg="fs-bg-share">
      <TwoCol video={SHARE_VIDEO} clip={SHARE_CARD_CLIP} videoSide="left">
        <Label dot="amber">Share your rank</Label>
        <Heading>Show the climb.</Heading>
        <Body>
          Every rank-up comes with a card. Download it, or post it straight to LinkedIn and X — proof your network can
          see.
        </Body>
      </TwoCol>
      <div className="mt-24 lg:mt-32">
        <TwoCol video={SHARE_VIDEO} clip={VISIBILITY_CLIP} videoSide="right">
          <Label dot="amber">Visibility</Label>
          <Heading>
            Your work speaks.
            <br />
            Louder than a resume.
          </Heading>
          <Body>
            <Brandify>
              Share your Bugdr card anywhere. Recruiters see your rank, your streak, your real debugging history — not a
              list of buzzwords.
            </Brandify>
          </Body>
        </TwoCol>
      </div>
    </FeatureSection>,
    <CvShowcase key="cv" />,
    <CompanyProblems key="companies" />,
    <Hackathons key="hackathons" />,
  ];
  // Thin gradient divider between sections.
  return <>{sections.flatMap((s, i) => (i ? [<div key={`d${i}`} aria-hidden className="feature-divider" />, s] : [s]))}</>;
}
