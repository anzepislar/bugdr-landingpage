import { Paras, Screenshot, Section, ShareCard } from "@/components/landing/section";

const stats = [
  ["Prompts", "12", "4"],
  ["Tokens", "3,840", "1,200"],
  ["First-run pass", "No", "68%"],
];

export function AIFeedback() {
  return (
    <Section
      id="feedback"
      label="Session feedback"
      heading="It passes. Now understand how you got there."
      intro={
        <Paras>
          {[
            "After a solve, your session debrief looks at your prompts, tokens, and test runs. Compare your approach with other participants on that case and find something useful to try next time.",
            "A working fix matters. So does learning a process you can repeat.",
          ]}
        </Paras>
      }
    >
      <div className="glass mt-12 max-w-[760px] rounded-card p-6 md:p-8">
        <p className="label">Example debrief</p>
        <h3 className="mt-3 font-mono text-xl text-text">payment retries</h3>

        <div className="mt-6 space-y-3 text-sm">
          <div className="ml-auto w-fit max-w-[85%] rounded-xl rounded-br-sm bg-action/[0.12] px-4 py-2.5 text-text">
            <span className="sr-only">You: </span>It passes. What could I do better?
          </div>
          <div className="w-fit max-w-[85%] rounded-xl rounded-bl-sm border border-white/[0.07] bg-surface2 px-4 py-2.5 text-text">
            <span className="mb-1 block text-xs font-medium text-action">Bugdr</span>
            You fixed the failure. Now tighten the investigation.
          </div>
        </div>

        <div className="mt-6 overflow-x-auto">
          <table className="w-full min-w-[320px] text-left text-sm">
            <thead>
              <tr className="border-b border-white/[0.09] text-xs uppercase tracking-[0.12em] text-muted2">
                <th scope="col" className="py-2.5 pr-4 font-medium">Measure</th>
                <th scope="col" className="py-2.5 pr-4 font-medium">You</th>
                <th scope="col" className="py-2.5 font-medium">Comparison group</th>
              </tr>
            </thead>
            <tbody className="font-mono">
              {stats.map(([m, you, group]) => (
                <tr key={m} className="border-b border-white/[0.06] last:border-0">
                  <th scope="row" className="py-3 pr-4 font-sans font-normal text-muted">{m}</th>
                  <td className="py-3 pr-4 text-text">{you}</td>
                  <td className="py-3 text-muted">{group}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="mt-6 text-sm leading-relaxed text-muted">
          Eight test runs before the first pass. Next time, inspect the logs
          before asking AI for another change.
        </p>

        <div className="mt-6 rounded-xl border border-white/[0.07] bg-canvas/60 p-4">
          <p className="text-xs font-medium uppercase tracking-[0.12em] text-action">On your next case</p>
          <p className="mt-2 text-sm leading-relaxed text-text/90">
            Read the full stack trace. Identify the likely failure point. Ask
            for one targeted change. Test the hypothesis.
          </p>
        </div>

        <p className="mt-6 text-xs italic text-muted2">
          Illustrative feedback and benchmark data. Fewer tokens alone do not
          mean a better fix.
        </p>
      </div>

      <Screenshot
        name="ai-feedback"
        alt="AI feedback after a solve: what you did well, how your prompts and tokens compare with typical solvers, and what to try next time."
      />

      {/* Solve result cards; phones show only the first. */}
      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <ShareCard
          name="solve-medium"
          alt="Solve card for Payment retries disappear, Medium: 2 prompts, 4,730 tokens, 17 minutes, efficiency score 2.0x."
        />
        <ShareCard
          name="solve-hard"
          className="hidden sm:block"
          alt="Solve card for Transfers that lock each other out, Hard: 3 prompts, 6,912 tokens, 31 minutes, efficiency score 1.8x."
        />
        <ShareCard
          name="solve-get-a-job"
          className="hidden sm:block"
          alt="Solve card for Every request is a cache miss, Get a job: 4 prompts, 11,240 tokens, 1 hour 52 minutes, efficiency score 1.9x."
        />
      </div>
    </Section>
  );
}
