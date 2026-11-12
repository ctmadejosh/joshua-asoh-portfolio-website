# Joshua Asoh Portfolio Website

Welcome to the source code for Joshua Asoh's portfolio website. This project showcases professional experience, skills, and projects using a modern React-based stack.

## Table of Contents
- [About](#about)
- [Experience](#experience)
- [Projects](#projects)
- [Contact](#contact)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Development](#development)
- [Deployment](#deployment)

---

## About
This website presents Joshua Asoh, a Computer Engineering Technology student with hands-on experience in cloud infrastructure, software development, and leadership roles. The About section highlights academic background, certifications, and core skills such as AWS, Terraform, Python, and project management.

## Experience
A timeline of professional roles, including:
- Cloud and Reliability Engineering Intern at The Hartford Insurance
- College Operations Intern at Connecticut Center for Arts and Technology
- Resident Assistant at Central Connecticut State University
- Software Engineering Extern at FactSet
- Lab Software Developer Intern at Alexion-AstraZeneca
- Vice President of IEEE (CCSU Chapter)

Each role details responsibilities, achievements, and technologies used.

## Projects
The Projects section features selected works and contributions, focusing on cloud solutions, AI, and inventory management systems. (See website for details.)

## Contact
A contact form is available for professional inquiries and networking.

## Tech Stack
- **Framework:** React (with Vite), pre-rendered to static HTML at build time
- **Language:** TypeScript
- **Styling:** Tailwind CSS, shadcn-ui
- **State/UI:** Custom hooks, Radix UI, Lucide icons
- **Other:** PostCSS, ESLint

## Getting Started
1. **Clone the repository:**
   ```sh
   git clone <YOUR_GIT_URL>
   cd joshua-asoh-portfolio-website
   ```
2. **Install dependencies:**
   ```sh
   bun install
   ```
3. **Start the development server:**
   ```sh
   bun run dev
   ```
   The site will be available at `http://localhost:8080` by default.

## Development
- Browser entry: `src/main.tsx` (hydrates pre-rendered HTML; renders from scratch in `bun run dev`)
- Pre-render entry: `src/entry-server.tsx`, run by `scripts/prerender.mjs`
- Routes: `src/App.tsx`; pages in `src/pages/`; shared layout and UI in `src/components/site/`
- Content: `src/data/` (`work.ts` case studies, `projects.ts`, `experience.ts`, `site.ts`). Headline numbers live once in `proofPoints` in `site.ts`.
- Styles and design tokens (light and dark): `src/index.css`, `tailwind.config.ts`

## SEO
`bun run build` builds the client, then pre-renders every route to its own HTML file
(`dist/work.html`, `dist/work/<slug>.html`, …) with that page's title, description, canonical
URL, Open Graph tags, and JSON-LD (ProfilePage/Person on home, Article on case studies,
BreadcrumbList on inner pages). It also writes `dist/sitemap.xml` from the route list and a
`dist/404.html` that Cloudflare serves with a real 404 status. Add a case study to
`src/data/work.ts` and it gets a page, sitemap entry, and metadata automatically.

After the first deploy, submit `https://juasoh.com/sitemap.xml` in Google Search Console.

## Analytics
Google Analytics 4 loads only when `VITE_GA_MEASUREMENT_ID` (e.g. `G-XXXXXXXXXX`) is set at
**build** time; set it under the Worker's *Settings → Build → Variables and secrets* in
Cloudflare. It sends one `page_view` per route change, plus these events:
`resume_download`, `contact_submit`, `email_copied`, and `command_palette_open`.

## Deployment
The site is deployed to Cloudflare Workers (static assets) and served at [juasoh.com](https://juasoh.com). Pushing to `main` triggers a build (`bun install --frozen-lockfile && bun run build`) and deploy using `wrangler.jsonc`.

---

**Author:** Joshua Asoh

Live site: [juasoh.com](https://juasoh.com)
