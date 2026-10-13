// Single source of truth for the operator identity. Used by the
// /privacy and /terms pages (their "Who we are" identity section)
// and by the shared footer / legal-page intro.
//
// `registrationId` is optional: leave it empty to omit the
// "registration no. {id}" clause everywhere it would otherwise
// appear. An empty string is not flagged by the build guard because
// the placeholder regex requires brackets — only literal
// `[REGISTRATION ID]` style placeholders in the legal pages are
// detected.

export const operator = {
  // Natural person operating bug.dr (s.p. form not yet registered).
  // Replace the address string below with the registered address
  // when the s.p. registration is finalised.
  name: "Anže Pišlar",
  address: "Dobrave 1, 1236 Trzin, Slovenia",
  registrationId: "",
} as const;

