"use client";

import { useEffect, useRef, useState } from "react";

// Glowing brand-blue traces that lead from each section's text down to the
// next section's label pill (every <Label> carries data-journey). Each trace
// drops below the text, turns in the gap between the two blocks, and lands on
// the next label, so it stays clear of videos and cards. Styles: .journey in
// globals.css. Rendered inside <main> (position: relative).

// One journey step: one or more paths (a split has several) plus end dots.
type Seg = { paths: string[]; dots: [number, number][] };
type Box = ReturnType<typeof box>;

// Layout position relative to `root`; offsets ignore the reveal transforms.
function box(el: HTMLElement, root: HTMLElement) {
  let x = 0;
  let y = 0;
  for (let e: HTMLElement | null = el; e && e !== root; e = e.offsetParent as HTMLElement | null) {
    x += e.offsetLeft;
    y += e.offsetTop;
  }
  return { left: x, top: y, bottom: y + el.offsetHeight, cx: x + el.offsetWidth / 2 };
}

// Down, rounded turn, across, rounded turn, down.
function trace(x1: number, y1: number, ym: number, x2: number, y2: number) {
  const dx = x2 - x1;
  if (Math.abs(dx) < 1) return `M${x1} ${y1}V${y2}`;
  const s = Math.sign(dx);
  const r = Math.max(0, Math.min(24, Math.abs(dx) / 2, ym - y1, y2 - ym));
  return `M${x1} ${y1}V${ym - r}Q${x1} ${ym} ${x1 + s * r} ${ym}H${x2 - s * r}Q${x2} ${ym} ${x2} ${ym + r}V${y2}`;
}

export function JourneyLines() {
  const ref = useRef<SVGSVGElement>(null);
  const [segs, setSegs] = useState<Seg[]>([]);
  const [size, setSize] = useState({ w: 0, h: 0 });

  useEffect(() => {
    const root = ref.current?.parentElement;
    if (!root) return;
    const measure = () => {
      const points = [...root.querySelectorAll<HTMLElement>("[data-journey]")].map((label) => {
        const col = label.closest<HTMLElement>(".rv") ?? label.parentElement!;
        const parent = col.parentElement!;
        // Side-by-side columns: start under the text column. Stacked (centered
        // sections, or two-column ones on small screens): start under the whole
        // stack so the line never crosses a video or cards below the text.
        const stacked = [...parent.children].every((c) => (c as HTMLElement).offsetLeft === col.offsetLeft);
        // Content that follows the row (e.g. the company cards after a
        // centered intro) belongs to it, up to the next labelled block.
        const textBottom = box(parent, root).bottom;
        let rowBottom = textBottom;
        let split: { cards: Box[]; bottom: number } | undefined;
        for (let s = parent.nextElementSibling; s && !s.querySelector("[data-journey]"); s = s.nextElementSibling) {
          const sb = box(s as HTMLElement, root);
          rowBottom = Math.max(rowBottom, sb.bottom);
          if ((s as HTMLElement).dataset.journeySplit !== undefined) {
            split = { cards: [...s.children].map((c) => box(c as HTMLElement, root)), bottom: sb.bottom };
          }
        }
        const blockBottom = stacked ? rowBottom : box(col, root).bottom;
        return { label: box(label, root), blockBottom, textBottom, rowTop: box(parent, root).top, rowBottom, split };
      });
      const next: Seg[] = [];
      for (let i = 1; i < points.length; i++) {
        const a = points[i - 1];
        const b = points[i];
        const x1 = Math.round(a.label.cx);
        let y1 = Math.round(a.blockBottom + 24);
        const paths: string[] = [];
        const dots: [number, number][] = [];
        if (a.split) {
          // Fork under the text into each card column, link the cards down the
          // column, and merge back under the grid; the step then continues.
          const y0 = Math.round(a.textBottom + 10);
          const merge = Math.round(a.split.bottom + 56);
          const columns = new Map<number, Box[]>();
          for (const c of a.split.cards) columns.set(c.left, [...(columns.get(c.left) ?? []), c]);
          dots.push([x1, y0], [x1, merge]);
          for (const cards of columns.values()) {
            cards.sort((p, q) => p.top - q.top);
            const cx = Math.round(cards[0].cx);
            const top = Math.round(cards[0].top - 6);
            paths.push(trace(x1, y0, Math.round((y0 + top) / 2), cx, top));
            dots.push([cx, top]);
            for (let k = 1; k < cards.length; k++) {
              const from = Math.round(cards[k - 1].bottom + 6);
              const to = Math.round(cards[k].top - 6);
              paths.push(`M${cx} ${from}V${to}`);
              dots.push([cx, from], [cx, to]);
            }
            const out = Math.round(cards[cards.length - 1].bottom + 6);
            paths.push(trace(cx, out, Math.round((out + merge) / 2), x1, merge));
            dots.push([cx, out]);
          }
          y1 = merge;
        }
        const x2 = Math.round(b.label.cx);
        const y2 = Math.round(b.label.top - 12);
        if (y2 - y1 < 40) continue;
        let ym = Math.round((a.rowBottom + b.rowTop) / 2);
        if (ym <= y1 + 8 || ym >= y2 - 8) ym = Math.round((y1 + y2) / 2);
        paths.push(trace(x1, y1, ym, x2, y2));
        dots.push([x1, y1], [x2, y2]);
        next.push({ paths, dots });
      }
      setSegs(next);
      setSize({ w: root.clientWidth, h: root.scrollHeight });
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(root);
    return () => ro.disconnect();
  }, []);

  return (
    <svg ref={ref} aria-hidden className="journey" width={size.w} height={size.h}>
      {segs.map((s, i) => (
        <g key={i}>
          {s.paths.map((d, k) => (
            <g key={k}>
              <path className="journey-base" d={d} />
              <path className="journey-pulse" d={d} pathLength={1} style={{ animationDelay: `${-i * 1.3}s` }} />
            </g>
          ))}
          {s.dots.map(([cx, cy], k) => (
            <circle key={k} className="journey-dot" cx={cx} cy={cy} r={2.5} />
          ))}
        </g>
      ))}
    </svg>
  );
}
