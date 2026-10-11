import { Check, Cross } from "@/components/landing/icons";
import { Container } from "@/components/landing/container";

// The "Interview vs bug.dr" comparison table.
//
// Earlier versions used framer-motion's `whileInView` to slide each row in
// from alternating sides. That looked nice interactively, but on the
// static export the SSR HTML rendered the rows at `opacity:0; transform:
// translateX(±50px)` and the IntersectionObserver only fired for rows that
// were actually in the viewport. Off-screen rows stayed invisible in
// fullPage screenshots, for crawlers, and for anyone printing the page.
//
// The fix is the same one used across the rest of the site: render plain
// HTML. The content is always visible. The rows are not animated.

type Row = {
  label: string;
  interview: string;
  bugdr: string;
  interviewTone?: "muted" | "danger";
  bugdrTone?: "muted" | "action";
};

const rows: Row[] = [
  {
    label: "The task",
    interview: "Solve a standalone puzzle.",
    bugdr: "Investigate a bug in an existing codebase.",
  },
  {
    label: "Using AI",
    interview: "Often restricted.",
    bugdr: "Part of the workspace.",
    interviewTone: "danger",
    bugdrTone: "action",
  },
  {
    label: "The work",
    interview: "Write an answer from scratch.",
    bugdr: "Read code, diagnose the issue, make changes, and test them.",
  },
  {
    label: "The checks",
    interview: "Does the answer match the expected output?",
    bugdr: "Does the bug stay fixed, and does the rest still work?",
  },
  {
    label: "What you can show",
    interview: "Your answer.",
    bugdr: "Your fix and how you got there.",
    bugdrTone: "action",
  },
];

export function Comparison() {
  return (
    <section
      id="problems"
      aria-labelledby="comparison-heading"
      className="relative pt-16 pb-24 sm:pt-20 sm:pb-32"
    >
      <Container>
        {/* Section header */}
        <div className="max-w-2xl">
          <h2
            id="comparison-heading"
            className="mt-3 text-3xl sm:text-4xl font-semibold text-headline"
          >
            The job changed. The coding test barely did.
          </h2>
          <p className="mt-4 text-muted text-lg leading-relaxed">
            AI can suggest a fix in seconds. Knowing whether it's the right fix
            takes practice. On bug.dr, you work on bugs, making sense of the code,
            and checking that your changes solve the problem without creating another
            one.
          </p>
        </div>

        {/* Comparison table */}
        <div className="mt-12 glass overflow-hidden">
          {/* Header row */}
          <div className="hidden sm:grid grid-cols-12 gap-4 px-6 py-4 border-b border-border font-mono text-xs uppercase tracking-wider text-muted">
            <div className="col-span-4">Dimension</div>
            <div className="col-span-4">Coding puzzle</div>
            <div className="col-span-4 relative text-action">
              bug.dr
              <span
                aria-hidden
                className="absolute -bottom-1 left-0 h-0.5 w-full bg-action/60"
              />
            </div>
          </div>

          {rows.map((row) => (
            <ComparisonRow key={row.label} row={row} />
          ))}
        </div>
      </Container>
    </section>
  );
}

function ComparisonRow({ row }: { row: Row }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-12 gap-2 sm:gap-4 px-6 py-5 border-b border-border last:border-b-0 relative">
      <div className="sm:col-span-4 font-mono text-xs uppercase tracking-wider text-muted">
        {row.label}
      </div>
      <div className="sm:col-span-4 text-muted flex items-start gap-2">
        <span
          aria-hidden
          className="mt-1 inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-diffImpossible/10 text-diffImpossible ring-1 ring-diffImpossible/40"
        >
          <Cross size={11} />
        </span>
        <span className="text-[15px]">{row.interview}</span>
      </div>
      <div className="sm:col-span-4 flex items-start gap-2 relative">
        <span
          aria-hidden
          className="mt-1 inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-action/15 text-action ring-1 ring-action/40"
        >
          <Check size={11} />
        </span>
        <span className="text-[15px] text-text">{row.bugdr}</span>
      </div>
    </div>
  );
}
