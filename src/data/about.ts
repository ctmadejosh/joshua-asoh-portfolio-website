import orderOfTheEngineer from "@/assets/gallery/order-of-the-engineer.jpg";
import ccsuGraduation from "@/assets/gallery/ccsu-graduation.jpg";
import hartfordCeo from "@/assets/gallery/hartford-ceo-meeting.jpg";
import hartfordPodium from "@/assets/gallery/hartford-intern-podium.jpg";
import hartfordInternship from "@/assets/gallery/hartford-internship.jpg";
import docChatbotTeam from "@/assets/gallery/doc-chatbot-team.jpg";
import minorityNetworkingNight from "@/assets/gallery/minority-networking-night.jpg";
import factsetMesh from "@/assets/gallery/factset-swe-mesh.jpg";
import biolaunchLab from "@/assets/gallery/biolaunch-lab.jpg";

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
  icon: "wrench" | "flask" | "users" | "trophy" | "bot" | "factory" | "rocket" | "map";
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
      "Building ATLAS, a developer platform used by 4,000+ engineers (as of November 2026): its CLI, desktop agent, VS Code extension, telemetry, and the CEO-sponsored push to make onboarding self-service.",
    highlight: { value: "144", label: "pull requests merged (of 214 authored), as of Nov 2026" },
    to: "/work/atlas-developer-platform",
  },
  {
    year: "Aug 2026",
    title: "Side project: browser-based Guides",
    org: "The Hartford",
    icon: "map",
    summary:
      "Alongside my role, I'm leading the implementation of browser-based Guides: interactive, step-by-step guides that help engineers learn workflows and complete setup as part of self-service onboarding.",
    to: "/work/self-service-onboarding",
  },
];

export const quickFacts = [
  { label: "Based in", value: "Connecticut" },
  { label: "Studying", value: "M.S. Computer Information Technology" },
  { label: "Program", value: "Tech & Ops Leadership Development" },
  { label: "Communities", value: "NSBE · ColorStack · Epsilon Pi Tau · FactSet Student Ambassador" },
];

/**
 * Photo gallery on the About page. Every photo comes from Joshua's own
 * LinkedIn (posts, Featured, or media on a role), chosen with his OK; captions
 * and dates come from the post or media title. Images are resized copies
 * (long edge ≤1600px) in src/assets/gallery.
 */
export type GalleryPhoto = {
  src: string;
  width: number;
  height: number;
  alt: string;
  caption: string;
  date?: string;
};

export const gallery: GalleryPhoto[] = [
  {
    src: orderOfTheEngineer,
    width: 800,
    height: 1067,
    alt: "Joshua holding a certificate beneath the University of New Haven seal",
    caption: "Inducted into the Order of the Engineer at the University of New Haven",
    date: "May 2026",
  },
  {
    src: ccsuGraduation,
    width: 533,
    height: 800,
    alt: "Joshua in a graduation cap, gray suit and teal stole in front of the Central Connecticut State University seal",
    caption: "Graduated from CCSU with a B.S. in Computer Engineering Technology",
    date: "December 2025",
  },
  {
    src: hartfordCeo,
    width: 800,
    height: 1067,
    alt: "Joshua standing with fellow interns and The Hartford's CEO",
    caption: "Meeting The Hartford's CEO as an intern",
    date: "Summer 2025",
  },
  {
    src: hartfordPodium,
    width: 800,
    height: 1067,
    alt: "Joshua at a podium in an office presentation space, with two colleagues beside him",
    caption: "At the podium during my Cloud & Reliability internship at The Hartford",
    date: "Summer 2025",
  },
  {
    src: docChatbotTeam,
    width: 800,
    height: 600,
    alt: "Joshua with seven teammates outside a brick office building",
    caption: "The team behind the GenAI documentation chatbot",
    date: "Summer 2025",
  },
  {
    src: hartfordInternship,
    width: 800,
    height: 1067,
    alt: "Joshua in front of The Hartford sign on a wood-panelled wall",
    caption: "Wrapping up my internship at The Hartford",
    date: "August 2025",
  },
  {
    src: biolaunchLab,
    width: 800,
    height: 600,
    alt: "Joshua working on a laptop at a lab bench",
    caption: "Updating the BioLaunch Lab's full inventory as College Operations and Training Intern at ConnCAT",
    date: "August 2024",
  },
  {
    src: factsetMesh,
    width: 800,
    height: 600,
    alt: "A group selfie of the FactSet SWE Mesh externs in an office",
    caption: "Two weeks in the SWE Mesh program at FactSet's Norwalk office",
    date: "May 2024",
  },
  {
    src: minorityNetworkingNight,
    width: 800,
    height: 1066,
    alt: "Joshua speaking into a microphone beside a Central Connecticut State University screen",
    caption: "Hosting Minority Networking Night as IEEE Vice President, with recruiters from FactSet, The Hartford, Travelers, Selective and COCC",
    date: "February 2024",
  },
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

/**
 * Leadership, mentoring & community. Wording confirmed by Joshua (November
 * 2026). NAAIA: "Committee Member" only, never a leader or officer title.
 * FIRST Robotics: event setup and field resetting only (no judging).
 */
export const community: { role: string; org: string; period?: string; detail: string; icon: "users" | "graduation" | "handshake" | "bot" }[] = [
  {
    role: "Technical onboarding & mentoring",
    org: "The Hartford, Tech & Ops Leadership Development Program",
    period: "2026 – Present",
    detail:
      "Leads technical onboarding and knowledge transfer, supports LDP mentorship and orientation, and mentors associates and interns.",
    icon: "users",
  },
  {
    role: "Committee Member",
    org: "NAAIA Greater Hartford Chapter",
    period: "May 2026 – Present",
    detail:
      "Serves on the Programs, Career Expo, College & University Outreach, and SHINE committees. Plans professional-development events and an early-career expo, and reaches out to local universities to support student career readiness.",
    icon: "handshake",
  },
  {
    role: "Student Team Mentor",
    org: "Central Connecticut State University",
    detail:
      "Joins weekly sprint reviews with student software teams and guides them on cloud, DevOps, and agile practices.",
    icon: "graduation",
  },
  {
    role: "Event Volunteer",
    org: "FIRST Robotics (Hartford)",
    detail: "Handled event setup and field resetting for a youth robotics competition.",
    icon: "bot",
  },
];
