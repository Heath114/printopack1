// POST /api/li-import -> { url } -> the post's title, body, date and picture.
//
// Fills the news drawer from a pasted LinkedIn post link. Authenticated: the middleware gates
// every /api/* except login, logout, config and enquiry.
//
// WHY THIS RUNS ON THE SERVER.
// The admin used to do this from the browser, which cannot fetch linkedin.com at all (no CORS
// headers on their side), so it went through the free anonymous r.jina.ai reader. That reader
// is periodically abuse-blocked for the whole linkedin.com domain because of other people's
// traffic ("AbuseAlleviationError ... DDoS attack suspected: Too many requests"), which is
// exactly the outage the client reported: it worked, then it stopped, with nothing changed at
// our end, then it came back on its own. From here there is no CORS to satisfy and no third
// party in the path, so that class of outage is gone.
//
// WHY schema.org AND NOT og: TAGS.
// LinkedIn's public post page carries a JSON-LD block holding the real content:
//   SocialMediaPosting -> headline (the post's opening line), articleBody (the whole text),
//                         datePublished, image.url (the real feedshare picture)
//   VideoObject        -> name, thumbnailUrl, uploadDate, embedUrl
// Its og: tags are absent or generic ("Printopack posted on LinkedIn") and og:image is usually
// a LinkedIn sprite rather than the post's picture. Reading og:title is why imported headlines
// arrived as the post's hashtag block. og: is kept only as a last-resort fallback.
//
// A NOTE ON WHAT IS NOT VERIFIED YET.
// This was proven against real public posts from a normal machine. Whether LinkedIn serves the
// same page to Cloudflare's egress addresses can only be confirmed on a deployed build. If it
// does not, the caller gets `reason:"blocked"` and the drawer says so plainly rather than
// failing with a generic message.

// Every User-Agent tested (Chrome, Googlebot, LinkedInBot, facebookexternalhit, bare curl, and
// none at all) came back with byte-identical JSON-LD and the same 1245-character articleBody, so
// LinkedIn is not gating this content by client. There is therefore nothing to gain by posing as
// a browser and nothing to justify impersonating a search crawler: this says who we actually are,
// in the conventional "compatible" form that legitimate server-side fetchers use.
const UA = 'Mozilla/5.0 (compatible; PrintopackNewsImporter/1.0; +https://printopack.com.sa)';

// A hung request must not hold a Worker open until the platform kills it.
const FETCH_TIMEOUT_MS = 15000;

// The picture is handed back as a data URL for the admin to put through the same canvas resize
// and /api/upload path as any other upload, so an imported picture lands in the database as a
// capped WebP instead of being hotlinked to LinkedIn's CDN forever.
const MAX_IMAGE_BYTES = 6 * 1024 * 1024;
const MAX_HTML_BYTES = 4 * 1024 * 1024;

const json = (body, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8' },
  });

const fail = (reason, message, status = 200) => json({ ok: false, reason, message }, status);

/**
 * One fetch, with a timeout and a single retry.
 *
 * 429 and 5xx are transient by definition, and LinkedIn hands out both under load; retrying once
 * after a short pause turns most of them into a success rather than an error the client sees.
 * Anything else (including 404 and 999, LinkedIn's "go away") is returned as-is: retrying those
 * only makes us look worse to their rate limiter.
 */
async function getWithRetry(url, accept) {
  const attempt = () =>
    fetch(url, {
      redirect: 'follow',
      signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
      headers: { 'user-agent': UA, accept, 'accept-language': 'en,ar;q=0.9' },
    });
  let res = await attempt();
  if (res.status === 429 || res.status >= 500) {
    await new Promise((r) => setTimeout(r, 700));
    res = await attempt();
  }
  return res;
}

/** True for linkedin.com and its country subdomains (sa.linkedin.com and friends). */
const isLinkedIn = (h) => h === 'linkedin.com' || h.endsWith('.linkedin.com');
/** LinkedIn's media CDNs. Pictures are only ever fetched from these. */
const isLinkedInMedia = (h) => h === 'licdn.com' || h.endsWith('.licdn.com');

/**
 * Canonicalise what was pasted, and refuse anything that is not LinkedIn.
 *
 * This endpoint makes the server fetch a URL chosen by the caller, so the host allowlist IS
 * the security boundary: without it an authenticated session could point it at an internal
 * address. Only https, only LinkedIn hosts, and `lnkd.in` short links are resolved separately
 * (below) so the allowlist is re-applied to wherever they land.
 */
export function normalise(raw) {
  let u;
  try {
    u = new URL(String(raw || '').trim());
  } catch {
    return { error: 'That does not look like a link.' };
  }
  if (u.protocol !== 'https:' && u.protocol !== 'http:') return { error: 'That does not look like a link.' };
  u.protocol = 'https:';
  const host = u.hostname.toLowerCase().replace(/^www\./, '');
  if (host === 'lnkd.in') return { shortLink: u.toString() };
  if (!isLinkedIn(host)) return { error: 'That is not a LinkedIn link.' };
  // Only a single post or article can be imported. Pasting the company page used to "work": its
  // og: tags are present, so the importer happily filed the company's About blurb and cover
  // picture as a news item. The accepted shapes are /posts/<slug>_<activity-id>,
  // /feed/update/urn:li:activity:<id> and /pulse/<slug> (a LinkedIn article). Anything else is
  // refused with an instruction.
  const path = u.pathname.replace(/\/+$/, '');
  const isPost = /^\/posts\/[^/]+$/.test(path) ||
                 /^\/feed\/update\/[^/]+$/.test(path) ||
                 /^\/pulse\/[^/]+$/.test(path);
  if (!isPost) {
    return {
      error: 'That is a LinkedIn page, not a single post. Open the post itself, use its ' +
             '"Copy link to post" menu, and paste that.',
    };
  }
  // Tracking parameters change nothing about the post and only make the URL look alarming in
  // the stored record, so the query is dropped.
  u.search = '';
  u.hash = '';
  return { url: u.toString() };
}

/** Resolve an lnkd.in short link, then re-apply the allowlist to the destination. */
async function resolveShort(shortUrl) {
  const res = await fetch(shortUrl, { redirect: 'follow', headers: { 'user-agent': UA } });
  const host = new URL(res.url).hostname.toLowerCase().replace(/^www\./, '');
  if (!isLinkedIn(host)) return { error: 'That short link does not lead to LinkedIn.' };
  const again = normalise(res.url);
  return again.url ? { url: again.url } : { error: again.error || 'That short link could not be resolved.' };
}

/** Every JSON-LD block on the page, parsed, bad ones skipped. */
export function jsonLdBlocks(html) {
  const out = [];
  const re = /<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;
  let m;
  while ((m = re.exec(html))) {
    try {
      const parsed = JSON.parse(m[1].trim());
      out.push(...(Array.isArray(parsed) ? parsed : [parsed]));
    } catch { /* a malformed block is not a reason to give up on the page */ }
  }
  return out;
}

const typeOf = (node) => {
  const t = node && node['@type'];
  return Array.isArray(t) ? t.join(' ') : String(t || '');
};

export function readMeta(html, key) {
  const attr = key.startsWith('og:') || key.startsWith('article:') ? 'property' : 'name';
  const k = key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  // The quote that opens `content` is captured and required to close it, via the backreference.
  // A plain [^"']* class stops at whichever quote comes first, so an ordinary apostrophe cut the
  // value short: a LinkedIn article summary reading "the packaging industry's impact" arrived as
  // "the packaging industry", 68 characters of a 160-character summary, silently.
  const patterns = [
    new RegExp('<meta[^>]+' + attr + '=["\']' + k + '["\'][^>]*?content=(["\'])((?:(?!\\1).)*)\\1', 'i'),
    // Some pages put content= before the name/property attribute.
    new RegExp('<meta[^>]+content=(["\'])((?:(?!\\1).)*)\\1[^>]*?' + attr + '=["\']' + k + '["\']', 'i'),
  ];
  for (const re of patterns) {
    const m = re.exec(html);
    if (m) return decodeEntities(m[2]);
  }
  return '';
}

export function decodeEntities(s) {
  return String(s || '')
    .replace(/&quot;/g, '"').replace(/&#0?39;/g, "'").replace(/&apos;/g, "'")
    .replace(/&lt;/g, '<').replace(/&gt;/g, '>')
    .replace(/&#x([0-9a-f]+);/gi, (_, h) => String.fromCodePoint(parseInt(h, 16)))
    .replace(/&#(\d+);/g, (_, d) => String.fromCodePoint(+d))
    .replace(/&amp;/g, '&');
}

/**
 * LinkedIn fills the headline and description with boilerplate when a post carries no words of
 * its own (a bare photograph or a video): "Printopack posted on LinkedIn", "Post by Printopack".
 * That is not a headline and not a body, so it is discarded rather than filed as content.
 */
export const isGeneric = (s) => {
  const t = String(s || '').trim();
  if (!t) return true;
  return /^post by /i.test(t) ||
         / posted (?:on|an? [\w-]+ on) linkedin$/i.test(t) ||
         /\|\s*linkedin$/i.test(t) ||
         /^linkedin\b/i.test(t);
};

const isHashtagWord = (w) => /^[#＃][\p{L}\p{N}_]+$/u.test(w);

/**
 * A headline for the news record.
 *
 * The client's posts routinely open with a block of hashtags, and LinkedIn puts that block in
 * `headline`, which is how two of their live news items ended up titled
 * "#اليوم_العالمي_للعسل #برنتوباك #جودة ...". So a headline that is only hashtags is discarded
 * and the first line of real prose is used instead.
 */
export function pickTitle(headline, body) {
  const clean = (s) =>
    String(s || '').replace(/\s+/g, ' ').trim();

  const withoutTags = (s) =>
    clean(s).split(' ').filter((w) => w && !isHashtagWord(w)).join(' ').trim();

  const h = clean(headline);
  if (h && withoutTags(h).length >= 3) return trimTitle(withoutTags(h));

  for (const line of String(body || '').split(/\r?\n/)) {
    const t = withoutTags(line);
    if (t.length >= 3) return trimTitle(t);
  }
  // Never fall back to the raw headline: on a post that is nothing BUT hashtags that would put
  // the hashtag wall straight back into the title, which is the whole defect this function
  // exists to prevent. Whatever prose survives the strip is used, and if none does the title is
  // left empty for a person to write.
  const stripped = withoutTags(h);
  return stripped ? trimTitle(stripped) : '';
}

/** Titles are a heading, not a paragraph: cut at a word boundary near 120 characters. */
export function trimTitle(s) {
  const t = String(s || '').trim().replace(/[\s,;:.،؛]+$/u, '');
  if (t.length <= 120) return t;
  const cut = t.slice(0, 120);
  const sp = cut.lastIndexOf(' ');
  return (sp > 60 ? cut.slice(0, sp) : cut).replace(/[\s,;:.،؛]+$/u, '') + '…';
}

/** The post's own picture: schema.org first, then the page's feedshare/videocover images. */
export function pickImage(node, html) {
  const fromNode = (v) => {
    if (!v) return '';
    if (typeof v === 'string') return v;
    if (Array.isArray(v)) return fromNode(v[0]);
    return v.url || v.contentUrl || '';
  };
  // The page's own markup is searched FIRST for a full-size variant. A VideoObject's
  // `thumbnailUrl` is the player's cover at its stored size, which for an old upload can be
  // 256x144: fine as a play button, far too small for a news card asking for 1200x800.
  const inPage = html.match(/https:\/\/media\.licdn\.com\/dms\/image\/[^"'\\\s]+/g) || [];
  const wanted = inPage.filter((u) => /feedshare|videocover|image-high-res/.test(u));
  const candidates = [
    wanted.find((u) => /image-high-res/.test(u)),
    wanted.find((u) => /feedshare-shrink_1280/.test(u)),
    wanted.find((u) => /feedshare-shrink_800/.test(u)),
    wanted.find((u) => /videocover-high/.test(u)),
    fromNode(node && node.image),
    node && node.thumbnailUrl,
    wanted[0],
  ];
  for (const c of candidates) {
    if (!c || typeof c !== 'string') continue;
    try {
      const u = new URL(decodeEntities(c));
      if (u.protocol === 'https:' && isLinkedInMedia(u.hostname.toLowerCase().replace(/^www\./, ''))) {
        return u.toString();
      }
    } catch { /* not a usable URL */ }
  }
  return '';
}

/** Fetch the picture and hand it back as a data URL for the normal upload path. */
async function fetchImage(url) {
  try {
    const res = await fetch(url, { headers: { 'user-agent': UA, accept: 'image/*' } });
    if (!res.ok) return null;
    const mime = (res.headers.get('content-type') || '').split(';')[0].trim().toLowerCase();
    if (!/^image\/(jpeg|png|webp|gif)$/.test(mime)) return null;
    const buf = new Uint8Array(await res.arrayBuffer());
    if (!buf.length || buf.length > MAX_IMAGE_BYTES) return null;
    let bin = '';
    for (let i = 0; i < buf.length; i += 0x8000) {
      bin += String.fromCharCode.apply(null, buf.subarray(i, i + 0x8000));
    }
    return 'data:' + mime + ';base64,' + btoa(bin);
  } catch {
    return null;
  }
}

export async function onRequestPost({ request }) {
  let body = {};
  try {
    body = await request.json();
  } catch { /* handled by the check below */ }

  let target = normalise(body && body.url);
  if (target.shortLink) target = await resolveShort(target.shortLink);
  if (target.error) return fail('bad-url', target.error);

  // PRIMARY PATH: fetch LinkedIn ourselves.
  let res = null;
  let fetchError = false;
  try {
    res = await getWithRetry(target.url, 'text/html,application/xhtml+xml');
  } catch {
    fetchError = true;
  }

  // LinkedIn answers a request it does not like by redirecting to the sign-in wall, so the FINAL
  // url is the trustworthy signal. The word "authwall" appears in the markup of every post page,
  // readable ones included, so testing the body for it reports a wall that is not there.
  const finalUrl = res ? String(res.url || '') : '';
  const redirectedToWall = /\/authwall|\/uas\/login|\/signup|\/login/.test(finalUrl);

  const html = res && res.ok && !redirectedToWall
    ? (await res.text()).slice(0, MAX_HTML_BYTES)
    : '';

  const blocks = jsonLdBlocks(html);
  let post =
    blocks.find((b) => /SocialMediaPosting|DiscussionForumPosting|Article/.test(typeOf(b))) ||
    blocks.find((b) => /VideoObject/.test(typeOf(b))) ||
    null;

  let via = 'direct';
  // A LinkedIn ARTICLE (/pulse) is shaped differently from a feed post: its schema `headline` is
  // the article's opening sentence and it carries no articleBody at all, while its og: tags hold
  // the real title and a summary. A feed post is the other way round, with generic og: tags. So
  // the source is chosen by type rather than by a fixed order of preference.
  const isArticle = post ? /Article/.test(typeOf(post)) && !/SocialMediaPosting/.test(typeOf(post)) : false;
  // Drives the gallery-side `kind` and whether an embed URL is worth returning.
  const isVideo = post ? /VideoObject/.test(typeOf(post)) : false;

  let rawBody = isArticle
    ? (readMeta(html, 'og:description') || String(post.articleBody || '').trim())
    : post
      ? String(post.articleBody || post.description || '').trim()
      : readMeta(html, 'og:description');
  let rawHeadline = isArticle
    ? (readMeta(html, 'og:title') || String(post.headline || '').trim())
    : post
      ? String(post.headline || post.name || '').trim()
      : readMeta(html, 'og:title');
  let readerImage = '';

  // FALLBACK PATH: the r.jina.ai reader.
  //
  // This is the service the old importer depended on, demoted to a backstop. It renders the page
  // in a headless browser, so it can occasionally see what a plain fetch cannot; it is also
  // periodically abuse-blocked for all of linkedin.com because of other users, which is why it
  // must never be the primary. Two independent paths mean a failure of either one alone is not a
  // failure of the feature, which matters most if LinkedIn ever refuses Cloudflare's egress.
  if (!post && isGeneric(rawHeadline) && isGeneric(rawBody)) {
    try {
      const alt = await getWithRetry('https://r.jina.ai/' + target.url, 'application/json');
      if (alt.ok) {
        const data = (await alt.json())?.data || {};
        const meta = data.metadata || {};
        const readerTitle = String(meta['og:title'] || data.title || '').trim();
        const readerText = String(meta['og:description'] || data.description || data.content || '').trim();
        if (!isGeneric(readerTitle) || !isGeneric(readerText)) {
          via = 'reader';
          rawHeadline = readerTitle;
          rawBody = readerText;
          const found = String(data.content || '').match(/https:\/\/media\.licdn\.com\/dms\/image\/[^)\s"']+/);
          if (found) readerImage = found[0];
        }
      }
    } catch { /* the backstop failing is not itself reportable; the direct result stands */ }
  }

  const text = isGeneric(rawBody) ? '' : decodeEntities(rawBody);
  const title = pickTitle(isGeneric(rawHeadline) ? '' : decodeEntities(rawHeadline), text);

  const imageUrl = pickImage(post, html) || readerImage;
  const dataUrl = imageUrl ? await fetchImage(imageUrl) : null;

  // A post with a picture but no words is still worth importing: its date and picture are real
  // and only the headline has to be typed. Nothing at all means the post is not readable.
  if (!title && !text && !dataUrl) {
    if (fetchError) {
      return fail('unreachable', 'LinkedIn could not be reached just now. Try again in a moment.');
    }
    if (redirectedToWall) {
      return fail('private', 'That post is not public, so only LinkedIn members can open it. Check the link, or type the details in below.');
    }
    if (res && !res.ok) {
      return fail('blocked', 'LinkedIn refused to serve that post (HTTP ' + res.status + '). Type the details in below.');
    }
    return fail('no-content', 'Nothing could be read from that post. Type the details in below.');
  }

  const when = post && (post.datePublished || post.uploadDate);
  const date = when && !Number.isNaN(Date.parse(when))
    ? new Date(when).toISOString().slice(0, 10)
    : '';

  return json({
    ok: true,
    // 'direct' or 'reader': which path produced this, so a live problem is diagnosable.
    via,
    title,
    body: text,
    date,
    kind: isVideo ? 'Video' : 'Photo',
    // Stored on the record so an imported item can always be traced back to its source. Every
    // item imported before this change has an empty `link`, which made them untraceable.
    link: target.url,
    embedUrl: isVideo && post && post.embedUrl ? String(post.embedUrl) : '',
    image: dataUrl,
    imageSource: dataUrl ? imageUrl : '',
    // Told to the drawer so it can say the text came through but the picture did not, rather
    // than silently leaving the picture slot empty.
    imageFailed: !!imageUrl && !dataUrl,
    // A bare photo or video post: the picture and date are real, the headline has to be typed.
    textMissing: !title && !text,
  });
}
