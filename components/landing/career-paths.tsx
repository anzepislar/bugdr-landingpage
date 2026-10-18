import { DIFFICULTY_COLOR, type Difficulty, Screenshot, Section } from "@/components/landing/section";

const stages: Difficulty[] = ["Easy", "Medium", "Hard", "Get a job"];

const cases = [
  "A prompt that exceeds the context window.",
  "An API response the client can't parse.",
  "A vector search returning duplicate results.",
];

export function CareerPaths() {
  return (
    <Section
      id="career-paths"
      label="Career paths"
      heading="Pick the work. Practice your way toward it."
      intro={
        <p>
          Choose a target role and follow a structured path through relevant
          cases. Start with focused bugs, then take on failures that require a
          deeper investigation.
        </p>
      }
    >
      <div className="glass mt-12 rounded-card p-6 md:p-8">
        <ol className="flex flex-wrap items-center gap-2 text-sm" aria-label="Difficulty progression">
          {stages.map((d, i) => (
            <li key={d} className="flex items-center gap-2">
              <span
                className="rounded-full border px-3 py-1 font-medium"
                style={{ color: DIFFICULTY_COLOR[d], borderColor: `${DIFFICULTY_COLOR[d]}55` }}
              >
                {d}
              </span>
              {i < stages.length - 1 && <span aria-hidden className="text-muted2">→</span>}
            </li>
          ))}
        </ol>
        <p className="mt-3 text-xs italic text-muted2">
          &ldquo;Get a job&rdquo; is a stage label, not an employment guarantee.
        </p>

        <div className="mt-8 grid gap-6 rounded-xl border border-white/[0.07] bg-surface2/60 p-5 md:grid-cols-2 md:p-6">
          <div>
            <p className="font-mono text-xs text-action">Stage 01</p>
            <h3 className="mt-2 font-display text-xl font-bold text-text">Find your footing</h3>
            <p className="mt-3 text-sm font-medium text-text/90">Small bugs. Better instincts.</p>
            <p className="mt-2 text-sm leading-relaxed text-muted">
              Trace the failure. Make a focused change. Check the result. Pass
              the acceptance checks and meet the path&apos;s efficiency
              benchmark to move forward.
            </p>
          </div>
          <div>
            <p className="label">Illustrative cases</p>
            <ul className="mt-3 space-y-2.5">
              {cases.map((c) => (
                <li key={c} className="flex gap-3 text-sm text-muted">
                  <span aria-hidden className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: DIFFICULTY_COLOR.Easy }} />
                  {c}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <Screenshot
        name="career-path"
        alt="The Backend Engineer career path: Easy unlocked, Medium in progress with efficiency targets met, Hard and Get a job locked, and the next problem to start."
      />
    </Section>
  );
}
