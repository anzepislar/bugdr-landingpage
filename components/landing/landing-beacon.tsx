"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

// First-party page-view beacon: one per page view, no cookies.
// Plain-string body → text/plain, so no CORS preflight.
export function LandingBeacon() {
  const pathname = usePathname();

  useEffect(() => {
    try {
      const host = location.hostname;
      if (host === "localhost" || host === "127.0.0.1") return;
      if (!navigator.sendBeacon || !crypto.randomUUID) return;
      let id = sessionStorage.getItem("bugdr_landing");
      if (!id) {
        id = crypto.randomUUID();
        sessionStorage.setItem("bugdr_landing", id);
      }
      navigator.sendBeacon(
        "https://app.bugdr.app/api/v1/events/landing",
        JSON.stringify({ sessionId: id, path: location.pathname }),
      );
    } catch {
      // never break the page over analytics
    }
  }, [pathname]);

  return null;
}
