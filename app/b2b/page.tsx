import type { Metadata } from "next";
import { assetPath } from "@/lib/asset-path";
import { SITE_URL } from "@/lib/site";
import { Scenes } from "./client";
import "./b2b.css";

const TITLE = "Bugdr for Teams - AI-era technical interviews on your own codebase";
const DESCRIPTION =
  "Candidates fix a real bug from your codebase with a built-in AI assistant. Watch every prompt, edit and test run, live or on replay, with scores you can compare.";
const OG = { url: `${SITE_URL}/b2b/og.png`, width: 1200, height: 630, alt: "Bugdr live interview command center" };

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/b2b/" },
  openGraph: { type: "website", url: `${SITE_URL}/b2b/`, siteName: "Bugdr", title: TITLE, description: DESCRIPTION, images: [OG] },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION, images: [OG.url] },
};

const DEMO = "mailto:hello@mail.bugdr.app?subject=Bugdr%20for%20Teams%20demo";
const SIGN_IN = "https://b2b.bugdr.app";

// The page follows the product video: the intro, then one scene per screen
// height (client.tsx, scenes.tsx), then the video's closing call to action.

// Same gold CTA as the b2c "Start now" (cta-b in globals.css).
function DemoButton({ className = "", small = false }: { className?: string; small?: boolean }) {
  return (
    <a href={DEMO} className={`cta-b justify-center ${small ? "cta-b--sm" : ""} ${className}`}>
      Book a demo
      <span aria-hidden className="cta-b__icon">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.75} strokeLinecap="round" strokeLinejoin="round">
          <path d="M5 12h14M13 6l6 6-6 6" />
        </svg>
      </span>
    </a>
  );
}

function Lockup({ className = "" }: { className?: string }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element -- static export
    <img src={assetPath("/logos/primary-lockup.png")} alt="Bugdr" width={212} height={56} className={className} />
  );
}

function Nav() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/[0.07] bg-canvas/80 backdrop-blur-xl">
      <div className="flex h-16 items-center justify-between gap-4 px-4 sm:px-6">
        <a href="#top" aria-label="Bugdr for Teams, back to top" className="flex shrink-0 items-center gap-3">
          {/* eslint-disable-next-line @next/next/no-img-element -- static export */}
          <img src={assetPath("/logos/primary-lockup.png")} alt="Bugdr" width={106} height={28} className="h-7 w-auto" />
          <span className="t-label hidden rounded-lg border border-white/[0.12] px-2 py-1 sm:inline">For Teams</span>
        </a>
        <nav aria-label="Primary" className="flex items-center gap-5 lg:gap-7">
          <a href={SIGN_IN} className="hidden text-sm text-muted transition-colors hover:text-text sm:inline">
            Sign in
          </a>
          <DemoButton small />
        </nav>
      </div>
    </header>
  );
}

function Intro() {
  return (
    <section className="relative flex min-h-svh flex-col items-center justify-center overflow-hidden px-4 pb-16 pt-28 text-center">
      <Circuit />
      <div className="t-intro relative">
        <Lockup className="mx-auto h-12 w-auto md:h-14" />
        <p className="mt-4 font-mono text-xs uppercase tracking-[0.4em] text-action sm:text-sm">For teams</p>
        <h1 className="mx-auto mt-6 max-w-3xl text-[2.5rem] font-semibold leading-[1.05] tracking-[-0.035em] text-text sm:text-6xl md:text-7xl">
          Here&apos;s what working with <span className="text-action">Bug.dr</span> looks like.
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-muted md:text-xl">
          Candidates fix a real bug from your codebase with a built-in AI assistant. You watch every prompt, edit and test run, live or on
          replay, with scores you can compare.
        </p>
        <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <DemoButton className="w-full sm:w-auto" />
          <a
            href="#get-started"
            className="inline-flex w-full items-center justify-center gap-2 rounded-btn border border-white/[0.12] px-5 py-3 text-sm font-semibold text-text transition-colors hover:border-action/60 sm:w-auto"
          >
            See how it works ↓
          </a>
        </div>
        <p className="t-dim mt-10 font-mono text-xs">Product views use a fictional demo company. All names are made up.</p>
      </div>
    </section>
  );
}

// Hero background: the b2c journey lines (.journey-* in globals.css) laid out
// like circuit-board traces. Drawn for a 1440×900 hero, kept clear of the
// centred content; the right half is the left half turned 180°.
const TRACES: [number, number][][] = [
  [[0, 180], [180, 180], [180, 100], [460, 100]],
  [[0, 330], [290, 330], [290, 580], [340, 580]],
  [[0, 350], [270, 350], [270, 600], [340, 600]],
  [[0, 370], [250, 370], [250, 620], [340, 620]],
  [[0, 620], [80, 620], [80, 700], [200, 700]],
  [[0, 760], [140, 760], [140, 820], [520, 820]],
];
// Polyline with rounded corners, same look as the b2c traces.
function tracePath(pts: [number, number][], r = 14) {
  let d = `M${pts[0][0]} ${pts[0][1]}`;
  for (let i = 1; i < pts.length - 1; i++) {
    const [[ax, ay], [bx, by], [cx, cy]] = [pts[i - 1], pts[i], pts[i + 1]];
    const u = (p: number, q: number) => Math.sign(q - p) * r;
    d += `L${bx - u(ax, bx)} ${by - u(ay, by)}Q${bx} ${by} ${bx + u(bx, cx)} ${by + u(by, cy)}`;
  }
  const [ex, ey] = pts[pts.length - 1];
  return `${d}L${ex} ${ey}`;
}

function Circuit() {
  const half = TRACES.map((pts, i) => {
    const [x, y] = pts[pts.length - 1];
    return (
      <g key={i}>
        <path className="journey-base" d={tracePath(pts)} />
        <path className="journey-pulse" d={tracePath(pts)} pathLength={1} style={{ animationDelay: `${-i * 0.9}s` }} />
        <circle className="journey-dot" cx={x} cy={y} r={3} />
        <circle cx={x} cy={y} r={6.5} fill="none" stroke="#8bacff" strokeOpacity={0.5} />
      </g>
    );
  });
  return (
    <svg
      aria-hidden
      viewBox="0 0 1440 900"
      preserveAspectRatio="xMidYMid slice"
      className="pointer-events-none absolute inset-0 h-full w-full max-md:hidden"
      style={{ filter: "drop-shadow(0 0 4px rgba(139,172,255,0.75))" }}
    >
      {half}
      <g transform="rotate(180 720 450)">{half}</g>
    </svg>
  );
}

function Outro() {
  return (
    <section className="relative flex min-h-[80svh] flex-col items-center justify-center overflow-hidden px-4 py-24 text-center">
      <div aria-hidden className="t-grid pointer-events-none absolute inset-0" />
      <div className="t-reveal relative">
        <Lockup className="mx-auto h-12 w-auto md:h-14" />
        <h2 className="mt-8 text-3xl font-semibold tracking-[-0.03em] text-text md:text-5xl">Run your next interview on Bugdr.</h2>
        <DemoButton className="mt-8" />
        <p className="mt-4 font-mono text-sm text-muted">bugdr.app/b2b</p>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-white/[0.06] py-10">
      <div className="mx-auto flex max-w-[1200px] flex-col gap-6 px-4 sm:px-6 md:flex-row md:items-center md:justify-between">
        {/* eslint-disable-next-line @next/next/no-img-element -- static export */}
        <img src={assetPath("/logos/primary-lockup.png")} alt="Bugdr" width={106} height={28} loading="lazy" className="h-7 w-auto self-start md:self-auto" />
        <nav aria-label="Footer" className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted">
          <a href="mailto:hello@mail.bugdr.app" className="hover:text-text">hello@mail.bugdr.app</a>
          <a href="https://www.bugdr.app/privacy" className="hover:text-text">Privacy</a>
          <a href="https://www.bugdr.app/terms" className="hover:text-text">Terms</a>
          <a href={SIGN_IN} className="hover:text-text">Sign in</a>
        </nav>
        <p className="t-dim font-mono text-xs">© {new Date().getFullYear()} Bugdr</p>
      </div>
    </footer>
  );
}

export default function B2bPage() {
  return (
    <>
      <Nav />
      <main id="top" className="overflow-x-clip">
        <Intro />
        <Scenes />
        <Outro />
      </main>
      <Footer />
    </>
  );
}
