"use client";

import { useState } from "react";
import { Container } from "@/components/landing/container";
import { ArrowRight, Check, Terminal } from "@/components/landing/icons";
import { Badge } from "@/components/ui/badge";

const stages = [
  { name: "Easy", badgeColor: "#22c55e", subtitle: "Find your footing", color: "#88C9A1", title: "Small bugs. Strong foundations.", description: "Trace a failure, make a focused change, and prove it works.", cases: [["AI / ML", "A prompt that exceeds the context window"], ["Backend", "An API response the client cannot parse"], ["Database", "A vector search returning duplicate results"]] },
  { name: "Medium", badgeColor: "#f59e0b", subtitle: "Connect the pieces", color: "#E0B265", title: "Follow the bug across the stack.", description: "Work through problems that cross service boundaries and touch more than one file.", cases: [["Backend", "Model requests that time out under load"], ["Database", "A retrieval query slowing down the app"], ["Frontend", "A streaming response that never finishes"]] },
  { name: "Hard", badgeColor: "#f97316", subtitle: "Handle the pressure", color: "#ED939A", title: "Production incidents. Real trade-offs.", description: "Investigate complex failures and make changes that hold up beyond the happy path.", cases: [["AI / ML", "An evaluation pipeline with inconsistent results"], ["Backend", "Retries that trigger duplicate model calls"], ["Database", "An indexing job serving stale embeddings"]] },
  { name: "Get a job", badgeColor: "#ef4444", subtitle: "Put it all together", color: "#8BACFF", title: "Show the work behind your confidence.", description: "Bring diagnosis, implementation, and verification together against the path's performance benchmarks.", cases: [["Investigate", "Understand an unfamiliar system"], ["Fix", "Use AI deliberately and own the changes"], ["Verify", "Pass the checks without breaking the app"]] },
];

// Stage name → Badge tone (Get a job uses the "impossible" red).
const STAGE_TONE = { Easy: "easy", Medium: "medium", Hard: "hard", "Get a job": "impossible" } as const;

export function CareerPaths() {
  const [selected, setSelected] = useState(0);
  const stage = stages[selected];
  const tone = STAGE_TONE[stage.name as keyof typeof STAGE_TONE];
  return (
    <section id="paths" aria-labelledby="paths-heading" className="relative py-24 md:py-32">
      <Container>
        <div className="grid gap-6 md:grid-cols-2 md:items-end md:gap-16">
          <h2 id="paths-heading" className="text-3xl sm:text-4xl font-semibold text-text leading-tight tracking-[-0.02em]">
            Pick a role.<br /><span className="text-muted">Build your way there.</span>
          </h2>
          <p className="text-muted text-lg leading-relaxed">Stop guessing what to practice. Follow a path built around the work your target role actually involves, one well-solved problem at a time.</p>
        </div>

        <div className="mt-12 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg glass-action p-0 text-action"><Terminal size={20} /></span>
            <div>
              <span className="block font-mono text-xs uppercase tracking-widest text-action/70">EXPLORE A PATH</span>
              <h3 className="text-xl font-semibold text-text">AI Engineer</h3>
            </div>
          </div>
          <p className="text-sm text-muted sm:text-right">Models are only part of the job.<br />Practice the backend, data, and interfaces too.</p>
        </div>

        <div className="mt-8 max-w-full overflow-x-auto">
          <div className="inline-flex gap-1 p-1 bg-white/[0.04] rounded-xl border border-white/[0.06]" role="tablist" aria-label="Career path stages">
            {stages.map((item, index) => (
              <button key={item.name} id={`stage-tab-${index}`} role="tab" aria-selected={selected === index} aria-controls="career-stage-panel" tabIndex={selected === index ? 0 : -1}
                onClick={() => setSelected(index)}
                onKeyDown={event => {
                  let next = index;
                  if (event.key === "ArrowRight") next = (index + 1) % stages.length;
                  else if (event.key === "ArrowLeft") next = (index + stages.length - 1) % stages.length;
                  else if (event.key === "Home") next = 0;
                  else if (event.key === "End") next = stages.length - 1;
                  else return;
                  event.preventDefault(); setSelected(next); document.getElementById(`stage-tab-${next}`)?.focus();
                }}
                className={
                  selected === index
                    ? "glass-action rounded-lg px-4 py-2 text-action text-sm font-semibold whitespace-nowrap"
                    : "text-muted text-sm px-4 py-2 rounded-lg border border-transparent hover:text-text transition-colors cursor-pointer whitespace-nowrap"
                }>
                <span className="mr-2 font-mono text-xs opacity-60">0{index + 1}</span>{item.name}
              </button>
            ))}
          </div>
        </div>

        <div id="career-stage-panel" role="tabpanel" aria-labelledby={`stage-tab-${selected}`} className="glass rounded-xl p-6 mt-4 grid gap-8 md:grid-cols-2" tabIndex={0}>
          <div>
            <p className="flex items-center gap-3 font-mono text-xs uppercase tracking-widest" style={{ color: stage.badgeColor }}>
              STAGE 0{selected + 1} / <span className="normal-case tracking-normal text-muted">{stage.subtitle}</span>
            </p>
            <h3 className="mt-3 text-2xl font-semibold text-text tracking-[-0.02em]">{stage.title}</h3>
            <p className="mt-3 text-muted leading-relaxed">{stage.description}</p>
            <div className="mt-6 flex items-start gap-2 text-sm text-text"><Check size={16} className="mt-0.5 shrink-0 text-passed" /><span>Pass the checks. Meet the efficiency benchmark. Move forward.</span></div>
          </div>
          <div>
            <div className="flex items-center justify-between font-mono text-[11px] uppercase tracking-widest text-muted">WHAT YOU'LL WORK ON <span className="normal-case tracking-normal text-muted/60">Illustrative examples</span></div>
            <div className="mt-3">
              {stage.cases.map(([tag, title]) => (
                <div className="border-b border-white/[0.05] py-3 last:border-b-0 flex items-start gap-3" key={title}>
                  <Badge tone={tone} className="shrink-0">{stage.name}</Badge>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm text-text">{title}</p>
                    <span className="font-mono text-xs text-muted/60">{tag}</span>
                  </div>
                  <ArrowRight size={16} className="mt-0.5 shrink-0 text-muted/50" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
