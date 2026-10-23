"use client";

import { useEffect, useRef } from "react";
import { APP_URL } from "@/lib/site";

// "Start now" pill. Hovering arms it; while armed it drifts toward the cursor
// as long as the cursor stays within RANGE px of its edge. Past that it eases
// back (slow return transition lives in .btn-cta) and waits for the next hover.
// The wrapper never moves, so measuring it gives a stable resting center
// (measuring the moving link itself makes it jitter).
const RANGE = 110;
const PULL = 0.3;

export function CtaButton({ className = "", hidden = false }: { className?: string; hidden?: boolean }) {
  const wrapRef = useRef<HTMLSpanElement>(null);
  const linkRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const link = linkRef.current;
    if (!wrap || !link || hidden) return;
    if (!matchMedia("(pointer: fine) and (prefers-reduced-motion: no-preference)").matches) return;
    const release = () => {
      delete link.dataset.following;
      link.style.transform = "";
    };
    const move = (e: PointerEvent) => {
      if (!("following" in link.dataset)) return;
      const r = wrap.getBoundingClientRect();
      const dx = e.clientX - (r.left + r.width / 2);
      const dy = e.clientY - (r.top + r.height / 2);
      // Distance from the nearest edge, so wide buttons hold on along their whole length.
      const ex = Math.max(Math.abs(dx) - r.width / 2, 0);
      const ey = Math.max(Math.abs(dy) - r.height / 2, 0);
      if (Math.hypot(ex, ey) > RANGE) return release();
      link.style.transform = `translate(${dx * PULL}px, ${dy * PULL}px)`;
    };
    const arm = () => (link.dataset.following = "");
    link.addEventListener("pointerenter", arm);
    window.addEventListener("pointermove", move, { passive: true });
    document.documentElement.addEventListener("pointerleave", release);
    return () => {
      link.removeEventListener("pointerenter", arm);
      window.removeEventListener("pointermove", move);
      document.documentElement.removeEventListener("pointerleave", release);
      release();
    };
  }, [hidden]);

  return (
    <span
      ref={wrapRef}
      className={["inline-flex transition-opacity duration-300", hidden && "pointer-events-none opacity-0", className]
        .filter(Boolean)
        .join(" ")}
    >
      <a
        ref={linkRef}
        href={APP_URL}
        aria-hidden={hidden || undefined}
        tabIndex={hidden ? -1 : undefined}
        className="btn-cta w-full justify-between"
      >
        Start now
        <span aria-hidden className="btn-cta-arrow">
          <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
            <path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      </a>
    </span>
  );
}
