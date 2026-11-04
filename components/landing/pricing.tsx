import { Brandify } from "@/components/landing/wordmark";
import { Centered, FeatureSection, Heading, Label } from "@/components/landing/feature-sections";
import { CtaButton } from "@/components/landing/cta-button";

// Every plan's CTA opens the app. Paid plans could later deep-link to
// app.bugdr.app/checkout?plan=own-key|pro|max.

type Plan = {
  name: string;
  price: string;
  unit: string;
  alt?: string;
  lead?: string;
  items: string[];
  featured?: boolean;
};

const plans: Plan[] = [
  {
    name: "Free",
    price: "€0",
    unit: "/month",
    items: [
      "All difficulty levels.",
      "150,000 tokens / day.",
      "AI assistant: Claude Haiku.",
      "Efficiency scoring.",
      "Public leaderboard.",
    ],
  },
  {
    name: "Pro",
    price: "€29.99",
    unit: "/month",
    alt: "or €239/year",
    lead: "~€19.92/month when billed annually. Save 33%.",
    items: [
      "Everything in Free.",
      "1,000,000 tokens / day.",
      "AI assistant: Claude Haiku.",
      "Career paths.",
      "AI feedback after every solve.",
      "Rank-up emails with your card.",
    ],
    featured: true,
  },
  {
    name: "Max",
    price: "€199",
    unit: "/month",
    lead: "Every Claude model, one daily budget.",
    items: [
      "Everything in Pro.",
      "Pick your model in the chat, one daily budget:",
      "Claude Haiku: 1,000,000 tokens / day.",
      "Claude Sonnet: 750,000 tokens / day.",
      "Claude Opus: 500,000 tokens / day.",
      "Elite efficiency scoring.",
    ],
  },
  {
    name: "Own Key",
    price: "€12.99",
    unit: "/month",
    lead: "For engineers who run their own AI stack.",
    items: [
      "Everything in Pro.",
      "Bring your Anthropic or OpenAI API key.",
      "Choose a supported model through your provider.",
      "Unlimited tokens on Bugdr, subject to your provider's limits.",
      "Provider AI usage charges are paid separately.",
    ],
  },
];

export function Pricing() {
  return (
    <FeatureSection id="pricing" bg="fs-bg-pricing">
      <Centered>
        <Label dot="amber">Pricing</Label>
        <Heading>Start with a bug. Choose your tools.</Heading>
        <div className="mt-14 grid w-full items-stretch gap-4 text-left sm:grid-cols-2 lg:grid-cols-4">
          {plans.map((p) => (
            <article
              key={p.name}
              className={`relative flex flex-col rounded-[20px] border p-6 ${
                p.featured
                  ? "border-[color-mix(in_srgb,var(--action)_35%,transparent)] bg-[linear-gradient(180deg,color-mix(in_srgb,var(--action)_7%,var(--surface)),var(--surface))] shadow-[0_0_60px_-20px_rgba(139,172,255,0.35)]"
                  : "border-border bg-surface"
              }`}
            >
              <h3
                className={`text-[11px] font-semibold uppercase tracking-[0.1em] ${p.featured ? "text-action" : "text-muted"}`}
              >
                {p.name}
              </h3>
              <p className="mt-5 flex items-baseline gap-1.5">
                <span className="font-display text-[clamp(32px,3.2vw,40px)] font-semibold leading-none tracking-[-0.025em] text-text">{p.price}</span>
                <span className="text-sm text-muted">{p.unit}</span>
              </p>
              {p.alt && <p className="mt-2 text-sm text-muted">{p.alt}</p>}
              {p.lead && <p className="mt-3 text-sm leading-relaxed text-text/90">{p.lead}</p>}

              <ul className="mb-8 mt-6 space-y-2.5 border-t border-border pt-6">
                {p.items.map((item) => (
                  <li key={item} className="flex gap-2.5 text-sm leading-snug text-muted">
                    <svg
                      aria-hidden
                      width="14"
                      height="14"
                      viewBox="0 0 14 14"
                      className={`mt-[3px] shrink-0 text-action`}
                    >
                      <path d="M3 7.5l2.5 2.5L11 4.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <span>
                      <Brandify>{item}</Brandify>
                    </span>
                  </li>
                ))}
              </ul>

              <CtaButton className="mt-auto w-full" variant="a" />
            </article>
          ))}
        </div>
        <div className="mt-10 space-y-2 text-sm text-muted">
          <p>Tokens measure how much of the codebase the AI reads. Better engineers use fewer.</p>
          <p>Payments open after launch.</p>
        </div>
      </Centered>
    </FeatureSection>
  );
}
