// Prebuild step: refresh db/seed.json from the published content snapshot before Astro builds.
// Runs automatically via `npm run build`.
//
// - If CONTENT_URL is set (Cloudflare production build), fetch that JSON (the R2 content.json
//   written by /api/publish) and write it to db/seed.json IN THE BUILD WORKSPACE. On Cloudflare
//   the workspace is ephemeral, so the committed seed.json is never changed.
// - If CONTENT_URL is not set (local dev/build), do nothing: the site builds from the committed
//   db/seed.json baseline.
import { writeFileSync } from 'node:fs';

const url = process.env.CONTENT_URL;
const seedPath = new URL('../db/seed.json', import.meta.url);

if (!url) {
  console.log('[content] no CONTENT_URL set; building from committed db/seed.json');
} else {
  try {
    const res = await fetch(url, { headers: { accept: 'application/json' } });
    if (!res.ok) throw new Error('HTTP ' + res.status);
    const data = await res.json();
    if (!data || !data.entries || !data.singletons) throw new Error('snapshot missing entries/singletons');
    writeFileSync(seedPath, JSON.stringify(data, null, 2));
    console.log('[content] built from the published snapshot at ' + url);
  } catch (e) {
    console.warn('[content] snapshot fetch failed (' + e.message + '); falling back to committed db/seed.json');
  }
}
