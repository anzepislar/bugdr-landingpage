import { Paras, Screenshot, Section } from "@/components/landing/section";

const steps = [
  {
    n: "01",
    title: "Read the scene.",
    body: [
      "Start with the bug report and explore the codebase. Learn what should happen and what happens instead. The cause is yours to find.",
      "The timer starts when you start the case.",
    ],
  },
  {
    n: "02",
    title: "Follow the evidence.",
    body: [
      "The editor, terminal, and AI assistant run in your browser.",
      "Trace the failure. Ask questions. Try a focused change. Run the code.",
      "Your prompts, token usage, and test runs are recorded during the session.",
    ],
  },
  {
    n: "03",
    title: "Make the fix hold.",
    body: [
      "Run the acceptance checks. Solve the reported problem and keep the rest working.",
      "Your first successful result is saved. Replaying the case won't replace it with a higher score.",
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
    <Section id="how-it-works" label="How it works" heading="One case. Your investigation.">
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

      <div className="mt-8 text-center">
        <a href="#waitlist" className="link-action">Get the launch link →</a>
      </div>
    </Section>
  );
}
