# Review guidance for GitHub Copilot

This repository is Joshua Asoh's public portfolio, juasoh.com: a pre-rendered React + TypeScript site on Cloudflare, plus a serverless AWS backend (API Gateway, Lambda in Python, DynamoDB, SES, Cognito) defined in Terraform and deployed by GitHub Actions with OIDC.

When reviewing pull requests, focus on these, in order:

## 1. Security
- **No secrets or keys** in code, Terraform, workflows or docs. AWS access is only through the OIDC roles in `infra/bootstrap`.
- **IAM stays least-privilege.** Flag any new `"*"` action or resource that isn't justified in a `#checkov:skip` comment, and any widening of the deploy role.
- **The public contact Lambda (`services/contact/handler.py`) must stay write-only.** Only the admin Lambda (behind Cognito) may read or delete messages.
- **The private admin page (`/inbox`)** must stay behind Cognito login, `noindex`, disallowed in `robots.txt` and out of the sitemap. Flag anything that exposes message content, visitor IPs or per-service costs publicly.
- **Third-party GitHub Actions** (not `actions/*` or `github/*`) must be pinned to a full commit SHA.
- **Input from visitors** must stay validated and length-limited; no new HTML injection paths.

## 2. Correctness
- **Pre-rendering:** pages render on the server first and then hydrate. Browser-only values (window, URL hash, `matchMedia`) must be read in an effect after hydration, not during render.
- **Lockfile:** `bun.lock` must stay `lockfileVersion: 1`. Cloudflare builds with Bun 1.2.15 and can't read newer formats.
- **Terraform** changes should be reflected in `docs/aws/contact-backend.md`.

## 3. Content
The site is public and recruiter-facing:
- No internal employer system names, story IDs or colleague names.
- No claims or numbers that aren't already on the site.

## Not worth flagging
Style nits that ESLint or Prettier would catch. Do flag a newly added UI component or package that nothing imports: unused template code was removed once, and should stay out.
