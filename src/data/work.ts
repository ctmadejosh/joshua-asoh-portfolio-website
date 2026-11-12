/**
 * Case studies. Every fact here comes from Joshua's resume and the earlier
 * version of this site. Per PROP-PR-6, team context and Joshua's own
 * contribution are labelled separately, and no platform-audience or
 * onboarding-time figure is published until its owner confirms it.
 */
export type CaseStudySection = {
  label: "Team context" | "The problem" | "My contribution" | "What shipped" | "Outcome" | "Approach";
  title: string;
  body: string[];
  bullets?: string[];
};

export type CaseStudy = {
  slug: string;
  title: string;
  eyebrow: string;
  lede: string;
  role: string;
  period: string;
  stack: string[];
  facts: { value: string; label: string }[];
  /** Three-line summary shown above the full story. */
  tldr: { problem: string; did: string; result: string };
  /** Left-to-right flow for the case study's diagram. */
  flow: { label: string; detail?: string; mine?: boolean }[];
  flowNote?: string;
  sections: CaseStudySection[];
  links?: { label: string; url: string }[];
};

export const caseStudies: CaseStudy[] = [
  {
    slug: "harness-platform-automation",
    title: "CI/CD automation for an internal developer platform",
    eyebrow: "The Hartford · 2026",
    lede:
      "Provisioning, onboarding workflows, and build-farm testing in Harness, plus the IDE and CLI tools engineers use on the platform day to day.",
    role: "Platform Engineer, Tech & Ops Leadership Development Program",
    period: "January 2026 – present",
    stack: ["Harness", "CI/CD", "VS Code extension", "CLI tooling", "Integration testing"],
    facts: [
      { value: "21", label: "Repositories contributed to" },
      { value: "144", label: "Pull requests merged" },
      { value: "80%+", label: "Coverage threshold on shared tooling" },
    ],
    tldr: {
      problem: "Shared provisioning and onboarding automation runs for many teams, often more than once, and has to be safe every time.",
      did: "Built idempotent Harness workflows, build-farm smoke tests, and a tested release path for the platform's IDE and CLI tools.",
      result: "144 merged pull requests across 21 repositories, with shared tooling held to an 80%+ coverage threshold.",
    },
    flow: [
      { label: "Team request", detail: "New project or onboarding" },
      { label: "Provision", detail: "Idempotent Harness workflow", mine: true },
      { label: "Smoke test", detail: "Build farm checks", mine: true },
      { label: "Integration tests", detail: "Cross-platform, 80%+ coverage", mine: true },
      { label: "Ship", detail: "VS Code, desktop, CLI, docs", mine: true },
    ],
    flowNote: "Highlighted steps are the parts I built or hardened; the platform itself is a team effort.",
    sections: [
      {
        label: "Team context",
        title: "A platform team serving engineers across the company",
        body: [
          "I work on The Hartford's developer platform team as part of the Technology & Operations Leadership Development Program. The team owns the CI/CD automation, developer tooling, and documentation other engineering teams build on.",
        ],
      },
      {
        label: "The problem",
        title: "Shared automation has to be safe to re-run",
        body: [
          "Provisioning and onboarding workflows run for many teams, often more than once. A workflow that breaks on a second run, or a tool change that only gets tested on one operating system, turns into support tickets for everyone downstream.",
        ],
      },
      {
        label: "My contribution",
        title: "What I built and hardened",
        body: ["Across 21 repositories I authored 214 pull requests, 144 of them merged."],
        bullets: [
          "Harness project provisioning and onboarding workflows, written to be idempotent so a re-run leaves a team's setup intact.",
          "Build-farm smoke testing in Harness, so platform changes are checked before engineers depend on them.",
          "Cross-platform integration tests and an 80%+ code-coverage threshold for the developer tooling teams share, along with release-readiness practices.",
          "Features across the developer-experience ecosystem: a VS Code extension, desktop and CLI tooling, DevOps Intelligence, and platform documentation.",
        ],
      },
      {
        label: "Outcome",
        title: "What changed",
        body: [
          "Shared tooling now ships behind integration tests and a coverage gate, and provisioning workflows can be re-run safely. I also lead technical enablement and onboarding for associates, interns, and engineers joining the platform.",
        ],
      },
    ],
  },
  {
    slug: "atlas-studio",
    title: "Atlas Studio: guides into narrated walkthroughs",
    eyebrow: "The Hartford · 2026",
    lede:
      "An AI-enabled tool that turns written guide content into narrated walkthrough videos, built to widen developer onboarding.",
    role: "Platform Engineer",
    period: "2026",
    stack: ["Generative AI", "Developer onboarding", "Video narration"],
    facts: [
      { value: "Guide → video", label: "Written guides become narrated walkthroughs" },
      { value: "Onboarding", label: "Built for new developers on the platform" },
    ],
    tldr: {
      problem: "Onboarding guides are written text, and recording walkthrough videos by hand can't keep up when the guides change.",
      did: "Built Atlas Studio, an AI-enabled tool that turns guide content into a narrated walkthrough video.",
      result: "When a guide changes, its walkthrough can be regenerated instead of re-recorded.",
    },
    flow: [
      { label: "Written guide", detail: "Existing onboarding content" },
      { label: "Atlas Studio", detail: "AI-enabled generation", mine: true },
      { label: "Narrated walkthrough", detail: "Video for new developers", mine: true },
    ],
    sections: [
      {
        label: "Team context",
        title: "Part of the team's onboarding work",
        body: [
          "Atlas Studio is part of the platform team's wider Atlas and onboarding work. Onboarding is a team effort; this page covers only the part I built.",
        ],
      },
      {
        label: "The problem",
        title: "Not everyone learns from a wall of text",
        body: [
          "Most onboarding material is written guides. Some people learn faster by watching someone walk through the steps, but recording and re-recording videos by hand doesn't keep up with docs that change.",
        ],
      },
      {
        label: "My contribution",
        title: "Generating the walkthrough from the guide",
        body: [
          "I built Atlas Studio, which takes existing guide content and produces a narrated walkthrough video from it, so the video can be regenerated when the guide changes instead of re-recorded.",
        ],
      },
    ],
  },
  {
    slug: "documentation-chatbot",
    title: "A GenAI chatbot for internal documentation",
    eyebrow: "The Hartford · 2025 internship",
    lede:
      "A retrieval-augmented chatbot on Claude 3.5 Sonnet and AWS Bedrock that answers engineers' questions from internal documentation.",
    role: "Tech & Ops LDP Intern, Cloud and Reliability Engineer",
    period: "May – August 2025",
    stack: ["AWS Bedrock", "Claude 3.5 Sonnet", "RAG", "ECS", "Lambda", "S3", "Terraform", "Angular"],
    facts: [
      { value: "1–2 hrs", label: "Saved per documentation lookup" },
      { value: "800+", label: "Engineers supported" },
    ],
    tldr: {
      problem: "Engineers spent one to two hours per question digging through unstructured internal documentation.",
      did: "Led prompt engineering and designed a modular RAG pipeline on AWS Bedrock with Claude 3.5 Sonnet, plus an Angular chat UI.",
      result: "Lookups got one to two hours faster per query, and the chatbot scaled to 800+ engineers.",
    },
    flow: [
      { label: "Unstructured docs", detail: "Internal documentation" },
      { label: "Processing pipeline", detail: "Modular ingestion", mine: true },
      { label: "Retrieval", detail: "RAG workflow", mine: true },
      { label: "Claude 3.5 Sonnet", detail: "On AWS Bedrock", mine: true },
      { label: "Chat UI", detail: "Responsive Angular app", mine: true },
    ],
    flowNote: "Runs across AWS ECS, Lambda, and S3, provisioned with Terraform within IAM and security policy.",
    sections: [
      {
        label: "The problem",
        title: "Answers buried in unstructured docs",
        body: [
          "Engineers were spending one to two hours tracking down answers spread across unstructured internal documentation.",
        ],
      },
      {
        label: "Approach",
        title: "Retrieval first, then generation",
        body: [
          "I led the prompt engineering and designed a modular pipeline that processes the unstructured documentation, retrieves the relevant passages, and has Claude 3.5 Sonnet on Bedrock answer from them.",
        ],
        bullets: [
          "Infrastructure provisioned with Terraform, compliant with AWS IAM and security protocols.",
          "RAG workflow running across AWS ECS, Lambda, and S3.",
          "A responsive Angular UI for real-time chat.",
        ],
      },
      {
        label: "Outcome",
        title: "Faster answers, at scale",
        body: [
          "The chatbot cut documentation lookup time by one to two hours per query and scaled to support more than 800 engineers.",
        ],
      },
    ],
  },
  {
    slug: "lab-inventory-system",
    title: "Real-time inventory for a research lab",
    eyebrow: "Alexion-AstraZeneca · 2023",
    lede:
      "A barcode-driven inventory system for biological samples and a BSL2 chemical inventory, built during a lab software internship.",
    role: "Lab Software Developer Intern",
    period: "October – December 2023",
    stack: ["Python", "Neptyne", "Barcodes"],
    facts: [
      { value: "1,600+", label: "Biological samples tracked" },
      { value: "20,000+", label: "BSL2 chemical inventory items" },
    ],
    tldr: {
      problem: "A research unit needed a live view of a large sample and chemical inventory without reconciling spreadsheets by hand.",
      did: "Led development of a barcode-driven, real-time inventory system in Python and Neptyne.",
      result: "One source of truth for 1,600+ biological samples and a 20,000+ item BSL2 chemical inventory.",
    },
    flow: [
      { label: "Barcode scan", detail: "Sample or compound" },
      { label: "Real-time database", detail: "Python + Neptyne", mine: true },
      { label: "Live inventory view", detail: "Quantities and unique IDs", mine: true },
    ],
    sections: [
      {
        label: "The problem",
        title: "A large inventory without a live view",
        body: [
          "The Rare Disease Unit needed one place to see what samples and compounds it had, how much, and where, without reconciling spreadsheets by hand.",
        ],
      },
      {
        label: "My contribution",
        title: "Designing the system",
        body: [
          "I led development of the inventory system in Python and Neptyne, with a real-time database keyed by barcode, quantity, and unique ID.",
        ],
      },
      {
        label: "Outcome",
        title: "One source of truth",
        body: [
          "The system handled more than 1,600 biological samples and a BSL2 chemical inventory of more than 20,000 items.",
        ],
      },
    ],
  },
];

/** Minutes to read the whole case study, at ~220 words a minute. */
export const readingMinutes = (study: CaseStudy) => {
  const text = [
    study.lede,
    ...study.sections.flatMap((section) => [section.title, ...section.body, ...(section.bullets ?? [])]),
  ].join(" ");
  return Math.max(1, Math.round(text.split(/\s+/).length / 220));
};

export const getCaseStudy = (slug: string | undefined) =>
  caseStudies.find((study) => study.slug === slug);
