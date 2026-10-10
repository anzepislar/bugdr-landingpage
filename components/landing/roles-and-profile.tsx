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
      className="lower-section relative divider-top"
    >
      <Container>
        <div className="max-w-2xl">
          <h2
            id="profile-heading"
            className="text-2xl sm:text-3xl font-semibold text-headline"
          >
            Practice the work you want to do.
          </h2>
          <p className="mt-3 text-muted text-lg leading-relaxed">
            Choose your role and start with cases that fit your experience. Build
            confidence with easier fixes, then take on problems that need a deeper
            investigation.
          </p>
        </div>

        <div className="role-showcase">
          {/* Left: 3x2 role chips */}
          <div className="role-list">
            {roles.map((r) => (
              <div
                key={r.name}
                className="role-row"
              >
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[11px] text-action border border-action/40 bg-action/10 rounded px-1.5 py-0.5">
                    {r.icon}
                  </span>
                  <span className="text-sm font-medium">{r.name}</span>
                </div>
                <div className="mt-2 text-[12px] text-text/90 leading-snug">
                  {r.example}
                </div>
              </div>
            ))}
          </div>

          {/* Right: profile screenshot */}
          <ProfileShot />
        </div>
      </Container>
    </section>
  );
}

function ProfileShot() {
  return (
    <figure className="profile-preview overflow-hidden">
      <ZoomableImage
        src={assetPath("/screenshots/profile.png")}
        alt="bug.dr profile page showing points, current level, current streak, a twelve-month activity grid and a list of solved problems."
        width={1600}
        height={1329}
        sizes="(min-width: 1024px) 500px, 100vw"
      />
    </figure>
  );
}
