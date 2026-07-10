# Printopack Website Rebuild — Full Project Handoff

> **You are continuing a live client project mid-flight, on a fresh session with no prior memory.**
> This file is your complete brain. Read it fully before doing anything. It is written so you can
> pick up exactly where the previous session left off without missing a beat.
>
> **This file is `.gitignore`d and MUST stay that way** — it contains commercial strategy, the fact
> that some portfolio sites are demo pieces, and notes about credentials. Never commit it, never
> paste its strategy sections into anything client-facing.
>
> Also check the persistent memory at `~/.claude/projects/-Users-bader/memory/` (MEMORY.md index +
> `project_printopack_site.md` + `feedback_*.md`). It overlaps with this file.

---

## 0. TL;DR — current state & immediate next action

- We are **rebuilding printopack.com.sa from scratch** as a premium, **no-motion**, luxurious + colorful corporate site with a self-service admin CMS, built in **Astro**, using **The Grove**'s design structure in a **navy / gold / cream** palette.
- **Active project:** `/Users/bader/printopack-v2` (Astro v5, static output). Run: `npm run dev` (port 4321). Build: `npm run build`.
- **Done:** Section 0 (Foundation — design system + global shell). A working **Home draft (~70%)**.
- **Immediate next action:** finish **Section 1 (Home)** — hero text legibility over the busy product image, a **Products preview** strip, a **Success Partners** logo strip + counters, a **Quality & Responsibility** teaser band, final polish. (The news-card "Read more" alignment is already fixed.)
- **Then** build the inner pages one at a time, reviewing each on the live dev server (see roadmap §7).
- A background dev server may already be running for the user's browser at `http://localhost:4321`.

---

## 1. Parties

**Us — The Office Development** (a software **company**, NOT a "studio" — never call it a studio), Amman, Jordan.
- Co-Founders: **Bader Rami Saleh Al Haj Hamad** (+962 7 8866 1142) and **Malek Ahmad Hasan Ismail** (+962 7 9220 0586).
- `info@theoffice.it.com` · https://theoffice.it.com
- Company is not yet legally registered — contracts sign in the founders' personal names.

**Client — Printopack** (Saudi Modern Packaging Factory Co. Ltd.), Jeddah, Saudi Arabia. Flexible-packaging manufacturer, est. 1997.
- **GM: Nasser Nabil** — `gm@printopack.com.sa`, Tel 00966-2-6081074 ext 234, Mobile 00966-504634596, Fax 00966-2-6081082.
- Also: `mkt@printopack.com.sa`, PO Box 19596 Jeddah 21445, Industrial Area #1 phase-5, Jeddah.
- Serious, engaged client — replied with a detailed full requirements list (see §4). The GM writes in Arabic; **bilingual EN/AR + RTL is central.**
- Existing customer portal (POS) is on Azure: `https://printopack.azurewebsites.net/` (the "Customer Login").

---

## 2. Commercial context & strategy (INTERNAL — never share)

- Original quotation: **350 JD, one-time, 3 days** (sent, `Printopack_Quotation.docx`). The GM then replied with a much larger scope (§4), so scope genuinely expanded (~3x).
- **User's decision:** stay firm at ~**350 JD (possibly 325)** as a strategic/introductory rate to **land this marquee Saudi client** — the local market is saturated, clients are scarce, and a cross-border Saudi reference of this scale is worth more than the invoice (proof of competency, recognition in both countries). This is a deliberate loss-leader.
- **Do not lower the price to look cheap.** Guidance given: hold 350 as an introductory rate, name the full expanded scope explicitly (builds trust), and make the **timeline conditional on the client delivering content**. Re-quote against the real list; don't pretend scope is unchanged.
- **No paid maintenance, ever** — the whole point of the admin CMS. One-time payment. Free-tier hosting. Third-party subscriptions (hosting, domain, email) are the client's responsibility.

---

## 3. Design direction — CRITICAL, read carefully

The GM's design brief (translated from his Arabic reply):
- **No motion / animation** — it tires the eyes and distracts. (Confirms earlier "too much movement" / "functionality over design.")
- BUT he wants a **luxurious, colorful** design, **better than the first prototype**. "Functionality over design" did NOT mean plain — he wants it to look expensive and colorful while behaving calmly.
- He praised **The Grove** (https://thegrove.jo) as beautiful and comfortable, but said its colors are **"plain white, not colored"** — he wants more color than Grove.

**The Grove analysis (our reference, and it is our own portfolio piece):**
- Built in **Astro**. A **catalogue + enquiry** business — **no online checkout**: products say "Price on request," CTA is **"Inquiry,"** Outdoor page states "made to order, offered by consultation." *(This is structurally identical to Printopack — B2B, quote-based. Grove is the ideal template.)*
- Pure **greyscale** palette (`#111 → #fff`, one crimson `#b00020` for sale/error). Warmth comes only from photography, not the UI chrome — which is exactly why the client called it "plain white."
- Type: **Futura PT** (display) + **Aktiv Grotesk** (body) + Capitana (Adobe Fonts). Light weights, **wide letter-spacing**, tall line-height, hairline dividers, generous whitespace.
- Structure: slim sticky header (centered wordmark, search left, location + login right), horizontal category nav with **mega-menus** (featured product images on the right), full-bleed photo heroes, category "product range" cards, collection landing (left filter rail + sub-category cards), product listing (image + name + brand + SKU + "Price on request" + wishlist), rich PDP (thumbnail rail + gallery + tabbed Description/Finishes/Options/Care + "About this set" centered narrative + "More sets" carousel), **dark editorial bands** (Philosophy, "The Grove Standard" journal), newsletter band, deep multi-column footer, login/register modal, wishlist, accounts.

**OUR DIRECTION:** Grove's structure + discipline (whitespace, hairlines, light display type, wide tracking, no motion) rendered in **Printopack navy / gold / cream** — put brand color into the chrome where Grove left it grey. This is the "luxurious + colorful" the client asked for, and it is being executed in `/Users/bader/printopack-v2` (see §6). Screenshots of Grove (home, product range, collection, PDP, philosophy band, journal, footer, mega-menu, login modal) were reviewed and confirm this reading.

**Hard conventions:**
- **NO em-dashes or en-dashes, ever**, in any writing/copy/document/email (user preference). Use hyphens, colons, commas, parentheses.
- Formal, professional tone. Address the client formally (GM = Nasser Nabil). Formal fusha Arabic.

---

## 4. The scope — the GM's full sitemap (his requirements, verbatim intent)

**Inner pages / sections:**
1. **About Us** — company history, the owners, mission, vision, values + a "years in market" counter.
2. **Social Responsibility** — Environment: ISO 14000 + safety + anti-pollution systems · Local community: license no., Saudization certificate, compliance certificate · International: global trade, certified shipping, safe product.
3. **Quality System** — quality certificates, quality assurance, lab & testing.
4. **Factory Departments** — a photo + description of **each production department**, plus warehouses.
5. **Team** — manager names/photos + counters: # employees, total experience, average experience.
6. **Products** — names, photos, **descriptions** (catalogue + enquire, Grove PDP model).
7. **Success Partners (Clients)** — client names, logos, **country** + counters: # countries, # customers.
8. **Careers** — open roles with specs, **requirements**, and a **contact email**.
9. **Gallery** — photos, **videos**, and **advertisements**.
10. **News & Events** — daily LinkedIn news + exhibitions/fairs.
11. **Contact** — management + **regional offices with phones and staff names** + # offices counter + map.

**Global / side features:** admin login (self-service, edit anything anytime, no developer), customer login (linked to their POS), **language toggle** (EN/AR), a **unified QR code**.

**Recurring device:** he loves **stat / counter icons** — years, employees, experience, countries, customers, offices. Thread them through the relevant sections, not just one band.

---

## 5. Content — source of truth (already fetched)

Everything real is at **`/Users/bader/printopack-content-fetch/`** — see its `MANIFEST.md`.
- `data/*.json` — categories (20), blogs/news (16), gallery (5), clients (20), footer. From `api.printopack.com.sa`.
- `images/` — **61 real image assets**: `categories/` (20), `news/` (16), `clients/` (20 logos), `gallery/` (5 factory-department photos).
- `pages/*.json` — rendered copy from the live site.

**Key real content:**
- **Counters:** 6 offices · +26 countries · +25 years · ~400 employees.
- **Hero:** "Where Technology Meets Vision" / "a global leader in developing and producing responsible packaging for food, beverage, pharmaceutical, medical, home and personal-care brands."
- **Vision:** "Empowering Brands Through Creative Packaging Excellence." **Mission:** "…driving force behind brands' packaging evolution. With a legacy of expertise in flexible packaging solutions since 1997…" (full text in `pages/about.json`).
- **6 regional offices** with per-country emails (existing routing): `kuwait@ · jordan@ · egypt@ · sudan@ · tunisia@ · algeria@printopack.com.sa`. HQ Jeddah: Industrial Area 5, Unit 10, 8508, Jeddah 22428 · `info@printopack.com.sa` · +966 12 608 1074.
- **5 factory departments:** Rotogravure, Bagging Machine, Punching Machine, Cylinder Engraving, Solvent Recovery.
- **Product catalogue is EMPTY** (categories exist, no products inside) — products are net-new content, not migration.
- **Live API** `https://api.printopack.com.sa/api/`: working = `footer_information`, `categories?per_page=60`, `blogs?per_page=40`, `gallery_items`, `our_clients`. `products` needs `category_id` + `per_page<=20` (returns empty). `sliders` needs an unknown `slider_type`. `contact` is POST-only. About/Quality/etc. text is in the SPA frontend, fetched via the r.jina.ai reader (see `pages/*.json`).

**Content only the client can provide (gated — scaffold with placeholders, he fills after signing):** company history/owners, values, social-responsibility certs, quality certs, per-department descriptions, product descriptions, team names/photos + experience numbers, client names/countries, office phones/staff names, gallery videos/ads, the QR target, and the "approved font."

---

## 6. The build — `/Users/bader/printopack-v2`

- **Stack:** Astro v5 (static output → plain HTML/CSS/JS, free hosting, zero client maintenance), scoped CSS in components, tiny vanilla-JS islands. Node 24. No CSS framework.
- **Run:** `npm run dev` (port 4321). `npm run build` → `dist/`.
- **Files:**
  - `src/styles/global.css` — the design system. Tokens: `--navy #0e2340`, `--navy-deep #091829`, `--gold #b1873a` / `--gold-bright #caa054`, `--paper #faf6ee` (warm ivory, never stark white), `--cream #f2ebdc`, `--sand`, `--ink #17191d`, `--muted`, `--line` (hairline). Fonts: `--display: Jost` (free Futura-like, honors Grove), `--body: Inter`, `--arabic: IBM Plex Sans Arabic`. Rhythm, buttons (`.btn-solid/.btn-gold/.btn-outline/.btn-outline-light`), `.eyebrow` (gold, tracked, with a rule), `.link-line`, `.on-navy`/`.on-deep` inversions, `[data-reveal]` (subtle fade-up, respects reduced-motion), RTL groundwork.
  - `src/components/Header.astro` — slim bar: search, centered **PRINTO·PACK** wordmark (gold middot), language toggle (`ع`), login → `/admin`. Category nav (About, Products, Company [mega-menu with sub-links + 2 featured factory images], Quality & Responsibility, News & Events, Contact). Mega-menu is CSS `:hover`. Mobile burger stub (not wired yet).
  - `src/components/Footer.astro` — newsletter band + deep navy footer: wordmark + tagline + **QR block** (inline SVG placeholder), columns (Company / Explore / Visit Us), **6 regional offices**, legal row + socials.
  - `src/components/Counter.astro` — the stat device (big gold number + rule + label; inverts on navy).
  - `src/layouts/Base.astro` — html shell, meta, Google Fonts (Jost+Inter+IBM Plex Sans Arabic), Header + slot + Footer, IntersectionObserver reveal.
  - `src/pages/index.astro` — **Home draft**: hero (full-bleed `hero.jpg`, "Where technology meets vision", gold accent, gold + outline buttons), navy **counters** band, editorial intro, **capability cards** (real dept photos), navy **"Our Vision"** band, **news** grid (3 real posts), CTA band.
  - `public/images/` — `hero.jpg`, `factory.jpg`, `lineup.jpg`, `pouch.png`, `logo.png`, `dept-1..5.jpg` (real factory photos), `cat-1..4.png`. `public/favicon.svg`.
- **STATUS:** Foundation done. Home ~70%. Remaining Home work listed in §0. News-card alignment already fixed (flex column + `margin-top:auto`).

---

## 7. Roadmap — build order (one section at a time, review each on the live server)

0. **Foundation** — DONE (design system + Header/Footer/Counter/Base + Home draft).
1. **Home** — IN PROGRESS. Finish: hero legibility, Products preview, Partners strip + counters, Quality teaser, polish.
2. **Products** — Grove catalogue + filter rail + PDP (no cart, "Request a quote"). Categories/images ready; products/descriptions client-gated.
3. **News & Events** — journal band ("Grove Standard" style). 16 real posts ready + LinkedIn-assisted import (see admin).
4. **Team** — grid + counters (400 employees known; names/photos gated).
5. **Success Partners** — 20 real logos + names/countries (gated) + counters.
6. **Factory Departments** — PDP "About this set" narrative per department; 5 real photos ready.
7. **Contact** — management + 6 regional offices (emails ready; phones/names gated) + offices counter + map (Leaflet/OSM like the old site).
8. **About Us** — dark editorial band; mission/vision ready; history/owners/values gated. (scaffold)
9. **Social Responsibility** — cert cards + editorial. (scaffold, client certs)
10. **Quality System** — cert cards + editorial. (scaffold, client certs)
11. **Gallery** — media grid (photos ready; videos/ads gated). (scaffold)
12. **Admin dashboard** — re-skin to the new premium look + extend for new content types (see §8).
13. **Global layer** — bilingual EN/AR + RTL + language toggle wiring, unified QR, counters everywhere, final polish, mobile menu.

Grove patterns map onto each section (catalogue+enquire for Products/Factory, dark editorial bands for About/Quality/Social, journal cards for News, deep footer, counters). The user reviews each section live before we move on.

---

## 8. The Admin dashboard (exists, separate from the Astro site)

- Lives in the OLD prototype: **`/Users/bader/printopack-site/admin/`** (`index.html` + `admin.css` + `admin.js`). Vanilla-JS single-page self-service CMS: login gate, navy sidebar, **schema-driven CRUD** (MODELS config) with a slide-in drawer editor, image upload, **bilingual EN/AR fields**, **LinkedIn-assisted news import** (fetches a pasted post via `https://r.jina.ai/<url>` → editable draft), and an **events calendar**.
- Persists to `localStorage['pp_admin_db_v1']` for the demo; production swaps the read/write layer to `api.printopack.com.sa`.
- Already **synced with real data**: 16 news, 20 categories, 5 team (incl. **Nasser Nabil** GM, **Ahmad Rachid** IT), 3 careers, page text, settings.
- **TODO:** re-skin to the new navy/gold/cream look and extend models for the new content types (About, Social Responsibility, Quality, Factory Departments, Partners, Gallery, Offices). Decide whether it stays a standalone vanilla app (probably yes — it just needs a restyle) or is rebuilt.

---

## 9. Repos, hosting, accounts

- **NEW Astro rebuild → `Heath114/printopack1`** (public, git-connected to Vercel → **auto-deploys to `printopack1.vercel.app` on every push to `main`** — this is the URL the user checks updates on). Local working copy `/Users/bader/printopack-v2` has `origin` = `printopack1`. Workflow: commit + `git push origin main` → Vercel auto-builds. NOTE: a redundant `Heath114/printopack` repo and a `printopack-v2` Vercel project (`printopack-v2.vercel.app`) also exist from an earlier CLI deploy — **unused, ignore or delete them** (do not push there; Vercel does not watch that one).
- **OLD prototype → `mawccu/printopack-site`** (public). Live at `mawccu.github.io/printopack-site` (GH Pages) and `printopack-site.vercel.app`. Contains the admin dashboard, the products-page fix, Team/Careers sections, Solutions→Services rename. **Pushing to this repo needs the `mawccu` gh account** (`gh auth token -u mawccu`), NOT Heath114.
- **Portfolio → `Heath114/portfoliowebsite2`** → `theoffice.it.com` (Vercel, Next.js). Work page features Flora/LineEscape/Bloom.
- **3 demo/proof sites (FICTIONAL brands, built as portfolio proof — do not present as real client work internally-confuse):** `Heath114/website1` = Flora (skincare) → `flora-amman.vercel.app`; `website2` = LineEscape (travel) → `lineescape-travel.vercel.app`; `website3` = Bloom (design studio) → `bloom-studio-amman.vercel.app`.
- **GitHub CLI:** `gh` is logged into BOTH **Heath114** (active — Bader's personal) and **mawccu** (company). Use `gh auth token -u <acct>` and push via `https://x-access-token:$TOKEN@github.com/<owner>/<repo>.git` when the active account lacks write access.
- **Vercel:** account **heath114**. Token at `~/Library/Application Support/com.vercel.cli/auth.json`. New projects ship with **`ssoProtection` ON** (a login wall) — disable for public access:
  `curl -X PATCH -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" -d '{"ssoProtection": null}' https://api.vercel.com/v9/projects/<name>`.

---

## 10. Environment quirks & how-to (save yourself pain)

- Running as **Claude Code on the user's Mac**, working dir `/Users/bader`, darwin. Bash runs on the real machine (files persist).
- **Bash sometimes loses PATH** ("command not found: curl/python3"). Fix: use full paths `/usr/bin/curl`, `/usr/bin/python3`.
- **Sandbox networking:** some outbound is blocked. Use `dangerouslyDisableSandbox: true` on Bash for image downloads. Fetch API JSON with **curl**, not python `urllib` (which 404s in-sandbox).
- **Fresh `*.vercel.app` deployments reset scripted TLS from this environment** — you cannot `curl`-verify a just-created Vercel URL (it returns 000 / connection reset), even though it works in a real browser. **Verify public serving via the reader:** `curl -H "Accept: application/json" https://r.jina.ai/https://<url>` and check the returned title. Established domains (theoffice.it.com) curl fine.
- **Preview:** the Claude Preview MCP reads `~/.claude/launch.json`. For Astro use `{"runtimeExecutable":"npm","runtimeArgs":["--prefix","/Users/bader/printopack-v2","run","dev","--","--port","4321","--host"],"port":4321}` (must use `--prefix` — it runs from `~` otherwise). The site uses no smooth-scroll lib, so `window.scrollTo` works for screenshots (the OLD prototype uses Lenis, which blocks programmatic scroll). Or run the dev server in background for the user's own browser.
- **Image sourcing trick** (used for the 3 demo sites): harvest real Unsplash photo IDs by fetching an Unsplash search page through `https://r.jina.ai/...` (JSON), extract `images.unsplash.com/photo-<id>`, then download `?w=1600&q=80&auto=format&fit=crop`.
- **Persistent memory:** `~/.claude/projects/-Users-bader/memory/` — `MEMORY.md` (index), `project_printopack_site.md`, `feedback_no_em_dashes.md`, `feedback_design_philosophy.md`, `feedback_source_of_truth.md`, `feedback_always_install_apk.md`, etc.

---

## 11. Conventions

- **No em/en-dashes** anywhere. Verify generated `.docx`/copy contains zero `—`/`–`.
- The Office Development is a **software company**, never a "studio."
- Client-facing tone: formal, professional, Gulf-B2B appropriate.
- **Commit messages** end with `Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>` for internal/dev repos. (Note: the user asked the fictional demo/portfolio repos to carry no "AI test-site" signals — use judgment there; this rebuild repo is an internal working repo so the trailer is fine.)
- Astro static output; deploy to Vercel; the client never touches code (edits go through the admin CMS/API).
- Build each section, then let the user review it live before moving on.

---

## 12. Documents produced (for reference)
- `/Users/bader/Downloads/Printopack_Quotation.docx` — the sent quotation (350 JD).
- `/Users/bader/printopack-proposal-brief.md` — full proposal brief.
- `/Users/bader/printopack-content-fetch/` — all fetched real content + `MANIFEST.md`.
- `/Users/bader/printopack-site/` — the OLD prototype (admin dashboard lives here).
- `/Users/bader/printopack-v2/` — THIS Astro rebuild (the active work).
