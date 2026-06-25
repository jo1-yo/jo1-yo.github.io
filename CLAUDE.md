# CLAUDE.md — Jane Zhang Personal Website

Instructions for Claude when working in this project.

## What this is

Jane Zhang's personal portfolio site. Static site, no build step, deployed via **GitHub Pages**.

- **Live:** https://imjane.top (custom domain via `CNAME`)
- **Repo:** https://github.com/jo1-yo/jo1-yo.github.io (branch `main`)
- **Deploy:** push to `main` → GitHub Pages publishes automatically. There is no CI, bundler, or framework.

## Stack

HTML5 · CSS3 · vanilla JavaScript · Three.js (r128, via CDN) for the 3D tree. No npm dependencies are required to run the site — `server.js`/`simple_server.py` are local preview helpers only. Fonts load from Google Fonts; Three.js + OrbitControls load from CDN (cdnjs / jsdelivr).

## Pages

- `index.html` — **main entry.** Interactive 3D "Four Seasons" tree portfolio (Three.js). Large single file with inline `<style>` and `<script>`. The only homepage view — mobile-optimized with `applyResponsiveFraming()` so the composition stays consistent across in-app browsers (Instagram) and mobile browsers regardless of viewport/aspect changes.
- `gensync.html` — Gensync project (intergenerational learning). Uses `css/main.css` + `css/parallax.css`.
- `suab.html` — SUAB (Student Union Against Bullying).
- `traller.html` — Traller (travel trailer app).
- `images/`, `videos/` — all media. `favicon.ico`, `CNAME` at root.

## Conventions

- All HTML pages use `<html lang="en">` and a `width=device-width` viewport meta. Keep both.
- `index.html` and most pages keep CSS/JS **inline** in the same file. Only `gensync.html` uses external CSS in `css/`. Follow the existing pattern of whatever file you edit — don't extract inline styles into new files unless asked.
- The site must stay **mobile-responsive** (last redesign was explicitly for this). Test/verify layout at narrow widths before considering a change done.
- Reference media with relative paths (`images/...`, `videos/...`), never absolute local paths.
- Pin the Three.js version (r128). Don't silently bump it — the API changes between versions.
- Comments and commit messages in the repo are sometimes in Chinese; that's fine. Match Jane's language if she writes in Chinese, otherwise default to English.

## Running locally

```bash
node server.js          # → http://localhost:3000  (needs `npm i express`)
python simple_server.py # → http://localhost:8000  (stdlib only)
```

## Git / deploy workflow

- Commit with clear, scoped messages (see history: "Mobile responsive redesign…", "Add Traller project page…").
- Pushing to `main` deploys to production immediately. **Confirm with Jane before pushing** unless she's asked for it in that turn.
- Never commit `.DS_Store`. Leave `CNAME` untouched (it pins the custom domain).

## How to respond to Jane

- Be concise and direct. Skip filler and long preambles.
- When changing a page, say which file(s) you touched and what visually changed.
- For any visual/layout change, verify the rendered result (screenshot or by reading the relevant markup) rather than assuming.
- Ask before large rewrites, dependency additions, or anything that changes the deployed site.

## Confidence scores (required)

End **every substantive answer** with a confidence line:

`**Confidence: <0–100%>** — <one-line reason>`

Guidance:
- Base it on how directly you verified the claim. Reading the actual file/output → high. Reasoning from memory or assumption → lower.
- ~90–100%: verified in the code or by running it.
- ~60–85%: strong inference, not directly confirmed.
- <60%: guess or unverified — say what would raise it.
- Be honest; don't inflate. A low score with a clear next step is more useful than false certainty.
- Skip it only for trivial chit-chat, not for technical answers, edits, or recommendations.
