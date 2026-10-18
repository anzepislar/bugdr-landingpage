import { Paras, Section } from "@/components/landing/section";

export function Belief() {
  return (
    <Section
      id="belief"
      label="The belief"
      heading="The code doesn't care what's on your CV."
      intro={
        <Paras>
          {[
            "Something broke. A customer is waiting. Your first fix looks convincing.",
            "Does it actually work?",
            "Bugdr gives you practice codebases built around failures you could face at work. Read the report. Follow the evidence. Use AI. Test your changes.",
            "You own the fix.",
          ]}
        </Paras>
      }
    />
  );
}
