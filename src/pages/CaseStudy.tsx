import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, ArrowRight, Clock } from "lucide-react";
import Seo, { absoluteUrl } from "@/components/site/Seo";
import { Container } from "@/components/site/Cards";
import FlowDiagram from "@/components/site/FlowDiagram";
import { caseStudies, getCaseStudy, readingMinutes } from "@/data/work";
import { SITE_NAME, SITE_URL } from "@/data/site";
import NotFound from "./NotFound";

const sectionId = (title: string) =>
  title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

/** Highlights the contents entry for the section currently being read. */
function useActiveSection(ids: string[]) {
  const [active, setActive] = useState<string | null>(null);
  const key = ids.join("|");
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: "-20% 0px -65% 0px" }
    );
    key.split("|").forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [key]);
  return active;
}

const CaseStudy = () => {
  const { slug } = useParams();
  const study = getCaseStudy(slug);
  const ids = study ? ["summary", ...study.sections.map((s) => sectionId(s.title))] : [];
  const active = useActiveSection(ids);
  if (!study) return <NotFound />;

  const index = caseStudies.indexOf(study);
  const next = caseStudies[(index + 1) % caseStudies.length];
  const minutes = readingMinutes(study);
  const path = `/work/${study.slug}`;

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: study.title,
    description: study.lede,
    url: absoluteUrl(path),
    mainEntityOfPage: absoluteUrl(path),
    image: `${SITE_URL}/og-image.jpg`,
    author: { "@type": "Person", name: SITE_NAME, url: `${SITE_URL}/` },
    keywords: study.stack.join(", "),
    timeRequired: `PT${minutes}M`,
  };

  const toc = [{ id: "summary", label: "Summary" }, ...study.sections.map((s) => ({ id: sectionId(s.title), label: s.label === "My contribution" ? s.title : s.label }))];

  return (
    <Container>
      <Seo
        title={study.title}
        description={study.lede}
        ogType="article"
        jsonLd={[articleJsonLd]}
        breadcrumbs={[
          ["Work", "/work"],
          [study.title, path],
        ]}
      />
      <nav aria-label="Breadcrumb" className="pt-10 md:pt-14">
        <ol className="flex flex-wrap items-center gap-1.5 text-sm text-muted-foreground">
          <li>
            <Link to="/work" className="group inline-flex items-center gap-1.5 hover:text-foreground">
              <ArrowLeft aria-hidden="true" className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
              Work
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li aria-current="page" className="truncate text-subtle">
            {study.title}
          </li>
        </ol>
      </nav>

      <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_14rem]">
        <article className="min-w-0 max-w-3xl">
          <header className="pb-10 pt-8">
            <p className="eyebrow mb-4 flex flex-wrap items-center gap-x-2">
              {study.eyebrow}
              <span aria-hidden="true">·</span>
              <span className="inline-flex items-center gap-1">
                <Clock aria-hidden="true" className="h-3 w-3" />
                {minutes} min read
              </span>
            </p>
            <h1 className="text-4xl font-bold leading-[1.06] tracking-tight sm:text-5xl">{study.title}</h1>
            <p className="mt-6 text-xl leading-relaxed text-muted-foreground">{study.lede}</p>

            <dl className="mt-8 grid gap-x-8 gap-y-4 border-y border-border py-5 text-sm sm:grid-cols-2">
              <div>
                <dt className="text-subtle">Role</dt>
                <dd className="mt-0.5 font-medium">{study.role}</dd>
              </div>
              <div>
                <dt className="text-subtle">When</dt>
                <dd className="mt-0.5 font-medium">{study.period}</dd>
              </div>
            </dl>

            <ul className="mt-8 grid grid-cols-2 gap-x-8 gap-y-6 sm:grid-cols-4">
              {study.facts.map((fact) => (
                <li key={fact.label}>
                  <span className="block font-display text-3xl font-bold tracking-tight">{fact.value}</span>
                  <span className="mt-1 block text-sm text-subtle">{fact.label}</span>
                </li>
              ))}
            </ul>
          </header>

          {/* The 30-second version. */}
          <section id="summary" aria-labelledby="summary-heading" className="surface-card scroll-mt-24 p-6 sm:p-7">
            <h2 id="summary-heading" className="eyebrow mb-4 text-primary-ink">
              The short version
            </h2>
            <dl className="space-y-3">
              {(
                [
                  ["Problem", study.tldr.problem],
                  ["What I did", study.tldr.did],
                  ["Result", study.tldr.result],
                ] as const
              ).map(([term, text]) => (
                <div key={term} className="grid gap-1 sm:grid-cols-[7rem_1fr]">
                  <dt className="font-semibold">{term}</dt>
                  <dd className="text-muted-foreground">{text}</dd>
                </div>
              ))}
            </dl>
            <div className="mt-6 border-t border-border pt-6">
              <FlowDiagram flow={study.flow} note={study.flowNote} />
            </div>
          </section>

          <div className="mt-14 space-y-12">
            {study.sections.map((section) => (
              <section key={section.title} id={sectionId(section.title)} className="scroll-mt-24" data-reveal>
                <p className={`eyebrow mb-2 ${section.label === "My contribution" ? "text-primary-ink" : ""}`}>{section.label}</p>
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

          {study.links && study.links.length > 0 && (
            <section className="mt-12" aria-labelledby="related-heading">
              <h2 id="related-heading" className="eyebrow mb-3">
                Related
              </h2>
              <ul className="space-y-2">
                {study.links.map((link) => (
                  <li key={link.url}>
                    <a href={link.url} target="_blank" rel="noopener noreferrer" className="text-link">
                      {link.label}
                      <span className="sr-only"> (opens in a new tab)</span>
                    </a>
                  </li>
                ))}
              </ul>
            </section>
          )}

          <section className="mt-12" aria-labelledby="stack-heading">
            <h2 id="stack-heading" className="eyebrow mb-3">
              Built with
            </h2>
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
                <span className="mt-1 block font-display text-lg font-semibold group-hover:text-primary-ink">{next.title}</span>
              </span>
              <ArrowRight aria-hidden="true" className="h-5 w-5 shrink-0 transition-transform group-hover:translate-x-0.5" />
            </Link>
          )}
        </article>

        <aside className="hidden lg:block">
          <nav aria-label="On this page" className="sticky top-24 pt-8">
            <p className="eyebrow mb-3">On this page</p>
            <ul className="space-y-1 border-l border-border text-sm">
              {toc.map((item) => (
                <li key={item.id}>
                  <a
                    href={`#${item.id}`}
                    aria-current={active === item.id ? "location" : undefined}
                    className={`-ml-px block border-l-2 py-1 pl-3 transition-colors ${
                      active === item.id
                        ? "border-primary font-medium text-foreground"
                        : "border-transparent text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </aside>
      </div>
    </Container>
  );
};

export default CaseStudy;
