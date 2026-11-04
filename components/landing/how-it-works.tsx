import { Paras, Screenshot, Section } from "@/components/landing/section";

const steps = [
  {
    n: "01",
    title: "Get dropped into unfamiliar code.",
    body: [
      "Choose a case built around a real-world failure. Read the report and explore the codebase. You know what’s broken. Finding out “why” is your first challenge.",
    ],
  },
  {
    n: "02",
    title: "Investigate together.",
    body: [
      "Use the editor, terminal, and AI agent in your browser. Decide what to inspect, what context to share, and which changes to make. Bugdr records your prompts, token usage, time, and test runs.",
    ],
  },
  {
    n: "03",
    title: "Fix it, without breaking it.",
    body: [
      "Pass the acceptance checks without breaking existing code. Your first successful result is saved. See what your approach took—and what you can improve next time.",
    ],
  },
];

const checks = [
  "Retry transient failures.",
  "Prevent duplicate charges.",
  "Back off between retries.",
  "Keep existing tests passing.",
  "Preserve successful payments.",
  "Keep the worker healthy.",
  "Keep failed jobs visible.",
];

export function HowItWorks() {
  return (
    <Section id="how-it-works" label="How it works" heading="Enter the codebase. Lead your agent.">
      <ol className="mt-12 grid gap-4 md:grid-cols-3">
        {steps.map((s) => (
          <li key={s.n} className="card flex flex-col p-6 md:p-7">
            <span className="font-mono text-sm text-action">{s.n}</span>
            <h3 className="mt-4 font-display text-xl font-bold text-text">{s.title}</h3>
            <div className="mt-3 space-y-3 text-sm leading-relaxed text-muted">
              <Paras>{s.body}</Paras>
            </div>
          </li>
        ))}
      </ol>

      <Screenshot
        name="workspace-checks"
        alt="The Bugdr workspace: bug report on the left, code editor in the middle with all 7 acceptance checks passed, AI assistant chat on the right."
      />

      <div className="glass mx-auto mt-10 max-w-[860px] rounded-card p-6 md:p-8">
        <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
          <div className="md:max-w-[34ch]">
            <p className="label">Example case</p>
            <h3 className="mt-3 font-mono text-xl text-text">payment retries</h3>
            <p className="mt-3 text-muted">A retry isn&apos;t a fix if it charges someone twice.</p>
            <p className="mt-6 text-xs italic text-muted2">Illustrative case and acceptance checks.</p>
          </div>

          <div className="w-full rounded-xl border border-white/[0.07] bg-canvas/80 p-5 font-mono text-[13px] md:max-w-[400px]">
            <ul className="space-y-2" aria-label="Acceptance checks">
              {checks.map((c) => (
                <li key={c} className="flex items-center gap-3 text-passed">
                  <span aria-hidden className="h-1.5 w-1.5 shrink-0 rounded-full bg-passed shadow-[0_0_6px_#22c55e]" />
                  <span className="text-text/90">{c}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </Section>
  );
}
