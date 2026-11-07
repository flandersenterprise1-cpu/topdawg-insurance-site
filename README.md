# Top Dawg Insurance — Website (Nov 2026 rebrand)

The site was rebuilt as **Top Dawg Insurance**: a family-centered agency site with
coverage pages, a state finder, and a three-step quote request.

**Update state availability without code:** edit `public/data/availability.json`
(`verified` = live, `draft` = preview only, `off` = hidden). Set `showDraft` to
`false` before launch. Business details (phone, legal name, license fields,
Medicare TPMO counts, desk inboxes) live in `src/site/config.ts`.

**Lead delivery:** set `VITE_CRM_WEBHOOK_URL` (Apex Flow CRM endpoint) and/or
`VITE_WEB3FORMS_KEY` as repo secrets. Every lead records product, state, ZIP,
lead source, consent text + timestamp, and submission time.

**Reviews:** add approved reviews to `public/data/reviews.json`
(`{ "name", "place", "text", "approved": true }`). Hidden until one exists.

**Clickable preview:** `VITE_PREVIEW=1 npx vite build` → `dist-preview/`
(hash routing and a desktop/mobile toggle).

---

# Top Dawg Financial — Website

The public marketing site for **topdawgfinancial.com**, migrated off Manus into
a self-owned, statically-hosted React app. No subscription, no vendor lock-in —
it builds to plain static files and deploys to **GitHub Pages** for free.

---

## What's here

```
.
├── src/                     # The marketing site (React + Tailwind v4)
│   ├── pages/Home.tsx        #   the single-page site
│   ├── components/           #   all the Dark Sovereign sections + UI
│   ├── contexts/ lib/        #   theme + helpers
│   └── index.css             #   the design system (colors, gold, fonts)
├── public/
│   ├── CNAME                 # custom domain for GitHub Pages
│   ├── favicon.svg
│   └── images/               # background images (see images/README.md)
├── .github/workflows/deploy.yml   # auto-build + deploy to GitHub Pages
├── index.html
└── manus-fullstack-export/   # ← the FULL original Manus export, preserved
```

> **`manus-fullstack-export/`** is your complete original project as exported
> from Manus, kept verbatim for safekeeping — including the Back Office **CRM**
> (leads, agents, pipelines, tasks) and its server/database code. It is **not**
> part of the deployed site (GitHub Pages can't run a server or database). If you
> ever want the CRM running again, it's the starting point for a separate
> full-stack deployment. Nothing was thrown away.

---

## Local development

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # production build → dist/
npm run preview    # preview the production build
npm run typecheck  # TypeScript check
```

---

## Going live — three one-time steps

### 1. Turn on GitHub Pages
In the GitHub repo: **Settings → Pages → Build and deployment → Source →
“GitHub Actions.”** That's it — the included workflow (`.github/workflows/deploy.yml`)
builds and publishes on every push to `main`. (You can also run it manually from
the **Actions** tab → *Deploy to GitHub Pages* → *Run workflow*.)

### 2. Point the domain at GitHub Pages
At your registrar's DNS settings for **topdawgfinancial.com**, remove the old
Manus records and add these:

**Apex (`topdawgfinancial.com`) — four A records:**
```
185.199.108.153
185.199.109.153
185.199.110.153
185.199.111.153
```
**(recommended) AAAA records for IPv6:**
```
2606:50c0:8000::153
2606:50c0:8001::153
2606:50c0:8002::153
2606:50c0:8003::153
```
**`www` — one CNAME record:**
```
www  →  flandersenterprise1-cpu.github.io
```

Then in **Settings → Pages → Custom domain**, confirm `topdawgfinancial.com`
is set (the `public/CNAME` file already does this) and tick **Enforce HTTPS**
once the certificate is issued (can take a few minutes to an hour).

DNS changes can take anywhere from a few minutes to 48 hours to propagate.

### 3. Wire up the contact form
Form submissions are delivered by **Web3Forms** (free, no server):

1. Go to <https://web3forms.com>, enter the email where you want leads
   delivered (e.g. `info@topdawgfinancial.com`), and copy your **Access Key**.
2. In the GitHub repo: **Settings → Secrets and variables → Actions → New
   repository secret**, name it `VITE_WEB3FORMS_KEY`, paste the key.
3. Re-run the deploy workflow. Done — submissions now email straight to you.

Until this is set, the form shows a friendly “not configured yet” message
instead of failing silently.

---

## Background images

Four section backgrounds still live on Manus's CDN. To fully cut ties, download
them into `public/images/` — see [`public/images/README.md`](public/images/README.md)
for the exact filenames and source URLs. The site looks clean (solid dark
sections) even before you add them.

---

## Notes on the migration

- Rebuilt as a **static site** — dropped the Manus runtime, tRPC client, and
  server/database coupling that the public homepage didn't need.
- The contact form was moved from the Manus database to Web3Forms.
- All 13 marketing sections and the Dark Sovereign design are unchanged.
