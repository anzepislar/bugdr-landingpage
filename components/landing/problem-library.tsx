import { Container } from "@/components/landing/container";
import { Badge } from "@/components/ui/badge";

// "What the problems look like" section.
//
// Earlier versions used framer-motion's `whileInView` to fade and slide
// the section header and the screenshot in as the user scrolled. On the
// static export the SSR HTML rendered them at `opacity:0` with a
// translate, and the IntersectionObserver only fired for content that
// was actually in the viewport. Off-screen content stayed invisible in
// fullPage screenshots, for crawlers, and for anyone trying to print the
// page. The fix: render plain HTML. The content is always visible.

// Placeholder rows showing the list pattern. Not real data.
const SAMPLE_PROBLEMS = [
  { title: "Duplicate charge on checkout", category: "payments", tone: "hard", role: "Backend" },
  { title: "Slow dashboard query", category: "database", tone: "medium", role: "Backend" },
  { title: "Failed deployment rollback", category: "devops", tone: "hard", role: "DevOps" },
  { title: "Race condition in job queue", category: "async", tone: "hard", role: "Backend" },
  { title: "Broken OAuth redirect", category: "auth", tone: "medium", role: "Fullstack" },
  { title: "Memory leak in image pipeline", category: "perf", tone: "hard", role: "Backend" },
] as const;

export function ProblemLibrary() {
  return (
    <section
      id="library"
      aria-labelledby="library-heading"
      className="relative py-24 md:py-32"
    >
      <Container>
        <div className="grid gap-4 md:grid-cols-2 md:gap-16">
          <h2
            id="library-heading"
            className="text-3xl sm:text-4xl font-semibold text-text leading-tight tracking-[-0.02em]"
          >
            Something's broken. Pick your case.
          </h2>
          <p className="text-muted text-lg leading-relaxed">
            Duplicate charges. Slow queries. Failed deployments. Browse by role, topic,
            and difficulty to find something worth working through. Every case includes
            a brief and the checks you need to pass, so you know what a working fix
            needs to do before you start.
          </p>
        </div>

        <div className="mt-12 glass rounded-2xl overflow-hidden">
          {SAMPLE_PROBLEMS.map((p) => (
            <div
              key={p.title}
              className="grid grid-cols-[1fr_auto] sm:grid-cols-[1fr_6rem_8rem] gap-x-4 items-center px-6 py-4 border-b border-white/[0.04] last:border-b-0 hover:bg-white/[0.02] transition-colors"
            >
              <div className="min-w-0">
                <p className="text-text text-sm">{p.title}</p>
                <p className="text-muted/60 text-xs font-mono">{p.category}</p>
              </div>
              <div className="text-center">
                <Badge tone={p.tone}>{p.tone}</Badge>
              </div>
              <div className="hidden sm:block text-right text-muted text-xs">{p.role}</div>
            </div>
          ))}
        </div>

        <p className="mt-4 text-center text-sm text-muted/50">
          More problems coming at launch — October 21.
        </p>
      </Container>
    </section>
  );
}
