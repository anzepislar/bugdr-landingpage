// Fixed home-page background: night-sky gradient, two star layers (one
// drifting), and blurred clouds drifting at different speeds. Styles in
// globals.css (.sky). All sections are transparent, so it shows behind
// the whole page.

function Cloud({ opacity, blur }: { opacity: number; blur: number }) {
  return (
    <svg viewBox="0 0 1000 300" aria-hidden style={{ filter: `blur(${blur}px)` }}>
      <g fill="currentColor" fillOpacity={opacity}>
        <ellipse cx="300" cy="190" rx="220" ry="70" />
        <ellipse cx="420" cy="140" rx="150" ry="95" />
        <ellipse cx="560" cy="170" rx="190" ry="80" />
        <ellipse cx="690" cy="195" rx="160" ry="55" />
      </g>
    </svg>
  );
}

const clouds = [
  { top: "4%", duration: 180, opacity: 0.06, blur: 50 },
  { top: "28%", duration: 300, opacity: 0.04, blur: 80 },
  { top: "52%", duration: 240, opacity: 0.05, blur: 60 },
  { top: "74%", duration: 210, opacity: 0.03, blur: 70 },
];

export function Sky() {
  return (
    <div aria-hidden className="sky">
      <div className="stars stars-a" />
      <div className="stars stars-b" />
      {clouds.map((c, i) => (
        <div
          key={i}
          className="cloud-row"
          // Negative delay staggers where each cloud starts in its loop.
          style={{ top: c.top, animationDuration: `${c.duration}s`, animationDelay: `-${c.duration * (i * 0.27)}s` }}
        >
          <Cloud opacity={c.opacity} blur={c.blur} />
          <Cloud opacity={c.opacity} blur={c.blur} />
        </div>
      ))}
    </div>
  );
}
