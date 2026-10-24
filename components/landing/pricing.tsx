import { Brandify } from "@/components/landing/wordmark";
import { Section } from "@/components/landing/section";
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
      "30 AI prompts per day.",
      "Basic AI assistant: Haiku.",
      "Efficiency scoring.",
      "Public leaderboard.",
    ],
  },
  {
    name: "Pro",
    price: "€19.99",
    unit: "/month",
    alt: "or €159/year",
    lead: "€13.25/month when billed annually. Save ~€81/year.",
    items: [
      "Everything in Free.",
      "150 AI prompts per day.",
      "Claude Sonnet or GPT-4o.",
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
    lead: "For those who want the Opus option.",
    items: [
      "Everything in Pro.",
      "Claude Opus.",
      "150 AI prompts per day, with a hard cap.",
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
      "Unlimited prompts on Bugdr, subject to your provider's limits.",
      "Provider AI usage charges are paid separately.",
    ],
  },
];

export function Pricing() {
  return (
    <Section id="pricing" label="Pricing" heading="Start with a bug. Choose your tools.">
      <div className="mt-12 grid items-stretch gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {plans.map((p) => (
          <article
            key={p.name}
            className={[
              "card flex flex-col p-6",
              p.featured
                ? "!bg-surface2 !border-action/30 hover:!border-action/60 lg:-translate-y-2 lg:hover:-translate-y-3"
                : "",
            ].join(" ")}
          >
            <h3 className={`text-xs font-medium uppercase tracking-[0.18em] ${p.featured ? "text-action" : "text-muted"}`}>
              {p.name}
            </h3>
            <p className="mt-4 flex items-baseline gap-1.5">
              <span className="font-display text-4xl font-bold tracking-tight text-text">{p.price}</span>
              <span className="text-sm text-muted">{p.unit}</span>
            </p>
            {p.alt && <p className="mt-1 text-sm text-muted">{p.alt}</p>}
            {p.lead && <p className="mt-3 text-sm text-text/90">{p.lead}</p>}

            <ul className="mb-8 mt-6 space-y-2.5 border-t border-white/[0.07] pt-6">
              {p.items.map((item) => (
                <li key={item} className="flex gap-2.5 text-sm text-muted">
                  <svg aria-hidden width="14" height="14" viewBox="0 0 14 14" className="mt-[3px] shrink-0 text-action">
                    <path d="M3 7.5l2.5 2.5L11 4.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <span>
                    <Brandify>{item}</Brandify>
                  </span>
                </li>
              ))}
            </ul>

            <CtaButton className="mt-auto w-full" />
          </article>
        ))}
      </div>

      <p className="mt-8 text-center text-sm text-muted">Payments open after launch.</p>
    </Section>
  );
}
