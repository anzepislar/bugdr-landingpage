import { APP_URL } from "@/lib/site";

// Full-viewport hero. Transparent, so the fixed night sky (sky.tsx) shows through.
export function Hero() {
  return (
    <section className="relative flex min-h-[100svh] items-center">
      <div className="relative mx-auto w-full max-w-[1100px] px-5 pb-24 pt-32 md:px-8">
        <h1 className="max-w-[12ch] font-display text-5xl font-extrabold leading-[0.95] tracking-[-0.03em] text-text sm:text-7xl md:text-8xl">
          Your title doesn&apos;t fix bugs.
        </h1>
        <p className="mt-8 max-w-[52ch] text-lg leading-relaxed text-muted md:text-xl">
          AI can write your code. Bugdr challenges you to understand it, find
          what broke, and prove your fix works.
        </p>
        <a href={APP_URL} className="btn-action mt-10 px-6 py-3.5 text-base">
          Start now
        </a>
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
