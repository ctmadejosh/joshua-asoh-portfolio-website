/**
 * Case studies. Per PROP-PR-6, team context, Joshua's own contribution, and
 * team outcomes are labelled separately. Platform-wide figures (4,000+
 * engineers, 95,000+ pipelines, 13,000+ repositories, 1,000+ in 90 days, the
 * 40+ day baseline) were confirmed by Joshua in November 2026 against the
 * team lead's published case studies, and are always labelled as team figures.
 */
export type CaseStudySection = {
  label: "Team context" | "The problem" | "My contribution" | "What shipped" | "Outcome" | "Team outcome" | "Approach";
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
    slug: "atlas-developer-platform",
    title: "Building ATLAS, the developer platform for 4,000+ engineers",
    eyebrow: "The Hartford · 2026",
    lede:
      "ATLAS puts onboarding, builds, policy, telemetry, and AI tooling for The Hartford's engineers in one place: a CLI, a desktop agent, and IDE extensions. I build across all three, plus the telemetry behind them.",
    role: "Platform Engineer, Tech & Ops Leadership Development Program",
    period: "January 2026 – present",
    stack: ["Platform CLI", "Desktop agent", "VS Code extension", "OpenTelemetry", "Amazon EventBridge", "DynamoDB", "Harness", "Integration testing"],
    facts: [
      { value: "4,000+", label: "Engineers on the platform (team figure)" },
      { value: "95,000+", label: "Pipelines the platform supports (team figure)" },
      { value: "144", label: "Of my pull requests merged, across 21 repositories" },
      { value: "80%+", label: "Coverage threshold on the tooling I test" },
    ],
    tldr: {
      problem: "A new engineer's tools were found in a browser, installed from a wiki, and run in a terminal, and nothing connected the three.",
      did: "Built CLI features, the desktop agent's bridge to the platform site, VS Code extension features, and telemetry, and put cross-platform tests and release checks around them.",
      result: "The team's unified CLI, desktop app, and IDE extensions reached 1,000+ engineers in 90 days; the CLI now runs on 4,000+ machines.",
    },
    flow: [
      { label: "Platform site", detail: "Where engineers start" },
      { label: "Desktop agent", detail: "Runs native commands from the site", mine: true },
      { label: "Platform CLI", detail: "Setup, builds, policy", mine: true },
      { label: "VS Code extension", detail: "The platform in the editor", mine: true },
      { label: "Telemetry", detail: "OpenTelemetry → EventBridge → DynamoDB", mine: true },
    ],
    flowNote: "Highlighted parts are ones I wrote code for; ATLAS as a whole is the platform team's work.",
    links: [{ label: "The platform team lead's public ATLAS case study", url: "https://brignano.io/work/atlas-developer-platform" }],
    sections: [
      {
        label: "Team context",
        title: "One platform team, one platform",
        body: [
          "I'm on The Hartford's developer platform team as part of the Technology & Operations Leadership Development Program. The team's technical lead sets the direction for ATLAS; I'm one of the engineers building it.",
          "As of November 2026, the platform serves 4,000+ engineers, on its way to the full 8,000-engineer organization, supports 95,000+ pipelines, and tracks 13,000+ repositories. Those are the platform's numbers, not mine alone; the sections below are the parts I built.",
        ],
      },
      {
        label: "The problem",
        title: "Three tools that didn't know about each other",
        body: [
          "Before ATLAS, an engineer's tooling was discovered in a browser, installed from a wiki, and run in a terminal, and nothing connected the three. Every team's pipelines had their own templates, so one change had to be repeated across thousands of them.",
        ],
      },
      {
        label: "My contribution",
        title: "The CLI and the desktop agent",
        body: ["The CLI is the core of ATLAS, and the desktop agent is what lets the platform's website reach it."],
        bullets: [
          "Built features in the platform's command-line tool (the HIG CLI), now in use on 4,000+ machines (platform figure, November 2026).",
          "Worked on the desktop agent's bridge to the platform site: a button on the site runs a native command on the engineer's own machine, which is what makes the in-browser onboarding possible.",
          "Fixed bugs and hardened both after rollout.",
        ],
      },
      {
        label: "My contribution",
        title: "The VS Code extension",
        body: ["The extension brings the platform into the editor engineers already use."],
        bullets: [
          "Built features in the platform's VS Code extension.",
          "Built the day-one walkthrough that opens VS Code, installs the extension, and tours the parts of the editor that matter on the first day.",
        ],
      },
      {
        label: "My contribution",
        title: "Telemetry for the platform's DevOps analytics",
        bullets: [
          "Led a zero-downtime, dual-write DynamoDB key migration across the DevOps analytics API (DevOps Intelligence) and its data ingestion.",
          "Shipped pipeline-query and guide deep-link capabilities.",
        ],
        body: [
          "The platform has been instrumented since day one, so the team can see how its tools are used. I worked on the telemetry pipeline behind that: events from the CLI, IDE extensions, and desktop agent flow through OpenTelemetry and Amazon EventBridge into DynamoDB, which feeds the usage dashboards.",
        ],
      },
      {
        label: "My contribution",
        title: "Tests and releases",
        body: ["Across 21 repositories I authored 214 pull requests, 144 of them merged."],
        bullets: [
          "Cross-platform integration tests and an 80%+ code-coverage threshold for the shared developer tooling.",
          "Release-readiness checks, so the CLI, agent, and extension ship in step.",
          "Build-farm smoke testing in Harness, so platform changes are checked before engineers depend on them.",
        ],
      },
      {
        label: "Team outcome",
        title: "How it was adopted",
        body: [
          "The unified CLI, desktop app, and IDE extensions reached 1,000+ active engineers in their first 90 days. The desktop agent reached the same number in a day, because it shipped to everyone who already had the CLI.",
        ],
      },
    ],
  },
  {
    slug: "self-service-onboarding",
    title: "The CEO-sponsored push to make onboarding self-service",
    eyebrow: "The Hartford · 2026",
    lede:
      "A CEO-sponsored initiative to cut the time from an engineer's hire date to their first commit. I built parts of the day-one path, turned its guides into narrated videos, and onboarded people through it.",
    role: "Platform Engineer, Tech & Ops Leadership Development Program",
    period: "2026",
    stack: ["Platform CLI", "Desktop agent", "VS Code", "Harness", "Generative AI", "Atlas Studio"],
    facts: [
      { value: "40+ days", label: "Hire to first commit, before (team baseline)" },
      { value: "Hours", label: "A machine, unboxed to building, on the platform path (team figure)" },
      { value: "CEO", label: "Sponsor" },
    ],
    tldr: {
      problem: "It took a new engineer 40+ days from hire to first commit, mostly waiting on setup and access that only experienced people knew to ask for.",
      did: "Built in-browser onboarding walkthroughs, the VS Code walkthrough, Harness provisioning workflows, and Atlas Studio's narrated videos, then onboarded associates, interns, and engineers through it.",
      result: "On the platform path, a new machine goes from unboxed to building in hours. The first-day goal is the initiative's target; the enterprise measure is still catching up.",
    },
    flow: [
      { label: "Laptop arrives", detail: "CLI and agent preinstalled" },
      { label: "Walkthroughs", detail: "Setup in the browser", mine: true },
      { label: "Narrated videos", detail: "Atlas Studio", mine: true },
      { label: "Provisioning", detail: "Harness workflows", mine: true },
      { label: "First build", detail: "One command, any project" },
    ],
    flowNote: "Highlighted steps are ones I built; the initiative is the platform team's.",
    links: [{ label: "The platform team lead's public onboarding case study", url: "https://brignano.io/work/self-service-developer-onboarding" }],
    sections: [
      {
        label: "Team context",
        title: "Why it reached the CEO",
        body: [
          "The time from hire date to first commit was 40+ days, and almost none of it was learning the codebase: it was laptop imaging, software access, and permission requests that each had their own approver. The figure came up in an operating review, and the CEO made bringing it down a sponsored initiative. ATLAS is how the platform team delivers on it.",
        ],
      },
      {
        label: "My contribution",
        title: "The day-one walkthroughs",
        body: [
          "The design rule is that onboarding stays in the browser until it has to leave. I built walkthroughs that run real setup on the engineer's own machine through the desktop agent, and the one that opens VS Code, installs the platform extension, and tours the editor.",
        ],
      },
      {
        label: "My contribution",
        title: "Atlas Studio: walkthroughs as narrated video",
        body: [
          "Some people learn faster by watching. I built Atlas Studio, a developer-tooling pipeline that turns written guide content into narrated 4K/8K walkthrough videos, with automated production and adaptive audio, so when a guide changes its video can be regenerated instead of re-recorded.",
        ],
      },
      {
        label: "My contribution",
        title: "Provisioning that is safe to re-run",
        body: [
          "I engineered and hardened Harness project provisioning and onboarding: rerunnable project creation, smoke testing, access configuration, and service-account reconciliation, so that running a workflow again leaves a team's setup intact.",
        ],
      },
      {
        label: "My contribution",
        title: "Onboarding people through it",
        body: [
          "I led technical enablement and onboarding for associates, interns, and engineers going through the new path, and fed what tripped them up back into the walkthroughs.",
        ],
      },
      {
        label: "My contribution",
        title: "Leading the Guides implementation (side project)",
        body: [
          "Alongside my role, since August 2026, I've been leading the implementation of browser-based Guides as a side project: interactive, step-by-step guides that help engineers learn workflows and complete setup as part of self-service onboarding. The onboarding platform itself is the team's.",
        ],
      },
      {
        label: "Team outcome",
        title: "What the numbers mean",
        body: [
          "The \"hours\" figure is what the platform path delivers on a single machine, from unboxed to building. The initiative is judged on hire date to first commit, a cumulative enterprise average that moves slowly and hasn't caught up yet; the first-day goal is a target, not a result.",
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
      { value: "80%", label: "Fewer documentation queries" },
    ],
    tldr: {
      problem: "Engineers spent one to two hours per question digging through unstructured internal documentation.",
      did: "Led prompt engineering and designed a modular RAG pipeline on AWS Bedrock with Claude 3.5 Sonnet, plus an Angular chat UI.",
      result: "Lookups got one to two hours faster per query, documentation queries dropped by 80%, and the chatbot scaled to 800+ engineers.",
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
          "The chatbot cut documentation lookup time by one to two hours per query and scaled to support more than 800 engineers. Agentic workflows for autonomous information retrieval reduced documentation queries by 80% across them.",
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
