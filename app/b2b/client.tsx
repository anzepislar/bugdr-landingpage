"use client";

import { useEffect, useId, useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import { assetPath } from "@/lib/asset-path";

// Muted loop that plays only while on screen (a hidden tab counts as off
// screen). Below the hero nothing is fetched until it nears the viewport.
// Reduced motion: poster + controls.
export function LoopVideo({ name, poster, label, eager = false }: {
  name: string;
  poster: string;
  label: string;
  eager?: boolean;
}) {
  const ref = useRef<HTMLVideoElement>(null);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setReduced(true);
      return;
    }
    v.muted = true;
    const io = new IntersectionObserver(
      ([e]) => (e.isIntersecting ? v.play().catch(() => {}) : v.pause()),
      { rootMargin: "200px" },
    );
    io.observe(v);
    return () => io.disconnect();
  }, []);

  return (
    <video
      ref={ref}
      muted
      loop
      playsInline
      controls={reduced}
      preload={eager ? "metadata" : "none"}
      poster={assetPath(`/b2b/${poster}-1440.webp`)}
      width={1440}
      height={900}
      aria-label={label}
      className="block h-auto w-full bg-canvas"
    >
      <source src={assetPath(`/b2b/${name}.mp4`)} type="video/mp4" />
      <source src={assetPath(`/b2b/${name}.webm`)} type="video/webm" />
    </video>
  );
}

const STATUS = {
  live: { color: "!text-passed", text: "Live", pulse: true },
  replay: { color: "!text-action", text: "Replay", pulse: false },
  ready: { color: "!text-passed", text: "Ready", pulse: false },
  signal: { color: "!text-pending", text: "Signal", pulse: false },
};
export type Status = keyof typeof STATUS;

export function Dot({ kind }: { kind: Status }) {
  const s = STATUS[kind];
  return (
    <span className={`t-label flex shrink-0 items-center gap-2 ${s.color}`}>
      <span aria-hidden className={`t-dot ${s.pulse ? "t-pulse" : ""}`} />
      {s.text}
    </span>
  );
}

export type View = { label: string; status?: Status; content: ReactNode };

// The one screenshot frame on the page. Several views become tabs in the
// header row; one view is a plain labelled frame.
export function Monitor({ views, glow = false, className = "" }: { views: View[]; glow?: boolean; className?: string }) {
  const [i, setI] = useState(0);
  const id = useId();
  const tabs = views.length > 1;

  const onKey = (e: KeyboardEvent) => {
    const step = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
    if (!step) return;
    const n = (i + step + views.length) % views.length;
    setI(n);
    document.getElementById(`${id}-t${n}`)?.focus();
  };

  return (
    <figure
      className={`overflow-hidden rounded-modal border border-white/[0.09] bg-surface ${
        glow ? "shadow-[0_0_40px_rgba(139,172,255,0.15)]" : ""
      } ${className}`}
    >
      <div className="flex h-12 items-center justify-between gap-3 border-b border-white/[0.09] px-2">
        {tabs ? (
          <div role="tablist" aria-label="Product views" onKeyDown={onKey} className="flex min-w-0 gap-1 overflow-x-auto">
            {views.map((v, n) => (
              <button
                key={v.label}
                id={`${id}-t${n}`}
                role="tab"
                type="button"
                aria-selected={n === i}
                aria-controls={`${id}-p${n}`}
                tabIndex={n === i ? 0 : -1}
                onClick={() => setI(n)}
                className={`t-label shrink-0 rounded-lg px-3 py-2 transition-colors ${
                  n === i ? "bg-white/[0.07] !text-text" : "hover:!text-text"
                }`}
              >
                {v.label}
              </button>
            ))}
          </div>
        ) : (
          <span className="t-label truncate px-2">{views[0].label}</span>
        )}
        {views[i].status && <span className="pr-2"><Dot kind={views[i].status} /></span>}
      </div>
      {views.map((v, n) => (
        <div
          key={v.label}
          id={`${id}-p${n}`}
          role={tabs ? "tabpanel" : undefined}
          aria-labelledby={tabs ? `${id}-t${n}` : undefined}
          hidden={n !== i}
        >
          {v.content}
        </div>
      ))}
    </figure>
  );
}

export type Step = { title: string; body: string; label: string; status?: Status; shot: ReactNode };

const pad = (n: number) => String(n).padStart(2, "0");

// Desktop: steps scroll on the left, one sticky monitor on the right swaps
// to the step nearest the middle of the screen. Phones: each step stacks
// with its own monitor.
export function ScrollSteps({ steps }: { steps: Step[] }) {
  const [active, setActive] = useState(0);
  const refs = useRef<(HTMLLIElement | null)[]>([]);

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(Number((e.target as HTMLElement).dataset.i))),
      { rootMargin: "-45% 0px -45% 0px" },
    );
    refs.current.forEach((el) => el && io.observe(el));
    return () => io.disconnect();
  }, []);

  const n = steps.length;
  return (
    <div className="grid gap-x-14 lg:grid-cols-12">
      <ol className="lg:col-span-5">
        {steps.map((s, i) => (
          <li
            key={s.title}
            ref={(el) => {
              refs.current[i] = el;
            }}
            data-i={i}
            className="py-10 first:pt-0 lg:flex lg:min-h-[70vh] lg:flex-col lg:justify-center lg:py-0"
          >
            <div className={`transition-opacity duration-300 motion-reduce:transition-none ${i === active ? "" : "lg:opacity-35"}`}>
              <p className="font-mono text-sm tabular-nums text-action">
                {pad(i + 1)} <span className="t-dim">/ {pad(n)}</span>
              </p>
              <h3 className="mt-3 text-2xl font-semibold tracking-[-0.02em] text-text md:text-3xl">{s.title}</h3>
              <p className="mt-4 max-w-[46ch] text-base leading-relaxed text-muted md:text-lg">{s.body}</p>
            </div>
            <Monitor className="mt-8 lg:hidden" views={[{ label: s.label, status: s.status, content: s.shot }]} />
          </li>
        ))}
      </ol>

      <div className="hidden lg:col-span-7 lg:block">
        <div className="sticky top-[max(6rem,calc(50vh-14rem))]">
          <figure className="overflow-hidden rounded-modal border border-white/[0.09] bg-surface shadow-[0_0_40px_rgba(139,172,255,0.15)]">
            <div className="flex h-12 items-center justify-between gap-3 border-b border-white/[0.09] px-4">
              <span className="t-label truncate" aria-live="polite">{steps[active].label}</span>
              <div className="flex items-center gap-1.5">
                {steps.map((s, i) => (
                  <button
                    key={s.title}
                    type="button"
                    aria-label={`Show step ${i + 1}: ${s.title}`}
                    aria-current={i === active ? "step" : undefined}
                    onClick={() => refs.current[i]?.scrollIntoView({ block: "center" })}
                    className="flex h-6 items-center"
                  >
                    <span className={`block h-1 w-6 rounded-full transition-colors ${i === active ? "bg-action" : "bg-white/[0.12]"}`} />
                  </button>
                ))}
              </div>
            </div>
            <div className="grid">
              {steps.map((s, i) => (
                <div
                  key={s.title}
                  aria-hidden={i !== active}
                  className={`[grid-area:1/1] transition-opacity duration-500 motion-reduce:transition-none ${
                    i === active ? "opacity-100" : "pointer-events-none opacity-0"
                  }`}
                >
                  {s.shot}
                </div>
              ))}
            </div>
          </figure>
        </div>
      </div>
    </div>
  );
}
