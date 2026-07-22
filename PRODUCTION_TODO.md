# Pre-production checklist

Things to do before this site goes live (do NOT ship these dev conveniences).

## Remove admin-facing placeholder notes
During the build, several pages carry small helper notes that explain the CMS
workflow to us, e.g.:

> "Certificate documents, the licence number and the Saudization and Mowaamah
> certificates are added and kept current by Printopack through the site's admin."
> (Arabic: "تُضيف برنتوباك وثائق الشهادات ورقم الترخيص ... عبر لوحة تحكم الموقع.")

These are for our reference only and must be **removed before production**, they should
not be visible to site visitors. Known locations (search for these classes/strings):
- `responsibility.astro` — `.resp-note` ("...through the site's admin")
- `quality.astro` — `.qnote` ("...appear here through the site's admin")
- Any page built later with a similar "added/updated by Printopack through the admin" line.

Tip: these notes use muted italic helper classes (`resp-note`, `qnote`, etc.). Strip the
lines, not the surrounding content.

## Other pre-production items
- Replace the expired BRCGS certificate image with the client's current certificate(s).
- Get the client's final Arabic sign-off on drafted vision/mission text.
- Fill client-gated placeholders (owner names/photos, team, product descriptions, etc.).
- Wire the admin to a real backend (currently a localStorage demo).
