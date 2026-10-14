"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Container } from "@/components/landing/container";
import { assetPath } from "@/lib/asset-path";

// "Earn your rank" : the progression section, between Features and
// Pricing. Aspirational only: no points, no locked state.

const RANKS = [
  {
    id: "intern",
    name: "Intern",
    description: "You're finding your footing in real codebases.",
    tier: "entry",
  },
  {
    id: "junior",
    name: "Junior Engineer",
    description: "You can read a stack trace and know where to start.",
    tier: "entry",
  },
  {
    id: "mid",
    name: "Mid Engineer",
    description: "Production bugs slow you down, but they don't stop you.",
    tier: "mid",
  },
  {
    id: "senior",
    name: "Senior Engineer",
    description: "Production incidents don't scare you anymore.",
    tier: "mid",
  },
  {
    id: "staff",
    name: "Staff Engineer",
    description: "You see the system, not just the bug.",
    tier: "elite",
  },
  {
    id: "principal",
    name: "Principal Engineer",
    description:
      "The rarest debuggers. You leave codebases better than you found them.",
    tier: "elite",
  },
];

export function RanksSection() {
  const grid = useRef<HTMLUListElement>(null);
  const [phase, setPhase] = useState<"static" | "hidden" | "shown">("static");

  useEffect(() => {
    const el = grid.current;
    if (!el || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    setPhase("hidden");
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setPhase("shown");
        observer.disconnect();
      },
      { threshold: 0.2 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="ranks"
      aria-labelledby="ranks-heading"
      className="relative py-24 md:py-32"
    >
      <Container>
        <div className="max-w-2xl">
          <p className="font-mono text-xs uppercase tracking-widest text-action/70 mb-3">
            Progression system
          </p>
          <h2
            id="ranks-heading"
            className="text-3xl sm:text-4xl font-semibold text-text leading-tight tracking-[-0.02em]"
          >
            Earn your rank. Prove it with code.
          </h2>
          <p className="mt-4 text-muted text-lg leading-relaxed">
            Every rank represents real engineering ability — not hours spent on
            toy puzzles. Debug your way from Intern to Principal.
          </p>
        </div>

        <ul ref={grid} className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-10">
          {RANKS.map((rank, i) => {
            const elite = rank.tier === "elite";
            // Visible in the server HTML; "hidden" is set after mount only.
            const reveal =
              phase === "hidden"
                ? "opacity-0 translate-y-4"
                : "opacity-100 translate-y-0";
            return (
              <li
                key={rank.id}
                className={`${elite ? "glass-heavy" : "glass"} relative overflow-hidden rounded-xl p-6 text-center flex flex-col items-center transition-all duration-300 ${reveal}`}
                style={phase === "shown" ? { transitionDelay: `${i * 60}ms` } : undefined}
              >
                {elite && (
                  <div className="accent-stripe rounded-t-xl absolute top-0 left-0 right-0" />
                )}
                <Image
                  src={assetPath(`/badges/${rank.id}.svg`)}
                  alt=""
                  width={92}
                  height={80}
                  className="mx-auto"
                />
                <h3 className="mt-4 font-semibold text-text">{rank.name}</h3>
                <p className="mt-2 text-[13px] leading-relaxed text-muted">
                  {rank.description}
                </p>
              </li>
            );
          })}
        </ul>

        <p className="mt-8 text-center text-sm text-muted">
          Start at the bottom. Climb by shipping fixes.
        </p>
      </Container>
    </section>
  );
}
