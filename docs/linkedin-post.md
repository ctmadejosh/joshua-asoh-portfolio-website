# LinkedIn post draft: projects

**When to post:** after the PR with these changes is live on juasoh.com. For the line about the AWS contact form, either wait until it's deployed on AWS, or keep the "deploying now" wording below, which is accurate today.

**Attach:** the juasoh.com link preview appears automatically. For more reach, add 2–3 images: the home page, the About timeline, and the architecture diagram from the "This website" case study.

---

## Main version

I rebuilt my portfolio, and this time I treated it like a production service.

juasoh.com is now:
🔹 A React + TypeScript site, pre-rendered for fast loads and search, deployed to Cloudflare from GitHub with a preview for every pull request
🔹 A serverless contact form backend on AWS: API Gateway, Lambda (Python), DynamoDB and SES, all written in Terraform
🔹 A CI/CD pipeline in GitHub Actions that runs unit tests, Terraform validation and a Checkov security scan on every change, and deploys with OIDC (no stored AWS keys) behind a manual approval
🔹 Analytics that show where visitors come from, so I can tell what's working

I built it end to end (design, infrastructure, pipeline, monitoring), using the same platform and DevOps practices I use every day. The AWS contact backend is deploying now; the code and the full write-up of how it works are on the site.

A few other projects I've built:
🔹 AI-Powered Lead Generation: Python + OpenAI automation that finds and scores relevant Reddit posts for a home care agency and logs leads in Airtable
🔹 Kate AI: a Streamlit portfolio assistant I built at the FactSet externship hackathon
🔹 AI Tools: reusable agent skills and guardrails for AI-assisted development

Take a look, and I'd love feedback from anyone working in platform engineering or DevOps:
https://juasoh.com/?utm_source=linkedin&utm_medium=post

#PlatformEngineering #DevOps #AWS #Terraform #CloudComputing #GitHubActions

---

## Shorter version

New portfolio, built like a production service: a pre-rendered React site on Cloudflare, a serverless AWS contact backend (API Gateway, Lambda, DynamoDB, SES) in Terraform, and a GitHub Actions pipeline with tests, security scanning and OIDC deploys. The write-up of how it's built is on the site, along with my other projects.

https://juasoh.com/?utm_source=linkedin&utm_medium=post

#DevOps #AWS #Terraform #PlatformEngineering

---

## Notes
- **Public-safe:** it doesn't mention internal Hartford systems, colleagues or unreleased work. Your day job is described only as "platform and DevOps work".
- **Getting seen:** posts with a link sometimes get less reach on LinkedIn. If you'd rather, post without the link and put it in the first comment instead, still tagged: `https://juasoh.com/?utm_source=linkedin&utm_medium=comment`.
- **Tags:** tag The Hartford or CCSU only if you're comfortable; it's optional.
