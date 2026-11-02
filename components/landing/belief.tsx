import { Paras, Section } from "@/components/landing/section";

export function Belief() {
  return (
    <Section
      id="belief"
      label="The belief"
      heading="3am, broken code, you and your agent"
      intro={
        <Paras>
          {[
            "When you don't write the code and something’s broken. Where do you start?",
            "Bugdr puts you and your AI agent inside a codebase that big tech companies work with. Learn what matters, give your agent useful context, challenge its suggestions, and check that the fix works.",
            "Use AI. Own the code.",
          ]}
        </Paras>
      }
    />
  );
}
