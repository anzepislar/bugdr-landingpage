import type { Metadata } from "next";
import type { ReactNode } from "react";
import { assetPath } from "@/lib/asset-path";
import { SITE_URL } from "@/lib/site";
import shotsJson from "./shots.json";
import { Dot, LoopVideo, Monitor, ScrollSteps } from "./client";
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

// ── building blocks ──────────────────────────────────────────────────────
//
// Layout system: every section is a SectionHead plus one of
//   showcase  full-width Monitor (views as tabs), Points row underneath
//   split     Points left (5/12), Monitor right (7/12)
//   steps     ScrollSteps, same 5/7 split with a sticky Monitor
// Every Monitor view is a 16:10 product shot or recording.

type Rect = number[];
const shots: Record<string, { src?: string; m?: Rect; crop?: Rect }> = shotsJson;
type ShotName = keyof typeof shotsJson;
const b = (f: string) => assetPath(`/b2b/${f}`);
const dims = ([, , w, h]: Rect) => {
  const width = Math.min(w, 1200);
  return { width, height: Math.round((h * width) / w) };
};

// Full view with srcset; under 640px swaps to the panel crop so a dashboard
// never shrinks below legible. `crop` shots are the crop at every width.
function Shot({ name, alt, sizes = "(min-width: 1280px) 1200px, 100vw" }: { name: ShotName; alt: string; sizes?: string }) {
  const s = shots[name];
  const img = { alt, loading: "lazy" as const, decoding: "async" as const, className: "block h-auto w-full" };
  if (s.crop) {
    // eslint-disable-next-line @next/next/no-img-element -- static export
    return <img src={b(`${name}.webp`)} {...dims(s.crop)} {...img} />;
  }
  return (
    <picture>
      {s.m && <source media="(max-width: 639px)" srcSet={b(`${name}-m.webp`)} {...dims(s.m)} />}
      {/* eslint-disable-next-line @next/next/no-img-element -- static export */}
      <img
        src={b(`${name}-1440.webp`)}
        srcSet={[720, 1440, 2160].map((w) => `${b(`${name}-${w}.webp`)} ${w}w`).join(", ")}
        sizes={sizes}
        width={1440}
        height={900}
        {...img}
      />
    </picture>
  );
}

const SPLIT = "(min-width: 1024px) 680px, 100vw";

function Section({ id, label, title, intro, children }: {
  id?: string;
  label: string;
  title: string;
  intro?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section id={id} className="border-t border-white/[0.06] py-24 md:py-32">
      <div className="mx-auto max-w-[1200px] px-4 sm:px-6">
        <header className="t-reveal grid gap-6 lg:grid-cols-12 lg:gap-14">
          <div className="lg:col-span-7">
            <p className="t-label">{label}</p>
            <h2 className="mt-4 text-3xl font-semibold tracking-[-0.025em] text-text md:text-[2.75rem] md:leading-[1.1]">{title}</h2>
          </div>
          {intro && <p className="text-lg leading-relaxed text-muted lg:col-span-5 lg:self-end">{intro}</p>}
        </header>
        <div className="mt-12 md:mt-16">{children}</div>
      </div>
    </section>
  );
}

// Feature points: columns separated by a hairline on top, no boxes.
type Point = [key: string, text: ReactNode, dot?: string];
function Points({ items, cols = "sm:grid-cols-2 lg:grid-cols-3" }: { items: Point[]; cols?: string }) {
  return (
    <dl className={`grid gap-x-10 gap-y-8 ${cols}`}>
      {items.map(([k, v, dot]) => (
        <div key={k} className="border-t border-white/[0.09] pt-5">
          <dt className={`t-label flex items-center gap-2 ${dot ?? "!text-action"}`}>
            {dot && <span aria-hidden className="t-dot" />}
            {k}
          </dt>
          <dd className="mt-3 max-w-[42ch] text-[15px] leading-relaxed text-muted">{v}</dd>
        </div>
      ))}
    </dl>
  );
}

function Split({ points, children }: { points: ReactNode; children: ReactNode }) {
  return (
    <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-14">
      <div className="lg:col-span-5">{points}</div>
      <div className="lg:col-span-7">{children}</div>
    </div>
  );
}

function Tile({ value, label, sub }: { value: string; label: string; sub: string }) {
  return (
    <div className="rounded-card border border-white/[0.09] bg-surface p-5">
      <p className="t-label">{label}</p>
      <p className="mt-3 font-mono text-2xl font-medium tabular-nums text-text md:text-3xl">{value}</p>
      <p className="t-dim mt-2 font-mono text-xs">{sub}</p>
    </div>
  );
}

function DemoButton({ className = "" }: { className?: string }) {
  return (
    <a href={DEMO} className={`btn-action whitespace-nowrap ${className}`}>
      Book a demo
    </a>
  );
}

// ── sections ─────────────────────────────────────────────────────────────

function Nav() {
  const links = [
    ["#live", "Product"],
    ["#how", "How it works"],
    ["#security", "Security"],
  ];
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/[0.07] bg-canvas/80 backdrop-blur-xl">
      <div className="flex h-16 items-center justify-between gap-4 px-4 sm:px-6">
        <a href="#top" aria-label="Bugdr for Teams, back to top" className="flex shrink-0 items-center gap-3">
          {/* eslint-disable-next-line @next/next/no-img-element -- static export */}
          <img src={assetPath("/logos/primary-lockup.png")} alt="Bugdr" width={106} height={28} className="h-7 w-auto" />
          <span className="t-label hidden rounded-lg border border-white/[0.12] px-2 py-1 sm:inline">For Teams</span>
        </a>
        <nav aria-label="Primary" className="flex items-center gap-5 lg:gap-7">
          {links.map(([href, label]) => (
            <a key={href} href={href} className="hidden text-sm text-muted transition-colors hover:text-text lg:inline">
              {label}
            </a>
          ))}
          <a href={SIGN_IN} className="hidden text-sm text-muted transition-colors hover:text-text sm:inline">
            Sign in
          </a>
          <DemoButton className="!px-4 !py-2" />
        </nav>
      </div>
    </header>
  );
}

function Hero() {
  const chips = ["Every prompt recorded", "Live or async", "Your own codebase", "No candidate account"];
  return (
    <section className="relative overflow-hidden pb-24 pt-32 md:pb-32 md:pt-40">
      <div aria-hidden className="t-grid pointer-events-none absolute inset-0" />
      <div className="relative mx-auto max-w-[1200px] px-4 sm:px-6">
        <div className="mx-auto max-w-3xl text-center">
          <p className="t-label inline-flex items-center gap-3">
            <span className="t-dot t-pulse text-passed" aria-hidden />
            Bugdr for Teams
          </p>
          <h1 className="mt-6 text-[2.5rem] font-semibold leading-[1.05] tracking-[-0.035em] text-text sm:text-6xl md:text-7xl">
            See how engineers really work with AI.
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-muted md:text-xl">
            Candidates fix a real bug from your codebase with a built-in AI assistant. You watch every prompt, edit and
            test run, live or on replay, with scores you can compare.
          </p>
          <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <DemoButton className="w-full sm:w-auto" />
            <a
              href="#live"
              className="inline-flex w-full items-center justify-center gap-2 rounded-btn border border-white/[0.12] px-5 py-3 text-sm font-semibold text-text transition-colors hover:border-action/60 sm:w-auto"
            >
              See it live
            </a>
          </div>
          <ul className="mt-10 flex flex-wrap justify-center gap-2">
            {chips.map((c) => (
              <li key={c} className="t-label rounded-lg border border-white/[0.09] bg-white/[0.03] px-3 py-1.5">
                {c}
              </li>
            ))}
          </ul>
        </div>
        <Monitor
          glow
          className="mt-14 md:mt-20"
          views={[{
            label: "Live interview",
            status: "live",
            content: (
              <LoopVideo
                name="rec-live-command-center"
                poster="03-live-command-center"
                eager
                label="Live interview command center: six candidate tiles with time, prompts, tokens and checks updating while an activity stream logs each prompt and submit."
              />
            ),
          }]}
        />
        <p className="t-dim mt-4 text-center font-mono text-xs">Product views use a fictional demo company. All names are made up.</p>
      </div>
    </section>
  );
}

function Problem() {
  const red = "!text-failed";
  return (
    <Section
      label="The problem"
      title="Classic interviews stopped measuring the job."
      intro="Every engineer now codes with AI. The usual formats either ignore that or hide it from you."
    >
      <Points
        items={[
          ["LeetCode", "An AI writes the answer in seconds. A correct solution now proves a chat window was open, not that the person can do the job.", red],
          ["Take-home", "Done with an AI you never see. You get the final code, but not what they asked, what they accepted or what they checked.", red],
          ["Whiteboard", "Tests recall under pressure. The job is reading unfamiliar code, finding the cause and shipping a safe fix with the tools engineers use every day.", red],
        ]}
      />
      <p className="mt-16 max-w-3xl text-2xl leading-snug tracking-[-0.015em] text-text md:text-3xl">
        Bugdr tests the job itself: a real bug, in your code, with AI in the room and on the record.
      </p>
    </Section>
  );
}

function HowItWorks() {
  return (
    <Section id="how" label="How it works" title="From your repository to a scored interview.">
      <ScrollSteps
        steps={[
          {
            title: "Upload your codebase",
            body: "Upload a ZIP or connect GitHub or GitLab. Bugdr's AI finds a bug and writes the problem and hidden tests, or you write them yourself. A codebase only goes live once every check fails on the buggy code and passes with the fix.",
            label: "Codebases",
            status: "ready",
            shot: <Shot name="09-codebases" sizes={SPLIT} alt="Codebases page: upload a repository as a ZIP or from GitHub or GitLab, choose whether the AI or you write the problem, and track checks as ready, checking or failed." />,
          },
          {
            title: "Invite candidates with a link",
            body: "Send one link. Candidates enter their name and email, read exactly what your team will see, agree, and start. No account to create.",
            label: "Candidate join page",
            shot: <Shot name="20-candidate-join-page" sizes={SPLIT} alt="Interview join page as a candidate sees it: room details, time limit, name and email fields, and a consent notice explaining what the company will see." />,
          },
          {
            title: "They fix the bug with AI",
            body: "A browser editor with your files, a terminal and a built-in AI assistant running the Claude or OpenAI models you allow. Tests visible to candidates are optional; the acceptance checks stay hidden.",
            label: "Candidate solve screen",
            status: "live",
            shot: <Shot name="21-candidate-solve-screen" sizes={SPLIT} alt="Candidate solve screen: assignment and incident log on the left, code editor and terminal in the middle, built-in AI assistant with prompts and an accepted code edit on the right." />,
          },
          {
            title: "You watch, then review",
            body: "Follow everyone live or let them work asynchronously. Every session ends with a report you can compare and a full replay.",
            label: "Candidate report",
            shot: <Shot name="05-candidate-report" sizes={SPLIT} alt="Candidate report: time, AI prompts, tokens, AI cost, submits, AI efficiency and code quality tiles, a timeline, the AI judge's note and repository test results." />,
          },
        ]}
      />
    </Section>
  );
}

function LiveControl() {
  return (
    <Section
      id="live"
      label="Live event control"
      title="One screen for the whole interview."
      intro="Every candidate is a live tile. Every prompt, submit and solve lands in the activity stream as it happens."
    >
      <Monitor
        glow
        views={[
          {
            label: "Command center",
            status: "live",
            content: (
              <LoopVideo
                name="rec-live-command-center"
                poster="03-live-command-center"
                label="Recording of a live interview: candidate tiles update as people prompt the AI and submit, one candidate solves, and the interviewer sends an announcement to everyone."
              />
            ),
          },
          {
            label: "Watch a candidate",
            status: "live",
            content: <Shot name="04-watch-candidate" alt="Watching one candidate read-only: their open files, current code and the AI chat with each prompt and its token count." />,
          },
        ]}
      />
      <div className="mt-14">
        <Points
          items={[
            ["Candidate tiles", "Time, prompts, tokens and checks for each candidate, updated live."],
            ["Activity stream", "Every prompt, submit and solve, timestamped in UTC."],
            ["Watch", "Open anyone's code and AI chat, read-only, without interrupting them."],
            ["Extend", "Add time for one candidate or for the whole room."],
            ["Announce", "Send a message every candidate sees at the top of their screen."],
            ["End", "Close the session for everyone at once."],
          ]}
        />
      </div>
    </Section>
  );
}

function Reports() {
  return (
    <Section
      id="reports"
      label="Candidate reports + replay"
      title="Evidence for the decision, not the decision."
      intro="Time, prompts, tokens, AI cost and submits. Whether they checked the AI's edits. Whether their change breaks your repository's own tests. And the whole session, step by step."
    >
      <Monitor
        views={[
          {
            label: "Report",
            content: <Shot name="05-candidate-report" alt="Candidate report with stat tiles for time, prompts, tokens, AI cost, submits, AI efficiency 1.82× and code quality 1.31×, a timeline, the AI judge's assessment and passing repository tests." />,
          },
          {
            label: "Replay",
            status: "replay",
            content: (
              <LoopVideo
                name="rec-session-replay"
                poster="06-session-replay"
                label="Recording of a session replay: the timeline steps forward while the code, opened files and AI chat change to match each moment."
              />
            ),
          },
        ]}
      />
      <div className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Tile label="AI efficiency" value="0.5–2.0×" sub="how well the AI was used" />
        <Tile label="Code quality" value="0.8–1.35×" sub="scored by an AI judge" />
        <Tile label="Repository tests" value="your suite" sub="run on their change" />
        <Tile label="Export" value="PDF · CSV" sub="and JSON, any time" />
      </div>
      <p className="mt-14 max-w-3xl border-l-2 border-highlight pl-5 text-lg leading-relaxed text-text">
        Scores are signals for your hiring decision, never the decision itself. Your reviewers see the full session behind
        every number.
      </p>
    </Section>
  );
}

function Integrity() {
  const amber = "!text-pending";
  return (
    <Section
      id="integrity"
      label="Integrity"
      title="Integrity signals, without guesswork."
      intro="Only the built-in AI counts, and candidates agree to this before they start. Signals go to a person for review. Bugdr never penalises anyone automatically."
    >
      <Split
        points={
          <Points
            cols=""
            items={[
              ["Outside paste", "Text pasted in from outside the built-in AI.", amber],
              ["Time away", "Time spent away from the interview tab.", amber],
              ["Code jumps", "Large code changes with no prompt or paste before them.", amber],
            ]}
          />
        }
      >
        <Monitor
          views={[{
            label: "Overview alerts",
            status: "signal",
            content: <Shot name="01-alerts" alt="Overview alerts panel: an upcoming live interview and three candidates, each with one integrity signal flagged for review." />,
          }]}
        />
      </Split>
    </Section>
  );
}

function Pipeline() {
  return (
    <Section
      id="pipeline"
      label="Pipeline + analytics"
      title="Every open role and every candidate, in one place."
      intro="See where each hiring mission stands, who is waiting for review, and which problems give you the clearest signal."
    >
      <Monitor
        views={[
          {
            label: "Overview",
            content: <Shot name="01-overview" alt="Company overview: live interviews, active hiring missions, candidates awaiting review, shortlist count, candidates by stage from invited to shortlisted, and alerts." />,
          },
          {
            label: "Candidates",
            content: <Shot name="07-candidates" alt="Candidates list with search and filters for role, skill, event and AI efficiency, showing each person's stage and a shortlist action." />,
          },
          {
            label: "Analytics",
            content: <Shot name="08-analytics" alt="Analytics: qualification rate, abandon rate, AI cost per candidate and per solve, a registration-to-completion funnel, efficiency and quality distributions, and a per-problem table." />,
          },
        ]}
      />
      <div className="mt-14">
        <Points
          items={[
            ["Hiring missions", "Active interviews and tests, candidates by stage, and who is awaiting review."],
            ["Candidates", "Filter by role, skill, event and score, and build a shortlist."],
            ["Analytics", "Qualification rate, AI cost per candidate and per solve, score distributions, and the best and worst problems."],
          ]}
        />
      </div>
    </Section>
  );
}

function Contests() {
  return (
    <Section
      id="contests"
      label="Contests + hackathons"
      title="Hiring contests on your own code."
      intro="Run a branded coding contest or hackathon on your codebases. A hiring funnel and employer branding in one."
    >
      <Monitor
        views={[
          {
            label: "Live ranking",
            status: "live",
            content: (
              <LoopVideo
                name="rec-contest-live-ranking"
                poster="12-event-live-ranking"
                label="Recording of a contest in progress: the ranking updates with points and times as participants solve, and a participant moves into first place."
              />
            ),
          },
          {
            label: "Events",
            content: <Shot name="11-events" alt="Contests and hackathons list with status, participant counts and start times for upcoming, live and ended events." />,
          },
          {
            label: "Registration",
            content: <Shot name="18-public-contest-page" alt="Public contest registration page as a participant sees it: event description, start and end times, ranking rules, name and email fields, and a data notice." />,
          },
        ]}
      />
      <div className="mt-14">
        <Points
          items={[
            ["Access", "Public, private or invite-only, with one registration link."],
            ["Live ranking", "Points per problem, ties broken by time, updated as people solve."],
            ["Reports", "A full report for every participant, the same as an interview."],
          ]}
        />
      </div>
    </Section>
  );
}

function Upskill() {
  return (
    <Section
      id="upskill"
      label="Upskill your team"
      title="Run the same test for your own engineers."
      intro="Find out who on your team already works well with AI, and where people need support."
    >
      <Split
        points={
          <Points
            cols=""
            items={[
              ["One link", "Share a test link with your engineers. They join with their work email."],
              ["Same evidence", "Every engineer gets the same report and replay as a candidate."],
              ["Team averages", "Compare time, prompts, tokens, efficiency and AI cost across the team."],
            ]}
          />
        }
      >
        <Monitor
          views={[{
            label: "Employee test",
            content: <Shot name="13-employee-test" sizes={SPLIT} alt="Employee test results: a shareable test link, team averages for solved, time, prompts, tokens, efficiency and AI cost, and a row for each engineer." />,
          }]}
        />
      </Split>
    </Section>
  );
}

function Security() {
  return (
    <Section
      id="security"
      label="Control + security"
      title="Your code, your data, your rules."
      intro="Decide who sees what, keep a record of every action, and take your data with you whenever you want."
    >
      <Monitor
        views={[
          { label: "Roles", content: <Shot name="15-roles" alt="Roles and permissions: Owner, Admin, Interviewer, Viewer and Hiring manager roles, each with its own list of allowed actions." /> },
          { label: "Audit log", content: <Shot name="17-audit-log" alt="Audit log listing each action in the portal with a UTC timestamp, such as opening a report, replaying a session or shortlisting a candidate." /> },
          { label: "Team", content: <Shot name="14-team" alt="Team members with their role, status and last sign-in, plus seat usage and an invite button." /> },
          { label: "Company", content: <Shot name="16-company" alt="Company profile settings: name, description, website and logo shown to candidates, and the GitHub or GitLab connection." /> },
        ]}
      />
      <div className="mt-14">
        <Points
          cols="sm:grid-cols-2 lg:grid-cols-4"
          items={[
            ["Roles", "Fine-grained permissions: who can run interviews, see replays, export results or manage the team."],
            ["Audit log", "A full record of who viewed, replayed, exported or changed what, and when."],
            ["Private code", "Your codebase is never public and is only used for your company."],
            ["Retention", "You set how long candidate data is kept."],
            ["Deletion", "Delete one candidate's data on request, or all of your data."],
            ["Export", "Export everything as JSON or CSV."],
            ["AI models", "Choose which Claude and OpenAI models candidates can use."],
            ["Token warning", "A per-candidate token warning keeps AI cost visible."],
          ]}
        />
      </div>
    </Section>
  );
}

function FinalCta() {
  return (
    <section className="border-t border-white/[0.06] py-24 md:py-32">
      <div className="mx-auto max-w-[1200px] px-4 sm:px-6">
        <div className="relative overflow-hidden rounded-modal border border-action/30 bg-surface shadow-[0_0_40px_rgba(139,172,255,0.15)]">
          <div aria-hidden className="t-grid pointer-events-none absolute inset-0" />
          <div className="relative flex h-12 items-center justify-between border-b border-white/[0.09] px-4">
            <span className="t-label">Next interview</span>
            <Dot kind="ready" />
          </div>
          <div className="relative px-6 py-14 text-center md:py-20">
            <h2 className="mx-auto max-w-2xl text-3xl font-semibold tracking-[-0.03em] text-text md:text-5xl">
              Run your next interview on Bugdr.
            </h2>
            <p className="mx-auto mt-5 max-w-xl text-lg text-muted">
              Book a demo and we will walk you through a live interview, a report and a replay.
            </p>
            <div className="mt-9 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <DemoButton className="w-full sm:w-auto" />
              <a href="mailto:hello@mail.bugdr.app" className="font-mono text-sm text-action hover:underline">
                hello@mail.bugdr.app
              </a>
            </div>
          </div>
        </div>
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
        <Hero />
        <Problem />
        <HowItWorks />
        <LiveControl />
        <Reports />
        <Integrity />
        <Pipeline />
        <Contests />
        <Upskill />
        <Security />
        <FinalCta />
      </main>
      <Footer />
    </>
  );
}
