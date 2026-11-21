"use client";

import { useEffect, useRef } from "react";
import { CtaButton } from "@/components/landing/cta-button";
import { Sky } from "@/components/landing/sky";

// Hero stays stuck and fades out while the next section rises over it from
// the first pixel of scroll (that section is pulled up by one viewport and has
// a transparent top edge, so the two blend instead of meeting at a line).
// The spacer gives the sticky hero exactly one viewport of travel; after that
// the faded hero scrolls away under the section.
// A hero taller than the viewport (phones) scrolls to its bottom first, then
// sticks and fades.
function useHeroFade() {
  const sticky = useRef<HTMLDivElement>(null);
  const hero = useRef<HTMLElement>(null);
  useEffect(() => {
    const s = sticky.current;
    const h = hero.current;
    if (!s || !h || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let overflow = 0;
    const update = () => {
      const fadeEnd = innerHeight * 0.8;
      h.style.opacity = String(Math.max(0, 1 - Math.max(0, scrollY - overflow) / fadeEnd));
    };
    const resize = () => {
      overflow = Math.max(0, s.offsetHeight - innerHeight);
      s.style.top = `${-overflow}px`;
      update();
    };
    resize();
    addEventListener("scroll", update, { passive: true });
    addEventListener("resize", resize);
    return () => {
      removeEventListener("scroll", update);
      removeEventListener("resize", resize);
    };
  }, []);
  return { sticky, hero };
}

// Full-viewport hero over the night sky (sky.tsx), which only covers the hero.
export function Hero() {
  const { sticky, hero } = useHeroFade();
  return (
    <div>
      <div ref={sticky} className="sticky top-0 z-[1]">
        <section ref={hero} className="hero relative flex min-h-[100svh] items-center will-change-[opacity]">
          <Sky />
          <div className="relative mx-auto w-full max-w-[1100px] px-5 pb-24 pt-32 md:px-8">
            <h1 className="font-display text-5xl font-semibold leading-[0.95] tracking-[-0.02em] text-text sm:text-7xl md:text-8xl">
              Solve what
              <br />
              actually matters
            </h1>
            <p className="mt-10 max-w-[52ch] text-[19px] leading-relaxed text-text/75 md:text-[22px]">
              Debug real code. With real AI. Prove you&apos;re the best at it. Fix
              real bugs from real open-source repositories, and Bugdr scores how
              well you use AI to do it.
            </p>
            <CtaButton className="mt-12" variant="b" />

          </div>

          <a
            href="#how-it-works"
            className="absolute bottom-8 left-1/2 flex -translate-x-1/2 flex-col items-center gap-2 text-[11px] uppercase tracking-[0.2em] text-muted2 transition-colors hover:text-muted"
          >
            Scroll
            <svg
              aria-hidden
              width="14"
              height="14"
              viewBox="0 0 14 14"
              fill="none"
              className="scroll-hint"
            >
              <path d="M7 2v10M3 8l4 4 4-4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>
        </section>
      </div>
      <div aria-hidden className="h-[100svh]" />
    </div>
  );
}
