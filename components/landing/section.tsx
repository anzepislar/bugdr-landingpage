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
// (2000x1250 WebP, converted from 2880x1800 captures).
// Links to the full-size file: on phones the in-page image is too small to read.
export function Screenshot({ name, alt }: { name: string; alt: string }) {
  const src = assetPath(`/screenshots/${name}.webp`);
  return (
    <figure className="glass mt-12 overflow-hidden rounded-card p-1.5 shadow-[0_24px_60px_-20px_rgba(0,0,0,0.7)] md:p-2">
      <a href={src} target="_blank" rel="noopener" className="block cursor-zoom-in" aria-label={`${alt} Open full size.`}>
        {/* eslint-disable-next-line @next/next/no-img-element -- static export, images unoptimized */}
        <img
          src={src}
          alt={alt}
          width={2000}
          height={1250}
          loading="lazy"
          decoding="async"
          className="block h-auto w-full rounded-[10px]"
        />
      </a>
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
