"use client";

import { useState } from "react";
import { Container } from "@/components/landing/container";
import { ZoomableImage } from "@/components/ui/zoomable-image";
import { assetPath } from "@/lib/asset-path";

// "Contests and your dashboard" — full-width slot section for the two
// product shots that don't otherwise have a home on the page. profile.png
// lives in the RolesAndProfile section to the right of the role chips.
// Cards stack full width, one per row, so the screenshots are readable
// at their natural size. Same frame pattern (`rounded-xl border
// border-border bg-surface shadow-card overflow-hidden`) as the other
// slots.
//
// Earlier versions used framer-motion's `whileInView` to slide the
// section header and each card in from alternating sides. On the static
// export the SSR HTML rendered them at `opacity:0` with a translate, and
// the IntersectionObserver only fired for content that was actually in
// the viewport. Off-screen content stayed invisible in fullPage
// screenshots, for crawlers, and for anyone trying to print the page.
// The fix: render plain HTML. The content is always visible.

type Feature = {
  label: string;
  title: string;
  body: string;
  src: string;
  alt: string;
  width: number;
  height: number;
};

const features: Feature[] = [
  {
    label: "Contests",
    title: "A shared challenge. Your own approach.",
    body:
      "Take on the same case. Daily, weekly, and monthly contests give you a shared challenge. See how your approach compares when everyone starts with the same problem.",
    src: "/contests-past.png",
    alt: "Contests page showing live daily, weekly and monthly incidents with countdowns and a contest history table.",
    width: 1600,
    height: 900,
  },
  {
    label: "Dashboard",
    title: "Know what to work on next.",
    body:
      "Your dashboard brings together recommended cases, live contests, and your progress. Spend less time deciding where to start.",
    src: "/contests-past.png",
    alt: "Dashboard showing contests and progress",
    width: 1600,
    height: 817,
  },
];

export function Features() {
  const [selected, setSelected] = useState(0);
  return (
    <section
      id="features"
      aria-labelledby="features-heading"
      className="lower-section relative divider-top"
    >
      <Container>
        <div className="max-w-2xl">
          <h2
            id="features-heading"
            className="mt-3 text-3xl sm:text-4xl font-semibold text-headline"
          >
            Keep your next challenge in sight.
          </h2>
          <p className="mt-4 text-muted text-lg leading-relaxed">
            Find your next case, keep track of your progress, or test yourself
            against the same challenge as other engineers.
          </p>
        </div>

        <div className="product-switcher" role="group" aria-label="Product preview">
          {features.map((feature, index) => <button key={feature.label} type="button" aria-pressed={selected === index} onClick={() => setSelected(index)}>{feature.label}</button>)}
        </div>
        <FeatureCard key={features[selected].src} feature={features[selected]} />
      </Container>
    </section>
  );
}

function FeatureCard({ feature }: { feature: Feature }) {
  return (
    <figure className="feature-showcase">
      <div className="feature-description">
        <p className="font-mono text-xs uppercase tracking-widest text-action">
          {feature.label}
        </p>
        <h3 className="mt-2 text-2xl font-semibold text-headline">
          {feature.title}
        </h3>
        <p className="mt-2 text-muted text-[15px] leading-relaxed">
          {feature.body}
        </p>
      </div>
      <ZoomableImage
        src={assetPath(feature.src)}
        alt={feature.alt}
        width={feature.width}
        height={feature.height}
        sizes="(min-width: 1024px) 1200px, 100vw"
        // Library and dashboard cards are the ones the user is most
        // likely to want to read at full size; show the tap-to-enlarge
        // badge on those. The contests card is smaller and the badge
        // would just be visual noise.
        showEnlargeHint={feature.label === "Dashboard"}
      />
    </figure>
  );
}
