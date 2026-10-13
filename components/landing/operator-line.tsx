import { operator } from "@/lib/operator";

// Shared "bug.dr is operated by ..." line, used in the footer and
// in the legal-page intro. Reads from `lib/operator.ts` so the
// two call sites stay in sync.
//
// Render rules:
//   - The optional "registration no. {id}" clause is only rendered
//     when `operator.registrationId` is a non-empty string. Leave
//     the config field empty to omit the clause entirely.
//
// Class names default to a small mono style suited to the footer /
// legal-page intro; callers can override with `className` for
// different sizes.

export function OperatorLine({ className }: { className?: string }) {
  return (
    <p className={className ?? "font-mono text-[11px] text-muted"}>
      <span className="brand">bug.dr</span> is operated by {operator.name}, {operator.address}
      {operator.registrationId ? (
        <>
          , registration no. <span>{operator.registrationId}</span>
        </>
      ) : null}
      .
    </p>
  );
}
