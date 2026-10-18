import { Nav } from "@/components/landing/nav";
import { Hero } from "@/components/landing/hero";
import { Sky } from "@/components/landing/sky";
import { Belief } from "@/components/landing/belief";
import { Comparison } from "@/components/landing/comparison";
import { HowItWorks } from "@/components/landing/how-it-works";
import { AIFeedback } from "@/components/landing/ai-feedback";
import { CareerPaths } from "@/components/landing/career-paths";
import { Roles } from "@/components/landing/roles-and-profile";
import { ProblemLibrary } from "@/components/landing/problem-library";
import { Contests } from "@/components/landing/contests";
import { Hackathons } from "@/components/landing/hackathons";
import { RanksSection } from "@/components/landing/ranks-section";
import { Pricing } from "@/components/landing/pricing";
import { Waitlist } from "@/components/landing/waitlist";
import { Faq } from "@/components/landing/faq";
import { Footer } from "@/components/landing/footer";
import { SITE_URL } from "@/lib/site";

// Structured data. No aggregateRating until there are real reviews, and
// no SearchAction: /problems doesn't exist on this site yet.
// One object with @graph rather than a top-level array: some JSON-LD
// readers (browser extensions) assume `data["@context"]` exists and crash.
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "SoftwareApplication",
      name: "Bugdr",
      url: SITE_URL,
      description:
        "A coding practice platform where software engineers debug real production bugs instead of toy algorithm puzzles. Features career paths, AI-powered feedback, and real-world scenarios.",
      applicationCategory: "DeveloperApplication",
      operatingSystem: "Web",
      offers: [
        { "@type": "Offer", name: "Free", price: "0", priceCurrency: "EUR" },
        { "@type": "Offer", name: "Pro", price: "19.99", priceCurrency: "EUR" },
      ],
    },
    {
      "@type": "WebSite",
      name: "Bugdr",
      url: SITE_URL,
    },
  ],
};

export default function Page() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <Sky />
      <Nav />
      <main id="top">
        <Hero />
        <Belief />
        <Comparison />
        <HowItWorks />
        <AIFeedback />
        <CareerPaths />
        <Roles />
        <ProblemLibrary />
        <Contests />
        <Hackathons />
        <RanksSection />
        <Pricing />
        <Waitlist />
        <Faq />
      </main>
      <Footer />
    </>
  );
}
