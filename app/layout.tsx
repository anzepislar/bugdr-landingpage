import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { SITE_URL } from "@/lib/site";

// Inter (body) and Syne (display), downloaded from Google Fonts and
// self-hosted instead of next/font/google: Turbopack fails the build with
// "Can't resolve '@vercel/turbopack-next/internal/font/google/font'" when
// the build machine can't reach Google Fonts. Geist Mono stays for code.
const inter = localFont({
  src: [
    { path: "./fonts/inter-400.woff2", weight: "400" },
    { path: "./fonts/inter-500.woff2", weight: "500" },
    { path: "./fonts/inter-600.woff2", weight: "600" },
  ],
  variable: "--font-inter",
  display: "swap",
});

const syne = localFont({
  src: [
    { path: "./fonts/syne-600.woff2", weight: "600" },
    { path: "./fonts/syne-700.woff2", weight: "700" },
    { path: "./fonts/syne-800.woff2", weight: "800" },
  ],
  variable: "--font-syne",
  display: "swap",
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
      className={`${inter.variable} ${syne.variable} ${geistMono.variable}`}
    >
      <body className="text-text font-sans antialiased min-h-screen">
        {children}
      </body>
    </html>
  );
}
