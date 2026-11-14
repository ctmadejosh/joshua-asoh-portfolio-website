import { Link } from "react-router-dom";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { readingMinutes, type CaseStudy } from "@/data/work";
import FlowDiagram from "./FlowDiagram";
import type { Project } from "@/data/projects";

export const PageIntro = ({
  eyebrow,
  title,
  children,
}: {
  eyebrow: string;
  title: string;
  children?: React.ReactNode;
}) => (
  <div className="max-w-3xl pb-12 pt-16 md:pt-24">
    <p className="eyebrow mb-4">{eyebrow}</p>
    <h1 className="text-4xl font-bold leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">{title}</h1>
    {children && (
      <div className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">{children}</div>
    )}
  </div>
);

export const SectionHeading = ({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: { label: string; to: string };
}) => (
  <div className="mb-8 flex flex-wrap items-end justify-between gap-4" data-reveal>
    <div className="max-w-2xl">
      <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">{title}</h2>
      {description && <p className="mt-3 text-lg text-muted-foreground">{description}</p>}
    </div>
    {action && (
      <Link to={action.to} className="group inline-flex items-center gap-1.5 font-medium text-primary-ink">
        {action.label}
        <ArrowRight aria-hidden="true" className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
      </Link>
    )}
  </div>
);

export const CaseStudyCard = ({ study, index = 0 }: { study: CaseStudy; index?: number }) => (
  <Link
    to={`/work/${study.slug}`}
    data-reveal
    data-reveal-delay={index * 70}
    className="surface-card group flex h-full flex-col px-6 py-6 hover:border-border-strong"
  >
    <p className="eyebrow mb-3">
      {study.eyebrow} · {readingMinutes(study)} min
    </p>
    <h3 className="text-xl font-semibold tracking-tight transition-colors group-hover:text-primary-ink">
      {study.title}
    </h3>
    <p className="mt-2 text-muted-foreground">{study.lede}</p>
    <div className="mt-5 overflow-hidden" aria-hidden="true">
      <FlowDiagram flow={study.flow.slice(0, 3)} compact />
    </div>
    <ul className="mt-5 flex flex-wrap gap-x-6 gap-y-2 text-sm">
      {study.facts.slice(0, 2).map((fact) => (
        <li key={fact.label}>
          <span className="font-semibold">{fact.value}</span>{" "}
          <span className="text-subtle">{fact.label.charAt(0).toLowerCase() + fact.label.slice(1)}</span>
        </li>
      ))}
    </ul>
    <span className="mt-auto inline-flex items-center gap-1.5 pt-6 text-sm font-medium text-primary-ink">
      Read the case study
      <ArrowRight aria-hidden="true" className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
    </span>
  </Link>
);

export const ProjectCard = ({ project, index = 0 }: { project: Project; index?: number }) => (
  <article
    data-reveal
    data-reveal-delay={index * 70}
    className="surface-card flex h-full flex-col px-6 py-6 hover:border-border-strong"
  >
    <p className="eyebrow mb-3">{project.context}</p>
    <h3 className="text-xl font-semibold tracking-tight">{project.title}</h3>
    <p className="mt-2 text-muted-foreground">{project.description}</p>
    <ul className="mt-5 flex flex-wrap gap-2" aria-label="Built with">
      {project.stack.map((item) => (
        <li key={item} className="chip">
          {item}
        </li>
      ))}
    </ul>
    {project.caseStudy && (
      <Link
        to={`/work/${project.caseStudy}`}
        className="group mt-auto inline-flex items-center gap-1 pt-6 text-sm font-medium text-primary-ink"
      >
        Read how it's built
        <ArrowRight aria-hidden="true" className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
      </Link>
    )}
    {project.link && (
      <a
        href={project.link}
        target="_blank"
        rel="noopener noreferrer"
        className={`group inline-flex items-center gap-1 text-sm font-medium text-primary-ink ${project.caseStudy ? "pt-2" : "mt-auto pt-6"}`}
      >
        View the code on GitHub
        <span className="sr-only"> (opens in a new tab)</span>
        <ArrowUpRight aria-hidden="true" className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
      </a>
    )}
  </article>
);

export const Container = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <div className={`mx-auto max-w-site px-6 md:px-10 ${className}`}>{children}</div>
);
