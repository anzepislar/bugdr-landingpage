"use client";

import { useEffect, useState } from "react";

// Launch hackathon start: Oct 21, 2026, 20:00 CEST (UTC+2) = 18:00 UTC.
export const HACKATHON_AT = Date.UTC(2026, 9, 21, 18, 0, 0);

const pad = (n: number) => String(n).padStart(2, "0");

function format(ms: number) {
  const s = Math.floor(ms / 1000);
  const d = Math.floor(s / 86_400);
  return `${d}d ${pad(Math.floor((s % 86_400) / 3600))}h ${pad(Math.floor((s % 3600) / 60))}m ${pad(s % 60)}s`;
}

// Hydration-safe: SSR and the first client render show a placeholder of the
// same shape; the real time lands after mount. Renders "Live now" once started.
export function Countdown({ target = HACKATHON_AT }: { target?: number }) {
  const [left, setLeft] = useState<number | null>(null);

  useEffect(() => {
    const update = () => setLeft(target - Date.now());
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, [target]);

  if (left !== null && left <= 0) return <span className="text-passed">Live now</span>;
  return (
    <span className="font-mono tabular-nums">
      {left === null ? "-d --h --m --s" : format(left)}
    </span>
  );
}
