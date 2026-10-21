import { DIFFICULTY_COLOR, type Difficulty, Paras, Screenshot, Section } from "@/components/landing/section";
import { APP_URL } from "@/lib/site";

// Live problems in the app (titles, difficulty and stack from its API).
const problems: { slug: string; title: string; tags: string[]; difficulty: Difficulty }[] = [
  { slug: "conversation-compaction-runner", title: "Conversation Compaction Runner", tags: ["AI / LLM", "Python"], difficulty: "Easy" },
  { slug: "autocast-aware-variable-store", title: "Autocast-aware Variable Store", tags: ["AI / LLM", "Python"], difficulty: "Medium" },
  { slug: "chat-history-truncation-reducer", title: "Chat History Truncation Reducer", tags: ["AI / LLM", "Python"], difficulty: "Medium" },
  { slug: "tool-invocation-helpers-for-llm-tool-calls", title: "Tool Invocation Helpers for LLM Tool Calls", tags: ["AI / LLM", "Python"], difficulty: "Medium" },
  { slug: "google-ai-service-client-initialization", title: "Google AI Service Client Initialization", tags: ["AI / LLM", "Python"], difficulty: "Medium" },
  { slug: "geo-distance-formula-scoring", title: "Geo distance formula scoring", tags: ["AI / LLM", "Python"], difficulty: "Easy" },
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
            <li key={p.slug}>
              <a
                href={`${APP_URL}/problems/${p.slug}`}
                className="card group flex h-full flex-col gap-3 p-5"
              >
                <div className="flex items-start justify-between gap-3">
                  <h3 className="text-[15px] font-medium text-text">{p.title}</h3>
                  <span
                    className="shrink-0 rounded-full px-2.5 py-0.5 text-[11px] font-medium"
                    style={{ color, background: `${color}1a` }}
                  >
                    {p.difficulty}
                  </span>
                </div>
                <div className="mt-auto flex items-end justify-between gap-3">
                  <p className="text-xs text-muted">
                    {[...p.tags, p.difficulty].join(" · ")}
                  </p>
                  <span
                    aria-hidden
                    className="text-action transition-transform duration-200 group-hover:translate-x-0.5"
                  >
                    →
                  </span>
                </div>
              </a>
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
