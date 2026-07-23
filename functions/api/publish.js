// POST /api/publish  -> snapshot the current content to R2 (content.json), then trigger a
// site rebuild via the Cloudflare Pages Deploy Hook. The static build reads content.json.
import { json, readAll } from './_shared.js';

export async function onRequestPost({ env }) {
  const snapshot = { ...(await readAll(env)), publishedAt: Date.now() };
  await env.MEDIA.put('content.json', JSON.stringify(snapshot), {
    httpMetadata: { contentType: 'application/json; charset=utf-8' },
  });
  let deployed = false;
  if (env.DEPLOY_HOOK_URL) {
    try { await fetch(env.DEPLOY_HOOK_URL, { method: 'POST' }); deployed = true; } catch (e) { /* reported below */ }
  }
  return json({ ok: true, deployed });
}
