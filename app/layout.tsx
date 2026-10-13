import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";
import "./lower-sections.css";
import { SignalBackground } from "@/components/landing/signal-background";
import { SITE_URL } from "@/lib/site";

// Geist + Geist Mono (full variable fonts from the official `geist` package), self-hosted instead of next/font/google:
// Turbopack fails the build with "Can't resolve
// '@vercel/turbopack-next/internal/font/google/font'" when the build
// machine can't reach Google Fonts.
const geist = localFont({
  src: "./fonts/geist.woff2",
  variable: "--font-geist",
  display: "swap",
  weight: "100 900",
});

const geistMono = localFont({
  src: "./fonts/geist-mono.woff2",
  variable: "--font-geist-mono",
  display: "swap",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Bugdr — The LeetCode Alternative for Real Engineers",
  description:
    "Practice debugging real production bugs instead of toy puzzles. Bugdr helps software engineers build the skills that actually matter on the job — not just interview tricks.",
  keywords: [
    "leetcode alternative",
    "coding practice real world",
    "production bug debugging",
    "software engineer practice",
    "backend engineer problems",
    "real world programming challenges",
    "leetcode for real jobs",
    "developer skill building",
  ],
  authors: [{ name: "Bugdr" }],
  creator: "Bugdr",
  metadataBase: new URL(SITE_URL),
  // Relative, so /privacy and /terms keep their own canonical.
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: SITE_URL,
    title: "Bugdr — Debug Real Production Bugs, Not Puzzles",
    description:
      "Stop grinding LeetCode. Practice the bugs you will actually face as a software engineer. Real codebases, real scenarios, AI-powered feedback.",
    siteName: "Bugdr",
    images: [
      {
        url: `${SITE_URL}/og.png`,
        width: 1200,
        height: 630,
        alt: "Bugdr — Real engineering practice",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Bugdr — The LeetCode Alternative for Real Engineers",
    description:
      "Practice debugging real production bugs instead of toy puzzles. Build skills that matter on the job.",
    images: [`${SITE_URL}/og.png`],
    creator: "@bugdr",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
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
      className={`${geist.variable} ${geistMono.variable}`}
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
        <div aria-hidden className="glass-blobs" />
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
