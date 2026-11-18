// Terms of Service for bug.dr, as one self-contained Next.js App Router page.
// Copy to app/terms/page.tsx in any Next.js + Tailwind project. It only
// imports from "next" and "react"; no project components, config or CSS.
// Generated from the landing site's app/terms/page.tsx: keep the wording
// of both in sync when the policy changes.
import type { Metadata } from "next";
import type { ReactNode } from "react";

// Who operates bug.dr. Keep in sync with lib/operator.ts on the landing site.
const operator = {
  name: "Anže Pišlar",
  address: "Dobrave 1, 1236 Trzin, Slovenia",
  registrationId: "", // leave empty to omit the "registration no." clause
} as const;

export const metadata: Metadata = {
  title: "Terms of Service · bug.dr",
  description:
    "The rules for using bug.dr. Eligibility, the AI assistant, scoring, acceptable use, contests, your content, liability and governing law.",
  // The public copy lives on www.bugdr.app; this keeps search engines from indexing both.
  alternates: { canonical: "https://www.bugdr.app/terms" },
};

const LAST_UPDATED = "Last updated: October 9, 2026";

const sections: LegalSection[] = [
  {
    slug: "who-we-are-acceptance",
    title: "Who we are and acceptance of the terms",
    body: (
      <>
        <p>
          These terms govern your use of <span className="text-[#8BACFF]">bug.dr</span>, operated by{" "}
          <strong>{operator.name}</strong> (the "operator", "we", "us"),
          with a registered address of <strong>{operator.address}</strong>.
        </p>
        <p>
          By creating an account or using <span className="text-[#8BACFF]">bug.dr</span>, you agree to these
          terms and to our <a href="/privacy">Privacy Policy</a>. If you
          do not agree, do not use the service.
        </p>
      </>
    ),
  },
  {
    slug: "eligibility",
    title: "Eligibility and accounts",
    body: (
      <>
        <p>
          You must be at least 16 years old to use <span className="text-[#8BACFF]">bug.dr</span>. By using the
          service, you confirm that you are.
        </p>
        <p>
          Keep your account credentials safe. You are responsible for
          activity on your account. Tell us promptly if you think someone else has used your account.
        </p>
      </>
    ),
  },
  {
    slug: "what-bugdr-is",
    title: "What bug.dr is",
    body: (
      <p>
        <span className="text-[#8BACFF]">bug.dr</span> is a practice environment for engineers. You work on
        production-style problems with an AI assistant in your editor,
        submit your work, and receive a score based on correctness,
        code quality, verification, time and AI efficiency. <span className="text-[#8BACFF]">bug.dr</span> is{" "}
        <strong>not a hiring service</strong>. We do not guarantee
        interviews, job offers, or any other outcome from your use of
        the platform.
      </p>
    ),
  },
  {
    slug: "scoring",
    title: "Scoring",
    body: (
      <>
        <p>
          Scores are calculated by <span className="text-[#8BACFF]">bug.dr</span> from your submission, the
          acceptance checks, and how you worked. The exact method may
          change over time as we improve the product.
        </p>
        <p>Each problem can be solved once for score.</p>
      </>
    ),
  },
  {
    slug: "ai-assistant",
    title: "AI assistant",
    body: (
      <>
        <p>
          The AI assistant in the workspace is a tool, not a source of
          truth. Its outputs can be wrong, incomplete, or out of date.
          You are responsible for what you submit and for the choices you
          make in the workspace.
        </p>
        <p>
          What we collect and why is explained in the{" "}
          <a href="/privacy/#what-we-collect">Privacy Policy</a>.
        </p>
      </>
    ),
  },
  {
    slug: "acceptable-use",
    title: "Acceptable use",
    body: (
      <>
        <p>When using <span className="text-[#8BACFF]">bug.dr</span> you must not:</p>
        <ul className="list-disc pl-5 space-y-1.5">
          <li>
            Do not publish or share solutions to problems anywhere
            outside the <span className="text-[#8BACFF]">bug.dr</span> discussion area. The discussion for a
            problem opens only after you have solved it.
          </li>
          <li>
            Cheat, share answers, or coordinate with other users in
            contests in a way that breaks the rules of the contest.
          </li>
          <li>
            Use bots, scripts or other automation to interact with the
            workspace, except for the in-product AI assistant.
          </li>
          <li>
            Create or operate multiple accounts to farm points, game
            streaks, or otherwise subvert scoring.
          </li>
          <li>
            Attack, probe, or attempt to disrupt the workspace
            infrastructure, including the editor, the terminal, the
            test runner and the AI assistant.
          </li>
          <li>
            Reverse engineer, decompile, or otherwise attempt to read
            the source of the acceptance checks, the test cases or the
            scoring engine.
          </li>
        </ul>
        <p>
          We may suspend or terminate accounts that violate these rules.
        </p>
      </>
    ),
  },
  {
    slug: "contests",
    title: "Contests",
    body: (
      <p>
        <strong>[CONTEST PRIZES: none or details]</strong>.
      </p>
    ),
  },
  {
    slug: "your-content",
    title: "Your content",
    body: (
      <>
        <p>
          You keep ownership of the code and solutions you write in{" "}
          <span className="text-[#8BACFF]">bug.dr</span>. We do not claim ownership of your work.
        </p>
        <p>
          You give us a limited licence to host, process, score and
          display your code, results and profile statistics as needed
          to run the service. How long we keep this data is explained
          in the{" "}
          <a href="/privacy/#how-long-we-keep-it">Privacy Policy</a>.
        </p>
      </>
    ),
  },
  {
    slug: "our-content",
    title: "Our content",
    body: (
      <p>
        The problems, the acceptance checks, the scoring engine, the
        UI, the brand and the platform itself are owned by <span className="text-[#8BACFF]">bug.dr</span> or
        our licensors. You may use them only as allowed by these
        terms.
      </p>
    ),
  },
  {
    slug: "availability",
    title: "Availability",
    body: (
      <p>
        <span className="text-[#8BACFF]">bug.dr</span> is new and under active development. We may add, change
        or remove features at any time. The service may be
        interrupted for maintenance, updates, or reasons outside our
        control. We aim to give notice for planned downtime, but we
        do not guarantee uninterrupted availability.
      </p>
    ),
  },
  {
    slug: "termination",
    title: "Termination",
    body: (
      <>
        <p>
          You can stop using <span className="text-[#8BACFF]">bug.dr</span> at any time and delete your account
          from your account settings. How long we keep your data after
          deletion is explained in the{" "}
          <a href="/privacy/#how-long-we-keep-it">Privacy Policy</a>.
        </p>
        <p>
          We may suspend or terminate your access if you break these
          terms, if your account is inactive for an extended period, or
          if we are required to do so by law. Where reasonable, we will
          give you notice first.
        </p>
      </>
    ),
  },
  {
    slug: "liability",
    title: "Liability",
    body: (
      <>
        <p>
          <span className="text-[#8BACFF]">bug.dr</span> is provided "as is" and "as available". To the fullest
          extent allowed by law, we exclude all warranties, conditions
          and terms, whether express or implied.
        </p>
        <p>
          We are not liable for indirect or consequential losses, loss
          of profit, loss of data, or loss of business opportunity
          arising from your use of the service. Where we cannot
          exclude liability by law, our total liability for any claim
          is limited to the amount you have paid us in the twelve
          months before the claim.
        </p>
        <p>
          Nothing in these terms removes or limits any consumer rights
          you have under the mandatory law of your country of
          residence.
        </p>
      </>
    ),
  },
  {
    slug: "governing-law",
    title: "Governing law",
    body: (
      <p>
        These terms are governed by the laws of{" "}
        <strong>the Republic of Slovenia</strong>. Any dispute
        will be resolved by the courts of{" "}
        <strong>Ljubljana</strong>, unless
        mandatory consumer law in your country of residence gives you
        the right to bring a claim in your local courts.
      </p>
    ),
  },
  {
    slug: "changes-to-these-terms",
    title: "Changes to these terms",
    body: (
      <p>
        We may update these terms. When we do, we will change the
        "Last updated" date at the top and, for material changes,
        email affected users or show a notice in the app. Continued
        use of <span className="text-[#8BACFF]">bug.dr</span> after a change means you accept the new terms.
        If you do not accept the new terms, you can stop using the
        service and delete your account.
      </p>
    ),
  },
];

export default function TermsPage() {
  return (
    <LegalLayout
      title="Terms of Service"
      lastUpdated={LAST_UPDATED}
      sections={sections}
    />
  );
}

// ── Layout ─────────────────────────────────────────────────────────────
// Page shell: title, last-updated line, operator line, table of contents,
// then the numbered sections. Hex colors are the Graphite Signal tokens
// (text #F2F3F5, muted #ACB2BE, action #8BACFF, border #383C43,
// surface #202226) so this works without the landing site's Tailwind theme.
type LegalSection = {
  slug: string;
  title: string;
  body: ReactNode;
};

function LegalLayout({
  title,
  lastUpdated,
  sections,
}: {
  title: string;
  lastUpdated: string;
  sections: LegalSection[];
}) {
  return (
    <main className="mx-auto w-full max-w-3xl px-5 py-16 text-[#F2F3F5] sm:py-24 md:px-8">
      <h1 className="text-4xl font-semibold leading-[1.15] tracking-[-0.025em] sm:text-5xl">{title}</h1>
      <div className="mt-4 text-sm text-[#ACB2BE]">
        <p className="font-mono text-[11px]">{lastUpdated}</p>
        <p className="mt-2">
          <span className="text-[#8BACFF]">bug.dr</span> is operated by {operator.name}, {operator.address}
          {operator.registrationId ? <>, registration no. {operator.registrationId}</> : null}.
        </p>
      </div>

      <nav aria-label="Table of contents" className="mt-12 rounded-xl border border-[#383C43] bg-[#202226]/60 p-6">
        <p className="font-mono text-[11px] uppercase tracking-widest text-[#ACB2BE]">Contents</p>
        <ol className="mt-3 space-y-1.5 text-sm">
          {sections.map((s, i) => (
            <li key={s.slug}>
              <a href={`#${s.slug}`} className="text-[#F2F3F5]/85 transition-colors hover:text-[#F2F3F5]">
                <span className="mr-2 font-mono text-[#ACB2BE]">{String(i + 1).padStart(2, "0")}</span>
                {s.title}
              </a>
            </li>
          ))}
        </ol>
      </nav>

      <div className="mt-16 space-y-16">
        {sections.map((s, i) => (
          <section key={s.slug} id={s.slug} className="scroll-mt-20">
            <h2 className="text-2xl font-semibold leading-[1.15] tracking-[-0.025em] sm:text-3xl">
              <span className="mr-3 align-middle font-mono text-base text-[#8BACFF]">{String(i + 1).padStart(2, "0")}</span>
              {s.title}
            </h2>
            <div className="mt-4 space-y-4 leading-relaxed text-[#ACB2BE] [&_a]:text-[#F2F3F5] [&_a]:underline [&_a]:decoration-[#F2F3F5]/30 [&_a]:underline-offset-2 hover:[&_a]:decoration-[#F2F3F5] [&_strong]:font-medium [&_strong]:text-[#F2F3F5]">
              {s.body}
            </div>
          </section>
        ))}
      </div>
    </main>
  );
}
