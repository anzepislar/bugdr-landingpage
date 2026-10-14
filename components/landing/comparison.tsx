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
      className="relative py-24 md:py-32"
    >
      <Container>
        <div className="max-w-2xl">
          <h2
            id="comparison-heading"
            className="text-3xl sm:text-4xl font-semibold text-text leading-tight tracking-[-0.02em]"
          >
            The job changed. The coding test barely did.
          </h2>
          <p className="mt-4 text-muted text-lg leading-relaxed">
            AI can suggest a fix in seconds. Knowing whether it's the right fix
            takes practice. On <span className="brand">bug.dr</span>, you work on bugs, making sense of the code,
            and checking that your changes solve the problem without creating another
            one.
          </p>
        </div>

        <div className="mt-12 glass rounded-2xl overflow-hidden">
          <div className="hidden sm:grid grid-cols-3 gap-4 px-6 py-3 bg-white/[0.04] border-b border-white/[0.06] font-mono text-[11px] uppercase tracking-widest text-muted">
            <div>Dimension</div>
            <div className="text-muted">Coding puzzle</div>
            <div className="text-action font-semibold">
              <span className="brand">bug.dr</span>
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
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-4 px-6 py-4 border-b border-white/[0.04] last:border-b-0 items-center text-sm">
      <div className="text-muted">{row.label}</div>
      <div className="flex items-start gap-2 text-muted">
        <span aria-hidden className="text-base leading-5 text-failed/70">
          ✗
        </span>
        <span>{row.interview}</span>
      </div>
      <div className="flex items-start gap-2 text-text">
        <span aria-hidden className="text-base leading-5 text-passed">
          ✓
        </span>
        <span>{row.bugdr}</span>
      </div>
    </div>
  );
}
