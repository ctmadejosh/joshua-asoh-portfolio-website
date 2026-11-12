import Seo from "@/components/site/Seo";
import { CaseStudyCard, Container, PageIntro } from "@/components/site/Cards";
import { caseStudies } from "@/data/work";

const Work = () => (
  <Container>
    <Seo
      title="Work"
      description="Case studies from Joshua Asoh's platform engineering, GenAI, and lab software work: the problem, his contribution, and the outcome."
      breadcrumbs={[["Work", "/work"]]}
    />
    <PageIntro eyebrow="Work" title="Case studies">
      Each one starts with a three-line summary and a diagram of the system, then the full story
      for anyone who wants it. Team context and my own contribution are always labelled
      separately.
    </PageIntro>
    <div className="grid gap-4 md:grid-cols-2">
      {caseStudies.map((study, i) => (
        <CaseStudyCard key={study.slug} study={study} index={i} />
      ))}
    </div>
  </Container>
);

export default Work;
