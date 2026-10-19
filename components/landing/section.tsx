import { Container } from "@/components/landing/container";
import { assetPath } from "@/lib/asset-path";

// Shared section shell: label above a Syne heading, optional intro.
// py-16/md:py-20 on every section gives 128px/160px between sections.
export function Section({
  id,
  label,
  heading,
  intro,
  children,
}: {
  id?: string;
  label: string;
  heading?: string;
  intro?: React.ReactNode;
  children?: React.ReactNode;
}) {
  const headingId = id ? `${id}-heading` : undefined;
  return (
    <section id={id} aria-labelledby={headingId} className="py-16 md:py-20">
      <Container>
        <p className="label">{label}</p>
        {heading && (
          <h2
            id={headingId}
            className="mt-4 max-w-[20ch] font-display text-3xl font-bold leading-[1.1] tracking-[-0.02em] text-text sm:text-4xl md:text-5xl"
          >
            {heading}
          </h2>
        )}
        {intro && (
          <div className="mt-6 max-w-[65ch] space-y-4 text-base leading-relaxed text-muted md:text-lg">
            {intro}
          </div>
        )}
        {children}
      </Container>
    </section>
  );
}

// Body copy with line breaks kept from the source copy: each string is a paragraph.
export function Paras({ children }: { children: string[] }) {
  return (
    <>
      {children.map((p) => (
        <p key={p}>{p}</p>
      ))}
    </>
  );
}

export const DIFFICULTY_COLOR = {
  Easy: "#22c55e",
  Medium: "#f59e0b",
  Hard: "#f97316",
  "Get a job": "#ef4444",
} as const;

export type Difficulty = keyof typeof DIFFICULTY_COLOR;

// Product screenshot in a glass frame. Files live in public/screenshots/
// as WebP, cropped from 2880x1800 captures to the part each section is about.
// Pixel sizes of each crop: they set the aspect ratio before load, and half
// the width caps the frame so the 2x capture stays sharp and isn't upscaled.
const SCREENSHOT_SIZES: Record<string, [number, number]> = {
  "workspace-checks": [2128, 1705],
  "ai-feedback": [1454, 1259],
  "career-path": [1449, 1202],
  "problems": [1434, 1449],
  "dashboard": [2390, 827],
  "leaderboard": [1497, 799],
};

export function Screenshot({ name, alt }: { name: string; alt: string }) {
  const src = assetPath(`/screenshots/${name}.webp`);
  const [width, height] = SCREENSHOT_SIZES[name];
  return (
    <figure
      className="glass mx-auto mt-12 overflow-hidden rounded-card p-1.5 shadow-[0_24px_60px_-20px_rgba(0,0,0,0.7)] md:p-2"
      style={{ maxWidth: width / 2 + 16 }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element -- static export, images unoptimized */}
      <img
        src={src}
        alt={alt}
        width={width}
        height={height}
        loading="lazy"
        decoding="async"
        className="block h-auto w-full rounded-[10px]"
      />
    </figure>
  );
}

// Square 1080x1080 share card exported from the app (rank-up or solve result).
// The card art has its own border, so no glass frame.
export function ShareCard({ name, alt, className }: { name: string; alt: string; className?: string }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element -- static export, images unoptimized
    <img
      src={assetPath(`/screenshots/${name}.webp`)}
      alt={alt}
      width={1080}
      height={1080}
      loading="lazy"
      decoding="async"
      className={`block h-auto w-full rounded-card shadow-[0_24px_60px_-20px_rgba(0,0,0,0.8)] ${className ?? ""}`}
    />
  );
}
