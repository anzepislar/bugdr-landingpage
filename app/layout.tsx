import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import "./lower-sections.css";
import { SignalBackground } from "@/components/landing/signal-background";
import { assetPath } from "@/lib/asset-path";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
  // Restrict to the weights the site actually uses (400 body, 500
  // mid-emphasis, 600 headings). Without this, next/font/google pulls
  // all 9 weights — ~6 of them are never rendered, wasting ~150–200KB
  // of woff2 on first load. Optical sizing on the variable font kicks
  // in via `font-optical-sizing: auto` on body.
  weight: ["400", "500", "600"],
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  display: "swap",
  // Body weight for the code font; 500 for emphasized tokens (e.g. the
  // "score" line in the discharge terminal).
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://bug.dr"),
  title: "bug.dr | Get better at debugging with AI",
  description:
    "Fix production-style bugs with AI in your browser. Practice for your role, test your changes, and learn from feedback on how you worked.",
  openGraph: {
    title: "bug.dr | Get better at debugging with AI",
    description:
      "Fix production-style bugs with AI in your browser. Practice for your role, test your changes, and learn from feedback on how you worked.",
    type: "website",
    images: [assetPath("/og.png")],
  },
};

export const viewport: Viewport = {
  themeColor: "#151618",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${jetbrainsMono.variable}`}
    >
      <body className="bg-bg text-text font-sans antialiased min-h-screen relative">
        {/* Page-wide grid background — same "cubes" the hero uses, but
            fixed to the viewport so it stays present as the user scrolls
            and frames every section the same way. The radial mask in
            .bg-grid-fade keeps the corners clean. */}
        <div
          aria-hidden
          className="pointer-events-none fixed inset-0 z-0 bg-grid bg-grid-fade opacity-20"
        />
        <SignalBackground />
        {/* The post-nav-click "vacuum in, spit out" transition
            (see lib/section-focus.ts) scales this wrapper, not the
            body. The id is the anchor the Web Animations API uses,
            and keeping the transform on this element — instead of
            on <body> — leaves the body's containing block and
            stacking context untouched, so click hit-testing on the
            nav and other in-page buttons stays correct mid-animation. */}
        <div id="page-content" className="relative z-10">
          {children}
        </div>
      </body>
    </html>
  );
}
