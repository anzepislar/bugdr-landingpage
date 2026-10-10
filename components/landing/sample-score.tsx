import { Container } from "@/components/landing/container";
import Image from "next/image";
import { assetPath } from "@/lib/asset-path";

// "Your progress, backed by your work." : the profile section.
//
// Shows a screenshot of the user profile page.

export function SampleScore() {
  return (
    <section
      id="score"
      aria-labelledby="score-heading"
      className="relative py-24 sm:py-32 divider-top"
    >
      <Container>
        <figure className="rounded-xl border border-border bg-surface shadow-card overflow-hidden">
          <Image
            src={assetPath("/profile.png")}
            alt="bug.dr profile page showing progress and solved cases"
            width={1600}
            height={1329}
            className="w-full h-auto"
          />
        </figure>
      </Container>
    </section>
  );
}
