"use client";

import { Container } from "@/components/landing/container";
import { Check, Sparkle } from "@/components/landing/icons";
import styles from "./feedback-chat.module.css";

export function AIFeedback() {
  return (
    <section
      id="feedback"
      aria-labelledby="feedback-heading"
      className="lower-section relative divider-top"
    >
      <Container>
        <div className="max-w-2xl">
          <h2
            id="feedback-heading"
            className="text-3xl sm:text-4xl font-semibold text-headline"
          >
            You fixed it. Now learn from it.
          </h2>
          <p className="mt-4 text-muted text-lg leading-relaxed">
            After each solve, get a debrief based on your session. See how many prompts,
            tokens, and test runs you used, how you compare with other people on that
            case, and what you could try differently next time.
          </p>
        </div>

        <div className={styles.chat} aria-label="Example AI feedback conversation">
          <header className={styles.header}>
            <span className={styles.identity}><Sparkle size={19} /><strong>Session debrief</strong></span>
            <span className={styles.example}>Example session</span>
          </header>
          <div className={styles.case}>
            <span>Payment retries</span>
            <span><Check size={13} />7 / 7 checks passed</span>
          </div>
          <div className={styles.conversation}>
            <div className={styles.user}>
              <span>You</span>
              <p>It passes. What could I have done better?</p>
            </div>
            <div className={styles.assistant}>
              <div className={styles.author}><Sparkle size={16} /><span><span className="brand">bug.dr</span> coach</span></div>
              <p><strong>You fixed it.</strong> Your change passed every acceptance check. The next thing to work on is how you get to the fix.</p>
              <div className={styles.metrics}>
                <div className={styles.metricHeader}><span>This session</span><span>You</span><span>Top performers</span></div>
                <div><span>Prompts</span><strong>12</strong><span>4</span></div>
                <div><span>Tokens</span><strong>3,840</strong><span>1,200</span></div>
                <div><span>First-run pass</span><strong>No</strong><span>68%</span></div>
              </div>
              <p>You ran tests <strong>8 times before your first passing run.</strong> Next time, spend a little longer on the logs before asking AI for a change.</p>
              <div className={styles.advice}>
                <h3>Try this on your next case</h3>
                <ol>
                  <li><span>1</span>Read the full stack trace.</li>
                  <li><span>2</span>Find the likely failure point.</li>
                  <li><span>3</span>Ask for one targeted change, then test it.</li>
                </ol>
              </div>
              <p className={styles.takeaway}>A working fix is the start. A repeatable approach is what you take into the next problem.</p>
            </div>
          </div>
          <footer className={styles.footer}>Illustrative feedback and benchmark data.</footer>
        </div>

        <p className="mt-5 font-mono text-[11px] text-muted">
          Generated automatically after every solve. Free tier includes
          feedback on Easy solves.
        </p>
      </Container>
    </section>
  );
}
