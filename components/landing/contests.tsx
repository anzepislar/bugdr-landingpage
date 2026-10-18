import { Paras, Screenshot, Section } from "@/components/landing/section";

export function Contests() {
  return (
    <Section
      id="contests"
      label="Contests and dashboard"
      heading="Same failure. Different approaches."
      intro={
        <Paras>
          {[
            "Daily, weekly, and monthly contests put participants on the same case. Bring your own approach and see how it compares.",
            "Your dashboard keeps your next case and progress in view.",
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
