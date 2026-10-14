import { Container } from "@/components/landing/container";
import { ZoomableImage } from "@/components/ui/zoomable-image";
import { assetPath } from "@/lib/asset-path";

// "Pick a role. Show your work." section.
//
// Six role chips on the left, profile screenshot on the right. Earlier
// versions used framer-motion's `whileInView` to slide each chip in from
// a different side. On the static export the SSR HTML rendered the
// chips at `opacity:0` with a translate, and the IntersectionObserver
// only fired for chips that were actually in the viewport. Off-screen
// chips stayed invisible in fullPage screenshots, for crawlers, and for
// anyone trying to print the page. The fix: render plain HTML. The
// content is always visible.

const roles = [
  {
    name: "Backend",
    icon: "BE",
    example: "A connection pool that runs out under load.",
  },
  {
    name: "Frontend",
    icon: "FE",
    example: "A page that keeps rendering until it slows to a crawl.",
  },
  {
    name: "Full-stack",
    icon: "FS",
    example: "Two users manage to book the same slot.",
  },
  {
    name: "Database",
    icon: "DB",
    example: "An orders dashboard slowed down by repeated queries.",
  },
  {
    name: "AI / LLM",
    icon: "AI",
    example: "A summarizer sending more context than the model can handle.",
  },
  {
    name: "DevOps / SRE",
    icon: "DO",
    example: "A service that keeps running out of memory.",
  },
];

export function RolesAndProfile() {
  return (
    <section
      id="profile"
      aria-labelledby="profile-heading"
      className="relative py-24 md:py-32"
    >
      <Container>
        <div className="max-w-2xl">
          <h2
            id="profile-heading"
            className="text-3xl sm:text-4xl font-semibold text-text leading-tight tracking-[-0.02em]"
          >
            Practice the work you want to do.
          </h2>
          <p className="mt-4 text-muted text-lg leading-relaxed">
            Choose your role and start with cases that fit your experience. Build
            confidence with easier fixes, then take on problems that need a deeper
            investigation.
          </p>
        </div>

        <div className="mt-10 grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-center lg:gap-14">
          <ul className="space-y-4">
            {roles.map((r) => (
              <li key={r.name}>
                <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-white/[0.08] bg-white/[0.03] text-muted text-sm font-mono hover:border-action/30 hover:text-action hover:bg-action/[0.05] transition-all cursor-default">
                  <span className="text-action/70">{r.icon}</span>
                  {r.name}
                </span>
                <p className="mt-2 pl-1 text-[13px] leading-relaxed text-muted">
                  {r.example}
                </p>
              </li>
            ))}
          </ul>

          <ProfileShot />
        </div>
      </Container>
    </section>
  );
}

function ProfileShot() {
  return (
    <figure className="glass rounded-xl overflow-hidden">
      <ZoomableImage
        src={assetPath("/screenshots/profile.png")}
        alt="bug.dr profile page showing points, current level, current streak, a twelve-month activity grid and a list of solved problems."
        width={1600}
        height={1329}
        sizes="(min-width: 1024px) 700px, 100vw"
      />
    </figure>
  );
}
