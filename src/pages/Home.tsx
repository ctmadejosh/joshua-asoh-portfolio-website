import { Link } from "react-router-dom";
import { ArrowRight, ArrowUpRight, Box, Copy, Download, Gauge, Linkedin, Mail, Rocket, Terminal } from "lucide-react";
import heroPortrait from "@/assets/hero-portrait.jpg";
import Pipeline from "@/components/Pipeline";
import Seo from "@/components/site/Seo";
import TerminalCard from "@/components/site/TerminalCard";
import FlowDiagram from "@/components/site/FlowDiagram";
import { copyEmail } from "@/components/site/CommandPalette";
import { CaseStudyCard, Container, SectionHeading } from "@/components/site/Cards";
import { caseStudies } from "@/data/work";
import { experiences } from "@/data/experience";
import {
  GITHUB_URL,
  LINKEDIN_URL,
  RESUME_PATH,
  SITE_DESCRIPTION,
  SITE_NAME,
  SITE_URL,
  PLATFORM_FIGURES_AS_OF,
  TEAM_LEAD,
  atlasWork,
  platformFigures,
  proofPoints,
  skillGroups,
} from "@/data/site";
import { trackEvent } from "@/lib/analytics";

const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "ProfilePage",
  url: `${SITE_URL}/`,
  mainEntity: {
    "@type": "Person",
    name: SITE_NAME,
    url: `${SITE_URL}/`,
    image: `${SITE_URL}/og-image.jpg`,
    jobTitle: "Platform Engineer",
    worksFor: { "@type": "Organization", name: "The Hartford" },
    alumniOf: { "@type": "CollegeOrUniversity", name: "Central Connecticut State University" },
    address: { "@type": "PostalAddress", addressRegion: "CT", addressCountry: "US" },
    knowsAbout: ["Platform engineering", "CI/CD", "Harness", "Developer experience", "AWS", "Terraform", "Retrieval-augmented generation"],
    sameAs: [LINKEDIN_URL, GITHUB_URL],
  },
};

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: SITE_NAME,
  url: `${SITE_URL}/`,
};

const Home = () => {
  const [featured, ...rest] = caseStudies;

  return (
    <>
      <Seo description={SITE_DESCRIPTION} ogType="profile" jsonLd={[personJsonLd, websiteJsonLd]} />

      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border">
        <div aria-hidden="true" className="bg-grid pointer-events-none absolute inset-0" />
        <Container className="relative grid items-center gap-12 py-16 md:py-24 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:gap-16">
          <div>
            <div className="mb-6 flex items-center gap-3">
              <img
                src={heroPortrait}
                alt="Portrait of Joshua Asoh"
                width={48}
                height={48}
                className="h-12 w-12 rounded-full border border-border object-cover object-[56%_40%]"
              />
              <p className="text-sm leading-tight">
                <span className="block font-semibold">{SITE_NAME}</span>
                <span className="text-subtle">Platform Engineer · The Hartford</span>
              </p>
            </div>
            <h1 className="text-[2.6rem] font-bold leading-[1.02] tracking-[-0.03em] sm:text-6xl lg:text-[4.25rem]">
              I build the pipelines and tools{" "}
              <span className="text-primary-ink underline decoration-signal decoration-[0.09em] underline-offset-[0.14em] [text-decoration-skip-ink:none]">
                engineers ship with
              </span>
              .
            </h1>
            <p className="mt-7 max-w-xl text-lg leading-relaxed text-muted-foreground">
              I'm a platform engineer at The Hartford, building ATLAS: the CLI, desktop agent, VS
              Code extension, and self-service onboarding that 4,000+ engineers use to ship. Before
              that: a GenAI documentation chatbot on AWS Bedrock, digital manufacturing, and lab
              software.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link to="/work" className="btn-primary">
                Read the case studies
                <ArrowRight aria-hidden="true" className="h-4 w-4" />
              </Link>
              <a
                href={RESUME_PATH}
                download
                onClick={() => trackEvent("resume_download", { location: "home_hero" })}
                className="btn-secondary"
              >
                <Download aria-hidden="true" className="h-4 w-4" />
                Resume
              </a>
              <button type="button" onClick={copyEmail} className="btn-secondary px-4" aria-label="Copy email address">
                <Copy aria-hidden="true" className="h-4 w-4" />
                <span className="hidden sm:inline">Copy email</span>
              </button>
            </div>
          </div>

          <TerminalCard />
        </Container>
      </section>

      <Container>
        {/* Proof strip: every figure comes from proofPoints and links to its evidence. */}
        <section aria-label="Results at a glance" className="grid grid-cols-2 border-b border-border lg:grid-cols-4">
          {proofPoints.map((point, i) => (
            <Link
              key={point.label}
              to={`/work/${point.source}`}
              data-reveal
              data-reveal-delay={i * 60}
              className={`group py-8 pr-4 ${i % 2 === 1 ? "pl-4 sm:pl-6" : ""} ${i > 0 ? "lg:border-l lg:pl-6" : ""} ${i % 2 === 1 ? "border-l" : ""} ${i < 2 ? "border-b lg:border-b-0" : ""} border-border`}
            >
              <p className="font-display text-3xl font-bold tracking-tight sm:text-4xl">{point.value}</p>
              <p className="mt-1 font-medium">{point.label}</p>
              <p className="mt-1 text-sm text-subtle">{point.context}</p>
              <p className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-primary-ink opacity-70 transition-opacity group-hover:opacity-100">
                See the evidence <ArrowRight aria-hidden="true" className="h-3 w-3" />
              </p>
            </Link>
          ))}
        </section>

        {/* Current role: ATLAS. Team figures are labelled as such; "My part" is Joshua's own work. */}
        <section aria-labelledby="atlas-heading" className="pt-20 md:pt-28">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-14">
            <div data-reveal>
              <p className="eyebrow mb-3">Current role · The Hartford</p>
              <h2 id="atlas-heading" className="text-3xl font-bold tracking-tight sm:text-4xl">
                Building ATLAS, the developer platform for 4,000+ engineers
              </h2>
              <p className="mt-5 text-lg leading-relaxed text-muted-foreground">
                ATLAS puts onboarding, builds, policy, telemetry, and AI tooling in one place: a CLI,
                a desktop agent, and IDE extensions. I'm one of the engineers building it, on the
                platform team led by{" "}
                <a href={TEAM_LEAD.url} target="_blank" rel="noopener noreferrer" className="text-link">
                  {TEAM_LEAD.name}
                  <span className="sr-only"> (opens in a new tab)</span>
                </a>
                , and I help deliver the{" "}
                <span className="font-medium text-foreground">CEO-sponsored push</span> to make
                new-engineer onboarding self-service.
              </p>

              <figure className="mt-8 rounded-xl border border-dashed border-border-strong p-5">
                <figcaption className="eyebrow mb-4">The platform · team figures, {PLATFORM_FIGURES_AS_OF}</figcaption>
                <ul className="grid grid-cols-2 gap-x-6 gap-y-5">
                  {platformFigures.map((figure) => (
                    <li key={figure.label}>
                      <span className="block font-display text-2xl font-bold tracking-tight sm:text-3xl">{figure.value}</span>
                      <span className="mt-0.5 block text-sm text-subtle">{figure.label}</span>
                    </li>
                  ))}
                </ul>
              </figure>

              <div className="mt-8 flex flex-wrap gap-3">
                <Link to="/work/atlas-developer-platform" className="btn-primary">
                  The ATLAS case study
                  <ArrowRight aria-hidden="true" className="h-4 w-4" />
                </Link>
                <Link to="/work/self-service-onboarding" className="btn-secondary">
                  The onboarding initiative
                </Link>
              </div>
            </div>

            <div data-reveal data-reveal-delay={100}>
              <h3 className="mb-4 flex items-center gap-2 font-sans text-sm font-semibold text-primary-ink">
                <span aria-hidden="true" className="h-2.5 w-2.5 rounded-sm border border-primary/40 bg-primary-surface" />
                My part
              </h3>
              <ul className="grid gap-3 sm:grid-cols-2">
                {atlasWork.map((item, i) => {
                  const Icon = [Terminal, Box, Rocket, Gauge][i];
                  return (
                    <li key={item.title}>
                      <Link
                        to={item.to}
                        className="surface-card group flex h-full flex-col p-5 hover:border-primary/50"
                      >
                        <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-surface text-primary-ink">
                          <Icon aria-hidden="true" className="h-[1.1rem] w-[1.1rem]" />
                        </span>
                        <span className="mt-4 font-display text-lg font-semibold group-hover:text-primary-ink">{item.title}</span>
                        <span className="mt-1.5 text-[0.95rem] leading-relaxed text-muted-foreground">{item.detail}</span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
          <div className="mt-6 rounded-xl border border-border bg-card/60 p-4 sm:p-6" data-reveal>
            <p className="eyebrow mb-4">How the pieces connect</p>
            <FlowDiagram flow={featured.flow} note={featured.flowNote} />
          </div>
        </section>

        {/* More case studies */}
        <section className="pt-20 md:pt-28">
          <SectionHeading
            title="More work"
            description="Each case study opens with a three-line summary and a diagram of the system, so you can stop there or keep reading."
            action={{ label: "All case studies", to: "/work" }}
          />
          <div className="grid gap-4 md:grid-cols-3">
            {rest.map((study, i) => (
              <CaseStudyCard key={study.slug} study={study} index={i} />
            ))}
          </div>
        </section>

        {/* How I work */}
        <section className="grid gap-6 pt-20 md:pt-28 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)]">
          <div className="surface-card px-6 py-8 sm:px-8" data-reveal>
            <h2 className="mb-6 text-2xl font-bold tracking-tight sm:text-3xl">How I work, stage by stage</h2>
            <Pipeline />
          </div>
          <div className="surface-card px-6 py-8 sm:px-8" data-reveal data-reveal-delay={80}>
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">Toolbox</h2>
            <dl className="mt-5 space-y-4">
              {skillGroups.map((group) => (
                <div key={group.name}>
                  <dt className="text-sm font-semibold">{group.name}</dt>
                  <dd className="mt-1.5 flex flex-wrap gap-1.5">
                    {group.items.map((item) => (
                      <span key={item} className="chip">
                        {item}
                      </span>
                    ))}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        {/* Recent roles */}
        <section className="pt-20 md:pt-28">
          <SectionHeading
            title="Recent roles"
            description="Ten roles since 2022. The three most recent:"
            action={{ label: "Full experience", to: "/experience" }}
          />
          <ol className="relative border-l border-border pl-6" data-reveal>
            {experiences.slice(0, 3).map((exp) => (
              <li key={exp.title + exp.period} className="relative pb-8 last:pb-0">
                <span aria-hidden="true" className="absolute -left-[1.85rem] top-1.5 h-3 w-3 rounded-full border-2 border-primary bg-background" />
                <p className="text-sm text-subtle">{exp.period}</p>
                <h3 className="mt-0.5 font-display text-lg font-semibold">{exp.title}</h3>
                <p className="text-muted-foreground">{exp.company}</p>
              </li>
            ))}
          </ol>
        </section>

        {/* Contact */}
        <section
          className="mt-20 overflow-hidden rounded-2xl bg-foreground px-6 py-12 text-background sm:px-12 sm:py-16 md:mt-28"
          data-reveal
        >
          <div className="grid gap-10 lg:grid-cols-[1.3fr_1fr] lg:items-end">
            <div>
              <h2 className="text-4xl font-bold tracking-tight sm:text-5xl">Have a platform problem worth solving?</h2>
              <p className="mt-5 max-w-xl text-lg leading-relaxed opacity-80">
                I'm open to new opportunities and glad to talk shop about CI/CD, developer experience,
                and internal tooling. I usually reply within a business day.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
              <Link
                to="/contact"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-lg bg-background px-6 font-semibold text-foreground transition-opacity hover:opacity-90"
              >
                <Mail aria-hidden="true" className="h-4 w-4" />
                Send me a message
              </Link>
              <a
                href={LINKEDIN_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-lg border border-background/30 px-6 font-semibold transition-colors hover:border-background"
              >
                <Linkedin aria-hidden="true" className="h-4 w-4" />
                Connect on LinkedIn
                <span className="sr-only"> (opens in a new tab)</span>
                <ArrowUpRight aria-hidden="true" className="h-4 w-4" />
              </a>
            </div>
          </div>
        </section>
      </Container>
    </>
  );
};

export default Home;
