import { Section } from "@/components/landing/section";

const rows = [
  ["The task", "Solve a standalone problem.", "Investigate a failure in existing code."],
  ["AI", "Rules depend on the assessment.", "Available in the workspace."],
  ["The work", "Build a solution from the prompt.", "Read, diagnose, change, and test."],
  ["The checks", "Does the solution produce the expected output?", "Is the failure fixed without breaking the rest?"],
  ["What you show", "Your solution.", "Your fix and the investigation behind it."],
];

export function Comparison() {
  return (
    <Section
      id="why"
      label="Why Bugdr"
      heading="Writing an answer is one skill. Finding the failure is another."
      intro={
        <p>
          Coding puzzles ask you to solve a defined problem. Bugdr asks you to
          investigate what went wrong in an existing codebase.
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
                Bugdr
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
