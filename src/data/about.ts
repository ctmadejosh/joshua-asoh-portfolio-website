/**
 * The About page's journey timeline. Every milestone is a fact from
 * Joshua's experience list (src/data/experience.ts) or resume. Personal
 * story (why platform engineering, what's next, fun facts) goes in `story`
 * below, in his own words; an empty field is simply not rendered.
 */
export type Milestone = {
  year: string;
  title: string;
  org: string;
  icon: "wrench" | "flask" | "users" | "trophy" | "bot" | "factory" | "rocket";
  summary: string;
  highlight?: { value: string; label: string };
  to?: string;
};

export const journey: Milestone[] = [
  {
    year: "2022",
    title: "IT Student Technician",
    org: "Gateway IT Department",
    icon: "wrench",
    summary:
      "Supported infrastructure across Connecticut's community college system, and helped repair a script malfunction that affected students and faculty across 12 colleges.",
    highlight: { value: "36,000+", label: "students and faculty affected by the fix" },
  },
  {
    year: "2023",
    title: "Lab Software Developer Intern",
    org: "Alexion-AstraZeneca",
    icon: "flask",
    summary:
      "Led development of a real-time, barcode-driven inventory system for a rare-disease research lab, in Python and Neptyne.",
    highlight: { value: "20,000+", label: "BSL2 chemical inventory items tracked" },
    to: "/work/lab-inventory-system",
  },
  {
    year: "2023",
    title: "Vice President, IEEE",
    org: "Central Connecticut State University",
    icon: "users",
    summary:
      "Recruited about 40 new members and set up partnerships with FactSet, COCC, The Hartford, and Travelers for diversity-focused hiring events.",
    highlight: { value: "~40", label: "new members recruited" },
  },
  {
    year: "2024",
    title: "Software Engineer Extern",
    org: "FactSet",
    icon: "trophy",
    summary:
      "Selected as one of 15 participants for a two-week software engineering and AI/ML program, and built Kate AI, a smart portfolio manager, for its hackathon.",
    highlight: { value: "1 of 15", label: "participants selected" },
  },
  {
    year: "2025",
    title: "Cloud & Reliability Engineer Intern",
    org: "The Hartford",
    icon: "bot",
    summary:
      "Built a GenAI documentation chatbot on Claude 3.5 Sonnet and AWS Bedrock with a RAG pipeline, provisioned with Terraform.",
    highlight: { value: "800+", label: "engineers supported" },
    to: "/work/documentation-chatbot",
  },
  {
    year: "2025",
    title: "Digital Manufacturing Engineering Intern",
    org: "Zygo AMETEK",
    icon: "factory",
    summary:
      "Wrote digital work instructions for precision optical products and put IIoT devices on the production floor to measure runtime and efficiency.",
    highlight: { value: "15", label: "optical products documented" },
  },
  {
    year: "2026",
    title: "Platform Engineer",
    org: "The Hartford",
    icon: "rocket",
    summary:
      "Building ATLAS, the developer platform for 4,000+ engineers: its CLI, desktop agent, VS Code extension, telemetry, and the CEO-sponsored push to make onboarding self-service.",
    highlight: { value: "144", label: "pull requests merged" },
    to: "/work/atlas-developer-platform",
  },
];

export const quickFacts = [
  { label: "Based in", value: "Connecticut" },
  { label: "Studying", value: "M.S. Computer Information Technology" },
  { label: "Program", value: "Tech & Ops Leadership Development" },
  { label: "Communities", value: "NSBE · ColorStack · Epsilon Pi Tau" },
];

/**
 * Joshua's own words. Leave a field empty and its section stays hidden; never
 * fill these in on his behalf.
 */
export const story: {
  why: string[];
  next: string[];
  funFacts: { emoji: string; fact: string }[];
} = {
  why: [],
  next: [],
  funFacts: [],
};
