import { Paras, Screenshot, Section } from "@/components/landing/section";

export function Contests() {
  return (
    <Section
      id="contests"
      label="Contests and dashboard"
      heading="Same codebase. Same bug. Different AI skills."
      intro={
        <Paras>
          {[
            "Take on the same case as other participants. Compare your results and the time, prompts, and tokens your approach required.",
            "Your dashboard keeps your next challenge and progress in view.",
          ]}
        </Paras>
      }
    >
      <Screenshot
        name="dashboard"
        alt="The Bugdr dashboard: daily, weekly and monthly live contests, the case to resume, recommended problems, and rank progress with a practice streak."
      />
    </Section>
  );
}
