"use client";

import { useEffect, useRef, useState, type CSSProperties, type RefObject } from "react";
import { SCENES, type Callout, type Scene } from "./scenes";

// The page is the product video, coded (scenes in scenes.tsx). Each scene is
// one screen-height section, played like a video scene when it scrolls into
// view: the headline fades in and types, the explanation follows, the portal
// window slides in from the right and its screen plays (`range`), then the
// callout cards slide in from their side. Leaving the screen resets it, so
// it plays again on the way back. Reduced motion: final state, no motion.

const W = 1440; // design size of every portal screen
const H = 900;
const PLAY_MS = 4200;
const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));
const seg = (t: number, a: number, b: number) => clamp((t - a) / (b - a), 0, 1);
const out = (x: number) => 1 - (1 - x) ** 3;

function usePlay(ref: RefObject<HTMLElement | null>) {
  const [t, setT] = useState(0);
  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return setT(1);
    let raf = 0;
    let playing = false;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.intersectionRatio >= 0.35 && !playing) {
          playing = true;
          const start = performance.now();
          const tick = (now: number) => {
            const k = Math.min(1, (now - start) / PLAY_MS);
            setT(k);
            if (k < 1) raf = requestAnimationFrame(tick);
          };
          raf = requestAnimationFrame(tick);
        } else if (!e.isIntersecting) {
          playing = false;
          cancelAnimationFrame(raf);
          setT(0);
        }
      },
      { threshold: [0, 0.35] },
    );
    io.observe(ref.current!);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [ref]);
  return t;
}

export function Scenes() {
  return SCENES.map((s) => <SceneSection key={s.title} s={s} />);
}

function SceneSection({ s }: { s: Scene }) {
  const ref = useRef<HTMLElement>(null);
  const t = usePlay(ref);
  const head = out(seg(t, 0, 0.12));
  const shown = Math.round(s.title.length * seg(t, 0.02, 0.2));
  const body = out(seg(t, 0.12, 0.26));
  return (
    <section ref={ref} id={s.id} className="scroll-mt-16 overflow-hidden py-20 md:py-32">
      <header className="mx-auto max-w-4xl px-4 text-center">
        <p className="font-mono text-xs uppercase tracking-[0.32em] text-action sm:text-sm" style={{ opacity: head }}>
          {s.chapter}
        </p>
        <h2
          className="mt-3 text-3xl font-semibold tracking-[-0.025em] text-text md:text-[2.75rem] md:leading-[1.08]"
          aria-label={s.title}
          style={{ opacity: head, filter: `blur(${(1 - head) * 8}px)` }}
        >
          <span aria-hidden>{s.title.slice(0, shown)}</span>
          <span aria-hidden className="opacity-15">{s.title.slice(shown)}</span>
        </h2>
        <p className="mx-auto mt-3 max-w-3xl text-base leading-relaxed text-muted" style={{ opacity: body, transform: `translateY(${(1 - body) * 12}px)` }}>
          {s.body}
        </p>
      </header>
      {/* Width capped by the screen height so a scene always fits one screen. */}
      <div className="mx-auto mt-6 w-full max-w-[min(1600px,calc((100svh-20rem)*2.18))] px-4 max-sm:max-w-none">
        <Stage s={s} t={t} />
      </div>
    </section>
  );
}

// The portal window shows one clean region of the 1440×900 screen (`region`,
// in design px), sized to it, centred in a 1920×880 stage; the callout cards
// stack on either side, overlapping its edges like in the video.
function Stage({ s, t }: { s: Scene; t: number }) {
  const win = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const ro = new ResizeObserver(([e]) => setWidth(e.contentRect.width));
    ro.observe(win.current!);
    return () => ro.disconnect();
  }, []);

  const [x, y, w, h] = s.region ?? [0, 0, W, H];
  const { Screen } = s;
  const screenT = s.range[0] + (s.range[1] - s.range[0]) * seg(t, 0.2, 0.85);
  const slide = out(seg(t, 0.08, 0.3));
  // Fits the window in 68% of the stage width and 92% of its height.
  const fit = `min(68cqw, ${((42.2 * w) / h).toFixed(2)}cqw)`;
  // The stage is as tall as the window plus a small margin, so short windows leave no gap.
  const stageH = Math.min((68 * h) / w, 42.2) + 4;
  return (
    <div className="relative [container-type:inline-size] sm:aspect-[var(--stage)]" style={{ "--stage": `100 / ${stageH.toFixed(2)}` } as CSSProperties}>
      <div
        ref={win}
        role="img"
        aria-label={s.label}
        style={{
          "--fit": fit,
          aspectRatio: `${w} / ${h}`,
          opacity: slide,
          translate: `${(1 - slide) * 18}% 0`,
          scale: String(0.96 + slide * 0.04),
        } as CSSProperties}
        className="relative w-full overflow-hidden rounded-card border border-white/[0.1] bg-canvas shadow-[0_24px_80px_-12px_rgba(0,0,0,0.7),0_0_60px_rgba(139,172,255,0.08)] sm:absolute sm:left-1/2 sm:top-1/2 sm:w-[var(--fit)] sm:-translate-x-1/2 sm:-translate-y-1/2"
      >
        <div className="absolute left-0 top-0 origin-top-left" style={{ width: W, height: H, transform: `scale(${width / w}) translate(${-x}px, ${-y}px)` }}>
          <Screen t={screenT} />
        </div>
        {s.badge && (
          <span className="absolute right-3 top-3 rounded-full bg-action px-3 py-1 font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-canvas sm:text-[clamp(9px,0.9cqw,13px)]">
            {s.badge}
          </span>
        )}
      </div>
      {/* Phones: one list under the window. Wider: a centred stack per side. */}
      <div className="mt-4 grid gap-2 sm:contents">
        {(["left", "right"] as const).map((side) => (
          <ul
            key={side}
            className={`grid gap-2 max-sm:contents sm:absolute sm:inset-y-[4%] sm:w-[22%] sm:content-center sm:gap-[1.2cqw] ${side === "left" ? "sm:left-[1.5%]" : "sm:right-[1.5%]"}`}
          >
            {s.callouts
              .filter((c) => c.side === side)
              .map((c) => {
                const k = out(seg(t, 0.4 + s.callouts.indexOf(c) * 0.09, 0.55 + s.callouts.indexOf(c) * 0.09));
                return (
                  <li key={c.title ?? c.label} style={{ opacity: k, transform: `translateX(${(1 - k) * (side === "left" ? -32 : 32)}px)` }}>
                    <Card c={c} />
                  </li>
                );
              })}
          </ul>
        ))}
      </div>
    </div>
  );
}

function Card({ c }: { c: Callout }) {
  return (
    <div className="flex gap-[0.8em] rounded-xl border border-white/[0.1] bg-surface/95 p-[0.9em] text-[13px] leading-snug shadow-[0_12px_32px_-8px_rgba(0,0,0,0.6)] backdrop-blur sm:text-[clamp(11px,1.15cqw,19px)]">
      {c.kind && (
        <span
          aria-hidden
          className={`mt-[0.1em] flex h-[1.7em] w-[1.7em] shrink-0 items-center justify-center font-bold ${
            c.kind === "check" ? "rounded-full bg-action text-canvas" : "rounded-md border border-pending/60 bg-pending/10 text-pending"
          }`}
        >
          {c.kind === "check" ? "✓" : "!"}
        </span>
      )}
      <div className="min-w-0">
        {c.label && <p className="font-mono text-[0.72em] uppercase tracking-[0.14em] text-muted">{c.label}</p>}
        {c.value && <p className="mt-[0.2em] font-mono text-[1.9em] font-medium leading-none tabular-nums text-text">{c.value}</p>}
        {c.title && <p className="font-semibold text-text">{c.title}</p>}
        {c.body && <p className="text-muted">{c.body}</p>}
        {c.chips && (
          <div className="mt-[0.5em] flex flex-wrap gap-[0.4em]">
            {c.chips.map((x) => (
              <span key={x} className="rounded-md border border-action/30 bg-action/10 px-[0.55em] py-[0.2em] text-[0.92em] font-medium text-action">
                {x}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
