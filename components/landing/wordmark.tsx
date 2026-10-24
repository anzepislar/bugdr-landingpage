import { assetPath } from "@/lib/asset-path";

// The bug.dr logo sized to sit inline in running text. Height and baseline
// offset are scaled so the logo's x-height matches Inter's (~0.55em).
export function Wordmark() {
  return (
    // eslint-disable-next-line @next/next/no-img-element -- inline glyph, static export
    <img
      src={assetPath("/logos/wordmark.png")}
      alt="Bugdr"
      width={347}
      height={107}
      className="inline-block h-[0.94em] w-auto align-[-0.19em] drop-shadow-[0_0_7px_rgba(139,172,255,0.6)]"
    />
  );
}

// Swaps each "Bugdr" in a copy string for the inline logo.
export function Brandify({ children }: { children: string }) {
  return <>{children.split("Bugdr").flatMap((part, i) => (i ? [<Wordmark key={i} />, part] : [part]))}</>;
}
