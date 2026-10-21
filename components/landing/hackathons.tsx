import { Paras, Section } from "@/components/landing/section";
import { APP_URL } from "@/lib/site";

const details = [
  "Same case for every participant.",
  "Scored on fix quality, efficiency, and time.",
  "Prizes for top finishers.",
];

export function Hackathons() {
  return (
    <Section
      id="hackathons"
      label="Hackathons"
      heading="One bug. Everyone racing."
      intro={
        <Paras>
          {[
            "Bugdr hackathons put every participant on the same case at the same time. Your fix, your approach, your efficiency — measured against everyone else's.",
            "Prizes for the top solvers.",
          ]}
        </Paras>
      }
    >
      <article className="mt-12 max-w-[640px] rounded-card border border-action/40 bg-surface2/80 p-6 shadow-[0_0_24px_rgba(139,172,255,0.15)] backdrop-blur-[16px] md:p-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="label">Launch hackathon</p>
          <span className="rounded-full border border-action/40 bg-action/10 px-3 py-1 text-xs font-medium text-action">
            Live at launch
          </span>
        </div>
        <h3 className="mt-4 font-display text-2xl font-bold text-text md:text-3xl">
          <time dateTime="2026-10-21">October 21, 2026</time>
        </h3>
        <ul className="mt-6 space-y-2.5">
          {details.map((d) => (
            <li key={d} className="flex gap-2.5 text-sm text-muted">
              <span aria-hidden className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-action" />
              {d}
            </li>
          ))}
        </ul>
        <a href={APP_URL} className="link-action mt-8 inline-block">
          Start now →
        </a>
      </article>
      <p className="mt-4 text-xs italic text-muted2">Hackathon details revealed at launch.</p>
    </Section>
  );
}
