import { Link } from "react-router-dom";
import { ArrowRight, Download, Mail, MapPin } from "lucide-react";
import heroPortrait from "@/assets/hero-portrait.jpg";
import Pipeline from "@/components/Pipeline";
import Seo from "@/components/site/Seo";
import SocialLinks from "@/components/site/SocialLinks";
import { CaseStudyCard, Container, ProjectCard, SectionHeading } from "@/components/site/Cards";
import { caseStudies } from "@/data/work";
import { projects } from "@/data/projects";
import { RESUME_PATH, SITE_NAME, SITE_ROLE, skillGroups } from "@/data/site";

const Home = () => (
  <>
    <Seo description="Joshua Asoh is a platform engineer at The Hartford building CI/CD automation, developer tooling, and cloud infrastructure." />

    <Container>
      {/* Hero */}
      <section className="flex min-h-[calc(100svh-4.5rem)] flex-col justify-center py-16 lg:min-h-[calc(100svh-10rem)]">
        <div className="grid items-center gap-12 lg:grid-cols-[minmax(0,1fr)_19rem] lg:gap-16">
          <div className="max-w-2xl">
            <div className="mb-6 flex items-center gap-4 lg:hidden" data-reveal>
              <img
                src={heroPortrait}
                alt=""
                width={64}
                height={64}
                className="h-16 w-16 rounded-full border border-border object-cover object-[56%_40%]"
              />
              <div>
                <p className="font-semibold">{SITE_NAME}</p>
                <p className="text-sm text-subtle">{SITE_ROLE}</p>
              </div>
            </div>
            <p className="eyebrow mb-5 hidden lg:block" data-reveal>
              Platform engineering · CI/CD · Developer experience
            </p>
            <h1
              className="text-4xl font-bold leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl"
              data-reveal
              data-reveal-delay={60}
            >
              I build the automation and tools engineers ship with.
            </h1>
            <p
              className="mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground"
              data-reveal
              data-reveal-delay={120}
            >
              I'm Joshua, a platform engineer in The Hartford's Technology &amp; Operations
              Leadership Development Program. I work on Harness CI/CD automation, IDE and CLI
              tooling, and the onboarding that gets engineers productive on our developer
              platform.
            </p>
            <div className="mt-8 flex flex-wrap gap-3" data-reveal data-reveal-delay={180}>
              <Link to="/work" className="btn-primary">
                See my work
                <ArrowRight aria-hidden="true" className="h-4 w-4" />
              </Link>
              <Link to="/contact" className="btn-secondary">
                Get in touch
                <Mail aria-hidden="true" className="h-4 w-4" />
              </Link>
            </div>
            <div className="mt-8" data-reveal data-reveal-delay={240}>
              <SocialLinks />
            </div>
          </div>

          <aside
            className="surface-card hidden flex-col items-center p-6 text-center lg:flex"
            data-reveal
            data-reveal-delay={160}
            aria-label="Profile"
          >
            <img
              src={heroPortrait}
              alt="Joshua Asoh working on a laptop at his desk"
              width={160}
              height={160}
              className="h-36 w-36 rounded-full border border-border object-cover object-[56%_40%]"
            />
            <p className="mt-4 font-display text-lg font-semibold">{SITE_NAME}</p>
            <p className="inline-flex items-center gap-1 text-sm text-subtle">
              <MapPin aria-hidden="true" className="h-3.5 w-3.5" />
              Connecticut
            </p>
            <div className="mt-5 w-full border-t border-border pt-5">
              <p className="font-display text-3xl font-bold tracking-tight">144</p>
              <p className="mt-1 text-sm text-subtle">pull requests merged across 21 platform repositories</p>
            </div>
            <a
              href={RESUME_PATH}
              download
              className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-primary-ink"
            >
              <Download aria-hidden="true" className="h-4 w-4" />
              Download resume (PDF)
            </a>
          </aside>
        </div>
      </section>

      {/* Pipeline */}
      <section aria-label="My work, stage by stage" className="surface-card px-6 py-8 sm:px-10" data-reveal>
        <Pipeline />
      </section>

      {/* Selected work */}
      <section className="pt-24 md:pt-32">
        <SectionHeading
          title="Selected work"
          description="Case studies from the platform team and earlier roles: the problem, what I did, and what changed."
          action={{ label: "All case studies", to: "/work" }}
        />
        <div className="grid gap-4 md:grid-cols-2">
          {caseStudies.slice(0, 2).map((study, i) => (
            <CaseStudyCard key={study.slug} study={study} index={i} />
          ))}
        </div>
      </section>

      {/* Toolbox */}
      <section className="pt-24 md:pt-32">
        <SectionHeading title="What I work with" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {skillGroups.map((group, i) => (
            <div key={group.name} className="surface-card px-6 py-5" data-reveal data-reveal-delay={i * 60}>
              <h3 className="font-sans text-base font-semibold">{group.name}</h3>
              <ul className="mt-3 flex flex-wrap gap-2">
                {group.items.map((item) => (
                  <li key={item} className="chip">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Projects */}
      <section className="pt-24 md:pt-32">
        <SectionHeading
          title="Side projects"
          description="Smaller things I've built on my own and at hackathons."
          action={{ label: "All projects", to: "/projects" }}
        />
        <div className="grid gap-4 md:grid-cols-2">
          {projects.slice(0, 2).map((project, i) => (
            <ProjectCard key={project.title} project={project} index={i} />
          ))}
        </div>
      </section>

      {/* Contact finale */}
      <section className="flex min-h-[60vh] flex-col justify-center border-t border-border pt-16 mt-24 md:mt-32" data-reveal>
        <h2 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">Let's talk.</h2>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">
          I'm glad to talk shop about platform engineering, CI/CD, and developer experience,
          or about opportunities where that work matters. I usually reply within a business day.
        </p>
        <div className="mt-10 flex flex-wrap gap-3">
          <Link to="/contact" className="btn-primary h-14 px-8 text-lg">
            <Mail aria-hidden="true" className="h-5 w-5" />
            Send me a message
          </Link>
          <a href={RESUME_PATH} download className="btn-secondary h-14 px-8 text-lg">
            <Download aria-hidden="true" className="h-5 w-5" />
            Resume
          </a>
        </div>
      </section>
    </Container>
  </>
);

export default Home;
