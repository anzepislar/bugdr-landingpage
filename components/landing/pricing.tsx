"use client";

import { useState } from "react";
import { Container } from "@/components/landing/container";
import { LinkButton } from "@/components/ui/button";
import { Check, Cross } from "@/components/landing/icons";

// "Simple pricing" : the Pricing section.
//
// Four cards in a row on desktop (Free, Pro, Own Key, Max), two per
// row on tablet, stacked on mobile with Pro first (CSS `order`, see
// lower-sections.css). Pro is highlighted with the action border, a
// "Most popular" badge and a slight lift. Own Key and Max get a
// subtle teal / purple border accent.
//
// Only Pro has the monthly/annual toggle (default annual). Every card
// ends with "Join waitlist" → #waitlist. No checkout yet.

type Item = { label: string; included: boolean };

const yes = (label: string): Item => ({ label, included: true });
const no = (label: string): Item => ({ label, included: false });

const freeItems: Item[] = [
  yes("All problems (Easy → Get a job)"),
  yes("30 AI prompts/day"),
  yes("Basic AI assistant (Haiku)"),
  yes("Efficiency scoring"),
  yes("Public leaderboard"),
  no("Career paths"),
  no("AI feedback after solves"),
  no("Powerful AI model"),
];

const proItems: Item[] = [
  yes("Everything in Free"),
  yes("150 AI prompts/day"),
  yes("Claude Sonnet or GPT-4o"),
  yes("Career paths"),
  yes("AI feedback after every solve"),
  yes("Rank up emails with card"),
];

const ownKeyItems: Item[] = [
  yes("Everything in Pro"),
  yes("Your API key — any model"),
  yes("Unlimited prompts"),
  yes("You control your AI costs"),
  yes("Zero token cost to platform"),
];

const maxItems: Item[] = [
  yes("Everything in Pro"),
  yes("Claude Opus (most powerful model)"),
  yes("150 prompts/day hard cap"),
  yes("Elite efficiency scoring"),
];

export function Pricing() {
  return (
    <section
      id="pricing"
      aria-labelledby="pricing-heading"
      className="relative py-24 md:py-32"
    >
      <Container>
        <div className="max-w-2xl mx-auto text-center">
          <h2
            id="pricing-heading"
            className="text-3xl sm:text-4xl font-semibold text-text leading-tight tracking-[-0.02em]"
          >
            Simple pricing
          </h2>
          <p className="mt-4 text-muted text-lg leading-relaxed">
            Free to start. Upgrade when you&apos;re serious.
          </p>
        </div>

        {/* Pro sits first on phones, second from sm up. */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-10 items-stretch">
          <PlanCard label="Free" price="€0" unit="/month" items={freeItems} />
          <ProCard />
          <PlanCard
            label="Own Key"
            price="€9.99"
            unit="/month"
            note="Bring your Anthropic or OpenAI API key"
            items={ownKeyItems}
          />
          <PlanCard
            label="Max"
            price="€199"
            unit="/month"
            note="Claude Opus · 150 prompts/day"
            items={maxItems}
          />
        </div>

        <p className="mt-8 text-center text-muted text-sm">
          Payments open after launch.
        </p>
      </Container>
    </section>
  );
}

function Price({ price, unit }: { price: string; unit: string }) {
  return (
    <div className="mt-3 flex items-baseline gap-1.5">
      <span className="text-3xl font-bold text-text tracking-tight">
        {price}
      </span>
      <span className="text-muted text-sm">{unit}</span>
    </div>
  );
}

function PlanCard({
  label,
  price,
  unit,
  note,
  items,
}: {
  label: string;
  price: string;
  unit: string;
  note?: string;
  items: Item[];
}) {
  return (
    <article className="glass rounded-xl p-6 flex flex-col">
      <div className="font-mono text-xs uppercase tracking-widest text-muted">
        {label}
      </div>
      <Price price={price} unit={unit} />
      {note && <p className="mt-1.5 text-[12px] text-muted">{note}</p>}

      <FeatureList items={items} />

      <LinkButton
        href="#waitlist"
        variant="secondary"
        size="md"
        className="mt-auto w-full"
      >
        Join waitlist
      </LinkButton>
    </article>
  );
}

function ProCard() {
  const [annual, setAnnual] = useState(true);

  return (
    <article
      className="glass-heavy relative rounded-xl overflow-hidden flex flex-col order-first sm:order-none"
      aria-label="Pro plan, most popular"
    >
      <div className="accent-stripe" />
      <span className="absolute top-3 right-3 text-[10px] font-mono uppercase tracking-widest text-action bg-action/10 border border-action/25 rounded-md px-2 py-0.5">
        Most popular
      </span>

      <div className="p-6 flex flex-1 flex-col">
        <div className="flex items-center gap-2">
          <div className="font-mono text-xs uppercase tracking-widest text-action">
            Pro
          </div>
          {annual && (
            <span className="inline-flex items-center rounded-md bg-passed/10 text-passed px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider">
              Save €57
            </span>
          )}
        </div>

        <Price
          price={annual ? "€99" : "€12.99"}
          unit={annual ? "/year" : "/month"}
        />
        {annual && (
          <p className="mt-1.5 text-[12px] text-muted">
            €8.25/month · <span className="text-action">save €57 (36%)</span> vs
            €155.88 billed monthly
          </p>
        )}

        <div
          role="group"
          aria-label="Billing period"
          className="mt-4 inline-flex items-center self-start gap-1 rounded-lg border border-white/[0.06] bg-white/[0.04] p-1 font-mono text-[11px] uppercase tracking-wider"
        >
          {[false, true].map((isAnnual) => (
            <button
              key={String(isAnnual)}
              type="button"
              onClick={() => setAnnual(isAnnual)}
              aria-pressed={annual === isAnnual}
              className={[
                "px-3 py-1 rounded-md border text-[11px] transition-colors",
                annual === isAnnual
                  ? "glass-action text-action"
                  : "border-transparent text-muted hover:text-text",
              ].join(" ")}
            >
              {isAnnual ? "Annual" : "Monthly"}
            </button>
          ))}
        </div>

        <FeatureList items={proItems} />

        <LinkButton
          href="#waitlist"
          variant="primary"
          size="md"
          className="mt-auto w-full"
        >
          Join waitlist
        </LinkButton>
      </div>
    </article>
  );
}

function FeatureList({ items }: { items: Item[] }) {
  return (
    <ul className="mt-6 mb-8">
      {items.map((item) => (
        <li
          key={item.label}
          className="flex items-center gap-2 text-sm text-muted py-1"
        >
          {item.included ? (
            <Check aria-hidden className="w-3.5 h-3.5 text-passed flex-shrink-0" />
          ) : (
            <Cross aria-hidden className="w-3.5 h-3.5 text-failed/70 flex-shrink-0" />
          )}
          <span className={item.included ? "" : "text-muted/50"}>
            <span className="sr-only">
              {item.included ? "Included: " : "Not included: "}
            </span>
            {item.label}
          </span>
        </li>
      ))}
    </ul>
  );
}
