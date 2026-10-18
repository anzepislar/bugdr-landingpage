import { Section } from "@/components/landing/section";

const roles = [
  ["Backend", "The connection pool runs out under load. Find out why."],
  ["Frontend", "The page keeps rendering. The browser keeps slowing down."],
  ["Full-stack", "Two users. One slot. Somehow both booked it."],
  ["Database", "The dashboard is slow. The queries tell the story."],
  ["AI / LLM", "The summarizer sends more context than the model can handle."],
  ["DevOps / SRE", "The service keeps running out of memory. Restarting it isn't the investigation."],
];

export function Roles() {
  return (
    <Section id="roles" label="Roles" heading="Practice the failures behind the job title.">
      <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {roles.map(([role, line]) => (
          <li key={role} className="card p-6">
            <h3 className="font-display text-lg font-bold text-text">{role}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted">{line}</p>
          </li>
        ))}
      </ul>
    </Section>
  );
}
