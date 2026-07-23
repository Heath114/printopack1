// POST /api/upload  { field, dataUrl }  -> stores the image in R2, returns { url }
// The admin sends a base64 data URL from its image picker; we persist it to R2 and hand
// back a public URL to store in the record.
import { json, bad } from './_shared.js';

export async function onRequestPost({ env, request }) {
  const { dataUrl } = await request.json();
  const m = /^data:([^;]+);base64,(.+)$/.exec(dataUrl || '');
  if (!m) return bad('expected a base64 data URL');
  const mime = m[1];
  const bytes = Uint8Array.from(atob(m[2]), (c) => c.charCodeAt(0));
  const ext = (mime.split('/')[1] || 'bin').replace('jpeg', 'jpg').replace('svg+xml', 'svg');
  const key = 'uploads/' + Date.now().toString(36) + Math.random().toString(36).slice(2, 8) + '.' + ext;
  await env.MEDIA.put(key, bytes, { httpMetadata: { contentType: mime } });
  const base = (env.R2_PUBLIC_BASE || '').replace(/\/$/, '');
  return json({ url: base + '/' + key, key });
}
