import { Container } from "@/components/landing/container";

// Native <details name="faq"> gives a one-open-at-a-time accordion with no
// JS (browsers without exclusive-details support just allow several open).

const faqs = [
  {
    q: "Can I use AI?",
    a: "Yes. Use the workspace assistant to explore code, ask questions, and work on a fix. You still need to understand the changes and check that they work. Use AI. Own the code.",
  },
  {
    q: "Are these actual production codebases?",
    a: "They're practice codebases built around failures you could encounter at work. You get incident context and room to investigate without touching a live customer system.",
  },
  {
    q: "Which languages and tools are covered?",
    a: "The listed library stacks include Node.js, TypeScript, Python, Go, React, Next.js, PostgreSQL, Redis, JWT, and WebSockets. Check the individual case before starting.",
  },
  {
    q: "Do I need to install anything?",
    a: "No. The editor, terminal, AI assistant, and tests run in your browser.",
  },
  {
    q: "What affects my score?",
    a: "A working, reliable fix matters most. Scoring also considers code quality, testing, time, and AI usage. Fewer tokens or fewer lines do not automatically mean better engineering.",
  },
  {
    q: "Can I retry for a better score?",
    a: "Your first successful result is final. Take the lesson into your next case.",
  },
  {
    q: "What does Pro include?",
    a: "Career paths, AI feedback after each solve, a higher daily token limit, and the listed Pro model options. €29.99 monthly or €239 yearly.",
  },
  {
    q: "Will a path get me a job?",
    a: "A path gives you relevant practice and benchmarks. It cannot promise employment. Hiring decisions belong to employers.",
  },
];

export function Faq() {
  return (
    <section id="faq" aria-label="FAQ" className="py-16 md:py-20">
      <Container>
        <p className="label">FAQ</p>
        <div className="mt-8 max-w-[760px] divide-y divide-white/[0.08] border-y border-white/[0.08]">
          {faqs.map((f) => (
            <details key={f.q} name="faq" className="faq group">
              <summary className="flex cursor-pointer items-center justify-between gap-6 py-5 text-left text-base font-medium text-text transition-colors hover:text-action md:text-lg">
                {f.q}
                <span aria-hidden className="faq-icon text-xl leading-none text-muted">+</span>
              </summary>
              <p className="max-w-[65ch] pb-6 leading-relaxed text-muted">{f.a}</p>
            </details>
          ))}
        </div>
      </Container>
    </section>
  );
}
