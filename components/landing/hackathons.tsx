import { Paras, Section } from "@/components/landing/section";

export function Hackathons() {
  return (
    <Section
      id="hackathons"
      label="Hackathons"
      heading="One bug. Everyone racing."
      intro={
        <Paras>
          {[
            "On special occasions, Bugdr runs hackathons: every participant gets the same case at the same time. Your fix, your approach, your efficiency — measured against everyone else's.",
            "Prizes for the top solvers.",
          ]}
        </Paras>
      }
    />
  );
}
