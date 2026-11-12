import Seo from "@/components/site/Seo";
import { CaseStudyCard, Container, PageIntro } from "@/components/site/Cards";
import { caseStudies } from "@/data/work";

const Work = () => (
  <Container>
    <Seo
      title="Work"
      description="Case studies from Joshua Asoh's platform engineering, GenAI, and lab software work: the problem, his contribution, and the outcome."
    />
    <PageIntro eyebrow="Work" title="Case studies">
      Longer write-ups of work I've done on teams. Most of it lives in company repositories, so
      these stand in for links. Each one separates the team's context from my own part in it.
    </PageIntro>
    <div className="grid gap-4 md:grid-cols-2">
      {caseStudies.map((study, i) => (
        <CaseStudyCard key={study.slug} study={study} index={i} />
      ))}
    </div>
  </Container>
);

export default Work;
