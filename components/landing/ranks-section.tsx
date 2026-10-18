import { Paras, Screenshot, Section, ShareCard } from "@/components/landing/section";

const ranks = [
  ["Intern", "Find your footing in unfamiliar code."],
  ["Junior Engineer", "Build a reliable investigation habit."],
  ["Mid Engineer", "Work through more demanding failures."],
  ["Senior Engineer", "Practice cases with deeper interactions."],
  ["Staff Engineer", "Look beyond the symptom to the system."],
  ["Principal Engineer", "Take on the platform's toughest cases."],
];

export function RanksSection() {
  return (
    <Section
      id="ranks"
      label="Progression"
      heading="Earn the rank. Keep learning."
      intro={
        <Paras>
          {[
            "Progress through Bugdr's practice ranks as you complete cases.",
            "A rank reflects your progress on the platform. It does not certify your job level or overall engineering ability.",
          ]}
        </Paras>
      }
    >
      <ol className="relative mt-12 max-w-[560px] space-y-7 pl-9">
        {/* Connecting line, brightening toward the top rank. */}
        <span
          aria-hidden
          className="absolute bottom-2 left-[7px] top-2 w-px bg-gradient-to-b from-border via-border to-action/70"
        />
        {ranks.map(([rank, line], i) => (
          <li key={rank} className="relative">
            <span
              aria-hidden
              className="absolute -left-9 top-1 flex h-[15px] w-[15px] items-center justify-center rounded-full border bg-canvas"
              style={{
                borderColor: `rgba(139,172,255,${0.3 + i * 0.14})`,
                boxShadow: i === ranks.length - 1 ? "0 0 12px rgba(139,172,255,0.4)" : undefined,
              }}
            >
              <span className="h-[5px] w-[5px] rounded-full bg-action" style={{ opacity: 0.35 + i * 0.13 }} />
            </span>
            <h3 className="font-display text-lg font-bold text-text">{rank}</h3>
            <p className="mt-1 text-sm text-muted">{line}</p>
          </li>
        ))}
      </ol>

      <Screenshot
        name="leaderboard"
        alt="The Bugdr leaderboard: top engineers by points, with level, problems solved and AI efficiency."
      />

      <figure className="mx-auto mt-16 max-w-[760px]">
        <div className="grid gap-4 sm:grid-cols-2">
          <ShareCard
            name="rank-staff"
            alt="Rank-up card: Staff, ranked up from Senior. 15 problems, 7,640 points, 12-day streak."
          />
          <ShareCard
            name="rank-principal"
            alt="Rank-up card: Principal, ranked up from Staff. 31 problems, 15,140 points, 29-day streak."
          />
        </div>
        <figcaption className="mt-4 text-center text-sm text-muted">
          Every rank-up comes with a card worth sharing.
        </figcaption>
      </figure>

      <p className="mt-16 font-display text-2xl font-bold text-text">One verified fix at a time.</p>
    </Section>
  );
}
