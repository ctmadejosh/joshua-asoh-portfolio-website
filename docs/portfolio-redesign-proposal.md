# PROP-PR-5 v1.3 — Multi-page Portfolio Redesign

**Status:** Proposal

- **Proposal ID:** `PROP-PR-5`
- **Version:** `1.3`
- **Source PR:** #5

**Scope:** Product and implementation direction only; this document does not authorize or include website changes.

Versions use `major.minor`: increment the minor version for revisions within this proposal, and the major version for a substantial rewrite. Each future proposal uses its own PR number as its stable identifier.

## Summary

Reshape the portfolio into a multi-page, interactive experience that helps visitors quickly understand Joshua's work, projects, and professional background. The structure takes inspiration from the clarity and depth of brignano.io without reproducing its visual identity, layouts, copy, or assets. The site remains a locally maintained portfolio; it does not depend on a live CMS or content API.

## Goals

- Give visitors a clear starting point and distinct paths to work, projects, and experience.
- Make individual case studies addressable and useful when opened directly or shared.
- Support concise browsing as well as deeper reading, without turning every section into one long landing page.
- Keep content maintainable in the existing React and TypeScript application.
- Deliver a responsive, accessible, fast experience with purposeful—not decorative—motion.

## Proposed information architecture

| Route | Purpose |
| --- | --- |
| `/` | Home hub with a short introduction, selected work, and clear paths into the site. |
| `/work` | Browseable index of selected case studies. |
| `/work/:slug` | A focused case study for one project or body of work. |
| `/projects` | Project index for work that does not need a full case-study treatment. |
| `/experience` | Professional experience and a link to a resume, if Joshua supplies one. |

Use persistent, compact site navigation and contextual links between related pages. A not-found route should provide a useful route back to the main sections. The exact final route names and page content can be confirmed during implementation.

## Page and content direction

- **Home:** Establish a clear point of view with a brief introduction, a small selection of work, and direct links to the main sections. Avoid adding unsupported biography or claims.
- **Work index:** Present projects as scannable cards with consistent titles, short summaries, role or contribution where confirmed, and optional supplied imagery.
- **Case studies:** Use a repeatable structure such as context, challenge, approach, outcome, and reflection. Include only facts and outcome measures Joshua verifies.
- **Projects:** Keep this index lighter than the case studies; make the distinction between a project listing and a detailed case study apparent.
- **Experience:** Present roles in a readable chronological format, with detail and resume access driven by verified source content.

## Visual and interaction principles

Develop an original visual system that fits the existing portfolio and Joshua's preferences. The reference is directional inspiration for a polished, editorial portfolio—not a template. Do not copy its page composition, styling, wording, animations, or assets. Establish hierarchy through typography, spacing, restrained color, and a consistent card and page system.

Interactions should support a real task: navigating between sections, opening a case study, scanning related work, or understanding a timeline. Use restrained transitions and progressive reveals only where they improve orientation. Essential content and navigation must remain available without animation, on touch devices, and with reduced motion enabled.

## Reference notes

These pages are linked as textual design references only. The observations below are original summaries of content organization; do not copy their wording or use their screenshots or assets.

- [brignano.io homepage](https://brignano.io/): Introduces the person and professional focus, then leads into selected work, projects, experience, and contact links. This is a useful example of a home page that serves as a concise hub to deeper content.
- [ATLAS Developer Platform case study](https://brignano.io/work/atlas-developer-platform): Starts with a project overview and scan-friendly indicators, then expands into the problem, platform capabilities, adoption, and future direction. This supports a case-study format that offers both a quick read and deeper context.
- [Self-service developer onboarding case study](https://brignano.io/work/self-service-developer-onboarding): Organizes the story around the onboarding challenge and process, while distinguishing measured results from goals and unmeasured outcomes. This is a useful model for clear, evidence-led storytelling.

## LinkedIn connection

Include a prominent, accessible link to Joshua's existing LinkedIn profile (`https://www.linkedin.com/in/joshua-asoh`) in shared site navigation, the footer, and contact content. Use a clear accessible name, a visible focus state, and an external-link treatment that remains understandable to assistive technology. Reference the same verified profile URL in the site's Person structured data. This is a profile link only; do not add LinkedIn OAuth, API feeds, or login.

## Content model and implementation approach

Keep portfolio content local and data-driven, using typed TypeScript data for structured project and experience fields. Use Markdown only if case-study narrative length makes it materially easier to author and review; do not introduce a CMS or runtime content service. Reuse the current React, TypeScript, Vite, and React Router stack where practical, and build page layouts from existing project conventions rather than adding a second application framework.

Content records should support stable slugs, titles, summaries, optional category or role, and explicitly optional media and external links. Case-study sections should be flexible enough for different project stories without inventing fields that imply facts. Missing optional content should not produce empty labels or broken links.

## Responsive behavior, accessibility, and performance

- Design from narrow mobile screens through laptop and larger viewports; preserve readable text widths and usable navigation at every size.
- Use semantic landmarks, a logical heading hierarchy, keyboard-operable controls, visible focus, and meaningful link names.
- Provide text alternatives for supplied meaningful images; treat decorative media as decorative.
- Respect `prefers-reduced-motion` and ensure motion never carries information by itself.
- Keep pages lightweight: optimize supplied images, avoid unnecessary client-side dependencies, and defer nonessential media where appropriate.
- Provide a unique title, description, and canonical URL for every route, plus Open Graph metadata for social previews.
- Include a sitemap and `robots.txt`; ensure sitemap entries use the canonical route URLs.
- Add Person JSON-LD with only verified profile details and the LinkedIn URL in `sameAs`.
- Keep headings semantic and provide appropriate alt text for meaningful images.
- Check mobile usability and performance on representative routes before release.

## Routing and deployment

The project currently uses React Router and Cloudflare static assets configured with `not_found_handling: "single-page-application"`. Preserve the SPA fallback so direct requests to routes such as `/work/example` serve the application shell. Verify both in-app navigation and a fresh load of each route against the deployed configuration. Route handling should still render an intentional not-found view for unknown client-side paths.

## Delivery phases

1. **Content and direction:** Confirm page names, visual direction, project priorities, and the source material Joshua will provide.
2. **Foundation:** Establish route layouts, navigation, shared page structure, and responsive design tokens/components.
3. **Content pages:** Build the home hub and indexes, then add case-study and experience templates backed by local typed content.
4. **Polish and verification:** Refine interactions, accessibility, metadata, performance, and direct-route behavior across screen sizes.

## Optional, later-phase features

These are not launch requirements. Consider them only after the core portfolio is complete, with original design and behavior rather than copied reference-site implementations:

- **Portfolio Q&A assistant:** An optional chat assistant answers only from approved portfolio content, clearly identifies its limits, protects visitor privacy, and offers a useful non-AI path to browse the site or contact Joshua. Any AI credentials must stay server-side and never be exposed in client code.
- **Light and dark themes:** Let visitors choose a theme, preserve readable contrast and focus states in both, and respect their system preference by default.
- **Seasonal accents:** Offer optional, restrained holiday or seasonal details that never obscure content, reduce usability, or replace the normal default experience.
- **Achievement photo gallery:** Show photos only when publicly accessible or supplied and approved by Joshua. Pair each with a concise caption and dates and achievement claims verified by Joshua; do not scrape or infer content from LinkedIn.

## Risks and mitigations

| Risk | Mitigation |
| --- | --- |
| Insufficient verified project detail or imagery makes case studies feel generic. | Gather source material before writing; launch with fewer complete examples rather than fabricated detail. |
| A highly distinctive reference leads to an overly derivative result. | Use it only to discuss broad qualities; create original layout, typography, color, copy, and assets. |
| More pages add navigation and maintenance overhead. | Keep the information architecture small and use shared layouts and data-driven templates. |
| Animation harms usability or performance. | Make motion restrained, optional under reduced-motion settings, and nonessential to understanding. |
| Deep links fail after deployment. | Confirm Cloudflare SPA fallback and test fresh loads on representative nested routes. |

## Acceptance criteria

- The site has distinct home, work index, case-study, projects, and experience destinations rather than relying on one long static page.
- Each supplied case study has a stable, directly loadable URL and a consistent, readable content hierarchy.
- Navigation makes the primary destinations discoverable and works by keyboard, touch, and pointer.
- Layouts remain usable on mobile and laptop-sized screens, with no essential content dependent on hover or animation.
- Reduced-motion preferences are respected; semantic structure, focus visibility, and image alternatives are addressed.
- Every route has a unique title, description, and canonical URL; Open Graph metadata produces useful social previews.
- A sitemap and `robots.txt` are present and consistent with the site's canonical URLs and crawl intent.
- Person JSON-LD uses verified details and includes Joshua's LinkedIn profile in `sameAs`.
- An accessible LinkedIn profile link is available in shared navigation, footer, and contact content; no OAuth, API feed, or login is introduced.
- Semantic headings and meaningful image alternatives are in place, and mobile usability and performance are checked.
- Content is maintained locally with typed structured data and no live CMS/API dependency.
- Cloudflare serves the application shell on valid nested routes, while unknown routes show a useful not-found page.
- No personal facts, project outcomes, statistics, imagery, or external links are added unless supplied or confirmed by Joshua.

## Content and assets needed from Joshua

- A short approved introduction and any preferred public-facing title or description.
- The projects to feature, their preferred order, and which deserve full case studies.
- For each selected case study: confirmed context, Joshua's role, challenge, approach, outcome, technologies, and any approved metrics.
- Verified experience entries, dates, descriptions, and the resume file or URL if it should be linked.
- Approved project screenshots, illustrations, video, or other media, plus any required attribution; achievement-gallery photos and verified captions/dates if that optional feature is pursued.
- Confirmed public links (for example, source repositories or live demos) and contact destinations.
- Any visual preferences or constraints beyond the requirement for an original identity.

Until that material is provided, use neutral placeholders during implementation and do not publish invented portfolio claims.
