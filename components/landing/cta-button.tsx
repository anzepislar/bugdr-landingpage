"use client";

import { useEffect, useRef } from "react";
import { APP_URL } from "@/lib/site";

// Magnetic CTA. Hovering arms it; while armed it is pulled toward the cursor
// as long as the cursor stays within RANGE px of its edge. Past that (or when
// the cursor leaves the page) it eases back to rest and waits for the next hover.
// Movement is lerped per animation frame and applied via the CSS `translate`
// property, so it never fights the buttons' own `transform` (:active press)
// or their CSS transitions, and never touches layout.
// The wrapper never moves, so measuring it gives a stable resting center
// (measuring the moving link itself makes it jitter).
const RANGE = 110;
const PULL = 0.3;
const EASE = 0.18; // fraction of the remaining distance covered per frame

export function CtaButton({
  className = "",
  hidden = false,
  label = "Start now",
  variant,
  small = false,
}: {
  className?: string;
  hidden?: boolean;
  label?: string;
  // a: pill with amber arrow (pricing). b: solid amber (hero). Unset: nav "Login" style.
  variant?: "a" | "b";
  small?: boolean;
}) {
  const wrapRef = useRef<HTMLSpanElement>(null);
  const linkRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const link = linkRef.current;
    if (!wrap || !link || hidden) return;
    // Mouse/trackpad only: touch devices and reduced-motion users get plain buttons.
    if (!matchMedia("(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)").matches) return;
    let armed = false;
    let tx = 0, ty = 0; // target offset
    let x = 0, y = 0; // current offset
    let raf = 0;
    const tick = () => {
      x += (tx - x) * EASE;
      y += (ty - y) * EASE;
      if (Math.abs(tx - x) < 0.1 && Math.abs(ty - y) < 0.1) {
        x = tx;
        y = ty;
        raf = 0;
      } else {
        raf = requestAnimationFrame(tick);
      }
      link.style.translate = x || y ? `${x}px ${y}px` : "";
    };
    const animate = () => {
      if (!raf) raf = requestAnimationFrame(tick);
    };
    const release = () => {
      armed = false;
      tx = ty = 0;
      animate();
    };
    const move = (e: PointerEvent) => {
      if (!armed || e.pointerType !== "mouse") return;
      const r = wrap.getBoundingClientRect();
      const dx = e.clientX - (r.left + r.width / 2);
      const dy = e.clientY - (r.top + r.height / 2);
      // Distance from the nearest edge, so wide buttons hold on along their whole length.
      const ex = Math.max(Math.abs(dx) - r.width / 2, 0);
      const ey = Math.max(Math.abs(dy) - r.height / 2, 0);
      if (Math.hypot(ex, ey) > RANGE) return release();
      tx = dx * PULL;
      ty = dy * PULL;
      animate();
    };
    const arm = (e: PointerEvent) => {
      if (e.pointerType === "mouse") armed = true;
    };
    link.addEventListener("pointerenter", arm);
    window.addEventListener("pointermove", move, { passive: true });
    document.documentElement.addEventListener("pointerleave", release);
    return () => {
      link.removeEventListener("pointerenter", arm);
      window.removeEventListener("pointermove", move);
      document.documentElement.removeEventListener("pointerleave", release);
      cancelAnimationFrame(raf);
      link.style.translate = "";
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
        className={variant ? `cta-${variant}${small ? ` cta-${variant}--sm` : ""}` : "btn-cta w-full justify-between"}
      >
        {label}
        {variant ? (
          <span aria-hidden className={`cta-${variant}__icon`}>
            <svg width={variant === "a" ? 18 : 16} height={variant === "a" ? 18 : 16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={variant === "a" ? 2.5 : 2.75} strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </span>
        ) : (
          <span aria-hidden className="btn-cta-arrow">
            <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
              <path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
        )}
      </a>
    </span>
  );
}
