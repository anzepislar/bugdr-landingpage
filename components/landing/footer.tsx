"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { OperatorLine } from "@/components/landing/operator-line";
import { APP_URL } from "@/lib/site";

// Internal paths use next/link (keeps basePath); app links are plain <a>.
const links = [
  { label: "How it works", href: "/#how-it-works" },
  { label: "Pricing", href: `${APP_URL}/pricing?ref=landing` },
  { label: "Login", href: `${APP_URL}?ref=landing` },
  { label: "Affiliates", href: "/affiliates" }, // ponytail: placeholder, page doesn't exist yet
  { label: "Privacy", href: "/privacy" },
  { label: "Terms", href: "/terms" },
];

// Used on the home page and the legal pages. The operator line stays:
// it's the site's legal operator disclosure.
export function Footer() {
  const path = usePathname().replace(/\/$/, "");
  return (
    <footer className="site-footer relative overflow-x-hidden">
      <div aria-hidden className="feature-divider" />
      <nav aria-label="Footer" className="flex flex-wrap justify-center gap-1 px-5 pt-14 text-[14px]">
        {links.map((l) => {
          const active = l.href === path;
          const cls = `rounded-full border px-4 py-1.5 transition-colors ${
            active ? "border-border bg-surface text-text" : "border-transparent text-muted hover:text-text"
          }`;
          return l.href.startsWith("http") ? (
            <a key={l.label} href={l.href} className={cls}>
              {l.label}
            </a>
          ) : (
            <Link key={l.label} href={l.href} className={cls} aria-current={active ? "page" : undefined}>
              {l.label}
            </Link>
          );
        })}
      </nav>
      <p aria-hidden className="footer-brand">
        Bugdr
      </p>
      <div className="relative space-y-1 px-5 pb-8 text-center text-[12px] text-muted">
        <p>© 2026 Bugdr. All rights reserved.</p>
        <OperatorLine className="text-[12px] text-muted2" />
      </div>
    </footer>
  );
}
