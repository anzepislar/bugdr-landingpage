import { Nav } from "@/components/landing/nav";
import { AnnouncementBar } from "@/components/landing/announcement-bar";
import { Hero } from "@/components/landing/hero";
import { Comparison } from "@/components/landing/comparison";
import { HowItWorks } from "@/components/landing/how-it-works";
import { SampleScore } from "@/components/landing/sample-score";
import { CareerPaths } from "@/components/landing/career-paths";
import { AIFeedback } from "@/components/landing/ai-feedback";
import { WaitlistCta } from "@/components/landing/waitlist-cta";
import { RolesAndProfile } from "@/components/landing/roles-and-profile";
import { ProblemLibrary } from "@/components/landing/problem-library";
import { Features } from "@/components/landing/features";
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
        { "@type": "Offer", name: "Pro", price: "12.99", priceCurrency: "EUR" },
      ],
    },
    {
      "@type": "WebSite",
      name: "Bugdr",
      url: SITE_URL,
    },
  ],
};

// Home page section order.
//
// Hero, How it works, then the example scorecard and a CTA
// before Career Paths and AI Feedback, then the role chips
// and the problem library + dashboard, then Pricing and
// another CTA, then the waitlist form and the FAQ, then
// the footer. The two CTAs are spread out so the user has
// multiple chances to convert without a sticky banner.
export default function Page() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <AnnouncementBar />
      <Nav />
      <main id="top">
        <Hero />
        <Comparison />
        <HowItWorks />
        <SampleScore />
        <WaitlistCta line="Get the link in your inbox the day we open." />
        <CareerPaths />
        <AIFeedback />
        <RolesAndProfile />
        <ProblemLibrary />
        <Features />
        <RanksSection />
        <Pricing />
        <WaitlistCta line="Be the first to pick a problem when the library opens." />
        <Waitlist />
        <Faq />
      </main>
      <Footer />
    </>
  );
}
