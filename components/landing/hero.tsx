import { Wordmark } from "@/components/landing/wordmark";
import { CtaButton } from "@/components/landing/cta-button";
import { APP_URL } from "@/lib/site";

// "Where do you want to work?" chips. The app reads ?company= on signup.
const companies = [
  { name: "Stripe", slug: "stripe", domain: "stripe.com" },
  { name: "Google", slug: "google", domain: "google.com" },
  { name: "Meta", slug: "meta", domain: "meta.com" },
  { name: "Airbnb", slug: "airbnb", domain: "airbnb.com" },
  { name: "Netflix", slug: "netflix", domain: "netflix.com" },
  { name: "Shopify", slug: "shopify", domain: "shopify.com" },
];

// Full-viewport hero. Transparent, so the fixed night sky (sky.tsx) shows through.
export function Hero() {
  return (
    <section className="relative flex min-h-[100svh] items-center">
      <div className="relative mx-auto w-full max-w-[1100px] px-5 pb-24 pt-32 md:px-8">
        <h1 className="max-w-[12ch] font-display text-5xl font-extrabold leading-[0.95] tracking-[-0.03em] text-text sm:text-7xl md:text-8xl">
          Your title doesn&apos;t fix bugs.
        </h1>
        <p className="mt-8 max-w-[52ch] text-lg leading-relaxed text-muted md:text-xl">
          AI can write your code. <Wordmark /> challenges you to understand it, find
          what broke, and prove your fix works.
        </p>
        <CtaButton className="mt-10" />

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
        href="#belief"
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
  );
}
