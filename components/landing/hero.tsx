"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "framer-motion";
import { Check } from "@/components/landing/icons";
import { type Line, TONE_CLASS } from "@/components/landing/code-block";
import { SPRING_GENTLE } from "@/lib/motion";
import { assetPath } from "@/lib/asset-path";
import { ZoomableImage } from "@/components/ui/zoomable-image";
import { WaitlistModal } from "@/components/landing/WaitlistModal";

// ── Hero ──────────────────────────────────────────────────────────────────
//
// Frame: everyone uses AI now. Equal tools do not give equal results. bug.dr
// measures how well an engineer uses AI to investigate a codebase, fix a bug
// and verify it.
//
// Layout: centered H1, subhead and one CTA over a full-viewport animated
// background: floating code, agent and solve panels (.hero-bg in globals.css).
// The CTA opens WaitlistModal.

// Real acceptance checks from the Payment retries problem. Exported so the
// static "How it works" step 3 card can reuse the same seven names without
// re-deriving the list.
export const acceptanceChecks: { label: string }[] = [
  { label: "Retry transient failures" },
  { label: "Prevent duplicate charges" },
  { label: "Back off between retries" },
  { label: "Existing tests still pass" },
  { label: "Preserve successful payments" },
  { label: "Keep the worker healthy" },
  { label: "Keep failed jobs visible in the queue" },
];

// ── Floating panel world background ─────────────────────────────────────
//
// ~24 glass panels drifting upward at three depths: code, AI agent
// terminals and solve cards. DOM elements, not a canvas: each panel needs
// its own CSS 3D tilt inside the perspective container. One rAF loop
// moves them by writing transforms directly (no React re-renders per
// frame).

const CODE_POOL = `async function validateSession(token: string) {
const user = await db.users.findOne({ id: userId })
if (!user) return null
return jwt.verify(token, process.env.SECRET)
}
export const getServerSideProps = async (ctx) => {
const { data, error } = await supabase
  .from('submissions').select('*')
  .eq('user_id', session.user.id)
interface BugReport {
  id: string
  severity: 'low' | 'medium' | 'high' | 'critical'
  stackTrace: string[]
  resolvedAt: Date | null
}
const result = await Promise.all(
  tasks.map(t => executor.run(t))
)
// TODO: handle edge case when user is null
// this has been here for 3 years
try {
  await processPayment(order.total)
} catch (err) {
  logger.error('Payment failed', err)
}
type Difficulty = 'easy'|'medium'|'hard'|'get_a_job'
const score = Math.round(elapsed / benchmark * 100)
return res.status(200).json({ success: true })
const ref = useRef<HTMLDivElement>(null)
useEffect(() => { fetchUserRank() }, [userId])
throw new Error('Unexpected state reached')`.split("\n");

const KEYWORD = /^(async|function|const|return|if|await|export|import|type|interface|try|catch|throw)$/;
const LITERAL = /^(\d+|true|false|null)$/;

function highlight(line: string) {
  if (line.trimStart().startsWith("//"))
    return <span className="text-[rgba(172,178,190,0.45)]">{line}</span>;
  return line.split(/('[^']*'|\.\w+|\b\w+\b)/).map((tok, i) => {
    const cls = tok.startsWith("'")
      ? "text-[rgba(34,197,94,0.85)]"
      : tok.startsWith(".")
        ? "text-[rgba(139,172,255,0.6)]"
        : KEYWORD.test(tok)
          ? "text-action"
          : LITERAL.test(tok)
            ? "text-[rgba(245,158,11,0.75)]"
            : undefined;
    return cls ? <span key={i} className={cls}>{tok}</span> : tok;
  });
}

// Agent scenarios: "◆" steps, "→" findings, last line ends in the score.
const AGENT_SCENARIOS = [
  `◆ Analyzing stack trace...
→ Null reference at auth.ts:47
→ Checking session context...
◆ Hypothesis: token expires before
middleware validates request
◆ Suggested fix: move token refresh
above route handler
Confidence: 87%`,
  `◆ Running memory profiler...
→ Heap usage: 847MB / 1024MB
→ Leak detected in useEffect
◆ Root cause: missing cleanup fn
EventListener not removed
◆ Patch ready — 3 lines changed
Confidence: 94%`,
  `◆ Tracing API timeout...
→ 3 downstream services
→ Redis timeout: 5012ms
◆ Bottleneck: connection pool
exhausted under load
◆ Scaling pool 20 → 50
Estimated fix: 91%`,
  `◆ Reviewing failed tests...
→ 1 of 47 tests failing
→ OrderService.create:88
◆ Race condition detected
async write before commit
◆ Adding transaction lock...
Confidence: 89%`,
].map((s) => s.split("\n"));

const SOLVE_CARDS = [
  { time: "4m 32s", problem: "Memory leak · useEffect cleanup", meta: "Senior · Hard", score: 94 },
  { time: "11m 07s", problem: "Null ref · auth middleware", meta: "Mid-level · Medium", score: 78 },
  { time: "2m 19s", problem: "Race condition · async write", meta: "Senior · Get a job", score: 97 },
  { time: "18m 44s", problem: "API timeout · connection pool", meta: "Beginner · Easy", score: 61 },
  { time: "6m 55s", problem: "Heap overflow · event listener", meta: "Mid-level · Hard", score: 88 },
];

const PANEL_LAYERS = [
  { count: 8, opacity: 0.22, scale: 0.62, speed: 0.1, font: 10, blur: true },
  { count: 9, opacity: 0.42, scale: 0.82, speed: 0.2, font: 11, blur: false },
  { count: 7, opacity: 0.62, scale: 1, speed: 0.32, font: 12, blur: false },
];

type PanelBody =
  | { kind: "code"; lines: string[] }
  | { kind: "agent"; lines: string[] }
  | { kind: "card"; card: (typeof SOLVE_CARDS)[number] };

type Panel = { layer: number; w: number; h: number; rx: number; ry: number; body: PanelBody };

const rand = (min: number, max: number) => min + Math.random() * (max - min);
const pick = <T,>(list: T[]) => list[Math.floor(Math.random() * list.length)];

function makeBody(kind: PanelBody["kind"]): { w: number; h: number; body: PanelBody } {
  if (kind === "agent")
    return { w: rand(320, 420), h: rand(220, 300), body: { kind, lines: pick(AGENT_SCENARIOS) } };
  if (kind === "card")
    return { w: rand(240, 320), h: rand(130, 160), body: { kind, card: pick(SOLVE_CARDS) } };
  // A contiguous run from the pool (wrapping) reads more like real code
  // than unrelated lines.
  const start = Math.floor(Math.random() * CODE_POOL.length);
  const n = 9 + Math.floor(Math.random() * 5);
  const lines = Array.from({ length: n }, (_, i) => CODE_POOL[(start + i) % CODE_POOL.length]);
  return { w: rand(300, 500), h: rand(200, 320), body: { kind, lines } };
}

// ~50% code, ~30% agent terminals, ~20% solve cards, shuffled across
// layers. Phones get about a third of the panels: two dozen panels up to
// 500px wide bury a 390px screen.
function makePanels(): Panel[] {
  const share = window.innerWidth < 768 ? 0.35 : 1;
  const slots = PANEL_LAYERS.flatMap((l, layer) =>
    Array.from({ length: Math.ceil(l.count * share) }, () => layer),
  );
  const code = Math.round(slots.length * 0.5);
  const cards = Math.round(slots.length * 0.21); // 24 panels → 12 / 7 / 5
  const kinds = slots.map((_, i): PanelBody["kind"] =>
    i < code ? "code" : i < slots.length - cards ? "agent" : "card",
  );
  for (let i = kinds.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [kinds[i], kinds[j]] = [kinds[j], kinds[i]];
  }
  return slots.map((layer, i) => ({
    layer,
    rx: rand(-8, 8),
    ry: rand(-14, 14),
    ...makeBody(kinds[i]),
  }));
}

function PanelContent({ body, font }: { body: PanelBody; font: number }) {
  if (body.kind === "code")
    return (
      <div className="hero-panel-body" style={{ fontSize: font }}>
        {body.lines.map((line, j) => (
          <div key={j}>{highlight(line)}</div>
        ))}
      </div>
    );
  if (body.kind === "agent")
    return (
      <>
        <div className="hero-agent-bar">
          <span className="flex gap-1.5">
            <i /> <i /> <i />
          </span>
          <span className="text-[0.6rem] text-action">agent · analyzing</span>
        </div>
        <div className="hero-panel-body" style={{ fontSize: font }}>
          {body.lines.map((line, j) => {
            const lastLine = j === body.lines.length - 1;
            if (lastLine)
              return (
                <div key={j} className="text-[rgba(34,197,94,0.8)]">
                  {line} <span className="hero-cursor">▌</span>
                </div>
              );
            if (line.startsWith("◆"))
              return (
                <div key={j}>
                  <span className="font-semibold text-action">◆</span>
                  {line.slice(1)}
                </div>
              );
            if (line.startsWith("→"))
              return (
                <div key={j} className="pl-3 text-[rgba(172,178,190,0.7)]">
                  {line}
                </div>
              );
            return (
              <div key={j} className="pl-4">
                {line}
              </div>
            );
          })}
        </div>
      </>
    );
  const { card } = body;
  return (
    <div className="hero-panel-body">
      <div className="flex items-baseline gap-2">
        <span className="text-[1rem] font-bold text-[#22c55e]">✓</span>
        <span className="text-[0.8rem] text-[rgba(242,243,245,0.8)]">solved in {card.time}</span>
      </div>
      <div className="mt-2.5 text-[0.75rem] text-muted">{card.problem}</div>
      <div className="text-[0.7rem] text-muted/60">{card.meta}</div>
      <div className="mt-2 text-[0.7rem] text-action/70">efficiency  {card.score}</div>
    </div>
  );
}

function FloatingPanels() {
  // Random content is generated after mount so SSR and hydration agree.
  const [panels, setPanels] = useState<Panel[]>([]);
  const refs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => setPanels(makePanels()), []);

  useEffect(() => {
    if (!panels.length) return;
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
    let width = 0;
    let height = 0;
    let frame = 0;
    let last = 0;
    const state = panels.map(() => ({ x: 0, y: 0, dir: 1, flipAt: 0 }));

    const place = (i: number) => {
      const p = panels[i];
      const el = refs.current[i];
      if (el)
        el.style.transform = `translate3d(${state[i].x}px, ${state[i].y}px, 0) rotateX(${p.rx}deg) rotateY(${p.ry}deg) scale(${PANEL_LAYERS[p.layer].scale})`;
    };

    const init = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      const now = performance.now();
      panels.forEach((p, i) => {
        state[i] = {
          x: rand(-p.w * 0.3, width - p.w * 0.7),
          y: rand(-p.h * 0.5, height),
          dir: Math.random() < 0.5 ? -1 : 1,
          flipAt: now + rand(7000, 14000),
        };
        place(i);
      });
    };

    const tick = (now: number) => {
      frame = requestAnimationFrame(tick);
      const dt = now - last;
      if (dt < 1000 / 61) return; // cap at 60fps
      last = now;
      const steps = Math.min(dt, 64) / (1000 / 60);
      panels.forEach((p, i) => {
        const s = state[i];
        s.y -= PANEL_LAYERS[p.layer].speed * steps;
        if (now >= s.flipAt) {
          s.dir *= -1;
          s.flipAt = now + rand(7000, 14000);
        }
        s.x += 0.03 * s.dir * steps;
        // Fully above the top: re-enter just below the bottom.
        if (s.y + p.h < 0) {
          s.y = height + rand(0, 80);
          s.x = rand(-p.w * 0.3, width - p.w * 0.7);
        }
        place(i);
      });
    };

    const start = () => {
      cancelAnimationFrame(frame);
      if (reduced || document.visibilityState !== "visible") return;
      last = performance.now();
      frame = requestAnimationFrame(tick);
    };

    init();
    start();
    window.addEventListener("resize", init);
    document.addEventListener("visibilitychange", start);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", init);
      document.removeEventListener("visibilitychange", start);
    };
  }, [panels]);

  return (
    <div className="hero-panels">
      {panels.map((p, i) => {
        const l = PANEL_LAYERS[p.layer];
        return (
          <div
            key={i}
            ref={(el) => {
              refs.current[i] = el;
            }}
            className={`hero-panel hero-panel-${p.body.kind}`}
            style={{
              width: p.w,
              height: p.h,
              opacity: l.opacity,
              filter: l.blur ? "blur(1.8px)" : undefined,
            }}
          >
            <PanelContent body={p.body} font={l.font} />
          </div>
        );
      })}
    </div>
  );
}

export function Hero() {
  const reduce = useReducedMotion();
  const [showWaitlistModal, setShowWaitlistModal] = useState(false);
  const bg = useRef<HTMLDivElement>(null);

  // The background stays fixed behind the whole page; dim the panels once
  // the hero is half scrolled away so they don't compete with body text.
  useEffect(() => {
    const update = () =>
      bg.current?.setAttribute("data-dim", String(window.scrollY > window.innerHeight * 0.5));
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);
  const enter = (delay: number) =>
    reduce
      ? { duration: 0.2, ease: "easeOut" as const, delay }
      : { delay, ...SPRING_GENTLE };
  return (
    <section className="relative min-h-screen flex items-center justify-center px-6 py-20">
      <div ref={bg} aria-hidden className="hero-bg">
        <div className="hero-blob hero-blob-blue" />
        <div className="hero-blob hero-blob-indigo" />
        <FloatingPanels />
        <div className="hero-vignette" />
      </div>

      <div className="relative z-10 w-full max-w-[640px] mx-auto text-center">
        {/* Soft dark wash so panel text never fights the copy. */}
        <div
          aria-hidden
          className="pointer-events-none absolute -inset-x-16 -inset-y-20 -z-10 bg-[radial-gradient(closest-side,rgba(8,10,12,0.8),transparent)]"
        />
        <motion.div
          aria-hidden
          className="mx-auto mb-7 h-px w-14 bg-[rgba(139,172,255,0.45)]"
          initial={reduce ? false : { opacity: 0, scaleX: 0 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={enter(0)}
        />
        <motion.h1
          className="font-extrabold text-text leading-[1.1] tracking-[-0.03em] text-[clamp(2.4rem,5vw,4.8rem)] [text-shadow:0_0_80px_rgba(139,172,255,0.2),0_2px_40px_rgba(0,0,0,0.95)]"
          initial={reduce ? false : { opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={enter(0.1)}
        >
          Your title doesn&apos;t fix bugs.
        </motion.h1>

        <motion.p
          className="mt-4 font-normal leading-[1.6] text-muted text-[clamp(0.95rem,1.6vw,1.15rem)] [text-shadow:0_1px_20px_rgba(0,0,0,0.8)]"
          initial={reduce ? false : { opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={enter(0.3)}
        >
          Real production bugs. AI available. Prove you can ship.
        </motion.p>

        <motion.div
          className="mt-8 flex justify-center"
          initial={reduce ? false : { opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={enter(0.45)}
        >
          <button
            type="button"
            onClick={() => setShowWaitlistModal(true)}
            className="glass-action"
          >
            Get early access
          </button>
        </motion.div>
      </div>

      <WaitlistModal
        isOpen={showWaitlistModal}
        onClose={() => setShowWaitlistModal(false)}
      />
    </section>
  );
}

// ── HeroIDE ───────────────────────────────────────────────────────────────
//
// One animated card. Story: open a file → spot the line that's broken →
// ask the AI for a fix → see the diff → watch the acceptance checks tick
// in. Each section enters with a small stagger so the card reads top to
// bottom rather than appearing all at once.
//
// 3D mouse-follow tilt: the card tilts toward the cursor as the user moves
// it across the surface, then springs back to flat when the cursor leaves.
// Honors prefers-reduced-motion (no tilt, all entrance animations become
// short opacity fades).

// payment-retry.ts — 11 lines, line 5 flagged (the for-loop that retries
// without an idempotency key or backoff).
const originalCode: Line[] = [
  // 1: import { charge } from "./gateway";
  {
    tokens: [
      { text: "import", tone: "kw" },
      { text: " { ", tone: "muted" },
      { text: "charge", tone: "fn" },
      { text: " } ", tone: "muted" },
      { text: "from", tone: "kw" },
      { text: " ", tone: "muted" },
      { text: '"./gateway"', tone: "str" },
      { text: ";", tone: "punct" },
    ],
  },
  // 2: import { sleep } from "./utils";
  {
    tokens: [
      { text: "import", tone: "kw" },
      { text: " { ", tone: "muted" },
      { text: "sleep", tone: "fn" },
      { text: " } ", tone: "muted" },
      { text: "from", tone: "kw" },
      { text: " ", tone: "muted" },
      { text: '"./utils"', tone: "str" },
      { text: ";", tone: "punct" },
    ],
  },
  // 3: empty
  { tokens: [{ text: "", tone: "muted" }] },
  // 4: export async function processOrder(order) {
  {
    tokens: [
      { text: "export", tone: "kw" },
      { text: " ", tone: "muted" },
      { text: "async", tone: "kw" },
      { text: " ", tone: "muted" },
      { text: "function", tone: "kw" },
      { text: " ", tone: "muted" },
      { text: "processOrder", tone: "fn" },
      { text: "(", tone: "punct" },
      { text: "order", tone: "fn" },
      { text: ") {", tone: "punct" },
    ],
  },
  // 5:   for (let i = 0; i < 3; i++) {  ← FLAGGED
  {
    tokens: [
      { text: "  ", tone: "muted" },
      { text: "for", tone: "kw" },
      { text: " (", tone: "muted" },
      { text: "let", tone: "kw" },
      { text: " ", tone: "muted" },
      { text: "i", tone: "fn" },
      { text: " = ", tone: "muted" },
      { text: "0", tone: "num" },
      { text: "; ", tone: "punct" },
      { text: "i", tone: "fn" },
      { text: " < ", tone: "muted" },
      { text: "3", tone: "num" },
      { text: "; ", tone: "punct" },
      { text: "i", tone: "fn" },
      { text: "++) {", tone: "punct" },
    ],
  },
  // 6:     const result = await charge(order);
  {
    tokens: [
      { text: "    ", tone: "muted" },
      { text: "const", tone: "kw" },
      { text: " ", tone: "muted" },
      { text: "result", tone: "fn" },
      { text: " = ", tone: "muted" },
      { text: "await", tone: "kw" },
      { text: " ", tone: "muted" },
      { text: "charge", tone: "fn" },
      { text: "(", tone: "punct" },
      { text: "order", tone: "fn" },
      { text: ");", tone: "punct" },
    ],
  },
  // 7:     if (result.ok) return result;
  {
    tokens: [
      { text: "    ", tone: "muted" },
      { text: "if", tone: "kw" },
      { text: " (", tone: "muted" },
      { text: "result", tone: "fn" },
      { text: ".", tone: "punct" },
      { text: "ok", tone: "fn" },
      { text: ") ", tone: "muted" },
      { text: "return", tone: "kw" },
      { text: " ", tone: "muted" },
      { text: "result", tone: "fn" },
      { text: ";", tone: "punct" },
    ],
  },
  // 8:   }
  { tokens: [{ text: "  }", tone: "punct" }] },
  // 9:   throw new Error("payment failed");
  {
    tokens: [
      { text: "  ", tone: "muted" },
      { text: "throw", tone: "kw" },
      { text: " ", tone: "muted" },
      { text: "new", tone: "kw" },
      { text: " ", tone: "muted" },
      { text: "Error", tone: "fn" },
      { text: "(", tone: "punct" },
      { text: '"payment failed"', tone: "str" },
      { text: ");", tone: "punct" },
    ],
  },
  // 10: }
  { tokens: [{ text: "}", tone: "punct" }] },
  // 11: empty
  { tokens: [{ text: "", tone: "muted" }] },
];

// The diff — the two changes the user ships to fix the flagged line.
//   - Pass an idempotency key derived from order.id so retries can't
//     double-charge.
//   - Sleep with exponential backoff (2 ** i * 100 ms) after a failed
//     attempt before the next try.
// Both lines are placed inside the for-loop on line 5, after the success
// check on line 7, so `i` is already in scope and `order` is the function
// parameter. Nothing resets between calls because the fix relies on
// server-side idempotency (the `idempotencyKey` argument) rather than
// in-process state like a `Set`.
const addedCode: Line[] = [
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

// Helper: token tone -> Tailwind class. Falls back to body text.
function cls(tone: Line["tokens"][number]["tone"]): string {
  return TONE_CLASS[tone ?? "muted"] ?? "text-text";
}

export function HeroIDE() {
  const reduce = useReducedMotion();
  // Test id so the verification script can find this card without parsing
  // its content. Not user-facing.
  const testId = "hero-ide-card";

  // Shared spring used everywhere; reduced-motion gets a plain fade.
  const spring = (delay: number, extra?: object) =>
    reduce
      ? { duration: 0.2, ease: "easeOut" as const, delay }
      : { delay, ...SPRING_GENTLE, ...extra };

  // ── 3D mouse-follow tilt ───────────────────────────────────────────────
  // Track the cursor as a fraction of the card (-1…1 on each axis), feed
  // it through a soft spring so the motion feels like the card is being
  // physically pushed, and map to a small rotation (±8°). The card is the
  // outer motion.div; the inner content does its own entrance animations
  // in the card's local frame, so the tilt composes cleanly with them.
  const cardRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  // Soft spring — quick enough to feel responsive, smooth enough to
  // avoid jitter when the mouse is moved fast across the card.
  const smoothX = useSpring(mouseX, { stiffness: 150, damping: 20, mass: 0.5 });
  const smoothY = useSpring(mouseY, { stiffness: 150, damping: 20, mass: 0.5 });
  const rotateY = useTransform(smoothX, [-1, 1], [-8, 8]);
  const rotateX = useTransform(smoothY, [-1, 1], [8, -8]);

  function onMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    if (reduce) return;
    const el = cardRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    // Normalise to -1…1 with the card centre at 0.
    mouseX.set(((e.clientX - rect.left) / rect.width) * 2 - 1);
    mouseY.set(((e.clientY - rect.top) / rect.height) * 2 - 1);
  }
  function onMouseLeave() {
    // Snap back to flat when the cursor leaves the card.
    mouseX.set(0);
    mouseY.set(0);
  }

  return (
    <div style={{ perspective: 1000 }} data-testid={testId}>
      <motion.div
        ref={cardRef}
        onMouseMove={onMouseMove}
        onMouseLeave={onMouseLeave}
        className="rounded-2xl border border-border bg-surface shadow-card overflow-hidden"
        style={{
          rotateX: reduce ? 0 : rotateX,
          rotateY: reduce ? 0 : rotateY,
          willChange: "transform",
        }}
      >
        {/* Window chrome: 3 traffic-light dots, "example incident" in the
            centre, "▶ run" affordance on the right. */}
        <motion.div
          className="flex items-center justify-between border-b border-border bg-bg/50 px-3 py-2 font-mono text-[11px]"
          initial={reduce ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={spring(0)}
        >
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-border" />
            <span className="h-2 w-2 rounded-full bg-border" />
            <span className="h-2 w-2 rounded-full bg-border" />
          </div>
          <span className="text-muted">example incident</span>
          <span className="text-action">▶ run</span>
        </motion.div>

        {/* File tabs. Active tab is raised; the other two are flat. */}
        <motion.div
          className="flex items-center gap-1 border-b border-border bg-bg/30 px-3 py-1.5 font-mono text-[11px]"
          initial={reduce ? false : { opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={spring(0.1)}
        >
          <span className="rounded bg-surface px-2.5 py-0.5 text-text">
            payment-retry.ts
          </span>
          <span className="px-2.5 py-0.5 text-muted">incident.md</span>
          <span className="px-2.5 py-0.5 text-muted">ai</span>
        </motion.div>

        {/* Code editor: 11 lines with line numbers, line 5 highlighted as
            the offending line. Lines slide in from the left with a small
            stagger so the file "loads" line by line. */}
        <div className="bg-bg px-4 py-2.5 font-mono text-[12px] leading-[1.65] overflow-x-auto">
          {originalCode.map((line, i) => {
            const isFlagged = i === 4; // 0-indexed → line 5
            return (
              <motion.div
                key={`o-${i}`}
                className={
                  isFlagged
                    ? "flex -mx-4 px-4 bg-[#1a1c20] border-l-2 border-text"
                    : "flex"
                }
                initial={reduce ? false : { opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={spring(0.2 + i * 0.04)}
              >
                <span className="w-7 shrink-0 select-none text-right pr-3 text-muted/40">
                  {i + 1}
                </span>
                <span className="min-w-0 whitespace-pre">
                  {line.tokens.map((tok, j) => (
                    <span key={j} className={cls(tok.tone)}>
                      {tok.text}
                    </span>
                  ))}
                </span>
              </motion.div>
            );
          })}
        </div>

        {/* Error annotation: "× line 5: no idempotency key, retry can
            double-charge" on the left, "→ ship the fix" on the right. */}
        <motion.div
          className="flex items-center justify-between gap-3 border-t border-border bg-bg/60 px-4 py-2 font-mono text-[11px]"
          initial={reduce ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={spring(0.7)}
        >
          <span className="flex items-center gap-2 min-w-0">
            <span className="text-diffImpossible shrink-0">×</span>
            <span className="text-muted truncate">
              line 5: no idempotency key, retry can double-charge
            </span>
          </span>
          <span className="text-action shrink-0">→ ship the fix</span>
        </motion.div>

        {/* AI prompt line — the user asked the assistant for a fix. Sits
            above the diff so the diff reads as the AI's answer. */}
        <motion.div
          className="flex items-center justify-between gap-3 border-t border-border bg-bg/40 px-4 py-2 font-mono text-[11px]"
          initial={reduce ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={spring(0.85)}
        >
          <span className="flex items-center gap-2 min-w-0">
            <span className="text-action shrink-0">ask ai</span>
            <span className="text-muted/70" aria-hidden>·</span>
            <span className="text-text/90 truncate">
              fix duplicate charge on retry, add backoff
            </span>
          </span>
          <span className="text-muted shrink-0">↩</span>
        </motion.div>

        {/* Diff header: "diff · retry loop" on the left, line counter
            ("+ 2") on the right. */}
        <motion.div
          className="flex items-center justify-between border-t border-border bg-bg/40 px-4 py-2 font-mono text-[11px]"
          initial={reduce ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={spring(1.0)}
        >
          <span className="text-muted">diff · retry loop</span>
          <span className="text-diffEasy">+ 2</span>
        </motion.div>

        {/* Diff body: 2 added lines. They drop into the for-loop on line 5
            after the success check on line 7, so `i` is in scope and
            `order` is the function parameter. */}
        <div className="bg-bg px-4 py-2.5 font-mono text-[12px] leading-[1.65] overflow-x-auto">
          {addedCode.map((line, i) => (
            <motion.div
              key={`a-${i}`}
              className="flex"
              initial={reduce ? false : { opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={spring(1.1 + i * 0.05)}
            >
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
            </motion.div>
          ))}
        </div>

        {/* Acceptance checks panel. The 7 rows slide in one by one (the
            "ticking" effect) and the "7 / 7 passing" counter appears once
            the last row has settled. */}
        <motion.div
          className="border-t border-border bg-bg/30 px-4 py-3"
          initial={reduce ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={spring(1.4)}
        >
          <div className="flex items-center justify-between font-mono text-[11px]">
            <span className="uppercase tracking-wider text-muted">
              acceptance checks
            </span>
            <motion.span
              className="text-action"
              initial={reduce ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={spring(1.5 + acceptanceChecks.length * 0.08)}
            >
              7 / 7 passing
            </motion.span>
          </div>
          <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-1.5 font-mono text-[11px]">
            {acceptanceChecks.map((check, i) => (
              <motion.div
                key={check.label}
                className="flex items-center gap-2 rounded border border-border bg-surface/60 px-2 py-1.5 min-w-0"
                initial={reduce ? false : { opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={spring(1.5 + i * 0.08)}
              >
                <span className="inline-flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-full bg-action/15 text-action ring-1 ring-action/40">
                  <Check size={9} />
                </span>
                <span className="text-text/85 min-w-0 break-words">
                  {check.label}
                </span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}

// ── HeroScreenshot ───────────────────────────────────────────────────────────
//
// Reframe the populated screenshot regions without altering the original asset.

export function HeroScreenshot() {
  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface shadow-card">
      <ZoomableImage
        src={assetPath("/screenshots/workspace.png")}
        alt="bug.dr workspace: payment retry assignment, incident logs, acceptance checks and checkout code"
        width={1600}
        height={828}
        showEnlargeHint
      >
        <span className="relative block aspect-square overflow-hidden" data-hero-workspace>
          <span className="absolute inset-x-0 top-0 h-[73%] overflow-hidden">
            <Image
              src={assetPath("/screenshots/workspace.png")}
              alt=""
              width={1600}
              height={828}
              priority
              sizes="(min-width: 1024px) 1800px, 300vw"
              className="absolute left-0 top-0 h-auto w-[300%] max-w-none"
            />
          </span>
          <span className="absolute inset-x-0 bottom-0 h-[27%] overflow-hidden border-t border-border">
            <Image
              src={assetPath("/screenshots/workspace.png")}
              alt=""
              width={1600}
              height={828}
              priority
              sizes="(min-width: 1024px) 1800px, 300vw"
              className="absolute -left-full top-0 h-auto w-[300%] max-w-none"
            />
          </span>
        </span>
      </ZoomableImage>
    </div>
  );
}
