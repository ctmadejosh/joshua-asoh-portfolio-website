export const SITE_URL = "https://juasoh.com";
export const SITE_NAME = "Joshua Asoh";
export const SITE_ROLE = "Platform Engineer at The Hartford";
export const RESUME_PATH = "/Joshua_Asoh_Resume.pdf";
export const EMAIL = "Joshua.asoh@my.ccsu.edu";
export const LINKEDIN_URL = "https://www.linkedin.com/in/joshua-asoh";
export const GITHUB_URL = "https://github.com/ctmadejosh";

/**
 * The contact form's backend: API Gateway + Lambda + DynamoDB + SES on AWS,
 * defined in infra/contact. Override with VITE_CONTACT_API_URL to test against
 * the default execute-api URL before aws.juasoh.com is attached.
 */
export const CONTACT_API_URL: string =
  (import.meta.env.VITE_CONTACT_API_URL as string | undefined) || "https://aws.juasoh.com/contact";

export const SITE_DESCRIPTION =
  "Joshua Asoh is a platform engineer at The Hartford building ATLAS, a developer platform used by 4,000+ engineers: its CLI, desktop agent, VS Code extension, telemetry, and self-service onboarding.";

/**
 * Headline numbers. Each one is defined once, here, and every page reads it
 * from this list, so the site can never show two versions of the same figure.
 * `source` says where it comes from, for anyone checking.
 */
export const proofPoints = [
  { value: "144", label: "pull requests merged", context: "of mine, across 21 ATLAS platform repositories", source: "atlas-developer-platform" },
  { value: "800+", label: "engineers supported", context: "by the GenAI documentation chatbot I built", source: "documentation-chatbot" },
  { value: "1–2 hrs", label: "saved per lookup", context: "on internal documentation questions", source: "documentation-chatbot" },
  { value: "20,000+", label: "inventory items tracked", context: "in a real-time BSL2 lab inventory system", source: "lab-inventory-system" },
] as const;

/** ATLAS platform-wide figures: the team's numbers, shown as context for Joshua's work. */
export const PLATFORM_FIGURES_AS_OF = "November 2026";
export const platformFigures = [
  { value: "4,000+", label: "engineers on the platform" },
  { value: "95,000+", label: "pipelines supported" },
  { value: "13,000+", label: "repositories tracked" },
  { value: "1,000+", label: "engineers adopted the tools in 90 days" },
] as const;


/** What Joshua built on ATLAS, grouped for the home page. Each links to the case study with detail. */
export const atlasWork = [
  {
    title: "CLI and desktop agent",
    detail: "CLI features, and the agent's bridge that lets a button on the platform site run a command on an engineer's own machine.",
    to: "/work/atlas-developer-platform#the-cli-and-the-desktop-agent",
  },
  {
    title: "VS Code extension",
    detail: "Extension features, and the day-one walkthrough that installs it and tours the editor.",
    to: "/work/atlas-developer-platform#the-vs-code-extension",
  },
  {
    title: "Self-service onboarding",
    detail: "In-browser walkthroughs, Atlas Studio's narrated videos, Harness provisioning, and onboarding people through it, for the CEO-sponsored initiative.",
    to: "/work/self-service-onboarding",
  },
  {
    title: "Telemetry and quality",
    detail: "The OpenTelemetry pipeline behind the usage dashboards, cross-platform tests with an 80%+ coverage gate, and release checks.",
    to: "/work/atlas-developer-platform#telemetry-for-devops-intelligence",
  },
] as const;

export const NAV_PAGES = [
  { label: "About", to: "/about" },
  { label: "Work", to: "/work" },
  { label: "Projects", to: "/projects" },
  { label: "Experience", to: "/experience" },
  { label: "Contact", to: "/contact" },
] as const;

export const skillGroups = [
  {
    name: "Cloud and infrastructure",
    items: ["AWS (ECS, Lambda, S3, Bedrock)", "GCP", "Terraform", "Docker"],
  },
  {
    name: "CI/CD and developer experience",
    items: ["Harness", "GitHub Actions", "Jenkins", "Internal developer platforms", "IDE and CLI tooling"],
  },
  {
    name: "AI",
    items: ["RAG and agentic workflows", "Prompt and retrieval engineering", "Cursor AI"],
  },
  {
    name: "Languages and frameworks",
    items: ["Python", "Java", "Angular", "C/C++", "SQL", "VHDL"],
  },
  {
    name: "Also",
    items: ["SOLIDWORKS", "Raspberry Pi", "Circuit prototyping", "Agile/Scrum", "Team leadership"],
  },
];

export const education = [
  {
    degree: "M.S. Computer Information Technology",
    detail: "Central Connecticut State University (4+1 program), expected May 2027. 3.71 GPA.",
  },
  {
    degree: "B.S. Computer Engineering Technology",
    detail: "Central Connecticut State University, August 2023 – December 2025. 3.44 GPA, Dean's List three times. Vice President of IEEE, A.S.O Club, and FactSet Student Ambassador.",
  },
];

export const certifications = [
  {
    name: "Terraform for the Absolute Beginners with Labs",
    date: "August 2025",
    description: "Udemy course covering Terraform fundamentals and hands-on infrastructure-as-code labs.",
  },
  {
    name: "BioLaunch Laboratory Operations",
    date: "February 2024",
    description: "Laboratory operations, safety protocols, and compliance for biotech environments.",
  },
  {
    name: "Electronics Technician Certification",
    date: "May 2023",
    description: "Electronic circuit analysis, troubleshooting, and repair techniques.",
  },
  {
    name: "SolidWorks Associate (CSWA)",
    date: "March 2021",
    description: "3D modeling, assembly design, and engineering drawings in SolidWorks.",
  },
  {
    name: "OSHA-10",
    date: "March 2019",
    description: "Occupational safety and health standards for general industry.",
  },
];
