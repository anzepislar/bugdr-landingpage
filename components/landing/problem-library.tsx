import { Container } from "@/components/landing/container";
import { ZoomableImage } from "@/components/ui/zoomable-image";

// "What the problems look like" section.
//
// Earlier versions used framer-motion's `whileInView` to fade and slide
// the section header and the screenshot in as the user scrolled. On the
// static export the SSR HTML rendered them at `opacity:0` with a
// translate, and the IntersectionObserver only fired for content that
// was actually in the viewport. Off-screen content stayed invisible in
// fullPage screenshots, for crawlers, and for anyone trying to print the
// page. The fix: render plain HTML. The content is always visible.

export function ProblemLibrary() {
  return (
    <section
      id="library"
      aria-labelledby="library-heading"
      className="lower-section relative divider-top"
    >
      <Container>
        <div className="library-intro">
          <h2
            id="library-heading"
            className="mt-3 text-3xl sm:text-4xl font-semibold text-headline"
          >
            Something's broken. Pick your case.
          </h2>
          <p className="mt-4 text-muted text-lg leading-relaxed">
            Duplicate charges. Slow queries. Failed deployments. Browse by role, topic,
            and difficulty to find something worth working through. Every case includes
            a brief and the checks you need to pass, so you know what a working fix
            needs to do before you start.
          </p>
        </div>
      </Container>
    </section>
  );
}
