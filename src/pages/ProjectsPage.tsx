import { Link } from "react-router-dom";
import Seo from "@/components/site/Seo";
import { Container, PageIntro, ProjectCard } from "@/components/site/Cards";
import { projects } from "@/data/projects";
import { GITHUB_URL } from "@/data/site";

const ProjectsPage = () => (
  <Container>
    <Seo
      title="Projects"
      description="Side projects by Joshua Asoh: AI lead generation, a hackathon portfolio manager, AI developer tooling, and this website."
    />
    <PageIntro eyebrow="Projects" title="Things I've built on my own">
      Smaller projects with public code. For longer write-ups of team work, see the{" "}
      <Link to="/work" className="text-link">
        case studies
      </Link>
      . More is on{" "}
      <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer" className="text-link">
        GitHub<span className="sr-only"> (opens in a new tab)</span>
      </a>
      .
    </PageIntro>
    <div className="grid gap-4 md:grid-cols-2">
      {projects.map((project, i) => (
        <ProjectCard key={project.title} project={project} index={i} />
      ))}
    </div>
  </Container>
);

export default ProjectsPage;
