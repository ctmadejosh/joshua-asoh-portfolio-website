const skillGroups = [
  {
    name: "Cloud and infrastructure",
    items: "AWS (ECS, Lambda, S3, Bedrock), GCP, Terraform, Docker",
  },
  {
    name: "CI/CD and developer experience",
    items: "Harness, Jenkins, internal developer platforms, IDE and CLI tooling",
  },
  {
    name: "AI",
    items: "RAG and agentic workflows, prompt and retrieval engineering",
  },
  {
    name: "Languages and frameworks",
    items: "Python, Java, Angular, C/C++, SQL, VHDL",
  },
  {
    name: "Also",
    items: "SOLIDWORKS, Agile/Scrum, team leadership",
  },
];

const education = [
  {
    degree: "M.S. Computer Information Technology",
    detail: "Central Connecticut State University, in progress. 3.71 GPA.",
  },
  {
    degree: "B.S. Computer Engineering Technology",
    detail: "Central Connecticut State University. 3.44 GPA, Dean's List three times.",
  },
];

const About = () => {
  return (
    <section id="about" className="py-20 lg:py-28">
      <div className="mx-auto grid max-w-6xl gap-14 px-6 lg:grid-cols-[1.15fr_1fr] lg:gap-20">
        <div>
          <h2 className="text-4xl font-bold tracking-tight sm:text-5xl">About</h2>
          <div className="mt-8 max-w-[62ch] space-y-5 text-lg leading-relaxed">
            <p>
              I'm a platform engineer in The Hartford's Technology &amp; Operations Leadership
              Development Program. My work covers Harness automation, developer experience,
              IDE tooling, DevOps Intelligence, cloud infrastructure, and guided onboarding
              for a platform that serves more than 3,000 engineers.
            </p>
            <p>
              Before this rotation I interned in digital manufacturing at Zygo AMETEK, built
              a GenAI document chatbot on Claude 3.5 Sonnet and AWS Bedrock at The Hartford,
              and developed lab inventory systems at Alexion-AstraZeneca. That mix of DevOps,
              cloud, AI, and industrial IoT shapes how I approach a problem.
            </p>
            <p>
              Outside of work I'm finishing a master's at CCSU. I served as Vice President of
              the university's IEEE chapter and I'm active in NSBE, ColorStack, and Epsilon
              Pi Tau.
            </p>
          </div>

          <h3 className="mt-12 text-2xl font-semibold tracking-tight">Education</h3>
          <ul className="mt-4 divide-y divide-border border-y border-border">
            {education.map((item) => (
              <li key={item.degree} className="py-4">
                <p className="font-semibold">{item.degree}</p>
                <p className="text-muted-foreground">{item.detail}</p>
              </li>
            ))}
          </ul>
        </div>

        <div className="lg:pt-2">
          <h3 className="text-2xl font-semibold tracking-tight">What I work with</h3>
          <dl className="mt-4 divide-y divide-border border-y border-border">
            {skillGroups.map((group) => (
              <div key={group.name} className="py-4">
                <dt className="font-semibold text-primary">{group.name}</dt>
                <dd className="mt-1">{group.items}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
};

export default About;
