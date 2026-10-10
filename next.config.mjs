/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Static export so the site can be served by GitHub Pages.
  // `next build` produces an `out/` directory we push to the gh-pages branch.
  output: "export",
  // next/image needs the optimization server in static export — disable it
  // and let the browser pick the right file.
  images: {
    unoptimized: true,
  },
  // Serve from the configured base path when the site is hosted on
  // GitHub Pages under a project URL (e.g. /chatgpt-bugdr-landing-page).
  // Set via the BASE_PATH env var; empty (site root) otherwise, e.g. Vercel.
  basePath: process.env.BASE_PATH || "",
  trailingSlash: true,
};

export default nextConfig;