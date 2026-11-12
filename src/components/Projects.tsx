import React from "react";

const projects = [
  {
    title: "AI-Powered Lead Generation",
    description: "End-to-end lead generation and outreach automation for a home care agency. Finds caregiving-related Reddit posts, scores them with AI, and logs leads and outreach in Airtable. Built with Python, OpenAI, PRAW, and the Airtable API.",
    link: "https://github.com/ctmadejosh/AI-Powered-Lead-Generation",
  },
  {
    title: "Kate AI – Smart Portfolio Manager",
    description: "Hackathon project from FactSet's SWE Mesh externship. A Streamlit assistant that uses OpenAI with FactSet and news data to answer questions about stocks and portfolios.",
    link: "https://github.com/ctmadejosh/MESH-Hackathon",
  },
  {
    title: "AI Tools",
    description: "Personal toolkit for AI-assisted development: reusable agent skills for repo scanning, shipping changes, docs, tests, and releases, plus instruction files that act as guardrails. Built with Node.js.",
    link: "https://github.com/ctmadejosh/ai-tools",
  },
  {
    title: "Personal Website",
    description: "This portfolio, built with React, Vite, TypeScript, and Tailwind CSS, and deployed on Cloudflare Workers.",
    link: "https://github.com/ctmadejosh/joshua-asoh-portfolio-website",
  },
];

const Projects: React.FC = () => (
  <section id="projects" className="container mx-auto px-6 py-20">
    <h1 className="text-4xl font-bold mb-8">Projects</h1>
    <div className="grid md:grid-cols-2 gap-8">
      {projects.map((project) => (
        <div key={project.title} className="bg-card rounded-xl shadow-card p-6 flex flex-col">
          <h2 className="text-2xl font-semibold mb-2">{project.title}</h2>
          <p className="text-muted-foreground mb-4">{project.description}</p>
          <a
            href={project.link}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-auto text-primary font-medium hover:underline"
          >
            View on GitHub
          </a>
        </div>
      ))}
    </div>
  </section>
);

export default Projects;