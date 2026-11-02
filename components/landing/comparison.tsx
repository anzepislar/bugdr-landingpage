import { Wordmark } from "@/components/landing/wordmark";
import { Section } from "@/components/landing/section";

const rows = [
  ["The task", "Solve a standalone problem.", "Investigate a bug in an unfamiliar codebase."],
  ["AI", "Rules depend on the assessment.", "Your agent works alongside you."],
  ["The work", "Build a solution from the prompt.", "Explore the code, direct your agent, and test changes."],
  ["The checks", "Does your answer produce the expected output?", "Is the bug fixed without breaking the rest?"],
  ["What you show", "Your solution.", "Your fix, investigation, and AI efficiency."],
];

export function Comparison() {
  return (
    <Section
      id="why"
      label={<>Why <Wordmark /></>}
      heading="Anyone can prompt BUT can you lead the investigation?"
      intro={
        <p>
          Working with AI gets harder when you don&rsquo;t know the codebase&mdash;or
          where the bug is hiding. <Wordmark /> gives you that challenge and scores how
          you handle it.
        </p>
      }
    >
      <div className="glass mt-12 overflow-hidden rounded-card">
        {/* Below sm each row stacks: aspect label on top, the two answers side by side. */}
        <table className="w-full border-collapse text-left text-sm md:text-base">
          <thead>
            <tr className="grid grid-cols-2 border-b border-white/[0.09] sm:table-row">
              <th scope="col" className="hidden w-[22%] px-5 py-4 sm:table-cell md:px-6">
                <span className="sr-only">Aspect</span>
              </th>
              <th scope="col" className="px-5 py-4 font-medium text-muted md:px-6">
                Coding puzzle
              </th>
              <th scope="col" className="px-5 py-4 font-semibold text-action md:px-6">
                <Wordmark />
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map(([aspect, puzzle, bugdr]) => (
              <tr key={aspect} className="grid grid-cols-2 border-b border-white/[0.06] last:border-0 sm:table-row">
                <th scope="row" className="col-span-2 px-5 pb-0 pt-4 align-top sm:pb-4 text-xs font-medium uppercase tracking-[0.14em] text-muted2 md:px-6">
                  {aspect}
                </th>
                <td className="px-5 py-4 align-top text-muted md:px-6">{puzzle}</td>
                <td className="bg-action/[0.04] px-5 py-4 align-top text-text md:px-6">{bugdr}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Section>
  );
}
