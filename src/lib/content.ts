// Build-time content source. Everything the pages render comes from here.
//
// It imports db/seed.json (the committed baseline). On a Cloudflare production build,
// `scripts/fetch-content.mjs` runs first and refreshes db/seed.json in the build workspace
// with the published R2 snapshot, so the same import transparently yields live content.
// Locally (no CONTENT_URL) it stays the committed seed, so the site builds identically.
import seed from '../../db/seed.json';

type Rec = Record<string, any>;
const DB = seed as { entries: Record<string, Rec[]>; singletons: Record<string, Rec> };

/** Records for a collection (news, products, productGroups, team, careers, partners,
 *  factory, quality, responsibility, gallery, offices), in published order. */
export function collection(name: string): Rec[] {
  return DB.entries[name] || [];
}

/** A singleton object (about | settings). */
export function singleton(key: string): Rec {
  return DB.singletons[key] || {};
}

/** Wrap a flat en/ar pair into the { en, ar } shape the bilingual components expect. */
export const bi = (en: any, ar: any) => ({ en: en ?? '', ar: ar ?? en ?? '' });

/** Format an ISO date (YYYY-MM-DD) as "27 Aug 2023" to match the original display. */
export function displayDate(iso: string): string {
  if (!iso) return '';
  const d = new Date(iso);
  if (isNaN(+d)) return iso;
  return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
}
