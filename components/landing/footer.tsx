import Link from "next/link";
import { Container } from "@/components/landing/container";
import { OperatorLine } from "@/components/landing/operator-line";

// Minimal footer. The operator line is rendered by OperatorLine
// (which also handles the optional registration id). Copyright and Privacy / Terms links
// sit on a second row. Used on the home page and on the legal
// pages — on mobile the nav links collapse, so this footer is the
// only way users reach Privacy and Terms.

const legalLinks = [
  { href: "/privacy", label: "Privacy" },
  { href: "/terms", label: "Terms" },
];

export function Footer() {
  return (
    <footer className="border-t border-[rgba(255,255,255,0.06)]">
      <Container>
        <div className="py-10 flex flex-col gap-4">
          <div className="flex items-center justify-between gap-6 border-b border-[rgba(255,255,255,0.06)] pb-6 mb-2">
            <span className="text-2xl text-text font-semibold">bug<span className="text-action">.</span>dr</span>
            <p className="text-muted text-sm">Use AI. Own the code.</p>
          </div>
          <OperatorLine className="text-muted/40 text-xs" />
          <div className="flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between">
            <p className="text-muted/40 text-xs">
              Use AI. Own the code. © 2026 <span className="brand">bug.dr</span>
            </p>
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
              {legalLinks.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  className="text-muted/60 text-sm hover:text-text transition-colors"
                >
                  {l.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </Container>
    </footer>
  );
}
