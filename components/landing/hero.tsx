"use client";

import { useEffect, useRef } from "react";
import { CtaButton } from "@/components/landing/cta-button";
import { APP_URL } from "@/lib/site";
import { Sky } from "@/components/landing/sky";

// "Where do you want to work?" chips. The app reads ?company= on signup.
const companies = [
  { name: "Stripe", slug: "stripe", domain: "stripe.com" },
  { name: "Google", slug: "google", domain: "google.com" },
  { name: "Meta", slug: "meta", domain: "meta.com" },
  { name: "Airbnb", slug: "airbnb", domain: "airbnb.com" },
  { name: "Netflix", slug: "netflix", domain: "netflix.com" },
  { name: "Shopify", slug: "shopify", domain: "shopify.com" },
];

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
              Fix bugs in real production codebases — with AI assistance. Build a
              portfolio that shows you can actually ship.
            </p>
            <CtaButton className="mt-12" variant="b" />

            <div className="mt-14">
              <h2 className="font-display text-xl font-bold text-text">Where do you want to work?</h2>
              <p className="mt-1.5 text-sm text-muted">Pick a company and start fixing their real bugs.</p>
              <ul className="mt-5 flex flex-wrap items-center gap-2.5">
                {companies.map((c) => (
                  <li key={c.slug}>
                    <a
                      href={`${APP_URL}/signup?company=${c.slug}`}
                      className="flex items-center gap-2 rounded-full border border-white/[0.12] bg-surface/70 px-3.5 py-1.5 text-sm font-medium text-text transition-[transform,border-color,box-shadow] duration-200 hover:-translate-y-0.5 hover:border-action/50 hover:shadow-[0_0_16px_rgba(139,172,255,0.2)]"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element -- external favicon, static export */}
                      <img
                        src={`https://www.google.com/s2/favicons?domain=${c.domain}&sz=32`}
                        alt=""
                        width={16}
                        height={16}
                        loading="lazy"
                        className="h-4 w-4 rounded-sm"
                      />
                      {c.name}
                    </a>
                  </li>
                ))}
                <li>
                  <a href={`${APP_URL}/signup`} className="px-1 text-sm text-muted transition-colors hover:text-text">
                    + more
                  </a>
                </li>
              </ul>
            </div>
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
