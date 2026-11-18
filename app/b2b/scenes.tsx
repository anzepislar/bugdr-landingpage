"use client";

import type { CSSProperties, ReactNode } from "react";
import { assetPath } from "@/lib/asset-path";

// The page is the product video, coded: one scene per screen height, in the
// video's order. Each screen is the portal rebuilt at 1440×900 (styles from
// the app's components/b2b), drawn as a function of t (0 → 1): how far the
// scene has played. `range` maps t onto the screen's own animation, and
// `region` is the clean part of the screen the window shows.
// All names and companies are fictional demo data.

// ── time helpers ────────────────────────────────────────────────────────
const c01 = (v: number) => Math.min(1, Math.max(0, v));
const seg = (t: number, a: number, b: number) => c01((t - a) / (b - a));
const ease = (x: number) => 1 - (1 - x) ** 3;
const typed = (s: string, t: number, a: number, b: number) => s.slice(0, Math.round(s.length * seg(t, a, b)));
const up = (t: number, a: number, d = 0.05): CSSProperties => {
  const k = ease(seg(t, a, a + d));
  return { opacity: k, transform: `translateY(${(1 - k) * 14}px)` };
};
const grow = (t: number, a: number, b: number) => ease(seg(t, a, b));
// Count every number in a display string up from 0 ("$0.03", "1.82×", "10,939").
const count = (s: string, k: number) =>
  s.includes(":") || k >= 1
    ? s
    : s.replace(/\d[\d,]*(\.\d+)?/g, (m) => {
        const dec = (m.split(".")[1] ?? "").length;
        const v = (parseFloat(m.replace(/,/g, "")) * k).toFixed(dec);
        return m.includes(",") ? v.replace(/\B(?=(\d{3})+(?!\d))/g, ",") : v;
      });
const clock = (base: number, t: number, span = 90) => {
  const s = base + Math.floor(t * span);
  return [s / 3600, (s / 60) % 60, s % 60].map((n) => String(Math.floor(n)).padStart(2, "0")).join(":");
};
const mmss = (s: number) => `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(Math.floor(s % 60)).padStart(2, "0")}`;

// ── portal kit ──────────────────────────────────────────────────────────
const L = "font-mono text-[11px] font-medium uppercase tracking-[0.14em] text-muted";
const GLASS = "rounded-lg border border-white/[0.08] bg-[#1b1d21] shadow-[0_16px_48px_rgba(0,0,0,0.55)]";

const ICONS: Record<string, string> = {
  Overview: "M3 3h7v7H3zM14 3h7v7h-7zM14 14h7v7h-7zM3 14h7v7H3z",
  Interviews: "M4 17l6-6-6-6M12 19h8",
  Candidates: "M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM4 21a8 8 0 0 1 16 0",
  Analytics: "M6 20v-8M12 20V4M18 20v-5M3 20h18",
  Codebases: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12",
  Events: "M8 21h8M12 17v4M7 4h10v5a5 5 0 0 1-10 0zM7 6H4a3 3 0 0 0 3 4M17 6h3a3 3 0 0 1-3 4",
  Tests: "M20 6 9 17l-5-5",
  Team: "M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM4 21a8 8 0 0 1 16 0",
  Company: "M4 21V5l8-2v18M12 9h8v12M4 21h16",
  Roles: "M5 11h14v10H5zM8 11V7a4 4 0 0 1 8 0v4",
  "Audit log": "M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20zM12 6v6l4 2",
};
const Icon = ({ d, className = "h-4 w-4" }: { d: string; className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <path d={d} />
  </svg>
);

type Tone = "passed" | "pending" | "failed" | "muted";
const TONE: Record<Tone, string> = { passed: "bg-passed", pending: "bg-pending", failed: "bg-failed", muted: "bg-muted2" };
const TEXT: Record<Tone, string> = { passed: "text-passed", pending: "text-pending", failed: "text-failed", muted: "text-muted" };
const Dot = ({ tone, live }: { tone: Tone; live?: boolean }) => (
  <span className="relative inline-flex h-2 w-2 shrink-0">
    {live && <span className={`absolute inset-0 animate-ping rounded-full opacity-60 ${TONE[tone]}`} />}
    <span className={`relative inline-flex h-2 w-2 rounded-full ${TONE[tone]}`} />
  </span>
);
const Status = ({ tone, live, children, boxed }: { tone: Tone; live?: boolean; children: ReactNode; boxed?: boolean }) => (
  <span className={`inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.12em] ${TEXT[tone] === "text-muted" ? "text-muted" : "text-text"} ${boxed ? "rounded border border-border px-2.5 py-1" : ""}`}>
    <Dot tone={tone} live={live} />
    {children}
  </span>
);

const Caret = () => <span className="ml-px inline-block h-[15px] w-px translate-y-[3px] animate-pulse bg-action" />;

function Field({ label, value, placeholder, focus, at, right, className = "", mono, area }: {
  label?: string; value?: ReactNode; placeholder?: string; focus?: boolean; at?: string; right?: ReactNode; className?: string; mono?: boolean; area?: boolean;
}) {
  return (
    <div className={className}>
      {label && (
        <p className={`${L} mb-2 flex justify-between`}>
          {label}
          {right}
        </p>
      )}
      <div
        data-at={at}
        className={`rounded border bg-canvas/70 px-3 py-2.5 text-sm text-text transition-[border-color,box-shadow] ${area ? "min-h-[64px] whitespace-pre-line" : "truncate"} ${mono ? "font-mono" : ""} ${
          focus ? "border-action shadow-[0_0_24px_rgba(139,172,255,0.2)]" : "border-border"
        }`}
      >
        {value ? value : !focus && <span className="text-muted2">{placeholder}</span>}
        {focus && <Caret />}
      </div>
    </div>
  );
}

function Btn({ children, at, ghost, pressed, danger, className = "" }: { children: ReactNode; at?: string; ghost?: boolean; pressed?: boolean; danger?: boolean; className?: string }) {
  const look = danger
    ? "bg-failed text-text"
    : ghost
      ? "border border-border bg-white/[0.04] text-text"
      : "bg-action text-canvas";
  return (
    <span data-at={at} className={`inline-flex items-center justify-center gap-2 rounded-md px-4 py-2.5 text-sm font-semibold transition-transform ${look} ${pressed ? "scale-95 brightness-110" : ""} ${className}`}>
      {children}
    </span>
  );
}

function Stat({ label, value, sub, k = 1, at, glow }: { label: string; value: string; sub?: string; k?: number; at?: string; glow?: boolean }) {
  return (
    <div data-at={at} className={`min-w-0 rounded-lg border bg-surface/60 px-4 py-3 ${glow ? "border-action/60 shadow-[0_0_24px_rgba(139,172,255,0.2)]" : "border-border"}`}>
      <p className={L}>{label}</p>
      <p className="mt-1 truncate font-mono text-2xl font-semibold tabular-nums text-text">{count(value, k)}</p>
      {sub && <p className="mt-0.5 truncate font-mono text-[11px] text-muted2">{sub}</p>}
    </div>
  );
}

function Panel({ title, action, children, className = "", at, style }: { title: string; action?: ReactNode; children: ReactNode; className?: string; at?: string; style?: CSSProperties }) {
  return (
    <section data-at={at} style={style} className={`min-w-0 rounded-lg border border-border bg-surface/60 ${className}`}>
      <div className="flex items-center justify-between gap-3 border-b border-white/[0.07] px-4 py-3">
        <h2 className={L}>{title}</h2>
        {action}
      </div>
      <div className="p-4">{children}</div>
    </section>
  );
}

const Check = ({ on, at }: { on: boolean; at?: string }) => (
  <span data-at={at} className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-sm border text-[11px] font-bold ${on ? "border-action bg-action text-canvas" : "border-border bg-canvas"}`}>
    {on && "✓"}
  </span>
);

const NAV = ["Overview", "Interviews", "Candidates", "Analytics", "Codebases", "Events", "Tests", "Team", "Company", "Roles", "Audit log"];

// The signed-in portal: top bar, sidebar, page.
function Shell({ nav, t, children, locked }: { nav?: string; t: number; children: ReactNode; locked?: boolean }) {
  return (
    <div className="flex h-full w-full flex-col bg-canvas text-text">
      <header className="flex h-14 shrink-0 items-center gap-3 border-b border-white/[0.07] px-6">
        {/* eslint-disable-next-line @next/next/no-img-element -- static export */}
        <img src={assetPath("/b2b/mark.png")} alt="" width={20} height={28} className="h-7 w-auto" />
        <span className="flex h-7 w-7 items-center justify-center rounded bg-[#23345f] font-bold text-action">N</span>
        <span className="font-semibold">Northwind Labs</span>
        <span className="flex items-center gap-2 rounded border border-border px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.16em] text-muted">
          <Dot tone="passed" /> Active
        </span>
        <div className="ml-auto flex items-center gap-5">
          <span className="font-mono text-xs tabular-nums text-muted">
            {clock(13 * 3600 + 26 * 60 + 19, t)} <span className="text-muted2">UTC</span>
          </span>
          <span className="text-right leading-tight">
            <span className="block text-sm">Maya Chen</span>
            <span className="block font-mono text-[11px] uppercase tracking-wider text-muted">Owner</span>
          </span>
          <span className="flex items-center gap-2 text-sm text-muted">
            <Icon d="M9 21H5V3h4M16 17l5-5-5-5M21 12H9" /> Sign out
          </span>
        </div>
      </header>
      <div className="flex min-h-0 flex-1">
        <nav className="w-56 shrink-0 border-r border-white/[0.07] px-3 py-6">
          {!locked && (
            <>
              <p className={`${L} mb-3 px-3`}>Navigate</p>
              <ul className="space-y-1">
                {NAV.map((n) => (
                  <li
                    key={n}
                    className={`relative flex items-center gap-3 rounded px-3 py-2 text-sm ${n === nav ? "bg-action/10 font-semibold text-text" : "text-muted"}`}
                  >
                    {n === nav && <span className="absolute inset-y-1.5 left-0 w-0.5 rounded bg-action" />}
                    <span className={n === nav ? "text-action" : ""}>
                      <Icon d={ICONS[n]} />
                    </span>
                    {n}
                  </li>
                ))}
              </ul>
            </>
          )}
        </nav>
        <main className="relative min-w-0 flex-1 overflow-hidden px-8 py-7">{children}</main>
      </div>
    </div>
  );
}

// Signed-out pages (sign in, candidate join): logo bar, centred card.
function Access({ tag, badge, children, wide }: { tag: string; badge: string; children: ReactNode; wide?: boolean }) {
  return (
    <div className="relative flex h-full w-full flex-col bg-canvas text-text">
      <div
        className="absolute inset-0 opacity-40"
        style={{
          backgroundImage: "linear-gradient(rgba(255,255,255,0.035) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.035) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
          maskImage: "radial-gradient(ellipse at center, black 30%, transparent 75%)",
        }}
      />
      <div className="absolute left-1/2 top-1/2 h-[520px] w-[520px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-action/[0.07] blur-3xl" />
      <header className="relative flex items-center justify-between px-10 py-5">
        <span className="flex items-center gap-3">
          {/* eslint-disable-next-line @next/next/no-img-element -- static export */}
          <img src={assetPath("/logos/primary-lockup.png")} alt="" width={128} height={34} className="h-9 w-auto" />
          <span className="rounded border border-border px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.18em] text-muted">{badge}</span>
        </span>
        <Status tone="passed" live>
          Systems online
        </Status>
      </header>
      <div className="relative flex flex-1 items-center justify-center">
        <div className={wide ? "w-[520px]" : "w-[420px]"}>
          <p className={`${L} flex items-center gap-2`}>
            <span className="h-px w-6 bg-action/60" />
            {tag}
          </p>
          <div data-at="card" className={`${GLASS} mt-4 p-8`}>{children}</div>
        </div>
      </div>
      <p className="relative pb-6 text-center font-mono text-[11px] text-muted2">bug.dr · {badge.toLowerCase()}</p>
    </div>
  );
}

const PageHead = ({ kicker, title, back, right, sub }: { kicker: string; title: string; back?: string; right?: ReactNode; sub?: string }) => (
  <div className="mb-6">
    {back && <p className="mb-2 font-mono text-xs text-action">← {back}</p>}
    <div className="flex items-end justify-between gap-6">
      <div>
        <p className={L}>{kicker}</p>
        <h1 className="mt-1.5 text-[28px] font-semibold tracking-[-0.01em]">{title}</h1>
      </div>
      {right && <div className="flex items-center gap-3">{right}</div>}
    </div>
    {sub && <p className="mt-2 max-w-[760px] text-sm text-muted">{sub}</p>}
  </div>
);

// ── screens ─────────────────────────────────────────────────────────────

const MISSIONS = [
  ["Backend · Live panel", "live interview · Senior Backend Engineer", "6 in · 5 solving · 1 solved", "passed"],
  ["Q4 AI workflow check", "Employee test", "5 in · 0 solving · 4 solved", "pending"],
  ["Frontend · Take-home", "async interview · Frontend Engineer", "6 in · 1 solving · 3 solved", "pending"],
  ["Platform · Live interview", "live interview · Platform Engineer (Python)", "1 in · 0 solving · 0 solved", "pending"],
] as const;
const STAGES = [
  ["Invited", 0, "bg-action"], ["Joined", 1, "bg-action"], ["Started", 3, "bg-action"], ["Submitted", 3, "bg-action"],
  ["Qualified", 13, "bg-passed"], ["Not solved", 4, "bg-failed"], ["Shortlisted", 4, "bg-passed"],
] as const;
const REVIEW = [
  ["Zara Ahmed", "Backend · Live panel · solved · 1.58×", "passed"],
  ["Emma Lindqvist", "Frontend · Take-home · solved · 1.02×", "passed"],
  ["Ravi Iyer", "Frontend · Take-home · not solved", "failed"],
  ["Hannah Fischer", "Frontend · Take-home · solved · 1.33×", "passed"],
] as const;
const ALERTS = ["Emma Lindqvist (Frontend · Take-home)", "Mila Jovanović (Backend · Live panel)", "Chloé Dubois (Backend · Live panel)"];

// a = when the page's own animation starts; flag = when alerts light up (integrity).
function Overview({ t, a = 0, flag }: { t: number; a?: number; flag?: number }) {
  const k = grow(t, a + 0.04, a + 0.22);
  return (
    <Shell nav="Overview" t={t}>
      <PageHead kicker="Overview" title="Northwind Labs" />
      <div data-at="ov-stats" className="grid grid-cols-4 gap-3">
        <Stat label="Live now" value="1" sub="interviews running" k={k} />
        <Stat label="Active missions" value="4" sub="rooms + tests open" k={k} />
        <Stat label="Awaiting review" value="5" sub="finished, report not opened" k={k} />
        <Stat label="Shortlisted" value="4" k={k} />
      </div>
      <div className="mt-4 grid grid-cols-2 gap-4">
        <Panel title="Active hiring missions" at="ov-missions">
          <ul className="space-y-3">
            {MISSIONS.map(([n, d, s, tone], i) => (
              <li key={n} style={up(t, a + 0.1 + i * 0.03)} className="flex items-start gap-3">
                <span className="mt-1.5">
                  <Dot tone={tone} live={tone === "passed"} />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-sm">{n}</span>
                  <span className="block font-mono text-[11px] text-muted">{d}</span>
                </span>
                <span className="font-mono text-[11px] text-muted">{s.replace(/ · \d+ solved$/, " · ")}<span className="text-passed">{s.match(/\d+ solved$/)?.[0]}</span></span>
              </li>
            ))}
          </ul>
        </Panel>
        <Panel title="Candidates by stage" at="ov-stages">
          <ul className="space-y-2.5">
            {STAGES.map(([n, v, c], i) => (
              <li key={n} className="flex items-center gap-4 font-mono text-[11px] uppercase tracking-[0.1em] text-muted">
                <span className="w-24">{n}</span>
                <span className="h-1.5 flex-1 rounded-full bg-white/[0.06]">
                  <span className={`block h-full rounded-full ${c}`} style={{ width: `${(Math.max(v, 0.3) / 13) * 100 * grow(t, a + 0.18 + i * 0.02, a + 0.34 + i * 0.02)}%` }} />
                </span>
                <span className="w-6 text-right text-text">{count(String(v), k)}</span>
              </li>
            ))}
          </ul>
          <p className="mt-3 text-xs text-action">All candidates →</p>
        </Panel>
        <Panel title="Awaiting review">
          <ul className="space-y-3">
            {REVIEW.map(([n, d, tone], i) => (
              <li key={n} style={up(t, a + 0.2 + i * 0.03)} className="flex items-center gap-3">
                <Dot tone={tone} />
                <span className="min-w-0 flex-1">
                  <span className="block text-sm">{n}</span>
                  <span className="block font-mono text-[11px] text-muted">{d}</span>
                </span>
                <span className="text-xs text-action">Review</span>
              </li>
            ))}
          </ul>
        </Panel>
        <Panel title="Upcoming + alerts" at="ov-alerts">
          <p className="flex gap-4 font-mono text-[11px] text-muted">
            2026-11-16 15:20 UTC <span className="font-sans text-sm text-text">Platform · Live interview</span>
            <span className="ml-auto">1 in lobby</span>
          </p>
          <ul className="mt-3 space-y-2">
            {ALERTS.map((n, i) => {
              const lit = flag !== undefined && t > flag + i * 0.06;
              return (
                <li
                  key={n}
                  style={up(t, a + 0.26 + i * 0.03)}
                  className={`flex items-center gap-2 rounded px-2 py-1 text-sm transition-colors ${lit ? "bg-pending/10 ring-1 ring-pending/40" : ""}`}
                >
                  <span className="text-highlight">⚑</span>
                  {n}: <span className="text-muted">1 integrity signal</span>
                </li>
              );
            })}
          </ul>
        </Panel>
      </div>
    </Shell>
  );
}

// Codebases: upload → AI writes the problem → checks prove the bug.
function Upload({ t }: { t: number }) {
  const ai = t > 0.1;
  const hint = typed("Totals look wrong once a coupon applies - probably in how tax is calculated.", t, 0.14, 0.24);
  const steps = ["Stored + duplicate check", "Dependencies install", "AI writes the problem, tests + fix", "Checks fail on your code, pass with the fix"];
  return (
    <Shell nav="Codebases" t={t}>
      <PageHead
        kicker="Codebases"
        title="Your codebases"
        sub="Upload a repository as a ZIP. Bugdr's AI finds a bug, writes what candidates read, hidden tests and a fix, and the checks must fail on your code and pass with the fix before it can be used. Your code is never shown outside your company."
      />
      <div className="grid grid-cols-3 gap-3">
        <Stat label="Ready" value="4" />
        <Stat label="Checking" value={t > 0.29 && t < 0.39 ? "1" : "0"} />
        <Stat label="Failed" value="0" />
      </div>
      <Panel title="Upload" className="mt-4">
        <div className="grid grid-cols-[1fr_320px] gap-6">
          <div className="space-y-4">
            <div>
              <p className={`${L} mb-2`}>Code from</p>
              <span className="inline-flex rounded border border-border font-mono text-[11px] uppercase tracking-[0.1em]">
                <span className="rounded-l bg-action/15 px-3 py-1.5 text-action">Zip file</span>
                <span className="px-3 py-1.5 text-muted">GitHub / GitLab</span>
              </span>
            </div>
            <div>
              <p className={`${L} mb-2`}>Repository (.zip, up to 50 MB)</p>
              <p className="flex items-center gap-3 text-sm">
                <Btn ghost className="!py-1.5">Choose file</Btn> checkout-service.zip
              </p>
            </div>
            <div data-at="cb-who">
              <p className={`${L} mb-2`}>Who writes the problem</p>
              <div className="grid grid-cols-2 gap-3">
                {[
                  ["With AI", "The AI finds the bug and writes the text, hidden tests and fix.", ai, "cb-ai"],
                  ["Manually", "You write the text, checks, hidden tests and fix yourself.", !ai, "cb-manual"],
                ].map(([h, p, on, at]) => (
                  <div key={h as string} data-at={at as string} className={`rounded-lg border p-3 ${on ? "border-action bg-action/10" : "border-border"}`}>
                    <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-text">{h}</p>
                    <p className="mt-1 text-xs text-muted">{p}</p>
                  </div>
                ))}
              </div>
            </div>
            <Field label="Where is the bug? (optional)" value={hint} placeholder="A hint for the AI" focus={t > 0.12 && t < 0.26} area />
            <Btn at="cb-upload" pressed={t > 0.27 && t < 0.3}>
              Upload + analyse
            </Btn>
          </div>
          <ul data-at="cb-steps" className="space-y-3 self-start rounded-lg border border-border bg-canvas/50 p-4">
            {steps.map((s, i) => {
              const a = 0.3 + i * 0.022;
              const done = t > a + 0.02;
              const run = t > a && !done;
              return (
                <li key={s} className={`flex items-center gap-3 text-sm ${done ? "text-text" : run ? "text-pending" : "text-muted2"}`}>
                  <span className={`flex h-4 w-4 items-center justify-center rounded-full text-[10px] ${done ? "bg-passed text-canvas" : run ? "animate-pulse bg-pending/40" : "bg-white/[0.08]"}`}>
                    {done && "✓"}
                  </span>
                  {s}
                </li>
              );
            })}
          </ul>
        </div>
      </Panel>
    </Shell>
  );
}

// Rooms: open a role → create a room → invite.
const ROOMS = [
  ["Platform · Live interview", "live · Invoice CSV export · Platform Engineer (Python)", "Scheduled", "pending", "WRS-TGH", "2026-11-18 13:02 UTC"],
  ["Backend · Live panel", "live · API rate limiter · Senior Backend Engineer", "Ended", "muted", "B44-URF", "2026-11-15 13:19 UTC"],
  ["Frontend · Take-home", "async · Product search pagination · Frontend Engineer", "Scheduled", "pending", "RTS-ZP8", "2026-11-19 13:37 UTC"],
  ["Senior Backend · Round 1", "async · Checkout order totals · Senior Backend Engineer", "Ended", "muted", "YAJ-VCV", "2026-11-03 13:37 UTC"],
] as const;
function Rooms({ t }: { t: number }) {
  const role = typed("Staff Platform Engineer", t, 0.06, 0.13);
  const added = t > 0.16;
  const roles = [["Frontend Engineer", 1], ["Platform Engineer (Python)", 2], ["Senior Backend Engineer", 2], ...(added ? [["Staff Platform Engineer", 0]] : [])] as const;
  return (
    <Shell nav="Interviews" t={t}>
      <PageHead kicker="Interviews" title="Interview rooms" right={<Btn at="rm-new" pressed={t > 0.25 && t < 0.28} className="!py-1.5">+ New room</Btn>} />
      <div className="grid grid-cols-4 gap-3">
        <Stat label="Live now" value="0" />
        <Stat label="Scheduled" value="2" />
        <Stat label="This month" value="3" sub="of 40 rooms" />
        <Stat label="Ready codebases" value="4" />
      </div>
      <Panel title="Rooms" className="mt-4">
        <ul className="divide-y divide-white/[0.06]">
          {ROOMS.map(([n, d, s, tone, code, at]) => (
            <li key={n} className="grid grid-cols-[1fr_120px_100px_180px] items-center gap-4 py-2.5 text-sm">
              <span>
                <span className="block">{n}</span>
                <span className="block font-mono text-[11px] text-muted">{d}</span>
              </span>
              <Status tone={tone}>{s}</Status>
              <span className="font-mono text-[12px] text-text">{code}</span>
              <span className="font-mono text-[11px] text-muted">{at}</span>
            </li>
          ))}
        </ul>
      </Panel>
      <Panel title="Open roles" className="mt-4" at="rm-roles">
        <div className="flex gap-3">
          <Field className="flex-1" value={role} placeholder="e.g. Senior backend engineer" focus={t > 0.05 && t < 0.15} />
          <Btn at="rm-add" ghost pressed={t > 0.15 && t < 0.17}>Add role</Btn>
        </div>
        <ul className="mt-3 space-y-1.5">
          {roles.map(([r, n]) => (
            <li key={r} style={String(r).startsWith("Staff") ? up(t, 0.16, 0.03) : undefined} className="flex items-center gap-3 text-sm">
              <Dot tone="passed" /> {r}
              <span className="ml-auto font-mono text-[11px] text-muted">{n} room{n === 1 ? "" : "s"}</span>
              <span className="text-xs text-action">Close</span>
            </li>
          ))}
        </ul>
      </Panel>
    </Shell>
  );
}

const INVITES = ["lena.weber@mailbox.dev", "omar.haddad@mailbox.dev", "kai.tanaka@mailbox.dev"];
function RoomPage({ t }: { t: number }) {
  const text = typed(INVITES.join("\n"), t, 0.64, 0.76);
  const sent = t > 0.81;
  const joined = INVITES.filter((_, i) => t > 0.88 + i * 0.04).length;
  return (
    <Shell nav="Interviews" t={t}>
      <PageHead back="Interviews" kicker="Live interview" title="Backend · Final round" right={<><span className="text-sm text-action">Export CSV</span><Status tone="pending" boxed>Scheduled</Status></>} />
      <div data-at="rm-code" className="flex items-center gap-10 rounded-lg border border-action/40 bg-surface/60 p-5 shadow-[0_0_24px_rgba(139,172,255,0.12)]">
        <div>
          <p className={L}>Room code</p>
          <p className="mt-1 font-mono text-[40px] font-semibold tracking-[0.2em]">WRS-TGH</p>
        </div>
        <div>
          <p className={L}>Join link</p>
          <p className="mt-1 font-mono text-sm">https://app.bugdr.app/join/WRS-TGH</p>
          <p className="mt-2 flex gap-2">
            <Btn className="!py-1.5">Copy link</Btn>
            <Btn ghost className="!py-1.5">Copy code</Btn>
          </p>
        </div>
      </div>
      <div data-at="rm-lobby" className="mt-4 flex items-center gap-6 rounded-lg border border-border bg-surface/60 px-4 py-3 font-mono text-[11px] uppercase tracking-[0.12em] text-muted">
        <Status tone="pending" live>Lobby</Status>
        <span>Candidates <span className="text-text">{joined}</span></span>
        <span>Solving 0</span>
        <span>Solved 0</span>
        <Btn className="ml-auto !py-1.5 normal-case tracking-normal">Start interview</Btn>
      </div>
      <Panel title={`Invites · ${sent ? 3 : 0}`} className="mt-4" at="rm-inv">
        <p className="mb-2 text-xs text-muted">Candidate emails - one per line or separated by commas. Bugdr emails them the link and the code for you.</p>
        <Field value={sent ? "" : text} placeholder="ana@example.com" focus={t > 0.62 && t < 0.79} area mono />
        <p className="mt-3 flex items-center gap-3">
          <Btn at="rm-send" pressed={t > 0.79 && t < 0.82} className="!py-1.5">Send 3 invites</Btn>
          <span className="font-mono text-[11px] text-muted2">max 50 at a time</span>
        </p>
        <ul className="mt-3 space-y-1.5">
          {sent &&
            INVITES.map((e, i) => (
              <li key={e} style={up(t, 0.81 + i * 0.015, 0.03)} className="flex items-center font-mono text-[12px]">
                {e}
                <span className="ml-auto">
                  <Status tone={t > 0.88 + i * 0.04 ? "passed" : "pending"}>{t > 0.88 + i * 0.04 ? "Joined" : "Sent"}</Status>
                </span>
              </li>
            ))}
        </ul>
      </Panel>
    </Shell>
  );
}

// Candidate join: code → details + consent → waiting room.
const ROOM_INFO = (
  <dl className="grid grid-cols-[70px_1fr] gap-y-1 rounded border border-border bg-canvas/60 px-4 py-3 font-mono text-[12px]">
    <dt className="text-muted">Room</dt><dd>WRS-TGH</dd>
    <dt className="text-muted">Time</dt><dd>60 min</dd>
    <dt className="text-muted">Starts</dt><dd>2026-11-20 15:00 UTC</dd>
  </dl>
);

function JoinDetails({ t }: { t: number }) {
  const scroll = ease(seg(t, 0.53, 0.6)) * 250;
  const agreed = t > 0.66;
  return (
    <Access tag="Interview · Northwind Labs" badge="Interview" wide>
      <div className="-m-8 h-[560px] overflow-hidden p-8">
        <div style={{ transform: `translateY(-${scroll}px)` }} className="space-y-4">
          <div data-at="jn-top" className="space-y-4">
            <p className="flex items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded bg-[#23345f] font-bold text-action">N</span>
              <span>
                <span className="block font-semibold">Northwind Labs</span>
                <span className="block text-xs text-muted">Payments and checkout infrastructure for 4,000 online stores across Europe.</span>
              </span>
            </p>
            <h2 className="text-xl font-semibold">Backend · Final round</h2>
            <p className="text-sm text-muted">Northwind Labs invited you to fix a bug in their code with Bugdr&apos;s built-in AI assistant.</p>
            {ROOM_INFO}
            <div className="grid grid-cols-2 gap-3">
              <Field label="Your name" value={typed("Lena Weber", t, 0.35, 0.41)} placeholder="Full name" focus={t > 0.33 && t < 0.42} />
              <Field label="Email" value={typed("lena.weber@mailbox.dev", t, 0.43, 0.51)} placeholder="you@email.com" focus={t >= 0.42 && t < 0.52} />
            </div>
          </div>
          <div data-at="jn-consent" className="space-y-3">
            <p className={`rounded border p-4 text-[13px] leading-relaxed text-muted ${t > 0.56 ? "border-action/40" : "border-border"} bg-canvas/60`}>
              <span className="font-semibold text-text">Northwind Labs</span> uses this interview to assess how you work with AI. It sees your code, every message you send the
              built-in AI and its answers, how you work in the editor (files you open, when you test, when you paste text or leave the tab), your time and your scores. Only the
              built-in AI counts; pastes from other tools are flagged to Northwind Labs. Scores are reviewed by a person, never an automatic decision.
            </p>
            <p className="flex items-center gap-3 text-sm">
              <Check on={agreed} at="jn-agree" /> I agree
            </p>
            <Btn at="jn-join" pressed={t > 0.71 && t < 0.74} className={`w-full ${agreed ? "" : "opacity-40"}`}>Join the interview</Btn>
          </div>
        </div>
      </div>
    </Access>
  );
}

// Live command center.
type Tile = { n: string; e: string; file: string; flag?: boolean; prompts: number[]; tok: number; solveAt?: number };
const TILES: Tile[] = [
  { n: "Zara Ahmed", e: "zara.ahmed@proton.me", file: "src/middleware.js", prompts: [0.3, 0.48, 0.66], tok: 13, solveAt: 0.84 },
  { n: "Felix Wagner", e: "felix.wagner@gmail.com", file: "src/middleware.js", prompts: [0.36, 0.7], tok: 9.1 },
  { n: "Mila Jovanović", e: "mila.j@gmail.com", file: "src/middleware.js", flag: true, prompts: [0.28, 0.42, 0.56, 0.74], tok: 17 },
  { n: "Arjun Mehta", e: "arjun.mehta@gmail.com", file: "src/middleware.js", prompts: [0.5], tok: 3.4 },
  { n: "Chloé Dubois", e: "chloe.dubois@gmail.com", file: "src/limiter.js", flag: true, prompts: [0.33, 0.62], tok: 8.6 },
  { n: "Viktor Larsen", e: "viktor.larsen@gmail.com", file: "src/limiter.js", prompts: [], tok: 0 },
];
const STREAM: [number, string, string, string][] = [
  [0.18, "MAYA", "started the interview", "text-muted"],
  [0.26, "ARJUN", "opened src/middleware.js", "text-muted"],
  [0.28, "MILA", "prompt #1 · 2.8K tokens", "text-text"],
  [0.3, "ZARA", "prompt #1 · 2.6K tokens", "text-text"],
  [0.33, "CHLOÉ", "prompt #1 · 2.6K tokens", "text-text"],
  [0.36, "FELIX", "prompt #1 · 5.8K tokens", "text-text"],
  [0.4, "ZARA", "submit 1/3", "text-pending"],
  [0.42, "MILA", "prompt #2 · 5.4K tokens", "text-text"],
  [0.48, "ZARA", "prompt #2 · 5.0K tokens", "text-text"],
  [0.5, "ARJUN", "prompt #1 · 3.4K tokens", "text-text"],
  [0.56, "MILA", "prompt #3 · 5.4K tokens", "text-text"],
  [0.62, "CHLOÉ", "prompt #2 · 6.0K tokens", "text-text"],
  [0.64, "MAYA", "announced: Reminder: run the visible tests as often as you like", "text-pending"],
  [0.66, "ZARA", "prompt #3 · 5.6K tokens", "text-text"],
  [0.7, "FELIX", "prompt #2 · 3.4K tokens", "text-text"],
  [0.74, "MILA", "⚠ time away from the tab · 01:35", "text-highlight"],
  [0.8, "ZARA", "submit 3/3 ✓", "text-passed"],
  [0.84, "ZARA", "solved ✓", "text-passed"],
];

function CommandCenter({ t }: { t: number }) {
  const started = t > 0.1;
  const left = started ? 45 * 60 - (t - 0.1) * 1100 : 45 * 60;
  const solved = TILES.filter((c) => c.solveAt && t > c.solveAt).length;
  const msg = typed("Reminder: run the visible tests as often as you like", t, 0.5, 0.6);
  const sentMsg = t > 0.63;
  return (
    <Shell nav="Interviews" t={t}>
      <PageHead
        back="Interviews"
        kicker="Live interview"
        title="Backend · Live panel"
        right={<><span className="text-sm text-action">Export CSV</span><Status tone={started ? "passed" : "pending"} live={started} boxed>{started ? "Live" : "Lobby"}</Status></>}
      />
      <div className="rounded-lg border border-border bg-surface/60">
        <div className="flex items-center gap-6 border-b border-white/[0.07] px-4 py-3 font-mono text-[11px] uppercase tracking-[0.12em] text-muted">
          <Status tone="passed" live={started}>{started ? "Live" : "Lobby"}</Status>
          <span className="text-[26px] font-medium normal-case tracking-normal tabular-nums text-text">{mmss(left)}</span>
          <span>Candidates <span className="text-text">6</span></span>
          <span>Solving <span className="text-text">{started ? 6 - solved : 0}</span></span>
          <span>Solved <span className="text-passed">{solved}</span></span>
          <span>Stopped 0</span>
          <span data-at="lv-controls" className="ml-auto flex items-center gap-2">
            Extend <Btn ghost className="!px-2.5 !py-1 !text-xs">+5 min</Btn>
            <Btn ghost className="!px-2.5 !py-1 !text-xs">+15 min</Btn>
            <span className="rounded-md border border-failed/60 px-3 py-1 text-xs normal-case tracking-normal text-failed">End interview</span>
          </span>
        </div>
        <div data-at="lv-announce" className="flex items-center gap-3 border-b border-white/[0.07] px-4 py-3">
          <span className={L}>Announce</span>
          <Field className="flex-1" value={sentMsg ? "" : msg} placeholder="A message every candidate sees, e.g. 10 minutes left" focus={t > 0.48 && t < 0.63} />
          <Btn at="lv-send" pressed={t > 0.62 && t < 0.645} className="!py-2">Send to all</Btn>
        </div>
        <div className="grid grid-cols-[1fr_280px] gap-4 p-4">
          <ul data-at="lv-tiles" className="grid grid-cols-3 gap-3">
            {TILES.map((c, i) => {
              const p = started ? c.prompts.filter((x) => t > x).length : 0;
              const done = !!c.solveAt && t > c.solveAt;
              const elapsed = started ? (t - 0.1) * 1100 : 0;
              const checks = c.solveAt ? (t > 0.8 ? 3 : t > 0.4 ? 1 : 0) : p > 1 ? 1 : 0;
              return (
                <li
                  key={c.n}
                  data-at={i === 0 ? "lv-zara" : undefined}
                  className={`min-w-0 rounded-lg border p-3.5 transition-colors ${done ? "border-passed/70 shadow-[0_0_24px_rgba(34,197,94,0.15)]" : "border-action/25"} bg-surface/60`}
                >
                  <p className="flex items-center gap-2">
                    <span className="truncate font-semibold">{c.n}</span>
                    {c.flag && t > 0.74 && <span className="rounded border border-highlight/50 px-1 font-mono text-[10px] text-highlight">⚑ 1</span>}
                    <span className="ml-auto">
                      <Status tone={started ? "passed" : "pending"} live={started && !done}>{done ? "Solved" : started ? "Solving" : "Waiting"}</Status>
                    </span>
                  </p>
                  <p className="truncate font-mono text-[11px] text-muted2">{c.e}</p>
                  <div className="mt-3 grid grid-cols-3 font-mono">
                    {[["Time", started ? mmss(done ? 14 * 60 : elapsed) : "-"], ["Prompts", p], ["Tokens", p ? `${((c.tok * p) / c.prompts.length).toFixed(1)}K` : 0]].map(([l, v]) => (
                      <span key={l as string}>
                        <span className="block text-[10px] uppercase tracking-[0.12em] text-muted">{l}</span>
                        <span className="text-sm text-text">{v}</span>
                      </span>
                    ))}
                  </div>
                  <p className="mt-3 flex justify-between font-mono text-[10px] uppercase tracking-[0.12em] text-muted">
                    Checks <span>{checks ? `${checks}/3 · ${checks === 3 ? 2 : 1} submit${checks === 3 ? "s" : ""}` : "no submit"}</span>
                  </p>
                  <span className="mt-1 block h-1 rounded-full bg-white/[0.06]">
                    <span className={`block h-full rounded-full transition-[width] ${checks === 3 ? "bg-passed" : "bg-pending"}`} style={{ width: `${(checks / 3) * 100}%` }} />
                  </span>
                  <p className="mt-2 truncate font-mono text-[11px] text-muted">file {started ? c.file : "-"}</p>
                  {done && <p className="font-mono text-[11px] text-passed">1.58× efficiency · 1.24× quality</p>}
                  <p className="mt-2 flex gap-1.5 font-mono text-[10px] uppercase tracking-[0.1em]">
                    <span className="rounded border border-border px-2 py-1 text-muted">Report</span>
                    {!done && <span className="rounded border border-border px-2 py-1 text-muted">+5 min</span>}
                    <span className="flex items-center gap-1 rounded border border-border px-2 py-1 text-muted"><Dot tone="passed" /> Watch</span>
                  </p>
                </li>
              );
            })}
          </ul>
          <div data-at="lv-stream" className="min-w-0 rounded-lg border border-border bg-canvas/50">
            <p className={`${L} border-b border-white/[0.07] px-3 py-2.5`}>Activity stream</p>
            <ul className="h-[430px] space-y-1.5 overflow-hidden p-3 font-mono text-[11px]">
              {STREAM.filter(([x]) => t > x)
                .reverse()
                .map(([x, who, what, tone], i) => (
                  <li key={x} style={i === 0 ? up(t, x, 0.02) : undefined} className="flex gap-2">
                    <span className="text-muted2">{clock(13 * 3600 + 3 * 60, x, 900)}</span>
                    <span className="truncate">
                      <span className="text-text">{who}</span> <span className={tone}>{what}</span>
                    </span>
                  </li>
                ))}
            </ul>
          </div>
        </div>
      </div>
      {t < 0.12 && (
        <div className="absolute inset-0 flex items-center justify-center bg-canvas/70" style={{ opacity: 1 - seg(t, 0.1, 0.12) }}>
          <div data-at="lv-dialog" className={`${GLASS} w-[380px] p-6`}>
            <p className="text-lg font-semibold">Start the interview?</p>
            <p className="mt-1 text-sm text-muted">6 candidates are in. Nobody else can join after the start.</p>
            <p className="mt-5 flex justify-end gap-2">
              <Btn ghost className="!py-1.5">Cancel</Btn>
              <Btn danger at="lv-start" pressed={t > 0.085 && t < 0.11} className="!py-1.5">Start</Btn>
            </p>
          </div>
        </div>
      )}
    </Shell>
  );
}

// Code shown in the watch, solve and replay screens.
const LIMITER = [
  "const WINDOW_MS = 60_000;",
  "const LIMIT = 100;",
  "",
  "/** Sliding-window limiter: timestamps of recent requests per API key. */",
  "class RateLimiter {",
  "  constructor({ windowMs = WINDOW_MS, limit = LIMIT, now = Date.now } = {}) {",
  "    this.windowMs = windowMs;",
  "    this.limit = limit;",
  "    this.now = now;",
  "    this.hits = new Map();",
  "  }",
  "",
  "  /** true = let the request through, false = 429. */",
  "  allow(key) {",
  "    const t = this.now();",
  "    const recent = (this.hits.get(key) ?? []).filter((at) => t - at > this.windowMs);",
  "    if (recent.length >= this.limit) return false;",
  "    recent.push(t);",
  "    this.hits.set(key, recent);",
  "    return true;",
  "  }",
  "}",
];
const FIXED = "    const recent = (this.hits.get(key) ?? []).filter((at) => t - at < this.windowMs);";

function Code({ lines, fixAt, t, at, from = 0 }: { lines: string[]; fixAt?: number; t: number; at?: string; from?: number }) {
  return (
    <ol className="font-mono text-[12.5px] leading-[1.7]">
      {lines.map((l, i) => {
        const fixed = fixAt !== undefined && i === 15 && t > fixAt;
        return (
          <li
            key={i}
            data-at={i === 15 ? at : undefined}
            className={`flex gap-4 px-3 ${fixed ? "bg-passed/10" : ""}`}
          >
            <span className="w-5 shrink-0 text-right text-muted2">{i + 1 + from}</span>
            <span className={`whitespace-pre ${l.trim().startsWith("/") ? "text-muted2" : fixed ? "text-passed" : "text-[#c9d1e0]"}`}>{fixed ? FIXED : l || " "}</span>
          </li>
        );
      })}
    </ol>
  );
}

const Bubble = ({ me, children, style, tag }: { me?: boolean; children: ReactNode; style?: CSSProperties; tag?: string }) => (
  <div style={style}>
    {tag && <p className="mb-1 font-mono text-[10px] text-muted2">{tag}</p>}
    <p className={`rounded-lg border px-3 py-2 text-[13px] leading-relaxed ${me ? "ml-6 border-action/40 bg-action/10 text-text" : "border-border bg-canvas/60 text-muted"}`}>{children}</p>
  </div>
);

function Watch({ t }: { t: number }) {
  const a1 = "It keeps the timestamps for which `t - at > this.windowMs` - that keeps the OLD requests and drops the recent ones, the opposite of a sliding window.";
  const a2 = "Keep requests younger than the window: filter((at) => t - at < this.windowMs)";
  return (
    <Shell nav="Interviews" t={t}>
      <PageHead back="Room" kicker="Watch · read-only" title="Felix Wagner" right={<><Status tone="passed" live boxed>Solving</Status><span className="font-mono text-[11px] text-muted">code from {t > 0.8 ? "just now" : "2 min ago"}</span></>} />
      <div className="grid h-[640px] grid-cols-[180px_1fr_340px] gap-4">
        <Panel title="Files">
          <ul className="space-y-1.5 font-mono text-[12px]">
            <li className="rounded bg-action/10 px-2 py-1 text-action">● src/limiter.js</li>
            <li className="px-2 text-muted">package.json</li>
            <li className="px-2 text-muted">src/middleware.js</li>
          </ul>
        </Panel>
        <Panel title="src/limiter.js" at="wt-code" className="overflow-hidden">
          <div className="-mx-4">
            <Code lines={LIMITER} t={t} fixAt={0.8} at="wt-line" />
          </div>
        </Panel>
        <Panel title={`AI chat · ${t > 0.5 ? 2 : t > 0.15 ? 1 : 0} prompts`} at="wt-chat">
          <div className="space-y-3">
            {t > 0.15 && <Bubble me tag="#1 · 13:03:22 · 5,757 tokens" style={up(t, 0.15)}>How does allow() decide which timestamps are still in the window?</Bubble>}
            {t > 0.25 && <Bubble style={up(t, 0.25)}>{typed(a1, t, 0.25, 0.38)}</Bubble>}
            {t > 0.5 && <Bubble me tag="#2 · 13:09:44 · 3,353 tokens" style={up(t, 0.5)}>Flip the filter so only the last minute counts.</Bubble>}
            {t > 0.6 && <Bubble style={up(t, 0.6)}>{typed(a2, t, 0.6, 0.7)}</Bubble>}
          </div>
        </Panel>
      </div>
    </Shell>
  );
}

function Solve({ t }: { t: number }) {
  const q = "Why do requests from the last minute get rejected?";
  const sent = t > 0.27;
  const ans = "allow() keeps timestamps where `t - at > this.windowMs` - the old requests - and drops the recent ones. Flip the comparison so only requests inside the window count:";
  const accepted = t > 0.62;
  const ran = t > 0.72;
  const submitted = t > 0.89;
  const left = 26 * 60 + 13 - t * 300;
  return (
    <div className="flex h-full w-full flex-col bg-canvas text-text">
      <div className="flex items-center gap-2 bg-highlight/10 px-5 py-1.5 font-mono text-[11px] text-text">
        <span className="uppercase tracking-[0.14em] text-highlight">From the interviewer</span>
        Reminder: you can run the visible tests as often as you like - only Submit counts.
      </div>
      <header data-at="sv-top" className="flex h-12 items-center gap-4 border-b border-white/[0.07] px-5">
        {/* eslint-disable-next-line @next/next/no-img-element -- static export */}
        <img src={assetPath("/logos/primary-lockup.png")} alt="" width={90} height={24} className="h-6 w-auto" />
        <span className="text-sm font-semibold">API rate limiter</span>
        <span className="mx-auto font-mono text-sm tabular-nums">{mmss(left)}</span>
        <span className="text-sm text-muted">Give up</span>
        <Btn at="sv-submit" pressed={t > 0.87 && t < 0.9} className="!bg-pending !py-1.5">Submit</Btn>
      </header>
      <div className="grid min-h-0 flex-1 grid-cols-[300px_1fr_380px]">
        <aside className="space-y-5 border-r border-white/[0.07] p-5 text-sm">
          <div>
            <p className="font-semibold">Your assignment</p>
            <p className="mt-2 leading-relaxed text-muted">Every public API key gets a sliding window of 100 requests a minute. The limiter keeps the timestamps of recent requests per key in memory and answers 429 when the window is full.</p>
          </div>
          <div>
            <p className="font-semibold">What the team is seeing</p>
            <p className="mt-2 rounded border border-border bg-surface/60 p-3 font-mono text-[11.5px] leading-relaxed text-muted">A partner hit us with ~400 requests in a few seconds right after a quiet minute and none of them were refused.</p>
          </div>
          <div>
            <p className="font-semibold">Acceptance checks <span className="text-muted">3</span></p>
            <ul className="mt-2 space-y-1 text-muted">
              {["Check 1", "Check 2", "Check 3"].map((c) => (
                <li key={c} className="flex items-center gap-2">
                  <span className={`h-1.5 w-1.5 rounded-full ${submitted ? "bg-passed" : "bg-action"}`} /> {c}
                </li>
              ))}
            </ul>
          </div>
        </aside>
        <section className="flex min-w-0 flex-col border-r border-white/[0.07]">
          <div className="flex items-center gap-4 border-b border-white/[0.07] px-4 py-2 font-mono text-[12px] text-muted">
            <span>package.json</span>
            <span className="border-b border-action pb-1 text-text">limiter.js</span>
            <span>middleware.js</span>
            <span data-at="sv-run" className={`ml-auto rounded px-2 py-0.5 text-passed ${t > 0.69 && t < 0.72 ? "bg-passed/20" : ""}`}>▷ Run</span>
          </div>
          <div data-at="sv-editor" className="min-h-0 flex-1 overflow-hidden py-2">
            <Code lines={LIMITER} t={t} fixAt={0.625} />
          </div>
          <div data-at="sv-term" className="h-[170px] border-t border-white/[0.07] px-4 py-2 font-mono text-[12px]">
            <p className="flex gap-4 text-muted"><span className="text-text">Terminal</span> Test Results</p>
            <p className="mt-2 text-muted2">▸ Run runs the open file, or type a command here.</p>
            {ran && (
              <div style={up(t, 0.72, 0.03)}>
                <p className="text-muted">$ npm test</p>
                <p className="text-passed">✓ lets 100 requests through</p>
                <p className="text-passed">✓ refuses the 101st inside the window</p>
                <p className="text-passed">✓ forgets requests older than a minute</p>
                <p className="text-text">3 passing</p>
              </div>
            )}
            {submitted && <p style={up(t, 0.9, 0.03)} className="mt-1 text-passed">Submitted · 3/3 acceptance checks passed ✓</p>}
          </div>
        </section>
        <aside data-at="sv-chat" className="flex min-w-0 flex-col">
          <div className="border-b border-white/[0.07] px-4 py-3">
            <p className="flex justify-between text-sm font-semibold">AI Assistant <span className="font-mono text-[11px] font-normal text-muted">Interview · claude-sonnet-5-5</span></p>
            <p className="mt-1 font-mono text-[11px] text-muted">Prompts: {sent ? 1 : 0} · Tokens: {sent ? count("2,841", seg(t, 0.28, 0.48)) : 0} · Runs: {ran ? 1 : 0}</p>
          </div>
          <div className="min-h-0 flex-1 space-y-3 overflow-hidden p-4">
            {sent && <Bubble me style={up(t, 0.27, 0.03)}>{q}</Bubble>}
            {t > 0.3 && <Bubble style={up(t, 0.3, 0.03)}>{typed(ans, t, 0.3, 0.47)}</Bubble>}
            {t > 0.49 && (
              <div style={up(t, 0.49)} className="overflow-hidden rounded-lg border border-border font-mono text-[11px]">
                <p className="flex items-center justify-between border-b border-white/[0.07] px-3 py-1.5 text-muted">
                  src/limiter.js
                  {accepted ? (
                    <span className="text-passed">Accepted</span>
                  ) : (
                    <span className="flex gap-1.5">
                      <span className="rounded border border-border px-2 py-0.5">Reject</span>
                      <span data-at="sv-accept" className={`rounded bg-action px-2 py-0.5 text-canvas ${t > 0.6 ? "scale-95" : ""}`}>Accept</span>
                    </span>
                  )}
                </p>
                <p className="truncate bg-failed/10 px-3 py-1 text-failed">- .filter((at) =&gt; t - at &gt; this.windowMs)</p>
                <p className="truncate bg-passed/10 px-3 py-1 text-passed">+ .filter((at) =&gt; t - at &lt; this.windowMs)</p>
              </div>
            )}
          </div>
          <div className="border-t border-white/[0.07] p-3">
            <Field at="sv-input" value={sent ? "" : typed(q, t, 0.1, 0.24)} placeholder="Ask AI for help…" focus={t > 0.08 && t < 0.27} />
            <p className="mt-2 flex items-center justify-between font-mono text-[11px] text-muted2">
              ~0 tokens <Btn at="sv-send" pressed={t > 0.255 && t < 0.28} className="!px-3 !py-1 !text-xs">Send</Btn>
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}

// Candidate report (also the integrity view, with a flagged candidate).
type ReportData = {
  back: string; kicker: string; name: string; meta: string; solved: boolean;
  stats: [string, string, string][]; timeline: [string, string][]; submit: [string, number, number]; judge: string; flagged: boolean;
};
const ANA: ReportData = {
  back: "Senior Backend · Round 1",
  kicker: "Candidate report · Senior Backend · Round 1",
  name: "Ana Kovač",
  meta: "ana.kovac@proton.me · joined 2026-10-31 13:29 UTC · consent 2026-10-31 13:29 UTC · model claude-sonnet-5-5",
  solved: true,
  stats: [["Time", "17:00", "limit 60 min"], ["AI prompts", "3", "0 iterations"], ["Tokens", "10,939", "warning at 120,000"], ["AI cost", "$0.03", "≈ at the model's list price"], ["Submits", "1", "first one passed"], ["AI efficiency", "1.82×", "0.5 - 2.0"], ["Code quality", "1.31×", "0.8 - 1.35"]],
  timeline: [["Started", "2026-10-31 13:31 UTC"], ["First prompt", "after 01:22"], ["Finished", "2026-10-31 13:48 UTC"], ["Lines", "+1 −1"]],
  submit: ["+16:55", 3, 3],
  judge: "Minimal, targeted change at the root cause.",
  flagged: false,
};
const MILA: ReportData = {
  back: "Backend · Live panel",
  kicker: "Candidate report · Backend · Live panel",
  name: "Mila Jovanović",
  meta: "mila.j@gmail.com · joined 2026-11-16 15:46 UTC · consent 2026-11-16 16:07 UTC · model claude-sonnet-5-5",
  solved: false,
  stats: [["Time", "-", "limit 60 min"], ["AI prompts", "4", "0 iterations"], ["Tokens", "16,698", "warning at 120,000"], ["AI cost", "$0.05", "≈ at the model's list price"], ["Submits", "1", "first one failed"], ["AI efficiency", "-", "0.5 - 2.0"], ["Code quality", "-", "0.8 - 1.35"]],
  timeline: [["Started", "2026-11-16 15:49 UTC"], ["First prompt", "after 01:22"], ["Finished", "-"], ["Lines", "+0 −0"]],
  submit: ["+05:06", 1, 3],
  judge: "Judged only when every check passes.",
  flagged: true,
};

function Report({ t, d }: { t: number; d: ReportData }) {
  const k = grow(t, 0.04, 0.26);
  const scroll = d.flagged ? ease(seg(t, 0.2, 0.32)) * 250 : ease(seg(t, 0.58, 0.68)) * 150;
  return (
    <Shell nav="Interviews" t={t}>
      <div style={{ transform: `translateY(-${scroll}px)` }}>
        <PageHead
          back={d.back}
          kicker={d.kicker}
          title={d.name}
          right={
            <>
              <Status tone={d.solved ? "passed" : "pending"} live={!d.solved} boxed>{d.solved ? "Solved" : "Solving"}</Status>
              <span className="text-sm text-action">Print / PDF</span>
              <Btn at="rp-replay" pressed={t > 0.93}>Replay session</Btn>
            </>
          }
        />
        <p className="-mt-4 mb-5 font-mono text-[11px] text-muted">{d.meta}</p>
        <div data-at="rp-stats" className="grid grid-cols-7 gap-2.5">
          {d.stats.map(([l, v, s], i) => (
            <Stat key={l} label={l} value={v} sub={s} k={k} at={i === 5 ? "rp-eff" : undefined} glow={!d.flagged && i >= 5 && t > 0.3 && t < 0.5} />
          ))}
        </div>
        <div className="mt-4 grid grid-cols-2 gap-4">
          <Panel title="Timeline" at="rp-timeline">
            <dl className="grid grid-cols-[110px_1fr] gap-y-1.5 text-sm">
              {d.timeline.map(([a, b]) => (
                <div key={a} className="contents">
                  <dt className="text-muted">{a}</dt>
                  <dd className="font-mono">{a === "Lines" ? <><span className="text-passed">{b.split(" ")[0]}</span> <span className="text-failed">{b.split(" ")[1]}</span></> : b}</dd>
                </div>
              ))}
            </dl>
            <p className={`${L} mt-4`}>Submits</p>
            <p className="mt-1.5 flex items-center gap-4 font-mono text-[11px] text-muted">
              {d.submit[0]}
              <span className="h-1 flex-1 rounded-full bg-white/[0.06]">
                <span className={`block h-full rounded-full ${d.submit[1] === d.submit[2] ? "bg-passed" : "bg-pending"}`} style={{ width: `${(d.submit[1] / d.submit[2]) * 100 * grow(t, 0.3, 0.45)}%` }} />
              </span>
              {d.submit[1]}/{d.submit[2]}
            </p>
          </Panel>
          <Panel title="Code quality · AI judge">
            <p className="text-sm" style={up(t, 0.35)}>{d.judge}</p>
            <p className="mt-2 text-xs text-muted">Scores are signals for your hiring decision, never the decision itself.</p>
          </Panel>
        </div>
        {d.flagged ? (
          <Panel title="Integrity signals · 1 flagged" className="mt-4" at="rp-integrity">
            <p className="text-sm text-muted">Only the built-in AI is allowed. These are signals with their context - look at them in the replay before drawing a conclusion.</p>
            <div className="mt-4 grid grid-cols-3 gap-4 font-mono text-[12px]">
              {[
                ["Pastes into the editor", "None.", null, 0.34],
                ["Time away from the window", "1× · 01:35 in total", "+05:57 · away 01:35", 0.42],
                ["Code bursts", "None.", null, 0.5],
              ].map(([h, v, s, a]) => (
                <div key={h as string} className={`rounded border p-3 transition-colors ${s && t > (a as number) ? "border-pending/60 bg-pending/10" : "border-border"}`} style={up(t, a as number)}>
                  <p className={L}>{h}</p>
                  <p className="mt-2 text-text">{v}</p>
                  {s && <p className="mt-1 text-highlight">{s}</p>}
                </div>
              ))}
            </div>
          </Panel>
        ) : (
          <Panel title="Repository tests" className="mt-4" at="rp-tests">
            <p className="flex items-center gap-2 text-sm" style={up(t, 0.6)}><Dot tone="passed" /> Their change keeps your repository&apos;s own tests passing.</p>
            <ul className="mt-3 rounded border border-border bg-canvas/60 p-3 font-mono text-[12px] text-muted">
              <li className="text-muted2">npm test</li>
              {["plain cart", "coupon totals", "region rates"].map((x, i) => (
                <li key={x} className={t > 0.64 + i * 0.04 ? "text-passed" : "text-muted2"}>{t > 0.64 + i * 0.04 ? "✓" : "·"} {x}</li>
              ))}
              <li className="text-text">{t > 0.76 ? "3 passing" : ""}</li>
            </ul>
          </Panel>
        )}
      </div>
    </Shell>
  );
}

const EVENTS: [number, string][] = [
  [0, "started"], [0.03, "opened src/cart.js"], [0.06, "code changed"], [0.09, "opened src/money.js"], [0.14, "prompt #1 · 2,831 tokens"],
  [0.33, "prompt #2 · 4,736 tokens"], [0.4, "code changed"], [0.58, "prompt #3 · 3,372 tokens"], [0.82, "code at Submit"], [0.9, "submit 3/3"], [0.95, "solved ✓"],
];
const CART = [
  "const { applyDiscount } = require(\"./discounts\");",
  "const { taxFor } = require(\"./tax\");",
  "const { round } = require(\"./money\");",
  "",
  "/** Totals for the payment page. A coupon lowers the taxable amount. */",
  "function orderTotals(cart, { region, coupon } = {}) {",
  "  const subtotal = cart.items.reduce((sum, item) => sum + lineTotal(item), 0);",
  "  const discount = coupon ? applyDiscount(subtotal, coupon) : 0;",
  "  const taxable = subtotal - discount;",
  "  const tax = taxFor(region, subtotal);",
  "  return {",
  "    subtotal: round(subtotal),",
  "    discount: round(discount),",
  "    tax: round(tax),",
  "    total: round(taxable + tax),",
  "  };",
  "}",
];
function Replay({ t }: { t: number }) {
  const pos = seg(t, 0.06, 0.96);
  const cur = EVENTS.filter(([x]) => pos >= x).length - 1;
  const fixed = pos > 0.4;
  const lines = CART.map((l, i) => (i === 9 && fixed ? "  const tax = taxFor(region, taxable);" : l));
  const chat = [
    [0.14, true, "Walk me through how orderTotals builds the total - where is tax applied?"],
    [0.2, false, "orderTotals sums the lines into subtotal, subtracts the coupon discount to get taxable, then calls taxFor(region, subtotal) - so tax is computed before the coupon."],
    [0.33, true, "So the tax ignores the discount? Fix it so tax is on the discounted amount."],
    [0.37, false, "Yes. Change the tax line to use taxable: const tax = taxFor(region, taxable);"],
  ] as const;
  return (
    <Shell nav="Interviews" t={t}>
      <PageHead
        back="Report"
        kicker="Session replay"
        title="Ana Kovač"
        right={<span data-at="rl-export" className="flex gap-1.5 font-mono text-[11px] uppercase tracking-[0.1em]">{["PDF", "CSV", "JSON"].map((x) => <span key={x} className={`rounded border px-2.5 py-1 ${t > 0.9 ? "border-action/50 text-action" : "border-border text-muted"}`}>{x}</span>)}</span>}
      />
      <div data-at="rl-controls" className="flex items-center gap-4 rounded-lg border border-border bg-surface/60 px-4 py-3 font-mono text-xs text-muted">
        ⏮ ◀
        <Btn at="rl-play" pressed={t > 0.04 && t < 0.07} className="!py-1.5">{t > 0.06 && t < 0.97 ? "Pause" : "Play"}</Btn>
        ▶ ⏭
        <span className="relative h-1 flex-1 rounded-full bg-white/[0.08]">
          <span className="absolute inset-y-0 left-0 rounded-full bg-action" style={{ width: `${pos * 100}%` }} />
          <span className="absolute top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-action" style={{ left: `${pos * 100}%` }} />
        </span>
        <span className="tabular-nums text-text">+{mmss(pos * 17 * 60)}</span>
        <span>{cur + 1}/11</span>
      </div>
      <div className="mt-4 grid h-[560px] grid-cols-[230px_1fr_330px] gap-4">
        <ul data-at="rl-events" className="space-y-1 rounded-lg border border-border bg-surface/60 p-3 font-mono text-[11.5px]">
          {EVENTS.map(([x, e], i) => (
            <li key={x} className={`flex gap-3 rounded px-2 py-0.5 ${i === cur ? "bg-action/15 text-text" : i < cur ? "text-muted" : "text-muted2"}`}>
              <span>+{mmss(x * 17 * 60)}</span>
              <span className={`truncate ${e.startsWith("prompt") ? "text-action" : e.startsWith("solved") || e.startsWith("submit") ? "text-passed" : ""}`}>{e}</span>
            </li>
          ))}
        </ul>
        <div className="min-w-0 overflow-hidden rounded-lg border border-border bg-surface/60">
          <p className="flex gap-4 border-b border-white/[0.07] px-4 py-2 font-mono text-[11.5px] text-muted">
            <span>README.md</span><span>package.json</span><span className="text-text">cart.js</span><span>discounts.js</span><span>money.js</span><span>tax.js</span>
          </p>
          <ol className="py-2 font-mono text-[12.5px] leading-[1.7]">
            {lines.map((l, i) => (
              <li key={i} className={`flex gap-4 px-3 ${i === 9 && fixed ? "bg-passed/10 text-passed" : l.trim().startsWith("/") ? "text-muted2" : "text-[#c9d1e0]"}`}>
                <span className="w-5 shrink-0 text-right text-muted2">{i + 1}</span>
                <span className="whitespace-pre">{l || " "}</span>
              </li>
            ))}
          </ol>
        </div>
        <div data-at="rl-chat" className="min-w-0 space-y-3 overflow-hidden rounded-lg border border-border bg-surface/60 p-3">
          <p className={L}>AI chat · up to here</p>
          {chat.filter(([x]) => pos > x).map(([x, me, m]) => (
            <Bubble key={x} me={me} style={up(pos, x, 0.03)}>{m}</Bubble>
          ))}
        </div>
      </div>
    </Shell>
  );
}

const PEOPLE = [
  ["Daniel Okafor", "daniel.okafor@gmail.com · 1 room · Platform Engineer (Python)", "Started", "pending", ""],
  ["Zara Ahmed", "zara.ahmed@proton.me · 1 room · Senior Backend Engineer", "Qualified", "passed", "1.58× eff · 1.24× quality"],
  ["Lena Weber", "lena.weber@mailbox.dev · 1 room · Senior Backend Engineer", "Qualified", "passed", "1.62× eff · 1.35× quality"],
  ["Ben Carter", "ben.carter@gmail.com · 1 room · Frontend Engineer", "Joined", "pending", ""],
  ["Tomás Silva", "tomas.silva@gmail.com · 1 room · Frontend Engineer", "Not solved", "failed", ""],
  ["Lucas Moreau", "lucas.moreau@gmail.com · 1 room · Frontend Engineer", "Qualified", "passed", "1.70× eff · 1.29× quality"],
  ["Felix Wagner", "felix.wagner@gmail.com · 1 room · Senior Backend Engineer", "Not solved", "failed", ""],
  ["Emma Lindqvist", "emma.lindqvist@gmail.com · 1 room · Frontend Engineer", "Qualified", "passed", "1.02× eff · 1.11× quality"],
  ["Julia Schmidt", "julia.s@posteo.de · 1 room · Senior Backend Engineer", "Qualified", "passed", "1.38× eff · 1.27× quality"],
] as const;
function Candidates({ t }: { t: number }) {
  const filtered = t > 0.2;
  const open = t > 0.15 && t < 0.2;
  const short = t > 0.5;
  const rows = PEOPLE.filter((p) => !filtered || parseFloat(p[4]) >= 1.5);
  return (
    <Shell nav="Candidates" t={t}>
      <PageHead kicker="Candidates" title="Candidates" sub="Everyone you invited to or who joined one of your interviews. Employee tests stay in Tests." />
      <div data-at="cd-stats" className="grid grid-cols-4 gap-3">
        <Stat label="People" value="25" />
        <Stat label="In progress" value="2" />
        <Stat label="Qualified" value="13" sub="solved every check" />
        <Stat label="Shortlisted" value={short ? "5" : "4"} glow={short && t < 0.75} />
      </div>
      <div data-at="cd-filters" className="relative mt-4 grid grid-cols-5 gap-3">
        <Field label="Show" value="Everyone" />
        <Field label="Role" value="Any role" />
        <Field label="Skill" value="Any skill" />
        <Field label="Event" value="Any room" />
        <div className="relative">
          <Field label="AI efficiency" at="cd-eff" value={filtered ? "1.5× and up" : "Any score"} focus={open} />
          {open && (
            <ul className="absolute inset-x-0 top-full z-10 mt-1 rounded border border-border bg-surface py-1 text-sm shadow-[0_16px_40px_rgba(0,0,0,0.5)]">
              {["Any score", "1.5× and up", "1.0× and up"].map((x) => (
                <li key={x} data-at={x === "1.5× and up" ? "cd-eff-opt" : undefined} className={`px-3 py-1.5 ${x === "1.5× and up" ? "bg-action/15 text-text" : "text-muted"}`}>{x}</li>
              ))}
            </ul>
          )}
        </div>
      </div>
      <ul data-at="cd-list" className="mt-4 divide-y divide-white/[0.06] rounded-lg border border-border bg-surface/60 px-4">
        {rows.map(([n, d, s, tone, eff]) => {
          const star = (n === "Lena Weber" && short) || n === "Lucas Moreau" || n === "Julia Schmidt";
          return (
            <li key={n} className={`grid grid-cols-[1fr_130px_200px_150px] items-center gap-4 py-2.5 ${n === "Lena Weber" && short && t < 0.75 ? "bg-action/[0.06]" : ""}`}>
              <span className="min-w-0">
                <span className="block text-sm">{star && <span className="text-pending">★ </span>}{n}</span>
                <span className="block truncate font-mono text-[11px] text-muted2">{d}</span>
              </span>
              <Status tone={tone}>{s}</Status>
              <span className="font-mono text-[11px] text-muted">{eff}</span>
              <span data-at={n === "Lena Weber" ? "cd-lena" : undefined} className="text-right text-xs text-action">{star ? "Remove from shortlist" : "Shortlist"}</span>
            </li>
          );
        })}
      </ul>
    </Shell>
  );
}

const EFF = [0, 1, 4, 3, 5, 1];
const QUAL = [1, 2, 4, 5, 2];
const PROBLEMS = [
  ["Checkout order totals", "best", "9", "77.8%", "28:17", "1.36×", "$0.06"],
  ["Invoice CSV export", "best", "4", "75%", "25:40", "1.47×", "$0.00"],
  ["Product search pagination", "best", "5", "60%", "19:00", "1.36×", "$0.00"],
  ["API rate limiter", "worst", "6", "16.7%", "14:00", "1.58×", "$0.03"],
] as const;
function Analytics({ t }: { t: number }) {
  const k = grow(t, 0.06, 0.3);
  const funnel = [["Invited", 28, ""], ["Joined", 26, "93%"], ["Started", 24, "92%"], ["Submitted", 21, "88%"], ["Solved", 14, "67%"]] as const;
  const hist = (vals: number[], labels: string[], a: number) => (
    <div className="flex h-[150px] items-end gap-2">
      {vals.map((v, i) => (
        <div key={i} className="flex flex-1 flex-col items-center gap-1">
          <span className="font-mono text-[10px] text-muted">{v || ""}</span>
          <span className="w-full rounded-t bg-action/80" style={{ height: `${(v / 5) * 110 * grow(t, a + i * 0.025, a + 0.12 + i * 0.025)}px` }} />
          <span className="font-mono text-[10px] text-muted2">{labels[i]}</span>
        </div>
      ))}
    </div>
  );
  return (
    <Shell nav="Analytics" t={t}>
      <PageHead kicker="Analytics" title="Analytics" />
      <div className="mb-4 grid grid-cols-2 gap-6">
        <Field label="Period" value="Last 30 days" />
        <Field label="Show" value="Interviews" />
      </div>
      <div data-at="an-stats" className="grid grid-cols-4 gap-3">
        <Stat label="Qualification rate" value="58.3%" sub="solved / started" k={k} />
        <Stat label="Abandoned" value="16.7%" sub="started, not solved" k={k} />
        <Stat label="AI cost / candidate" value="$0.03" sub="$0.68 in total" k={k} />
        <Stat label="AI cost / solve" value="$0.05" sub="≈ at list price" k={k} />
      </div>
      <div data-at="an-charts" className="mt-4 grid grid-cols-3 gap-4">
        <Panel title="Registration → completion">
          <ul className="space-y-2.5">
            {funnel.map(([n, v, p], i) => (
              <li key={n} className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.1em] text-muted">
                <span className="w-20">{n}</span>
                <span className="h-1.5 flex-1 rounded-full bg-white/[0.06]">
                  <span className="block h-full rounded-full bg-action" style={{ width: `${(v / 28) * 100 * grow(t, 0.3 + i * 0.03, 0.45 + i * 0.03)}%` }} />
                </span>
                <span className="w-14 text-right text-text">{count(String(v), k)} <span className="text-muted2">{p}</span></span>
              </li>
            ))}
          </ul>
        </Panel>
        <Panel title="AI efficiency of solves">{hist(EFF, ["0.5×", "0.75×", "1×", "1.25×", "1.5×", "1.75×"], 0.42)}</Panel>
        <Panel title="Code quality of solves">{hist(QUAL, ["0.8×", "0.9×", "1×", "1.1×", "1.2×"], 0.5)}</Panel>
      </div>
      <Panel title="Problems" className="mt-4" at="an-table">
        <table className="w-full text-left text-sm">
          <thead className={L}>
            <tr>{["Problem", "Started", "Solve rate", "Avg time", "Avg efficiency", "AI cost"].map((h) => <th key={h} className="pb-2 font-medium">{h}</th>)}</tr>
          </thead>
          <tbody className="font-mono text-[12px]">
            {PROBLEMS.map(([n, tag, ...r], i) => (
              <tr key={n} style={up(t, 0.66 + i * 0.03)}>
                <td className="py-1.5 font-sans text-sm">{n} <span className={`ml-1 font-mono text-[10px] uppercase ${tag === "best" ? "text-passed" : "text-failed"}`}>{tag}</span></td>
                {r.map((c, j) => <td key={j}>{c}</td>)}
              </tr>
            ))}
          </tbody>
        </table>
      </Panel>
    </Shell>
  );
}

type Runner = { n: string; e: string; pts: number; time: string; p: string };
const RANKING: Runner[] = [
  { n: "Kai Müller", e: "kai.mueller@gmail.com", pts: 750, time: "43:00", p: "✓✓✓" },
  { n: "Sara Lindgren", e: "sara.lindgren@gmail.com", pts: 350, time: "19:00", p: "✓✓·" },
  { n: "Noah Becker", e: "noah.becker@gmail.com", pts: 350, time: "21:00", p: "✓✓·" },
  { n: "Diego Ramos", e: "diego.ramos@gmail.com", pts: 350, time: "26:00", p: "✓✓·" },
  { n: "Ivan Petrov", e: "ivan.petrov@gmail.com", pts: 100, time: "06:00", p: "✓··" },
  { n: "Leon Hoffmann", e: "leon.hoffmann@gmail.com", pts: 100, time: "07:00", p: "✓··" },
];
function Contest({ t }: { t: number }) {
  const sara = t > 0.5;
  const runners = RANKING.map((r) => (r.n === "Sara Lindgren" && sara ? { ...r, pts: 750, time: "34:00", p: "✓✓✓" } : r));
  const order = [...runners].sort((a, b) => b.pts - a.pts || a.time.localeCompare(b.time));
  const feed = [
    [0.12, "KAI", "solved · API rate limiter"], [0.2, "NOAH", "submit · Checkout order totals"], [0.28, "SARA", "prompt · Checkout order totals"],
    [0.36, "DIEGO", "prompt · API rate limiter"], [0.44, "SARA", "submit 3/3 · Checkout order totals"], [0.5, "SARA", "solved · Checkout order totals ✓"],
    [0.6, "IVAN", "prompt · Product search"], [0.7, "LEON", "joined"],
  ] as const;
  return (
    <Shell nav="Events" t={t}>
      <PageHead back="Events" kicker="Contest · public" title="Northwind Code Sprint · November" right={<><span className="rounded-md border border-failed/60 px-3 py-1.5 text-xs text-failed">End now</span><Status tone="passed" live boxed>Live</Status></>} />
      <div data-at="ct-link" className="flex items-center justify-between rounded-lg border border-action/40 bg-surface/60 px-5 py-4">
        <div>
          <p className={L}>Registration link</p>
          <p className="mt-1 font-mono text-sm">https://app.bugdr.app/e/77C-CCZ</p>
          <p className="mt-1 text-xs text-muted2">Anyone with the link can register, up to 200 people.</p>
        </div>
        <Btn at="ct-copy" pressed={t > 0.09 && t < 0.12}>{t > 0.1 && t < 0.3 ? "Copied ✓" : "Copy link"}</Btn>
      </div>
      <div className="mt-4 grid grid-cols-4 gap-3">
        <Stat label="Registered" value="12" sub="of 200" />
        <Stat label="Solving now" value={sara ? "4" : "5"} />
        <Stat label="With a solve" value="9" />
        <Stat label="Ends" value="14:38 UTC" sub="2026-11-15" />
      </div>
      <div className="mt-4 grid grid-cols-[1fr_330px] gap-4">
        <Panel title="Ranking" at="ct-ranking">
          <div className="grid grid-cols-[30px_1fr_70px_70px_80px] pb-2 font-mono text-[10px] uppercase tracking-[0.12em] text-muted">
            <span>#</span><span>Participant</span><span>Points</span><span>Time</span><span>P1 P2 P3</span>
          </div>
          <ul className="relative" style={{ height: RANKING.length * 46 }}>
            {runners.map((r) => {
              const rank = order.indexOf(r);
              const moved = r.n === "Sara Lindgren" && sara;
              return (
                <li
                  key={r.n}
                  className={`absolute inset-x-0 grid h-[46px] grid-cols-[30px_1fr_70px_70px_80px] items-center rounded transition-[top,background-color] duration-700 ease-out ${moved && t < 0.75 ? "bg-passed/10" : ""}`}
                  style={{ top: rank * 46 }}
                >
                  <span className="font-mono text-sm">{rank + 1}</span>
                  <span>
                    <span className="block text-sm">{r.n}</span>
                    <span className="block font-mono text-[11px] text-muted2">{r.e}</span>
                  </span>
                  <span className={`font-mono text-sm ${moved ? "text-passed" : ""}`}>{r.pts}</span>
                  <span className="font-mono text-[12px] text-muted">{r.time}</span>
                  <span className="font-mono text-[12px] tracking-[0.6em] text-passed">{r.p}</span>
                </li>
              );
            })}
          </ul>
        </Panel>
        <Panel title="Activity" at="ct-activity">
          <ul className="space-y-1.5 font-mono text-[11px]">
            {feed.filter(([x]) => t > x).reverse().map(([x, w, m]) => (
              <li key={x} style={up(t, x, 0.02)}>
                <span className="text-muted2">{clock(13 * 3600 + 4 * 60, x, 1200)}</span> <span className="text-text">{w}</span>{" "}
                <span className={m.includes("solved") ? "text-passed" : "text-muted"}>{m}</span>
              </li>
            ))}
          </ul>
        </Panel>
      </div>
    </Shell>
  );
}

const STAFF = [
  ["Luka Novak", "luka@northwind.dev", "Solved", "passed", "14:00", "2 · 6,797", "1.79× · 1.28×", "$0.02"],
  ["Priya Shah", "priya@northwind.dev", "Solved", "passed", "19:00", "3 · 8,875", "1.41× · 1.21×", "$0.03"],
  ["Jonas Berg", "jonas@northwind.dev", "Solved", "passed", "33:00", "7 · 26,734", "0.97× · 1.06×", "$0.09"],
  ["Irena Zupan", "irena@northwind.dev", "Solved", "passed", "22:00", "3 · 8,178", "1.55× · 1.19×", "$0.03"],
  ["Tobias Klein", "tobias@northwind.dev", "Not solved", "failed", "-", "6 · 18,712", "-", "$0.06"],
] as const;
function Employees({ t }: { t: number }) {
  const k = grow(t, 0.3, 0.5);
  return (
    <Shell nav="Tests" t={t}>
      <PageHead back="Tests" kicker="Employee test · Checkout order totals" title="Q4 AI workflow check" right={<><span className="text-sm text-action">Export CSV</span><Status tone="passed" live boxed>Active</Status></>} />
      <div data-at="em-link" className="flex items-center justify-between gap-6 rounded-lg border border-action/40 bg-surface/60 px-5 py-4">
        <div>
          <p className={L}>Test link</p>
          <p className="mt-1 font-mono text-sm">https://app.bugdr.app/join/7JT-E3U</p>
          <p className="mt-1 text-xs text-muted2">Listed employees open it with their work email any time while the test is active. They see what you will see before they start.</p>
        </div>
        <span className="flex shrink-0 gap-2">
          <Btn at="em-copy" pressed={t > 0.09 && t < 0.12}>{t > 0.1 && t < 0.3 ? "Copied ✓" : "Copy link"}</Btn>
          <Btn at="em-email" ghost pressed={t > 0.19 && t < 0.22}>{t > 0.21 ? "Sent to 3 ✓" : "Email 3 employees"}</Btn>
        </span>
      </div>
      <div data-at="em-stats" className="mt-4 grid grid-cols-6 gap-3">
        <Stat label="Solved" value="4/8" sub="5 joined" k={k} />
        <Stat label="Avg time" value="22:00" sub="solves only" />
        <Stat label="Avg prompts" value="3.75" k={k} />
        <Stat label="Avg tokens" value="12,646" k={k} />
        <Stat label="Avg efficiency" value="1.43×" sub="code quality 1.19×" k={k} glow={t > 0.4 && t < 0.6} />
        <Stat label="AI cost / solve" value="$0.06" sub="≈ at list price" k={k} />
      </div>
      <Panel title="Employees" className="mt-4" at="em-table">
        <div className="grid grid-cols-[1fr_120px_80px_110px_120px_70px] pb-2 font-mono text-[10px] uppercase tracking-[0.12em] text-muted">
          <span>Employee</span><span>Status</span><span>Time</span><span>Prompts · tokens</span><span>Efficiency</span><span>AI cost</span>
        </div>
        <ul className="divide-y divide-white/[0.06]">
          {STAFF.map(([n, e, s, tone, tm, pt, ef, c], i) => (
            <li key={n} style={up(t, 0.5 + i * 0.035)} className={`grid grid-cols-[1fr_120px_80px_110px_120px_70px] items-center py-2.5 font-mono text-[12px] ${i === 0 && t > 0.8 ? "bg-passed/[0.07]" : ""}`}>
              <span><span className="block font-sans text-sm">{n}</span><span className="text-[11px] text-muted2">{e}</span></span>
              <Status tone={tone}>{s}</Status>
              <span>{tm}</span><span>{pt}</span><span>{ef}</span><span>{c}</span>
            </li>
          ))}
        </ul>
      </Panel>
    </Shell>
  );
}

const PERMS = ["See the dashboard", "See interviews", "Create + run interviews", "See employee tests", "Create + run employee tests", "Upload codebases", "See results + replays", "Export results", "Manage contests + hackathons", "Manage team, roles + audit log", "See billing"];
const ROLES: [string, string, number[]][] = [
  ["Owner", "1 member · fixed", PERMS.map((_, i) => i)],
  ["Admin", "0 members", PERMS.map((_, i) => i)],
  ["Interviewer", "3 members", [0, 1, 2, 3, 6, 7]],
  ["Viewer", "1 member", [0, 1, 3, 6]],
  ["Hiring manager", "1 member", [1, 2, 3, 6, 7]],
];
function Roles({ t }: { t: number }) {
  return (
    <Shell nav="Roles" t={t}>
      <PageHead kicker="Access control" title="Roles" right={<Btn className="!py-1.5">+ New role</Btn>} sub="A role decides what its members can see and do in the portal. The Owner role has every permission and can't be changed." />
      <div className="grid grid-cols-3 gap-4">
        {ROLES.map(([n, m, on], r) => (
          <section key={n} data-at={r === 0 ? "ro-owner" : r === 2 ? "ro-interviewer" : undefined} style={up(t, 0.03 + r * 0.03)} className={`rounded-lg border bg-surface/60 p-4 ${r === 2 && t > 0.36 && t < 0.72 ? "border-action/50" : "border-border"}`}>
            <p className="flex items-center justify-between font-semibold">{n}{r > 0 && <span className="text-xs font-normal"><span className="text-action">Edit</span> <span className="text-failed">Delete</span></span>}</p>
            <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-muted">{m}</p>
            <ul className="mt-3 space-y-1 text-[12.5px]">
              {PERMS.map((p, i) => {
                const toggled = r === 2 && i === 5 && t > 0.46;
                const has = on.includes(i) || toggled;
                return (
                  <li key={p} data-at={r === 2 && i === 5 ? "ro-toggle" : undefined} className={`flex items-center gap-2 rounded px-1 ${has ? "text-text" : "text-muted2"} ${toggled && t < 0.7 ? "bg-passed/10" : ""}`}>
                    <span className={`h-1.5 w-1.5 rounded-full ${has ? "bg-passed" : "bg-white/[0.15]"}`} />
                    {p}
                  </li>
                );
              })}
            </ul>
          </section>
        ))}
      </div>
    </Shell>
  );
}

const AUDIT: [string, string, string][] = [
  ["2026-11-15 13:22:50", "replayed the session of", "Ana Kovač (Senior Backend · Round 1)"],
  ["2026-11-15 13:22:43", "opened the report of", "Ana Kovač (Senior Backend · Round 1)"],
  ["2026-11-15 13:22:37", "watched", "Felix Wagner (Backend · Live panel)"],
  ["2026-11-15 13:20:00", "event.created", "contest: Northwind Code Sprint · October"],
  ["2026-11-15 13:20:00", "event.created", "hackathon: Payments Reliability Hackathon"],
  ["2026-11-15 13:20:00", "test.created", "Q4 AI workflow check"],
  ["2026-11-15 13:20:00", "candidate.shortlisted", "lucas.moreau@gmail.com"],
  ["2026-11-15 13:20:00", "candidate.shortlisted", "julia.s@posteo.de"],
  ["2026-11-15 13:20:00", "created the interview room", "Platform · Round 1"],
  ["2026-11-15 13:20:00", "started the interview", "Backend · Live panel"],
  ["2026-11-15 13:20:00", "created the interview room", "Frontend · Take-home"],
];
const NEW_AUDIT: [number, string, string, string][] = [
  [0.25, "2026-11-15 13:24:02", "candidate.shortlisted", "lena.weber@mailbox.dev"],
  [0.45, "2026-11-15 13:24:31", "exported the report of", "Lena Weber (Backend · Final round)"],
  [0.65, "2026-11-15 13:25:10", "changed the role", "Interviewer: + Upload codebases"],
];
function Audit({ t }: { t: number }) {
  const rows = [...NEW_AUDIT.filter(([x]) => t > x).reverse().map(([x, ...r]) => [x, ...r] as const), ...AUDIT.map((r) => [0, ...r] as const)];
  return (
    <Shell nav="Audit log" t={t}>
      <PageHead kicker="Security" title="Audit log" sub="Every change in the portal, who made it and when (UTC). Kept as long as your company's data." />
      <section data-at="au-table" className="rounded-lg border border-border bg-surface/60">
        <p className="grid grid-cols-[190px_1fr] border-b border-white/[0.07] px-4 py-2.5 font-mono text-[10px] uppercase tracking-[0.12em] text-muted"><span>Time</span><span>Event</span></p>
        <ul className="divide-y divide-white/[0.05] px-4">
          {rows.slice(0, 13).map(([x, time, what, obj], i) => (
            <li key={`${time}${obj}${what}`} style={x ? up(t, x as number, 0.03) : undefined} className={`grid grid-cols-[190px_1fr] py-2 font-mono text-[12px] ${x && i === 0 && t < (x as number) + 0.15 ? "bg-action/[0.08]" : ""}`}>
              <span className="text-muted">{time}</span>
              <span><span className="font-sans text-sm text-text">Maya Chen</span> <span className="text-muted">{what}</span> <span className="text-text">{obj}</span></span>
            </li>
          ))}
        </ul>
      </section>
    </Shell>
  );
}

// ── scenes, in the video's order ───────────────────────────────────────

type Screen = (p: { t: number }) => ReactNode;
export type Callout = {
  side: "left" | "right";
  kind?: "check" | "warn";
  title?: string;
  body?: string;
  label?: string; // mono label above chips or a stat value
  chips?: string[];
  value?: string;
};
export type Scene = {
  id?: string;
  chapter: string;
  title: string;
  body: string; // the explanation under the headline
  label: string; // what the window shows, for screen readers
  Screen: Screen;
  range: [number, number];
  region?: [x: number, y: number, w: number, h: number]; // part of the 1440×900 screen the window shows
  callouts: Callout[];
  badge?: string;
};

const GET_STARTED = "01 · Get started";
const SET_UP = "02 · Set up";
const DAY = "03 · Interview day";
const DECIDE = "04 · Decide";
const MORE = "And there's more";
const CANDIDATE_SEES = "What your candidate sees";

export const SCENES: Scene[] = [
  {
    id: "get-started",
    chapter: GET_STARTED,
    title: "Every role, every candidate, in one place.",
    body: "The overview shows what is running right now, which hiring missions are open, who is waiting for review and who made the shortlist, with alerts for anything that needs a person.",
    label: "Company overview: live interviews, active hiring missions, candidates awaiting review, the shortlist, candidates by stage and alerts.",
    Screen: ({ t }) => <Overview t={t} />,
    range: [0, 0.5],
    region: [232, 64, 1196, 790],
    callouts: [
      { side: "left", label: "Live now", value: "1", body: "interviews running" },
      { side: "left", label: "Active missions", value: "4", body: "rooms + tests open" },
      { side: "right", label: "Awaiting review", value: "5", body: "reports to read" },
      { side: "right", label: "Shortlisted", value: "4", body: "candidates" },
    ],
  },
  {
    chapter: SET_UP,
    title: "Upload your codebase.",
    body: "Upload a ZIP or connect GitHub or GitLab. Bugdr's AI finds a real bug and writes what candidates read, the hidden tests and the fix, or you write them yourself.",
    label: "Uploading a codebase as a ZIP: the AI writes the problem, and the checks run against your code.",
    Screen: Upload,
    range: [0.02, 0.4],
    region: [232, 64, 1196, 756],
    callouts: [
      { side: "left", label: "Upload from", chips: ["ZIP file", "GitHub", "GitLab"], body: "Never shown outside your company" },
      { side: "right", kind: "check", title: "AI finds a real bug", body: "and writes the fix" },
      { side: "right", kind: "check", title: "Writes the problem + hidden tests", body: "or you write them" },
    ],
  },
  {
    chapter: SET_UP,
    title: "Open a role.",
    body: "Open a role for each position you hire for. Rooms, candidates and results are grouped by role, so every hiring mission has its own pipeline.",
    label: "Interview rooms and open roles, with a new role being added.",
    Screen: Rooms,
    range: [0, 0.2],
    region: [232, 64, 1196, 795],
    callouts: [{ side: "right", kind: "check", title: "Roles you hire for", body: "Frontend · Platform · Backend" }],
  },
  {
    chapter: SET_UP,
    title: "Create a room. Invite with one link.",
    body: "Pick a codebase, a time limit and the AI models candidates may use. Run it live, with everyone starting together, or async. Bugdr emails candidates the link and the room code.",
    label: "A new interview room with its room code and join link, and three candidates invited by email.",
    Screen: RoomPage,
    range: [0.6, 0.98],
    region: [232, 64, 1196, 650],
    callouts: [
      { side: "left", label: "Room code", value: "WRS-TGH", body: "One link for every candidate" },
      { side: "right", kind: "check", title: "No candidate account", body: "a name and an email" },
      { side: "right", kind: "check", title: "Claude or OpenAI", body: "Only the models you allow" },
    ],
  },
  {
    id: "interview-day",
    chapter: DAY,
    title: "Candidates join with the room code.",
    body: "No account to create. Candidates enter their name and email, read exactly what your team will see, agree, and wait in the lobby until you start.",
    label: "The join page a candidate sees: the company, the room, their name and email.",
    Screen: JoinDetails,
    range: [0.3, 0.52],
    region: [410, 150, 620, 640],
    badge: CANDIDATE_SEES,
    callouts: [
      { side: "left", kind: "check", title: "No account needed", body: "just the room code" },
      { side: "right", kind: "check", title: "They read what your team sees", body: "then agree and start" },
    ],
  },
  {
    chapter: DAY,
    title: "Start the room. One screen for the whole interview.",
    body: "Every candidate is a live tile with their time, prompts, tokens and checks. Every prompt, submit and solve lands in the activity stream. Extend time, announce to everyone or end the room.",
    label: "Live interview command center: candidate tiles with time, prompts, tokens and checks, an announcement bar, and the activity stream.",
    Screen: CommandCenter,
    range: [0.13, 0.9],
    region: [232, 64, 1196, 770],
    callouts: [
      { side: "right", label: "You control", chips: ["Watch", "Extend", "Announce", "End"], body: "for one candidate or the room" },
      { side: "left", kind: "check", title: "Every prompt, submit and solve", body: "live in the activity stream" },
    ],
  },
  {
    chapter: DAY,
    title: "They fix a real bug, with AI.",
    body: "A browser editor with your files, a terminal and a built-in AI assistant running the Claude or OpenAI models you allow. Tests visible to candidates are optional; the acceptance checks stay hidden.",
    label: "The candidate's solve screen: the assignment, the code editor and terminal, and the built-in AI assistant proposing an edit.",
    Screen: Solve,
    range: [0, 0.75],
    badge: CANDIDATE_SEES,
    callouts: [
      { side: "left", label: "In the browser", chips: ["Files", "Terminal", "AI assistant"], body: "nothing to install" },
      { side: "left", kind: "check", title: "Your bug, your codebase", body: "not a puzzle from a list" },
      { side: "right", kind: "check", title: "Every prompt recorded", body: "and every edit they accept" },
    ],
  },
  {
    chapter: DAY,
    title: "Watch any candidate live. Read-only.",
    body: "Open anyone's code and AI chat while they work. They are never interrupted, and you see exactly how they use the AI: what they ask, what they accept and what they check.",
    label: "Watching one candidate read-only: their files, current code and AI chat.",
    Screen: Watch,
    range: [0, 0.82],
    region: [232, 64, 1196, 790],
    callouts: [
      { side: "left", label: "You see", chips: ["Code", "AI chat", "Tests"], body: "as they work" },
      { side: "left", kind: "check", title: "No interruptions", body: "Read-only" },
    ],
  },
  {
    chapter: DAY,
    title: "Integrity signals, without guesswork.",
    body: "Only the built-in AI counts, and candidates agree to this before they start. Outside pastes, time away from the tab and sudden code jumps are flagged with their context for a person to review.",
    label: "A candidate report with an integrity signal: time away from the interview tab, shown with its context.",
    Screen: ({ t }) => <Report t={t} d={MILA} />,
    range: [0, 0.6],
    region: [232, 56, 1196, 490],
    callouts: [
      { side: "right", kind: "warn", title: "Outside paste", body: "pasted from outside the built-in AI" },
      { side: "right", kind: "warn", title: "Time away", body: "away from the interview tab" },
      { side: "right", kind: "warn", title: "Code jumps", body: "big changes with no prompt before" },
      { side: "left", kind: "check", title: "A person reviews", body: "never penalised automatically" },
    ],
  },
  {
    id: "decide",
    chapter: DECIDE,
    title: "Evidence for the decision, not the decision.",
    body: "Each report has time, prompts, tokens, AI cost and submits, an AI efficiency and a code quality score, and whether the fix keeps your repository's own tests passing. Scores are signals; your reviewers decide.",
    label: "Candidate report: time, prompts, tokens, AI cost and submits, AI efficiency 1.82× and code quality 1.31×, the timeline, the AI judge's note and repository tests.",
    Screen: ({ t }) => <Report t={t} d={ANA} />,
    range: [0, 0.5],
    region: [232, 64, 1196, 730],
    callouts: [
      { side: "left", label: "AI efficiency", value: "1.82×", body: "scale 0.5 - 2.0" },
      { side: "left", label: "Code quality", value: "1.31×", body: "scale 0.8 - 1.35" },
      { side: "right", kind: "check", title: "Repository tests", body: "Their change keeps your own tests passing" },
    ],
  },
  {
    chapter: DECIDE,
    title: "Replay every session, step by step.",
    body: "Play any session back: the timeline steps forward while the code, the open files and the AI chat change to match each moment. Export reports as PDF, CSV or JSON.",
    label: "Session replay: the timeline of events, the code at that moment and the AI chat up to there.",
    Screen: Replay,
    range: [0, 0.62],
    region: [232, 64, 1196, 780],
    callouts: [
      { side: "right", kind: "check", title: "Step-by-step replay", body: "code, files and chat in sync" },
      { side: "right", label: "Export", chips: ["PDF", "CSV", "JSON"], body: "any report, any time" },
    ],
  },
  {
    chapter: DECIDE,
    title: "End the room. Build your shortlist.",
    body: "Filter candidates by role, skill, room and AI efficiency, and shortlist the ones you want to move forward. Everyone stays in one list across all your interviews.",
    label: "Candidates list filtered by AI efficiency, with Lena Weber added to the shortlist.",
    Screen: Candidates,
    range: [0.1, 0.62],
    region: [232, 64, 1196, 530],
    callouts: [
      { side: "left", label: "Filter by", chips: ["Role", "Skill", "Event", "AI efficiency"], body: "across every interview" },
      { side: "right", kind: "check", title: "Lena Weber shortlisted", body: "1.62× efficiency · 1.35× quality" },
    ],
  },
  {
    id: "more",
    chapter: MORE,
    title: "Analytics across every role.",
    body: "See your qualification rate, where candidates drop off, AI cost per candidate and per solve, score distributions, and which problems give you the clearest signal.",
    label: "Analytics: qualification rate, abandon rate, AI cost per candidate and per solve, the funnel, score distributions and the best and worst problems.",
    Screen: Analytics,
    range: [0, 0.82],
    region: [232, 64, 1196, 790],
    callouts: [
      { side: "left", label: "Qualification rate", value: "58.3%", body: "last 30 days" },
      { side: "right", label: "AI cost / solve", value: "$0.05", body: "at list price" },
    ],
  },
  {
    chapter: MORE,
    title: "Hiring contests on your own code.",
    body: "Run a public, private or invite-only contest or hackathon on your codebases. A live ranking with points per problem, ties broken by time, and a full report for every participant.",
    label: "A live contest: the registration link, and the ranking with points and times, updated as participants solve.",
    Screen: Contest,
    range: [0.2, 0.78],
    region: [232, 64, 1196, 746],
    callouts: [
      { side: "left", label: "Access", chips: ["Public", "Private", "Invite-only"], body: "one registration link" },
      { side: "right", kind: "check", title: "Live ranking", body: "Points per problem, ties broken by time" },
    ],
  },
  {
    chapter: MORE,
    title: "Run the same test for your own engineers.",
    body: "Share a test link with your team. Every engineer gets the same report and replay as a candidate, so you see who already works well with AI and where people need support.",
    label: "Employee test: the test link, team averages for time, prompts, tokens and efficiency, and a row for each engineer.",
    Screen: Employees,
    range: [0.25, 0.85],
    region: [232, 64, 1196, 780],
    callouts: [
      { side: "right", label: "Avg efficiency", value: "1.43×", body: "4 of 8 solved" },
      { side: "left", label: "Team averages", chips: ["Time", "Prompts", "Tokens", "AI cost"], body: "compare across the team" },
    ],
  },
  {
    id: "your-data",
    chapter: MORE,
    title: "Roles for your whole team.",
    body: "Decide who can run interviews, see replays, export results or manage the team. Owner, Admin, Interviewer, Viewer and Hiring manager come built in, and you can add your own.",
    label: "Roles and permissions: Owner, Admin, Interviewer, Viewer and Hiring manager, each with its own allowed actions.",
    Screen: Roles,
    range: [0, 0.6],
    region: [232, 64, 1196, 500],
    callouts: [
      { side: "left", label: "Roles", chips: ["Owner", "Admin", "Interviewer", "Viewer", "Hiring manager"], body: "or create your own" },
      { side: "right", kind: "check", title: "Fine-grained permissions", body: "Who runs interviews, sees replays or exports" },
    ],
  },
  {
    chapter: MORE,
    title: "Your data, your rules.",
    body: "Every action in the portal is in the audit log. You set how long candidate data is kept, delete one candidate's data or all of it on request, and export everything as JSON or CSV.",
    label: "The audit log: every action in the portal with a UTC timestamp.",
    Screen: Audit,
    range: [0, 0.8],
    region: [232, 64, 1196, 675],
    callouts: [
      { side: "left", kind: "check", title: "Full audit log", body: "Who did what, and when (UTC)" },
      { side: "right", label: "Your data", chips: ["Retention", "Deletion", "Export"], body: "you set the rules" },
    ],
  },
];
