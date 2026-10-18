import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/landing/container";
import { OperatorLine } from "@/components/landing/operator-line";
import { assetPath } from "@/lib/asset-path";

// Used on the home page and the legal pages. The operator line stays:
// it's the site's legal operator disclosure.
export function Footer() {
  return (
    <footer className="border-t border-white/[0.07]">
      <Container className="flex flex-col gap-6 py-10">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <Image
            src={assetPath("/logos/primary-lockup.png")}
            alt="Bugdr"
            width={108}
            height={28}
            className="h-7 w-auto self-start"
          />
          <nav aria-label="Legal" className="flex items-center gap-3 text-sm text-muted">
            <Link href="/privacy" className="transition-colors hover:text-text">Privacy Policy</Link>
            <span aria-hidden className="text-muted2">·</span>
            <Link href="/terms" className="transition-colors hover:text-text">Terms</Link>
          </nav>
        </div>
        <div className="space-y-1 text-xs text-muted2">
          <p>© 2026 Bugdr. All rights reserved.</p>
          <OperatorLine className="text-xs text-muted2" />
        </div>
      </Container>
    </footer>
  );
}
