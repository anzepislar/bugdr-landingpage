"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { assetPath } from "@/lib/asset-path";
import { CtaButton } from "@/components/landing/cta-button";

// Sticky top nav. "home": transparent over the hero, glass once the page
// scrolls; section links hide on mobile. "legal": logo and
// a link back home (privacy / terms pages).

const links = [
  { href: "#how-it-works", label: "How it works" },
  { href: "#pricing", label: "Pricing" },
];

function Logo({ href }: { href: string }) {
  return (
    <Link href={href} aria-label="Bugdr home" className="flex items-center p-1 -ml-1">
      <Image
        src={assetPath("/logos/primary-lockup.png")}
        alt="Bugdr"
        width={108}
        height={28}
        className="h-7 w-auto"
        priority
      />
    </Link>
  );
}

export function Nav({ variant = "home" }: { variant?: "home" | "legal" }) {
  const [scrolled, setScrolled] = useState(variant === "legal");
  const [pastHero, setPastHero] = useState(false);

  useEffect(() => {
    if (variant !== "home") return;
    // Hero is one viewport tall (100svh); past it minus the 64px bar = hero is gone.
    const update = () => {
      setScrolled(window.scrollY > 8);
      setPastHero(window.scrollY > window.innerHeight - 64);
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, [variant]);

  return (
    <header
      className={[
        "fixed inset-x-0 top-0 z-50 border-b transition-[background-color,border-color] duration-300",
        scrolled
          ? "border-white/[0.07] bg-canvas/70 backdrop-blur-xl"
          : "border-transparent",
      ].join(" ")}
    >
      <div className="mx-auto flex h-16 max-w-[1100px] items-center justify-between gap-4 px-5 md:px-8">
        {variant === "legal" ? (
          <>
            <Logo href="/" />
            <Link href="/" className="text-sm text-muted transition-colors hover:text-text">
              ← Home
            </Link>
          </>
        ) : (
          <>
            <Logo href="#top" />
            <nav aria-label="Primary" className="flex items-center gap-6">
              {links.map((l) => (
                <a
                  key={l.href}
                  href={l.href}
                  className="hidden text-sm text-muted transition-colors hover:text-text sm:inline"
                >
                  {l.label}
                </a>
              ))}
              <CtaButton hidden={!pastHero} />
            </nav>
          </>
        )}
      </div>
    </header>
  );
}
