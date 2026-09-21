# Personal Portfolio — YOUR NAME

A fast, fully responsive, single-page portfolio for a senior software engineer.
Hand-written **HTML5 + CSS3 + vanilla JavaScript** — no frameworks, no build
step, no dependencies. Drop it in a repo, switch on GitHub Pages, done.

---

## What's inside

| | |
|---|---|
| **Sections** | Home · About Me · Skills · Experience timeline · Portfolio · Articles · Contact Me |
| **Theme** | Dark-first "midnight + electric blue" palette with a light mode toggle that remembers the visitor's choice |
| **Responsive** | Fluid type and spacing via `clamp()` — one layout that flows from 320 px to ultra-wide, no fixed breakpoint jumps |
| **Navigation** | Sticky glass header, sliding pill indicator, scroll-spy active states, full-screen mobile menu |
| **Contact form** | Client-side validation, honeypot spam trap, and three interchangeable delivery providers |
| **Motion** | Scroll reveals, animated counters, skill bars, aurora background — all disabled under `prefers-reduced-motion` |
| **SEO** | Meta description, canonical, Open Graph, Twitter cards, JSON-LD `Person` schema, `sitemap.xml`, `robots.txt`, web manifest |
| **A11y** | Skip link, semantic landmarks, visible focus rings, ARIA states on every interactive control, WCAG-AA contrast |
| **Performance** | ~0 JS dependencies, system-font fallbacks, lazy images, no layout-shifting web font swap |

---

## Quick start

```bash
# 1 · create the repo on GitHub, then locally:
git init
git add .
git commit -m "feat: personal portfolio site"
git branch -M main
git remote add origin https://github.com/YOURHANDLE/YOURHANDLE.github.io.git
git push -u origin main
```

Preview locally — any static server works:

```bash
python3 -m http.server 8000     # → http://localhost:8000
# or
npx serve .
```

### Publishing on GitHub Pages

**Option A — user site (recommended).** Name the repo exactly
`YOURHANDLE.github.io`. It goes live at `https://YOURHANDLE.github.io` within a
minute of the first push.

**Option B — project site.** Any repo name works. Go to
**Settings → Pages → Build and deployment → Source: GitHub Actions**. The
included workflow at `.github/workflows/deploy.yml` deploys on every push to
`main`. The site lands at `https://YOURHANDLE.github.io/repo-name/`.

> On a project site, asset paths stay correct because everything is
> relative — nothing to change.

---

## Make it yours

Search the project for `EDIT ME` — every spot that needs your details is
marked. The short list:

### 1 · Your identity

| File | What to change |
|---|---|
| `index.html` | `YOUR NAME`, job title, `yourdomain.com`, `yourhandle`, `you@yourdomain.com`, phone, location |
| `index.html` → JSON-LD block | Same details, plus your real `sameAs` profile URLs |
| `site.webmanifest` | Name and description |
| `robots.txt`, `sitemap.xml` | Your domain |
| `LICENSE` | Your name |

### 2 · Your photo and CV

```
assets/img/profile.jpg     ← square, 800×800 or larger
assets/files/resume.pdf    ← linked by the "Download CV" button
assets/img/og-image.png    ← 1200×630 social preview card
```

If `profile.jpg` is missing the portrait slot shows a labelled placeholder
instead of a broken image, so nothing looks unfinished while you gather assets.

### 3 · Your content

- **Experience** — four `<li class="timeline__item">` entries in the
  `#experience` section. Copy one to add a role.
- **Portfolio** — six `<article class="project">` cards in `#portfolio`. The
  `data-cat` attribute drives the filters; use any combination of
  `web`, `api`, `cloud`, `oss`.
- **Skills** — the `data-level` attribute on each `.bar i` is the fill
  percentage.
- **Articles** — three `<article class="post">` cards in `#blog`. Point each
  `href` at your real post.
- **Stats** — the `data-count` attributes in the hero.

### 4 · Your colours

Everything is driven by CSS custom properties at the top of
`assets/css/style.css`. Change these four and the whole site follows:

```css
:root {
  --accent:   #38BDF8;   /* primary */
  --accent-2: #6366F1;   /* gradient partner */
  --bg:       #05070E;   /* page ground */
  --text:     #E9EFFA;   /* body ink */
}
```

The light palette lives in the `:root[data-theme="light"]` block just below it.

---

## Making the contact form actually send email

GitHub Pages serves static files only — it cannot run server code, so the form
needs a third-party endpoint. Open `assets/js/main.js` and edit
`CONTACT_CONFIG` at the very top.

### Option A · Formspree *(recommended)*

1. Sign up free at <https://formspree.io> — 50 submissions/month on the free tier.
2. Create a form; copy the ID out of the endpoint URL
   `https://formspree.io/f/**xbjnqkla**`.
3. Set:

```js
const CONTACT_CONFIG = {
  provider: 'formspree',
  formspreeId: 'xbjnqkla',
  email: 'you@yourdomain.com',
  subjectPrefix: '[Portfolio] '
};
```

4. Confirm your email on the first submission and you're live.

### Option B · Web3Forms *(no account, unlimited free)*

1. Enter your email at <https://web3forms.com> — an access key arrives instantly.
2. Set `provider: 'web3forms'` and paste the key into `web3formsKey`.

### Option C · mailto fallback *(zero setup)*

Set `provider: 'mailto'`. The form opens the visitor's mail client with
everything pre-filled. No signup, but delivery depends on the visitor having a
mail app configured.

### Demo mode

Out of the box `provider: 'demo'` validates the form and confirms on screen
without sending anything — safe for screenshots and local testing.

**Spam protection:** a hidden honeypot field (`_gotcha`) is included and is
respected by both Formspree and Web3Forms.

---

## Custom domain

Rename `CNAME.example` to `CNAME`, put your domain on the first line, and
follow the DNS steps in that file's comments. Then update the domain in
`index.html` (canonical + Open Graph), `robots.txt` and `sitemap.xml`.

---

## Project structure

```
.
├── index.html                  # the entire site, one semantic page
├── assets/
│   ├── css/style.css           # design tokens + all styles
│   ├── js/main.js              # theme, nav, reveals, filters, form
│   ├── img/                    # favicon, profile photo, og image
│   └── files/                  # resume.pdf
├── .github/workflows/deploy.yml
├── site.webmanifest
├── robots.txt
├── sitemap.xml
├── CNAME.example
├── LICENSE
└── README.md
```

---

## Browser support

Current Chrome, Edge, Firefox, Safari (including iOS) and Samsung Internet.
Uses `color-mix()`, `aspect-ratio`, `clamp()`, `backdrop-filter` and CSS
custom properties — all baseline across 2023+ browsers. Older engines degrade
to a flat but perfectly readable layout.

---

## Pre-launch checklist

- [ ] Replaced every `YOUR NAME`, `yourdomain.com`, `yourhandle`, `you@yourdomain.com`
- [ ] Added `profile.jpg`, `resume.pdf`, `og-image.png`
- [ ] Rewrote the timeline, projects and articles with real work
- [ ] Configured `CONTACT_CONFIG` and sent yourself a test message
- [ ] Checked the light theme as well as the dark one
- [ ] Ran Lighthouse (aim for 95+ on all four)
- [ ] Validated the social card at <https://cards-dev.twitter.com/validator> and the
      rich result at <https://search.google.com/test/rich-results>

---

## License

MIT — see [LICENSE](LICENSE). Use it, change it, ship it.
