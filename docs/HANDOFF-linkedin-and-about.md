# Handoff: LinkedIn photos, About page, and open items

**For:** a new Claude session running **on Joshua's laptop** (the Claude desktop app with its built-in browser, or Claude Code with a browser tool), so it can look at his LinkedIn while he is signed in.
**Repo:** `ctmadejosh/joshua-asoh-portfolio-website` · **Live site:** https://juasoh.com · **Written:** 13 November 2026

## Rules for this work
- **Credentials:**
  - Joshua signs in to LinkedIn himself, in the browser. Never ask for, type, or store his password.
  - Don't change anything on LinkedIn: no posts, edits, messages or connection requests. Read only.
- **No invented facts:** don't publish anything personal he hasn't written or confirmed. Use his own words for the story sections, and his own captions or dates for photos (ask if unclear).
- **Team vs his work:**
  - The site separates *team* context from *his* contributions. Keep that: ATLAS and the onboarding initiative are led by his manager, Anthony Brignano, and Joshua is one of the engineers.
  - Platform-wide figures (4,000+ engineers, 95,000+ pipelines, 13,000+ repos, 1,000+ in 90 days) are always labelled as team figures.
- **Photos:** only use ones Joshua owns or appears in and is fine publishing. For photos showing other people, ask him whether that's OK.

## Task 1: LinkedIn photos → an About-page gallery
1. **Open the profile:** https://www.linkedin.com/in/joshua-asoh with Joshua signed in. Look through:
   - **Experience:** media attached to each role.
   - **Featured:** if he has the section.
   - **Activity → Posts:** posts with photos (events, hackathons, IEEE, The Hartford, FactSet, Zygo, Alexion, school).
2. **Shortlist** about 6–9 strong photos and **show Joshua the list before downloading**: what each is, and the post or role it came from. He picks.
3. **Save and process** them:
   - **Location:** `src/assets/gallery/` (`kebab-case.jpg`).
   - **Size:** resize so the long edge is ≤1600px, JPEG quality around 82, progressive. The repo's `hero-portrait2.jpg` and `hero-portrait3.jpg` are 25 MB originals; never import those directly.
   - **Tooling:** Python/PIL is fine for this (`ImageOps.exif_transpose`, then `thumbnail`, then `save(quality=82, optimize=True, progressive=True)`).
4. **Add a `gallery` array to `src/data/about.ts`**, for example:
   `{ src: "/src/assets/gallery/x.jpg" (import it), alt: string, caption: string, date?: string }`.
   - Captions and dates come from Joshua or the LinkedIn post itself.
   - Alt text describes the image for screen readers.
5. **Render it in `src/pages/AboutPage.tsx`**, after "The road here" and before "Education". Only render if `gallery.length > 0`.
   - **Layout:** a responsive grid (2 columns on phones, 3 on desktop), rounded corners, and the caption overlaid or below.
   - **Lightbox:** clicking a photo opens it larger, with keyboard support (Esc closes, ←/→ moves) and focus returned on close. The Radix `Dialog` in `src/components/ui/dialog.tsx` is fine for this.
   - **Loading:** lazy-load the images (`loading="lazy"`), and keep `data-reveal` for the scroll fade.
6. **Optional:** if a photo clearly belongs to one journey stop in `journey` (`src/data/about.ts`), add an `image` to that milestone and show it in the timeline's detail panel.

## Task 2: Check the site against LinkedIn
Compare LinkedIn's Experience, Education, Licenses & certifications and Volunteering with:
- `src/data/experience.ts` (all roles)
- `src/data/site.ts` (education, certifications, skills)
- `src/data/about.ts` (journey timeline)
- `src/data/work.ts` (case studies)
- the resume at `public/Joshua_Asoh_Resume.pdf`

Report every mismatch (titles, dates, numbers, missing roles) to Joshua as a list, and fix only what he confirms. **Known open questions to raise:**
1. **Audience figure:** the resume says 3,000+ engineers on the platform, and the site says 4,000+. Joshua confirmed 4,000+ against his team lead's published figures. Suggest he updates the resume.
2. **Chatbot result:** the resume says "reducing queries by 80% across 800+ engineers", and the site says it saved 1–2 hours per lookup. Ask which to show, or both.
3. **Master's status:** the M.S. (4+1 program) is listed for May 2026. If it's complete, change the About page's "Studying" quick fact and the terminal card's `studying` line (`src/components/site/TerminalCard.tsx`) to graduated.

## Task 3: Joshua's own words, when he provides them
In `src/data/about.ts`, `story.why`, `story.next` and `story.funFacts` are empty, and their About-page sections stay hidden until filled. Ask him for:
- **Why platform engineering:** what got him into it.
- **What's next:** long-term interests.
- **Fun facts:** two or three, each with an emoji.

Use his words, lightly edited for clarity only.

## Task 4: Contact form backend (AWS)
The form now posts to Joshua's own AWS backend at `https://aws.juasoh.com/contact` (API Gateway → Lambda → DynamoDB + SES), defined in `infra/contact` and `services/contact`. Until it's deployed, the form falls back to opening the visitor's email app. Setup steps and a full explanation are in `docs/aws/contact-backend.md`. Joshua deploys it from his own AWS account; never ask for AWS keys.

## Project facts a new session needs
- **Stack:** React 18 + Vite + TypeScript + Tailwind, React Router.
  - **Pre-rendering:** every route is pre-rendered to static HTML at build time (`src/entry-server.tsx` + `scripts/prerender.mjs`), and the browser hydrates it.
  - **New routes** must be added to `src/App.tsx` and the `routes` list in `src/entry-server.tsx`; the sitemap is generated from that list.
- **Commands:**
  - `bun run build` builds the client, the SSR bundle and the pre-render.
  - `npx tsc -p tsconfig.app.json --noEmit` type-checks.
  - `npx eslint src`: the two errors in `src/components/ui/command.tsx` and `textarea.tsx` predate this work.
- **Lockfile:** use **`bun.lock` only, at `"lockfileVersion": 1`**. Cloudflare builds with Bun 1.2.15, which can't read `bun.lockb` or lockfile version 2.
  - If a newer Bun rewrites it to version 2, change the header back to `"lockfileVersion": 1` and remove `"configVersion"` (the package entries are identical).
  - Or generate it with Bun 1.2.x.
- **Deploy:** Cloudflare Workers Builds, with `wrangler.jsonc` deploying `dist`. Pushing to `main` deploys to juasoh.com in about a minute, and branches get preview URLs.
  - Unknown URLs serve `404.html` with a real 404 status. `public/_redirects` handles old resume URLs.
- **SEO and sharing:**
  - Per-page metadata comes from `<Seo>` (`src/components/site/Seo.tsx`).
  - Social preview cards are in `public/og/`. Regenerate them with `npm run og` and bump `OG_VERSION` in `src/data/og.ts`.
  - After deploys with new pages, run `npm run indexnow`: Node needs `NODE_USE_ENV_PROXY=1` behind a proxy.
- **Design:** warm paper background, cobalt blue (`--primary`) and amber (`--signal`), Bricolage Grotesque headings with Instrument Sans body. The circuit-trace JA logo is in `src/components/site/Logo.tsx`. Light and dark themes are tokens in `src/index.css`.
- **Verifying UI:** build, serve `dist` (anything that maps `/x` to `x.html`), and check pages in Playwright at 1440px and iPhone 13, light and dark. Look for console errors and horizontal overflow.

## Done looks like
- The About page has a gallery of Joshua-approved photos with his captions. It works by keyboard, on a phone, and in both themes.
- Joshua has a mismatch list from the LinkedIn check, and the fixes he approved are in.
- Changes go up as a PR, the Cloudflare preview build passes, and it's merged and deployed only when Joshua says so.
