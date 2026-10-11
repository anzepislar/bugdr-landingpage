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
      className="lower-section relative divider-top"
    >
      <Container>
        <div className="max-w-2xl">
          <h2
            id="pricing-heading"
            className="mt-3 text-3xl sm:text-4xl font-semibold text-headline"
          >
            Simple pricing
          </h2>
          <p className="mt-4 text-muted text-lg leading-relaxed">
            Free to start. Upgrade when you&apos;re serious.
          </p>
        </div>

        <div className="plan-grid">
          <PlanCard label="Free" price="€0" unit="/month" items={freeItems} />
          <ProCard />
          <PlanCard
            label="Own Key"
            price="€9.99"
            unit="/month"
            note="Bring your Anthropic or OpenAI API key"
            items={ownKeyItems}
            accent="border-[#2dd4bf]/50"
          />
          <PlanCard
            label="Max"
            price="€199"
            unit="/month"
            note="Claude Opus · 150 prompts/day"
            items={maxItems}
            accent="border-[#c084fc]/50"
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
      <span className="text-3xl font-semibold text-headline tracking-tight">
        {price}
      </span>
      <span className="text-sm text-muted">{unit}</span>
    </div>
  );
}

function PlanCard({
  label,
  price,
  unit,
  note,
  items,
  accent = "",
}: {
  label: string;
  price: string;
  unit: string;
  note?: string;
  items: Item[];
  accent?: string;
}) {
  return (
    <article
      className={`glass ${accent} p-6 sm:p-8 flex flex-col`}
    >
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
        className="mt-8 w-full"
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
      className="plan-pro glass glass-pro p-6 sm:p-8 flex flex-col"
      aria-label="Pro plan, most popular"
    >
      <span className="absolute -top-3 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md bg-action px-3 py-0.5 font-mono text-[10px] uppercase tracking-wider text-bg">
        Most popular
      </span>

      <div className="flex items-center justify-between gap-3">
        <div className="font-mono text-xs uppercase tracking-widest text-action">
          Pro
        </div>
        {annual && (
          <span className="inline-flex items-center rounded-md bg-action/15 text-action px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider">
            Save €57
          </span>
        )}
      </div>

      <Price
        price={annual ? "€99" : "€12.99"}
        unit={annual ? "/year" : "/month"}
      />

      <div
        role="group"
        aria-label="Billing period"
        className="mt-4 inline-flex items-center self-start rounded-[10px] border border-border bg-bg/40 p-1 font-mono text-[11px] uppercase tracking-wider"
      >
        {[false, true].map((isAnnual) => (
          <button
            key={String(isAnnual)}
            type="button"
            onClick={() => setAnnual(isAnnual)}
            aria-pressed={annual === isAnnual}
            className={[
              "px-3 py-1 rounded-md transition-colors",
              annual === isAnnual
                ? "bg-action/15 text-action"
                : "text-muted hover:text-text",
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
        className="mt-8 w-full"
      >
        Join waitlist
      </LinkButton>
    </article>
  );
}

function FeatureList({ items }: { items: Item[] }) {
  return (
    <ul className="mt-6 space-y-2.5">
      {items.map((item) => (
        <li
          key={item.label}
          className="flex items-start gap-2.5 text-[14px] leading-snug"
        >
          <span
            aria-hidden
            className={[
              "mt-0.5 inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-full ring-1",
              item.included
                ? "bg-action/15 text-action ring-action/40"
                : "bg-diffImpossible/10 text-diffImpossible ring-diffImpossible/40",
            ].join(" ")}
          >
            {item.included ? <Check size={11} /> : <Cross size={11} />}
          </span>
          <span className={item.included ? "text-text" : "text-muted"}>
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
