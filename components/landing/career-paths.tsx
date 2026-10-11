"use client";

import { useState } from "react";
import Image from "next/image";
import { Container } from "@/components/landing/container";
import { ArrowRight, Check, Terminal } from "@/components/landing/icons";
import { assetPath } from "@/lib/asset-path";
import styles from "./career-paths.module.css";

const badgeSrc = (name: string) =>
  assetPath(`/badges/difficulty/${name.toLowerCase().replace(/ /g, "-")}.svg`);

const stages = [
  { name: "Easy", badgeColor: "#22c55e", subtitle: "Find your footing", color: "#88C9A1", title: "Small bugs. Strong foundations.", description: "Trace a failure, make a focused change, and prove it works.", cases: [["AI / ML", "A prompt that exceeds the context window"], ["Backend", "An API response the client cannot parse"], ["Database", "A vector search returning duplicate results"]] },
  { name: "Medium", badgeColor: "#f59e0b", subtitle: "Connect the pieces", color: "#E0B265", title: "Follow the bug across the stack.", description: "Work through problems that cross service boundaries and touch more than one file.", cases: [["Backend", "Model requests that time out under load"], ["Database", "A retrieval query slowing down the app"], ["Frontend", "A streaming response that never finishes"]] },
  { name: "Hard", badgeColor: "#f97316", subtitle: "Handle the pressure", color: "#ED939A", title: "Production incidents. Real trade-offs.", description: "Investigate complex failures and make changes that hold up beyond the happy path.", cases: [["AI / ML", "An evaluation pipeline with inconsistent results"], ["Backend", "Retries that trigger duplicate model calls"], ["Database", "An indexing job serving stale embeddings"]] },
  { name: "Get a job", badgeColor: "#ef4444", subtitle: "Put it all together", color: "#8BACFF", title: "Show the work behind your confidence.", description: "Bring diagnosis, implementation, and verification together against the path's performance benchmarks.", cases: [["Investigate", "Understand an unfamiliar system"], ["Fix", "Use AI deliberately and own the changes"], ["Verify", "Pass the checks without breaking the app"]] },
];

export function CareerPaths() {
  const [selected, setSelected] = useState(0);
  const stage = stages[selected];
  return (
    <section id="paths" aria-labelledby="paths-heading" className={styles.section}>
      <Container>
        <div className={styles.intro}>
          <div>
            <h2 id="paths-heading">Pick a role.<br /><span>Build your way there.</span></h2>
          </div>
          <p className={styles.lead}>Stop guessing what to practice. Follow a path built around the work your target role actually involves, one well-solved problem at a time.</p>
        </div>

        <div className={styles.pathHeader}>
          <div className={styles.role}><Terminal size={22} /><div><span>EXPLORE A PATH</span><h3>AI Engineer</h3></div></div>
          <p>Models are only part of the job.<br />Practice the backend, data, and interfaces too.</p>
        </div>

        <div className={styles.stages} role="tablist" aria-label="Career path stages">
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
              style={{ "--stage-color": item.color, "--badge-color": item.badgeColor } as React.CSSProperties}>
              <span className={styles.stageTop}><span className={styles.number}>0{index + 1}</span><span className={styles.track} /></span>
              <strong><Image className={styles.badge} src={badgeSrc(item.name)} alt={item.name} width={132} height={132} /></strong><span className={styles.subtitle}>{item.subtitle}</span>
            </button>
          ))}
        </div>

        <div id="career-stage-panel" role="tabpanel" aria-labelledby={`stage-tab-${selected}`} className={styles.panel} tabIndex={0}>
          <div className={styles.stageCopy}>
            <p className={styles.eyebrow} style={{ color: stage.color }}>STAGE 0{selected + 1} /<Image className={styles.badgeSmall} src={badgeSrc(stage.name)} alt={stage.name} width={132} height={132} /></p>
            <h3>{stage.title}</h3>
            <p>{stage.description}</p>
            <div className={styles.benchmark}><Check size={16} /><span>Pass the checks. Meet the efficiency benchmark. Move forward.</span></div>
          </div>
          <div className={styles.cases}>
            <div className={styles.caseHeading}>WHAT YOU'LL WORK ON <span>Illustrative examples</span></div>
            {stage.cases.map(([tag, title]) => <div className={styles.case} key={title}><span>{tag}</span><p>{title}</p><ArrowRight size={16} /></div>)}
          </div>
        </div>

      </Container>
    </section>
  );
}
