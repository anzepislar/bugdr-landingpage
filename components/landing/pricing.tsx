"use client";

import { useState } from "react";
import { Brandify } from "@/components/landing/wordmark";
import { Centered, FeatureSection, Heading, Label } from "@/components/landing/feature-sections";
import { CtaButton } from "@/components/landing/cta-button";
import { APP_URL } from "@/lib/site";

// Only Pro has an annual price; Free and Max ignore the toggle.
type Price = { price: string; unit: string; alt?: string; href: string };

type Plan = {
  name: string;
  monthly: Price;
  annual?: Price;
  cta: string;
  lead?: string;
  items: string[];
  featured?: boolean;
};

const plans: Plan[] = [
  {
    name: "Free",
    monthly: { price: "€0", unit: "/month", href: `${APP_URL}/onboarding?ref=landing` },
    cta: "Start free",
    items: ["250K AI tokens a day (about 6 solves), Claude Haiku.", "All problems.", "No career paths, no AI feedback."],
  },
  {
    name: "Pro",
    monthly: { price: "€19.99", unit: "/month", alt: "Billed monthly", href: `${APP_URL}/checkout?plan=pro&interval=month&ref=landing` },
    annual: { price: "€219", unit: "/year", alt: "€18.25/month. Save 9%.", href: `${APP_URL}/checkout?plan=pro&interval=year&ref=landing` },
    cta: "Get Pro",
    lead:
      "For engineers who practice every day. You get 1M AI tokens a day with Claude Haiku, which is about 25 solves, so you won't run out mid-bug. Career paths take you from Easy to Get a job for your role, and stages unlock as your fixes get more efficient. After every solve, AI feedback tells you what you did well and how to use fewer prompts next time.",
    items: [
      "1M AI tokens a day (about 25 solves), Claude Haiku.",
      "All problems.",
      "Career paths.",
      "AI feedback after every solve.",
      "Rank up emails.",
    ],
    featured: true,
  },
  {
    name: "Max",
    monthly: { price: "€169", unit: "/month", alt: "Billed monthly", href: `${APP_URL}/checkout?plan=max&ref=landing` },
    cta: "Get Max",
    lead:
      "For engineers who want the strongest AI on the hardest bugs. Choose the model for each problem right in the chat: Claude Opus for the toughest ones, Sonnet for balance, Haiku for speed. One daily budget of 5M tokens covers all three: 2.5M on Opus, 3.75M on Sonnet or 5M on Haiku. Includes everything in Pro: career paths, AI feedback after every solve and every problem.",
    items: [
      "One 5M AI token budget a day; pick the model in the chat: Claude Opus 2.5M, Sonnet 3.75M or Haiku 5M.",
      "Everything in Pro.",
    ],
  },
];

const TOGGLE =
  "rounded-full px-4 py-1.5 text-sm transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-action";

export function Pricing() {
  const [annual, setAnnual] = useState(false);
  return (
    <FeatureSection id="pricing" bg="fs-bg-pricing">
      <Centered>
        <Label dot="amber">Pricing</Label>
        <Heading>Start with a bug. Choose your tools.</Heading>
        <div role="group" aria-label="Billing period" className="mt-10 inline-flex rounded-full border border-border bg-surface p-1">
          {[false, true].map((a) => (
            <button
              key={String(a)}
              type="button"
              aria-pressed={annual === a}
              onClick={() => setAnnual(a)}
              className={`${TOGGLE} ${annual === a ? "bg-canvas text-text" : "text-muted hover:text-text"}`}
            >
              {a ? "Annual" : "Monthly"}
            </button>
          ))}
        </div>
        <div className="mt-10 grid w-full items-stretch gap-4 text-left lg:grid-cols-3">
          {plans.map((p) => {
            const price = (annual && p.annual) || p.monthly;
            return (
              <article
                key={p.name}
                className={`relative flex min-w-0 flex-col rounded-[20px] border p-6 ${
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
                  <span className="font-display text-[clamp(32px,3.2vw,40px)] font-semibold leading-none tracking-[-0.025em] text-text">{price.price}</span>
                  <span className="text-sm text-muted">{price.unit}</span>
                </p>
                {price.alt && <p className="mt-2 text-sm text-muted">{price.alt}</p>}
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

                <CtaButton className="mt-auto w-full" variant="a" label={p.cta} href={price.href} />
              </article>
            );
          })}
        </div>
        <div className="mt-10 space-y-2 text-sm text-muted">
          <p>Token limits reset at midnight UTC. Prices in EUR.</p>
          <p>Tokens measure how much of the codebase the AI reads. Better engineers use fewer.</p>
        </div>
      </Centered>
    </FeatureSection>
  );
}
