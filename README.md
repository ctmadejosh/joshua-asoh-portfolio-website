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

Social preview cards (the image iMessage, LinkedIn, and X show for a link) are in `public/og/`,
one for the home page and one per case study. Regenerate them with `npm run og` (needs Playwright)
after changing a case study's title, and bump `OG_VERSION` in `src/data/og.ts` when the look
changes, so apps that cached the old image fetch the new one.

After a deploy with new or changed pages, run `npm run indexnow` to tell Bing (and DuckDuckGo
and Yahoo, which use Bing's index) to recrawl them; the key file is
`public/a98d7e4ee1b1de4c75822f84eb4c55e6.txt`. Google doesn't use IndexNow.

After the first deploy, submit `https://juasoh.com/sitemap.xml` in Google Search Console.

## Sharing links
Every link to juasoh.com you post should carry a source tag (`?utm_source=linkedin&utm_medium=profile`,
or the short `?ref=linkedin`), so Google Analytics and the contact form can tell where visitors came
from. Ready-to-paste links for LinkedIn, GitHub, the resume, and more are in
[docs/share-links.md](docs/share-links.md).

## Resume
`resume/resume.html` is the source of `public/Joshua_Asoh_Resume.pdf`. Edit the HTML, then run
`npm run resume` (needs Playwright) and commit both.

## Contact form backend (AWS)
The contact form posts to a serverless API on AWS at `https://aws.juasoh.com/contact`:
API Gateway → Lambda (Python) → DynamoDB + SES, with CloudWatch alarms, all in Terraform
(`infra/`) and deployed by GitHub Actions over OIDC. See
[docs/aws/contact-backend.md](docs/aws/contact-backend.md) for how it works and how to set it up.

## Analytics
Google Analytics 4 (property `G-G1XFK5MDXR`) runs only on juasoh.com and www.juasoh.com, never on
Cloudflare previews or localhost, so test traffic doesn't count. It sends one `page_view` per route
change plus `resume_download`, `contact_submit`, `email_copied` and `command_palette_open`, and records
where each visit came from (see [docs/share-links.md](docs/share-links.md)). To test against another
property, build with `VITE_GA_MEASUREMENT_ID`.

## Deployment
The site is deployed to Cloudflare Workers (static assets) and served at [juasoh.com](https://juasoh.com). Pushing to `main` triggers a build (`bun install --frozen-lockfile && bun run build`) and deploy using `wrangler.jsonc`.

---

**Author:** Joshua Asoh

Live site: [juasoh.com](https://juasoh.com)
