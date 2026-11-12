import { ArrowUpRight } from "lucide-react";

const projects = [
  {
    title: "Atlas Studio",
    context: "The Hartford, 2026",
    description:
      "An AI-enabled tool that turns written guide content into narrated walkthrough videos, built to widen developer onboarding.",
    stack: ["GenAI", "Developer onboarding"],
  },
  {
    title: "Documentation chatbot",
    context: "The Hartford, 2025",
    description:
      "A GenAI document chatbot on Claude 3.5 Sonnet and AWS Bedrock, with a RAG workflow across ECS, Lambda, and S3. It cut documentation lookups by one to two hours per query and scaled to 800+ engineers.",
    stack: ["AWS Bedrock", "RAG", "Terraform", "Angular"],
  },
  {
    title: "AI-Powered Lead Generation",
    context: "Personal",
    description:
      "End-to-end lead generation and outreach automation for a home care agency. Finds caregiving-related Reddit posts, scores them with AI, and logs leads and outreach in Airtable.",
    stack: ["Python", "OpenAI", "PRAW", "Airtable"],
    link: "https://github.com/ctmadejosh/AI-Powered-Lead-Generation",
  },
  {
    title: "Kate AI",
    context: "FactSet externship hackathon, 2024",
    description:
      "A Streamlit smart portfolio manager built for the hackathon that closed a two-week software engineering externship with 15 selected participants. It uses FactSet and news data to answer questions about stocks and portfolios.",
    stack: ["Python", "AI/ML", "Streamlit"],
    link: "https://github.com/ctmadejosh/MESH-Hackathon",
  },
  {
    title: "AI Tools",
    context: "Personal",
    description:
      "A toolkit for AI-assisted development, with reusable agent skills for repo scanning, shipping changes, docs, tests, and releases, plus instruction files that act as guardrails.",
    stack: ["Node.js", "Agent skills"],
    link: "https://github.com/ctmadejosh/ai-tools",
  },
  {
    title: "Lab inventory system",
    context: "Alexion-AstraZeneca, 2023",
    description:
      "Real-time inventory tracking for 1,600+ biological samples and a BSL2 chemical inventory of 20,000+ items, with barcodes, quantities, and unique IDs.",
    stack: ["Python", "Neptyne"],
  },
  {
    title: "This website",
    context: "Personal, ongoing",
    description:
      "My portfolio, built with React, Vite, TypeScript, and Tailwind CSS and deployed to Cloudflare Workers from GitHub.",
    stack: ["React", "TypeScript", "Cloudflare Workers"],
    link: "https://github.com/ctmadejosh/joshua-asoh-portfolio-website",
  },
];

const Projects = () => (
  <section id="projects" className="bg-ink py-20 text-white lg:py-28">
    <div className="mx-auto max-w-6xl px-6">
      <h2 className="text-4xl font-bold tracking-tight sm:text-5xl">Selected work</h2>
      <p className="mt-4 max-w-xl text-lg text-sky">
        Things I've built at work and on my own. Most of it lives inside company
        repositories, so the write-ups stand in for links.
      </p>

      <ul className="mt-12 grid gap-x-16 md:grid-cols-2">
        {projects.map((project) => (
          <li key={project.title} className="border-t border-white/20 py-8">
            <p className="text-[0.95rem] text-signal">{project.context}</p>
            <h3 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">
              {project.title}
            </h3>
            <p className="mt-3 max-w-[52ch] leading-relaxed text-white/85">
              {project.description}
            </p>
            <ul className="mt-5 flex flex-wrap gap-2">
              {project.stack.map((item) => (
                <li key={item} className="rounded-full border border-white/25 px-3 py-1 text-sm">
                  {item}
                </li>
              ))}
            </ul>
            {project.link && (
              <a
                href={project.link}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-5 inline-flex items-center gap-1 font-semibold underline decoration-signal decoration-2 underline-offset-4 hover:text-signal"
              >
                View the code on GitHub
                <ArrowUpRight className="h-4 w-4" />
              </a>
            )}
          </li>
        ))}
      </ul>
    </div>
  </section>
);

export default Projects;
