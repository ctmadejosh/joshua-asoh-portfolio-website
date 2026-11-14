import { Link } from "react-router-dom";
import { ArrowRight, Bot, Download, GraduationCap, Handshake, MapPin, Users } from "lucide-react";
import portraitMain from "@/assets/portrait-linkedin.jpg";
import portraitClose from "@/assets/portrait-close.jpg";
import Seo from "@/components/site/Seo";
import { Container, SectionHeading } from "@/components/site/Cards";
import JourneyTimeline from "@/components/site/JourneyTimeline";
import SocialLinks from "@/components/site/SocialLinks";
import PhotoGallery from "@/components/site/PhotoGallery";
import { community, gallery, journey, quickFacts, story } from "@/data/about";
import { RESUME_PATH, SITE_NAME, certifications, education } from "@/data/site";
import { trackEvent } from "@/lib/analytics";

const AboutPage = () => (
  <Container>
    <Seo
      title="About"
      description="About Joshua Asoh: a platform engineer at The Hartford, his path from IT support and lab software to building ATLAS, his education, and what drives him."
      breadcrumbs={[["About", "/about"]]}
    />

    {/* Header: big portrait beside the intro. */}
    <section className="grid items-center gap-10 pb-16 pt-12 md:pt-16 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:gap-16">
      <div>
        <p className="eyebrow mb-4">About</p>
        <h1 className="text-4xl font-bold leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">
          Hi, I'm Josh.
        </h1>
        <div className="mt-6 max-w-xl space-y-4 text-lg leading-relaxed text-muted-foreground">
          <p>
            I'm a platform engineer in The Hartford's Technology &amp; Operations Leadership
            Development Program, building ATLAS, a developer platform used by 4,000+ engineers (as of November 2026) to
            ship.
          </p>
          <p>
            My path here ran through IT support, lab software, a GenAI chatbot, and a
            manufacturing floor before it reached the platform team. The timeline below walks
            through each stop.
          </p>
        </div>
        <dl className="mt-8 grid max-w-xl grid-cols-2 gap-x-6 gap-y-4">
          {quickFacts.map((fact) => (
            <div key={fact.label} className="border-l-2 border-primary/40 pl-3">
              <dt className="text-xs uppercase tracking-wider text-subtle">{fact.label}</dt>
              <dd className="mt-0.5 font-medium">{fact.value}</dd>
            </div>
          ))}
        </dl>
        <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-4">
          <a
            href={RESUME_PATH}
            download
            onClick={() => trackEvent("resume_download", { location: "about" })}
            className="btn-primary"
          >
            <Download aria-hidden="true" className="h-4 w-4" />
            Resume
          </a>
          <SocialLinks />
        </div>
      </div>

      <figure className="relative isolate mx-auto w-full max-w-md">
        <div aria-hidden="true" className="absolute -inset-3 -z-10 rotate-2 rounded-[2rem] bg-primary-surface" />
        <img
          src={portraitMain}
          alt="Portrait of Joshua Asoh smiling, in a white T-shirt"
          width={640}
          height={800}
          className="aspect-[4/5] w-full rounded-3xl border border-border object-cover shadow-[0_30px_60px_-30px_hsl(var(--foreground)/0.45)]"
        />
        <figcaption className="absolute -bottom-4 left-4 flex items-center gap-1.5 rounded-full border border-border bg-card px-3.5 py-1.5 text-sm font-medium shadow-sm">
          <MapPin aria-hidden="true" className="h-3.5 w-3.5 text-primary-ink" />
          {SITE_NAME} · Connecticut
        </figcaption>
      </figure>
    </section>

    {/* Journey */}
    <section className="pt-12 md:pt-16" aria-labelledby="journey-heading">
      <div className="mb-8" data-reveal>
        <h2 id="journey-heading" className="text-3xl font-bold tracking-tight sm:text-4xl">
          The road here
        </h2>
        <p className="mt-3 max-w-2xl text-lg text-muted-foreground">
          {journey.length} stops since 2022. Pick one to see what I did there.
        </p>
      </div>
      <div data-reveal>
        <JourneyTimeline milestones={journey} />
      </div>
    </section>

    {/* Photo gallery: Joshua's own photos from LinkedIn. */}
    {gallery.length > 0 && (
      <section className="pt-20 md:pt-28" aria-labelledby="gallery-heading">
        <div className="mb-8" data-reveal>
          <h2 id="gallery-heading" className="text-3xl font-bold tracking-tight sm:text-4xl">
            Along the way
          </h2>
          <p className="mt-3 max-w-2xl text-lg text-muted-foreground">
            A few moments from the road so far. Select a photo to see it larger.
          </p>
        </div>
        <PhotoGallery photos={gallery} />
      </section>
    )}

    {/* Leadership, mentoring & community. Wording confirmed by Joshua. */}
    <section className="pt-20 md:pt-28" aria-labelledby="community-heading">
      <div className="mb-8" data-reveal>
        <h2 id="community-heading" className="text-3xl font-bold tracking-tight sm:text-4xl">
          Leadership, mentoring &amp; community
        </h2>
        <p className="mt-3 max-w-2xl text-lg text-muted-foreground">
          Outside the day-to-day engineering work.
        </p>
      </div>
      <ul className="grid gap-4 md:grid-cols-2">
        {community.map((item, i) => {
          const Icon = { users: Users, handshake: Handshake, graduation: GraduationCap, bot: Bot }[item.icon];
          return (
            <li key={item.org} className="surface-card flex gap-4 p-6" data-reveal data-reveal-delay={i * 70}>
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary-surface text-primary-ink">
                <Icon aria-hidden="true" className="h-5 w-5" />
              </span>
              <div>
                <h3 className="font-sans text-lg font-semibold leading-snug">{item.role}</h3>
                <p className="text-sm font-medium text-muted-foreground">
                  {item.org}
                  {item.period && <span className="text-subtle"> · {item.period}</span>}
                </p>
                <p className="mt-2 leading-relaxed text-muted-foreground">{item.detail}</p>
              </div>
            </li>
          );
        })}
      </ul>
    </section>

    {/* Why platform engineering: Joshua's own words, shown only once written. */}
    {story.why.length > 0 && (
      <section className="grid gap-8 pt-20 md:grid-cols-[16rem_minmax(0,1fr)] md:gap-12 md:pt-28" data-reveal>
        <img
          src={portraitClose}
          alt="Close-up portrait of Joshua Asoh"
          width={800}
          height={800}
          loading="lazy"
          className="aspect-square w-40 rounded-2xl border border-border object-cover md:w-full"
        />
        <div>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Why platform engineering</h2>
          <div className="mt-5 space-y-4 text-lg leading-relaxed text-muted-foreground">
            {story.why.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>
        </div>
      </section>
    )}

    {story.next.length > 0 && (
      <section className="pt-20 md:pt-28" data-reveal>
        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">What's next</h2>
        <div className="mt-5 max-w-3xl space-y-4 text-lg leading-relaxed text-muted-foreground">
          {story.next.map((p) => (
            <p key={p}>{p}</p>
          ))}
        </div>
      </section>
    )}

    {story.funFacts.length > 0 && (
      <section className="pt-20 md:pt-28" aria-labelledby="facts-heading">
        <h2 id="facts-heading" className="mb-8 text-3xl font-bold tracking-tight sm:text-4xl" data-reveal>
          A few fun facts
        </h2>
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {story.funFacts.map((f, i) => (
            <li
              key={f.fact}
              data-reveal
              data-reveal-delay={i * 70}
              className="surface-card group flex gap-4 p-5 transition-transform hover:-translate-y-1 motion-reduce:hover:translate-y-0"
            >
              <span aria-hidden="true" className="text-3xl transition-transform group-hover:scale-125 motion-reduce:group-hover:scale-100">
                {f.emoji}
              </span>
              <p className="leading-relaxed">{f.fact}</p>
            </li>
          ))}
        </ul>
      </section>
    )}

    {/* Education and certifications */}
    <section className="pt-20 md:pt-28" aria-labelledby="edu-heading">
      <SectionHeading title="Education" />
      <div className="grid gap-4 md:grid-cols-2">
        {education.map((item, i) => (
          <div key={item.degree} className="surface-card flex gap-4 p-6" data-reveal data-reveal-delay={i * 80}>
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary-surface text-primary-ink">
              <GraduationCap aria-hidden="true" className="h-5 w-5" />
            </span>
            <div>
              <h3 id={i === 0 ? "edu-heading" : undefined} className="font-sans text-lg font-semibold">
                {item.degree}
              </h3>
              <p className="mt-1 text-muted-foreground">{item.detail}</p>
            </div>
          </div>
        ))}
      </div>
      <p className="mt-6 text-sm text-subtle" data-reveal>
        Certifications: {certifications.map((c) => c.name).join(" · ")}.
      </p>
    </section>

    <section className="mt-20 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-border bg-card p-6 sm:p-8 md:mt-28" data-reveal>
      <p className="font-display text-2xl font-semibold tracking-tight">See what I've built.</p>
      <div className="flex flex-wrap gap-3">
        <Link to="/work" className="btn-primary">
          Case studies <ArrowRight aria-hidden="true" className="h-4 w-4" />
        </Link>
        <Link to="/contact" className="btn-secondary">
          Get in touch
        </Link>
      </div>
    </section>
  </Container>
);

export default AboutPage;
