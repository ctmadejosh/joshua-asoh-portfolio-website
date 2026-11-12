import { Link, useParams } from "react-router-dom";
import { ArrowLeft, ArrowRight } from "lucide-react";
import Seo from "@/components/site/Seo";
import { Container } from "@/components/site/Cards";
import { caseStudies, getCaseStudy } from "@/data/work";
import NotFound from "./NotFound";

const CaseStudy = () => {
  const { slug } = useParams();
  const study = getCaseStudy(slug);
  if (!study) return <NotFound />;

  const index = caseStudies.indexOf(study);
  const next = caseStudies[(index + 1) % caseStudies.length];

  return (
    <Container>
      <Seo title={study.title} description={study.lede} />
      <article className="mx-auto max-w-3xl">
        <nav aria-label="Breadcrumb" className="pt-12 md:pt-16">
          <Link
            to="/work"
            className="group inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft aria-hidden="true" className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
            All case studies
          </Link>
        </nav>

        <header className="pb-10 pt-8" data-reveal>
          <p className="eyebrow mb-4">{study.eyebrow}</p>
          <h1 className="text-4xl font-bold leading-[1.08] tracking-tight sm:text-5xl">{study.title}</h1>
          <p className="mt-6 text-xl leading-relaxed text-muted-foreground">{study.lede}</p>

          <dl className="mt-8 grid gap-x-8 gap-y-4 border-y border-border py-6 text-sm sm:grid-cols-2">
            <div>
              <dt className="text-subtle">Role</dt>
              <dd className="mt-0.5 font-medium">{study.role}</dd>
            </div>
            <div>
              <dt className="text-subtle">When</dt>
              <dd className="mt-0.5 font-medium">{study.period}</dd>
            </div>
          </dl>

          <dl className="mt-8 flex flex-wrap gap-x-10 gap-y-6">
            {study.facts.map((fact) => (
              <div key={fact.label} className="flex flex-col-reverse">
                <dt className="mt-1 text-sm text-subtle">{fact.label}</dt>
                <dd className="font-display text-3xl font-bold tracking-tight">{fact.value}</dd>
              </div>
            ))}
          </dl>
        </header>

        <div className="space-y-12">
          {study.sections.map((section) => (
            <section key={section.title} data-reveal>
              <p
                className={`eyebrow mb-2 ${section.label === "My contribution" ? "text-primary-ink" : ""}`}
              >
                {section.label}
              </p>
              <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">{section.title}</h2>
              <div className="mt-4 space-y-4 text-lg leading-relaxed text-muted-foreground">
                {section.body.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
              {section.bullets && (
                <ul className="mt-4 space-y-3">
                  {section.bullets.map((bullet) => (
                    <li
                      key={bullet}
                      className="relative pl-6 leading-relaxed text-muted-foreground before:absolute before:left-0 before:text-subtle before:content-['—']"
                    >
                      {bullet}
                    </li>
                  ))}
                </ul>
              )}
            </section>
          ))}
        </div>

        <section className="mt-12" data-reveal>
          <p className="eyebrow mb-3">Built with</p>
          <ul className="flex flex-wrap gap-2">
            {study.stack.map((item) => (
              <li key={item} className="chip">
                {item}
              </li>
            ))}
          </ul>
        </section>

        {next && next.slug !== study.slug && (
          <Link
            to={`/work/${next.slug}`}
            className="surface-card group mt-16 flex items-center justify-between gap-6 px-6 py-5 hover:border-border-strong"
          >
            <span>
              <span className="eyebrow block">Next case study</span>
              <span className="mt-1 block font-display text-lg font-semibold group-hover:text-primary-ink">
                {next.title}
              </span>
            </span>
            <ArrowRight aria-hidden="true" className="h-5 w-5 shrink-0 transition-transform group-hover:translate-x-0.5" />
          </Link>
        )}
      </article>
    </Container>
  );
};

export default CaseStudy;
