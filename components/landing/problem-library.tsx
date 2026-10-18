import { DIFFICULTY_COLOR, type Difficulty, Paras, Screenshot, Section } from "@/components/landing/section";

const problems: { title: string; tags: string[]; difficulty: Difficulty }[] = [
  { title: "Duplicate charge on checkout", tags: ["Backend", "Payments"], difficulty: "Hard" },
  { title: "Slow dashboard query", tags: ["Backend", "Database"], difficulty: "Medium" },
  { title: "Failed deployment rollback", tags: ["DevOps"], difficulty: "Hard" },
  { title: "Race condition in job queue", tags: ["Backend", "Async"], difficulty: "Hard" },
  { title: "Broken OAuth redirect", tags: ["Full-stack", "Auth"], difficulty: "Medium" },
  { title: "Memory leak in image pipeline", tags: ["Backend", "Performance"], difficulty: "Hard" },
];

export function ProblemLibrary() {
  return (
    <Section
      id="library"
      label="Problem library"
      heading="Something's broken. Pick your case."
      intro={
        <Paras>
          {[
            "Duplicate charges. Slow queries. Failed deployments.",
            "Browse by role, topic, and difficulty. Every case gives you a brief and acceptance checks, so you know what the fix needs to achieve.",
          ]}
        </Paras>
      }
    >
      <ul className="mt-12 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {problems.map((p) => {
          const color = DIFFICULTY_COLOR[p.difficulty];
          return (
            <li key={p.title} className="card flex flex-col gap-3 p-5">
              <div className="flex items-start justify-between gap-3">
                <h3 className="text-[15px] font-medium text-text">{p.title}</h3>
                <span
                  className="shrink-0 rounded-full px-2.5 py-0.5 text-[11px] font-medium"
                  style={{ color, background: `${color}1a` }}
                >
                  {p.difficulty}
                </span>
              </div>
              <p className="text-xs text-muted">
                {[...p.tags, p.difficulty].join(" · ")}
              </p>
            </li>
          );
        })}
      </ul>

      <Screenshot
        name="problems"
        alt="The problem library: filters for role, difficulty, topic and status above a grid of cases tagged by difficulty and stack."
      />

      <div className="mt-8 flex flex-col items-center gap-3 text-center">
        <p className="text-sm text-muted">More cases coming at launch, October 21.</p>
        <a href="#waitlist" className="link-action">Get the launch link →</a>
      </div>
    </Section>
  );
}
