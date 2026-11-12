export type Project = {
  title: string;
  context: string;
  description: string;
  stack: string[];
  link?: string;
  caseStudy?: string;
};

export const projects: Project[] = [
  {
    title: "AI-Powered Lead Generation",
    context: "Personal",
    description:
      "Lead generation and outreach automation for a home care agency. It finds caregiving-related Reddit posts, scores them with AI, and logs leads and outreach in Airtable.",
    stack: ["Python", "OpenAI", "PRAW", "Airtable"],
    link: "https://github.com/ctmadejosh/AI-Powered-Lead-Generation",
  },
  {
    title: "Kate AI",
    context: "FactSet externship hackathon, 2024",
    description:
      "A Streamlit smart portfolio manager built for the hackathon that closed a two-week externship with 15 selected participants. It uses FactSet and news data to answer questions about stocks and portfolios.",
    stack: ["Python", "AI/ML", "Streamlit"],
    link: "https://github.com/ctmadejosh/MESH-Hackathon",
  },
  {
    title: "AI Tools",
    context: "Personal",
    description:
      "A toolkit for AI-assisted development: reusable agent skills for repo scanning, shipping changes, docs, tests, and releases, plus instruction files that act as guardrails.",
    stack: ["Node.js", "Agent skills"],
    link: "https://github.com/ctmadejosh/ai-tools",
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
