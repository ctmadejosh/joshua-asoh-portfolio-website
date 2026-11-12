import * as Accordion from "@radix-ui/react-accordion";
import { Plus } from "lucide-react";
import { experiences } from "@/data/experience";

const Experience = () => {
  return (
    <section id="experience" className="border-t border-border bg-card py-20 lg:py-28">
      <div className="mx-auto max-w-6xl px-6">
        <h2 className="text-4xl font-bold tracking-tight sm:text-5xl">Experience</h2>
        <p className="mt-4 max-w-xl text-lg text-muted-foreground">
          Ten roles since 2022, newest first. Open any of them for the details.
        </p>

        <Accordion.Root type="single" collapsible defaultValue="role-0" className="mt-10 border-t border-ink">
          {experiences.map((exp, index) => (
            <Accordion.Item key={exp.title + exp.period} value={`role-${index}`} className="border-b border-border">
              <Accordion.Header asChild>
                <h3 className="font-sans">
                  <Accordion.Trigger className="group grid w-full grid-cols-[1fr_auto] items-center gap-x-6 gap-y-1 py-5 text-left md:grid-cols-[16rem_1fr_auto]">
                    <span className="col-span-2 text-[0.95rem] text-muted-foreground md:col-span-1">
                      {exp.period}
                    </span>
                    <span>
                      <span className="block font-display text-xl font-semibold tracking-tight transition-colors group-hover:text-primary group-data-[state=open]:text-primary sm:text-2xl">
                        {exp.title}
                      </span>
                      <span className="mt-0.5 block text-muted-foreground">
                        {exp.company}, {exp.location}
                      </span>
                    </span>
                    <span className="flex h-9 w-9 items-center justify-center rounded-full border border-border transition-colors group-hover:border-primary group-hover:text-primary group-data-[state=open]:border-primary group-data-[state=open]:bg-primary group-data-[state=open]:text-white">
                      <Plus className="h-4 w-4 transition-transform duration-200 group-data-[state=open]:rotate-45" />
                    </span>
                  </Accordion.Trigger>
                </h3>
              </Accordion.Header>
              <Accordion.Content className="overflow-hidden data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down">
                <div className="pb-8 md:pl-[17.5rem] md:pr-16">
                  <p className="max-w-[68ch] font-medium">{exp.description}</p>
                  <ul className="mt-4 max-w-[68ch] list-disc space-y-2 pl-5 marker:text-primary">
                    {exp.achievements.map((achievement) => (
                      <li key={achievement}>{achievement}</li>
                    ))}
                  </ul>
                </div>
              </Accordion.Content>
            </Accordion.Item>
          ))}
        </Accordion.Root>
      </div>
    </section>
  );
};

export default Experience;
