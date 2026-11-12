export const SITE_URL = "https://juasoh.com";
export const SITE_NAME = "Joshua Asoh";
export const SITE_ROLE = "Platform Engineer at The Hartford";
export const RESUME_PATH = "/Josh_Asoh_Resume_020926.pdf";
export const EMAIL = "Joshua.asoh@my.ccsu.edu";
export const LINKEDIN_URL = "https://www.linkedin.com/in/joshua-asoh";
export const GITHUB_URL = "https://github.com/ctmadejosh";

export const SITE_DESCRIPTION =
  "Joshua Asoh is a platform engineer at The Hartford building CI/CD automation, developer tooling, and cloud infrastructure.";

/**
 * Headline numbers. Each one is defined once, here, and every page reads it
 * from this list, so the site can never show two versions of the same figure.
 * `source` says where it comes from, for anyone checking.
 */
export const proofPoints = [
  { value: "144", label: "pull requests merged", context: "across 21 platform repositories at The Hartford", source: "harness-platform-automation" },
  { value: "800+", label: "engineers supported", context: "by the GenAI documentation chatbot I built", source: "documentation-chatbot" },
  { value: "1–2 hrs", label: "saved per lookup", context: "on internal documentation questions", source: "documentation-chatbot" },
  { value: "20,000+", label: "inventory items tracked", context: "in a real-time BSL2 lab inventory system", source: "lab-inventory-system" },
] as const;

export const NAV_PAGES = [
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
    items: ["Harness", "Jenkins", "Internal developer platforms", "IDE and CLI tooling"],
  },
  {
    name: "AI",
    items: ["RAG and agentic workflows", "Prompt and retrieval engineering"],
  },
  {
    name: "Languages and frameworks",
    items: ["Python", "Java", "Angular", "C/C++", "SQL", "VHDL"],
  },
  {
    name: "Also",
    items: ["SOLIDWORKS", "Agile/Scrum", "Team leadership"],
  },
];

export const education = [
  {
    degree: "M.S. Computer Information Technology",
    detail: "Central Connecticut State University, in progress. 3.71 GPA.",
  },
  {
    degree: "B.S. Computer Engineering Technology",
    detail: "Central Connecticut State University. 3.44 GPA, Dean's List three times.",
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
