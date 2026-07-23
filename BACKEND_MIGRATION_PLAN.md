# Printopack: Backend Migration Plan (Cloudflare)

Goal: move the site's content out of hardcoded files and into a real, free, self-managed
backend so Printopack can edit everything themselves for years, with no developer and no fees.
The public site stays static (fast, SEO, luxury). This document is the agreed shape before code.

---

## 1. Principles (why the choices below)

- **No developer, ever.** Nothing in the live path may have a failure mode that only a
  developer can clear. (This is why we are NOT using Supabase: its free database pauses when
  idle and needs a manual "Restore" that would lock the client out.)
- **No fees, ever.** Everything sits on Cloudflare's free tier, which is generous far beyond a
  brochure site's needs and does not meter or pause the way we care about.
- **Keep the admin we built.** The bilingual, branded dashboard stays; only its data layer
  changes (from browser localStorage to the real backend).
- **Keep the site static.** Visitors always get pre-built HTML. Only the admin talks to the
  live backend; visitors never do.

---

## 2. The stack

All on Cloudflare, one vendor, one account, one login for the client:

| Piece | What it does | Free-tier reality |
|---|---|---|
| **Cloudflare Pages** | Hosts the static Astro site + runs the small API (Pages Functions) | Unlimited requests; 500 builds/month |
| **D1** (SQLite) | Stores all content the admin edits (the working database) | Huge for our size; **does not pause** |
| **R2** (object storage) | Stores images the client uploads + the published content snapshot | 10 GB storage, generous ops |
| **Access** (Zero Trust) | The login wall in front of the admin | Free up to 50 users |
| **Deploy Hook** | A URL that triggers a site rebuild when the client hits "Publish" | Free |

(We move hosting from Netlify to Cloudflare Pages so everything is one vendor. The GitHub repo
`Heath114/printopack1` stays the source; Cloudflare Pages builds from it.)

---

## 3. How content flows (the important part)

```
CLIENT EDITS (admin, behind Access login)
      |  save
      v
  Pages Functions API  --->  D1 (working content)   + R2 (uploaded images)
      |
CLIENT CLICKS "PUBLISH TO LIVE SITE"
      |
  API: snapshot all content from D1  --->  writes content.json to R2 (public)
      |                                     then calls the Deploy Hook
      v
  Cloudflare Pages REBUILD
      |  Astro fetches content.json from R2 (one request, no login needed)
      v
  Static HTML regenerated + deployed  --->  PUBLIC VISITORS (fast static pages)
```

Two states on purpose:
- **Draft (D1):** every save is instant and visible in the admin. The client can make ten edits.
- **Published (R2 snapshot + rebuild):** one "Publish" button pushes the current content live in
  ~1-2 minutes. This avoids a rebuild on every keystroke and gives an implicit "published version."

Why the R2 snapshot instead of the build reading D1 directly: it keeps the build simple and
token-free (the build just fetches one public JSON file), and it cleanly separates "what I'm
editing" from "what's live."

---

## 4. Data model (D1)

The admin is schema-driven (each model is a list of fields), so we mirror that with two generic
tables instead of one table per model. This maps almost 1:1 to today's localStorage shape.

```sql
-- collections: news, products, productGroups, team, careers, partners,
-- factory, quality, responsibility, gallery, offices
CREATE TABLE entries (
  collection TEXT NOT NULL,
  id         TEXT NOT NULL,
  data       TEXT NOT NULL,          -- JSON: the whole record (bilingual fields, image URLs, etc.)
  sort       INTEGER DEFAULT 0,
  updated_at INTEGER NOT NULL,
  PRIMARY KEY (collection, id)
);

-- singletons: about (home/about + counters), settings (company details)
CREATE TABLE singletons (
  key  TEXT PRIMARY KEY,             -- 'about' | 'settings'
  data TEXT NOT NULL,                -- JSON object
  updated_at INTEGER NOT NULL
);
```

Storing each record as a JSON blob means adding a field later (in the admin schema) needs no
database migration. Good for a system meant to run untouched.

---

## 5. The API (Cloudflare Pages Functions)

Small, behind Access. Bound to D1 + R2.

- `GET  /api/:collection`            list records
- `POST /api/:collection`            create/update a record
- `DELETE /api/:collection/:id`      delete a record
- `GET/PUT /api/singleton/:key`      read/write about + settings
- `POST /api/upload`                 upload an image to R2, return its public URL
- `POST /api/publish`                snapshot D1 to R2 content.json, then call the Deploy Hook

The admin's existing data functions (`db/save/coll/setColl/obj/setObj`) are rewritten to call
these endpoints. The rest of the admin UI is unchanged.

---

## 6. Login (client experience)

Cloudflare Access protects `/admin` and the write API. Method: **one-time email PIN**.
The client opens the admin, types their email, receives a 6-digit code, enters it, and is in for
the session. No password to forget or reset. Fully self-service. We add the GM's email (and any
others he names) to the Access allow-list. The old demo login screen is removed.

Customer login (the existing button that points to their Azure POS portal) is unchanged; it is an
external link, not part of this backend.

---

## 7. Images

Client uploads a photo in the admin -> `/api/upload` stores it in R2 -> returns a public URL ->
the URL is saved in the record. The published snapshot and the built site reference that URL.
The admin's recommended image sizes (already built in) still guide the client.

---

## 8. Phases (each is independently testable; the site stays live throughout)

- **Phase 0 - Provisioning (Malek, in the Cloudflare dashboard).** Create account, D1, R2, connect
  the repo to Pages, set up Access, create the Deploy Hook. See section 9.
- **Phase 1 - Schema + seed (Claude). DONE.** `db/schema.sql` (entries + singletons), `db/seed.json`
  (98 records across 11 collections + about/settings singletons, all real finalized content),
  `db/build-seed-sql.mjs` -> `db/seed.sql`. Counts verified.
- **Phase 2 - API + admin swap (Claude). DONE + verified locally.** Pages Functions in `functions/api/`
  (bootstrap, list/upsert, delete, singleton read/write, image upload to R2, publish). Admin data
  layer swapped to a dual-mode adapter (uses /api when the backend is reachable, falls back to
  localStorage otherwise, so the demo never breaks). Verified end to end with `wrangler pages dev`
  + a local D1 seeded from db/seed.sql: bootstrap returned all content, a create/read/delete
  roundtrip passed, and the admin loaded in API mode (16 news, 15 offices) with no errors. The
  live-deploy verification still happens once Phase 0 provisioning is done.
- **Phase 3 - Site reads content (Claude). IN PROGRESS.** Foundation done: `src/lib/content.ts`
  (imports db/seed.json baseline, or the live snapshot), `scripts/fetch-content.mjs` prebuild
  (refreshes seed.json from CONTENT_URL on Cloudflare builds), and `package.json` build chains it.
  Pages migrated + parity-verified: **News** (src/data/news.ts) and **Products** (src/data/products.ts).
  Remaining pages to point at the content source (same pattern, structural copy stays templated):
  partners, factory, gallery, contact offices directory, quality certificates, responsibility
  certificates, team, and the singletons (home/company counters + about story from `about`; footer
  from `settings`).
- **Phase 4 - Publish button (Claude).** Wire the admin "Publish" button to `/api/publish`. Verify
  edit -> publish -> live in ~1-2 min.
- **Phase 5 - Handover (Claude).** Write the client + Malek handover guide (how to log in, edit,
  publish, recover), and a short recovery note. Final full verification.

Rollback at any point: the current static content stays in git until Phase 3 swaps it, and D1 +
git history are both recoverable.

---

## 9. Who does what

**Malek (Cloudflare dashboard - I cannot do these; they need account access):**
1. Create/confirm a Cloudflare account (free).
2. Create a **D1** database (note its name/ID).
3. Create an **R2** bucket (note its name) and enable public access (r2.dev URL or a subdomain).
4. In **Pages**, connect the GitHub repo `Heath114/printopack1`, set the build command
   (`npm run build`) and output (`dist`).
5. Bind D1 and R2 to the Pages project (Settings -> Functions -> bindings).
6. Set up **Access (Zero Trust)**: an application protecting `/admin*` and `/api/*` write routes,
   policy = allow the GM's email, login = one-time PIN.
7. Create a **Deploy Hook** URL; add it (and the R2 public base URL) as Pages environment secrets.
8. Decide **ownership/handover**: keep the Cloudflare project under The Office and give Printopack
   only the Access login, or transfer the project to a Printopack-owned account at the end.

I can hand you the exact click-path and any `wrangler` CLI commands for each of these, and if you
run `wrangler login` yourself in this session I can execute the CLI steps (schema load, seed
import, bindings via `wrangler.toml`) for you.

**Claude (in the repo):** everything in Phases 1-5 above (schema SQL, seed import script, the API
Functions, the admin data-layer rewrite, the Astro build-from-snapshot refactor, the publish
wiring, `wrangler.toml`/Pages config, and the handover docs).

---

## 10. Decisions assumed (tell me if any is wrong)

1. **All-Cloudflare** (move hosting off Netlify to Cloudflare Pages). Alternative: keep Netlify and
   use Cloudflare only for the backend, but that is two vendors and more moving parts.
2. **Manual "Publish" button** (batch edits, one rebuild). Alternative: auto-rebuild on every save.
3. **Generic JSON tables** in D1 (no per-model migrations later).
4. **One-time email PIN** login via Access.
5. Custom domain is a later, separate step; we launch on the free `*.pages.dev` URL first.

---

## 12. Domain cutover (from a public DNS lookup, done 2026-07)

Their real setup (all public):
- **DNS/registrar: GoDaddy** (`ns07/ns08.domaincontrol.com`).
- **Email: Microsoft 365 via GoDaddy** — MX `printopack-com-sa.mail.protection.outlook.com`,
  SPF `v=spf1 include:secureserver.net -all`, verification `MS=ms97281972`. No DKIM/DMARC set.
- **Web (apex + www + `api`)** all resolve to GoDaddy `72.167.69.115`. www is a CNAME to the apex.
- Customer portal is on Azure (`printopack.azurewebsites.net`), a separate domain, unaffected.

**Recommended cutover: keep DNS at GoDaddy, change only two records.** Their email and their `api`
subdomain live in this GoDaddy zone, so moving nameservers to Cloudflare would risk breaking mail.
Instead:
1. `www.printopack.com.sa` -> CNAME to the Cloudflare Pages target.
2. `printopack.com.sa` (apex) -> GoDaddy Forwarding, 301 to `https://www.printopack.com.sa`
   (GoDaddy cannot CNAME an apex).

Leave MX, SPF, the `MS=` TXT, autodiscover, and the `api` record untouched. Canonical becomes
`www.`. Old GoDaddy site keeps serving until the flip, so no downtime. SSL is automatic.

Exceptions to confirm with the client:
- If he wants the bare apex `printopack.com.sa` (no `www`) as the canonical address, that forces a
  nameserver move to Cloudflare, and then we must carefully re-create the M365 email records.
- Before anyone cancels the old GoDaddy web hosting, confirm `api.printopack.com.sa` is not served
  from that same box, or the API goes down.

This does not affect Phases 1-5; it only makes the final domain step concrete.

## 11. Why this needs no developer later (the whole point)

- No database that pauses or bills. D1 stays up; R2 and Pages are free and static.
- The client logs in with an email code, edits in the same admin, clicks Publish. No terminal, no
  code, no rebuild knowledge required.
- Content lives in D1 and is snapshotted to R2 on every publish, and the code lives in git, so
  there are two independent recovery paths. Nothing is trapped in a single fragile place.
