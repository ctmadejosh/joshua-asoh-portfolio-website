# Links to share, with source tags

Every link to juasoh.com you post somewhere should carry a **source tag**. Then Google Analytics, and the contact form's email ("Came from: …"), can tell you where each visitor came from.

Tags use the standard **UTM** format that Google Analytics reads automatically:
- `utm_source`: *where* the link lives (linkedin, github, resume, …).
- `utm_medium`: *what kind* of link it is (profile, post, pdf, email, …).
- `utm_campaign` (optional): a specific effort, such as a job application.

The site also accepts a short form, **`?ref=linkedin`**, for places where a long link looks messy. It's treated as `utm_source=linkedin`, `utm_medium=referral`.

Tags never affect search ranking: every page tells Google its clean address (the canonical URL).

## Copy-paste links

| Where you post it | Link |
|---|---|
| LinkedIn profile → Contact info → **Website** | `https://juasoh.com/?utm_source=linkedin&utm_medium=profile` |
| LinkedIn **Featured** section | `https://juasoh.com/?utm_source=linkedin&utm_medium=featured` |
| LinkedIn **posts** | `https://juasoh.com/?utm_source=linkedin&utm_medium=post` |
| LinkedIn **messages** to recruiters | `https://juasoh.com/?utm_source=linkedin&utm_medium=message` |
| GitHub **profile** website field | `https://juasoh.com/?utm_source=github&utm_medium=profile` |
| GitHub **repo** "About" website | `https://juasoh.com/?utm_source=github&utm_medium=repo` |
| **Resume PDF** (already in it) | `https://juasoh.com/?utm_source=resume&utm_medium=pdf` |
| **Email signature** | `https://juasoh.com/?utm_source=email&utm_medium=signature` |
| **iMessage / texts** | `https://juasoh.com/?ref=text` |
| **Handshake / job portals** | `https://juasoh.com/?utm_source=handshake&utm_medium=profile` |
| A **specific application** | `https://juasoh.com/?utm_source=application&utm_medium=email&utm_campaign=<company>` |

To link straight to a page, put the tag after the path, for example `https://juasoh.com/work/atlas-developer-platform?utm_source=linkedin&utm_medium=post`.

## Where to see the results
- **Google Analytics** → Reports → Acquisition → *Traffic acquisition*. Group by **Session source / medium** to see rows like `linkedin / profile`.
- **Contact form emails** include a `Came from:` line, and the same value is stored with each message in DynamoDB.
- **Untagged visitors** still get a source when their browser sends one: `google` (organic search), `linkedin`, `github`, and so on. Otherwise they count as `direct`.

## Getting Google search data (Search Console)
Analytics shows visits; **Google Search Console** shows the *searches* people found you with (for example "joshua asoh") and how often you appeared. Google's sitelinks under your result (Resume, Work, Projects…) are chosen automatically once the site is verified and indexed.
1. Go to https://search.google.com/search-console and choose **Add property → Domain → `juasoh.com`**.
2. Google asks for a DNS TXT record. Because juasoh.com is on Cloudflare, Google usually offers to add it for you; otherwise add it in Cloudflare → DNS.
3. Open **Sitemaps** and submit `sitemap.xml`. Then use **URL inspection** on `https://juasoh.com/` and click **Request indexing**.
4. The **Performance** report (Google's "search analytics") fills in within a few days.
