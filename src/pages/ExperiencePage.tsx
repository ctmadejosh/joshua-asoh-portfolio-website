import { useState } from "react";
import * as Accordion from "@radix-ui/react-accordion";
import { Download, Plus } from "lucide-react";
import Seo from "@/components/site/Seo";
import { Container, PageIntro } from "@/components/site/Cards";
import { experiences } from "@/data/experience";
import { RESUME_PATH, certifications, education } from "@/data/site";
import { trackEvent } from "@/lib/analytics";

const FILTERS = [
  { label: "All", match: () => true },
  { label: "Engineering", match: (type: string, title: string) => /engineer|developer|technician|software/i.test(title) },
  { label: "Internships", match: (type: string) => /intern|extern/i.test(type) },
  { label: "Leadership & campus", match: (type: string) => /leadership|part-time/i.test(type) },
] as const;

const ExperiencePage = () => {
  const [filter, setFilter] = useState<(typeof FILTERS)[number]["label"]>("All");
  const match = FILTERS.find((f) => f.label === filter)!.match;
  const visible = experiences.map((exp, index) => ({ exp, index })).filter(({ exp }) => match(exp.type, exp.title));

  return (
  <Container>
    <Seo
      title="Experience"
      description="Joshua Asoh's roles, education, and certifications, from IT support and lab software to platform engineering at The Hartford."
      breadcrumbs={[["Experience", "/experience"]]}
    />
    <PageIntro eyebrow="Experience" title="Where I've worked">
      <p>{experiences.length} roles since 2022, newest first. Open any of them for the details.</p>
      <a
        href={RESUME_PATH}
        download
        onClick={() => trackEvent("resume_download", { location: "experience" })}
        className="btn-secondary mt-6 h-11 text-base"
      >
        <Download aria-hidden="true" className="h-4 w-4" />
        Download resume (PDF)
      </a>
    </PageIntro>

    <div role="group" aria-label="Filter roles" className="mb-6 flex flex-wrap gap-2">
      {FILTERS.map((f) => {
        const count = experiences.filter((e) => f.match(e.type, e.title)).length;
        const on = f.label === filter;
        return (
          <button
            key={f.label}
            type="button"
            aria-pressed={on}
            onClick={() => setFilter(f.label)}
            className={`rounded-full border px-3.5 py-1.5 text-sm transition-colors ${
              on
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border-strong text-muted-foreground hover:border-primary hover:text-foreground"
            }`}
          >
            {f.label} <span className="opacity-70">{count}</span>
          </button>
        );
      })}
    </div>

    <Accordion.Root
      type="single"
      collapsible
      defaultValue="role-0"
      className="border-t border-border-strong"
    >
      {visible.map(({ exp, index }) => (
        <Accordion.Item key={exp.title + exp.period} value={`role-${index}`} className="border-b border-border">
          <Accordion.Header asChild>
            <h2 className="font-sans">
              <Accordion.Trigger className="group grid w-full grid-cols-[1fr_auto] items-center gap-x-6 gap-y-1 py-5 text-left md:grid-cols-[14rem_1fr_auto]">
                <span className="col-span-2 text-sm text-subtle md:col-span-1">{exp.period}</span>
                <span>
                  <span className="block font-display text-lg font-semibold tracking-tight transition-colors group-hover:text-primary-ink group-data-[state=open]:text-primary-ink sm:text-xl">
                    {exp.title}
                  </span>
                  <span className="mt-0.5 block text-muted-foreground">
                    {exp.company} · {exp.location}
                  </span>
                </span>
                <span className="flex h-9 w-9 items-center justify-center rounded-full border border-border transition-colors group-hover:border-primary group-data-[state=open]:border-primary group-data-[state=open]:bg-primary group-data-[state=open]:text-primary-foreground">
                  <Plus aria-hidden="true" className="h-4 w-4 transition-transform duration-200 group-data-[state=open]:rotate-45" />
                </span>
              </Accordion.Trigger>
            </h2>
          </Accordion.Header>
          <Accordion.Content className="overflow-hidden data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down">
            <div className="pb-8 md:pl-[15.5rem] md:pr-16">
              <p className="mb-3 inline-block rounded-full bg-primary-surface px-2.5 py-0.5 text-xs font-medium text-primary-ink">
                {exp.type}
              </p>
              <p className="max-w-[68ch] font-medium">{exp.description}</p>
              <ul className="mt-4 max-w-[68ch] space-y-2">
                {exp.achievements.map((achievement) => (
                  <li
                    key={achievement}
                    className="relative pl-6 text-muted-foreground before:absolute before:left-0 before:text-subtle before:content-['—']"
                  >
                    {achievement}
                  </li>
                ))}
              </ul>
            </div>
          </Accordion.Content>
        </Accordion.Item>
      ))}
    </Accordion.Root>

    <div className="mt-24 grid gap-16 lg:grid-cols-2">
      <section data-reveal>
        <h2 className="text-3xl font-bold tracking-tight">Education</h2>
        <ul className="mt-6 space-y-4">
          {education.map((item) => (
            <li key={item.degree} className="surface-card px-6 py-5">
              <p className="font-semibold">{item.degree}</p>
              <p className="mt-1 text-muted-foreground">{item.detail}</p>
            </li>
          ))}
        </ul>
        <p className="mt-6 text-muted-foreground">
          Former Vice President of CCSU's IEEE chapter, and active in NSBE, ColorStack, and
          Epsilon Pi Tau.
        </p>
      </section>

      <section data-reveal>
        <h2 className="text-3xl font-bold tracking-tight">Certifications</h2>
        <ul className="mt-6 divide-y divide-border border-y border-border">
          {certifications.map((cert) => (
            <li key={cert.name} className="grid gap-x-6 gap-y-1 py-4 sm:grid-cols-[1fr_auto]">
              <div>
                <h3 className="font-sans font-semibold">{cert.name}</h3>
                <p className="mt-0.5 text-sm text-muted-foreground">{cert.description}</p>
              </div>
              <p className="text-sm text-subtle sm:text-right">{cert.date}</p>
            </li>
          ))}
        </ul>
      </section>
    </div>
  </Container>
  );
};

export default ExperiencePage;
