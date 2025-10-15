import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Building } from "lucide-react";

const Experience = () => {
  const experiences = [
    {
      title: "Digital Manufacturing Intern",
      company: "Zygo AMETEK Precision Metrology",
      location: "Middlefield, CT",
      period: "September 2025 – Present",
      type: "Internship",
      description: "Creating digital work instructions and leveraging data analytics to enhance manufacturing efficiency through process optimization and documentation.",
      achievements: [
          "Developed and documented digital work instructions for manufacturing machines and processes",
    "Queried company databases using SQL to identify high-frequency operations and workflow patterns",
    "Created detailed, step-by-step digital guides for operators and technicians based on data-driven insights",
    "Analyzed downtime, runtime, and task duration metrics to recommend efficiency improvements"
        
      ]
    },
    {
      title: "Cloud and Reliability Engineering Intern",
      company: "The Hartford Insurance",
      location: "Hartford, CT",
      period: "May 2025 – August 2025",
      type: "Internship",
      description: "Engineered generative AI and cloud solutions to improve documentation accessibility and automation for engineering teams using AWS, Terraform, and modern frontend frameworks.",
      achievements: [
      "Provisioned cloud infrastructure with Terraform while ensuring compliance with AWS IAM and security protocols",
    "Developed and deployed a responsive Angular UI integrated with AWS Bedrock for real-time chatbot interactions",
    "Led prompt engineering and modular pipeline design for processing unstructured internal documentation",
    "Deployed agentic workflows for autonomous information retrieval, reducing queries by 80% across 800+ engineers",
    "Engineered a GenAI-powered document chatbot using Claude 3.5 Sonnet and Bedrock, integrating AWS ECS, Lambda, and S3 within a Retrieval-Augmented Generation (RAG) workflow"
      ]
    },
    {
      title: "College Operations Intern and Assistant Trainer",
      company: "Connecticut Center for Arts and Technology",
      location: "New Haven, CT",
      period: "May 2024 – January 2025",
      type: "Internship",
      description: "Managing inventory systems, developing SOPs, and training staff on software tools while supporting BioLaunch operations and ensuring compliance with best practices.",
      achievements: [
        "Managed inventory using Monday.com and Quartzy for efficient tracking",
        "Developed and maintained SOPs for inventory management systems",
        "Implemented critical software solutions for improved operations",
        "Trained staff on software tools and best practices compliance"
      ]
    },
    {
      title: "Resident Assistant",
      company: "Central Connecticut State University",
      location: "New Britain, CT",
      period: "August 2024 – May 2025",
      type: "Part-time",
      description: "Providing support and guidance to residents while fostering a safe and inclusive community environment through educational programs and conflict mediation.",
      achievements: [
        "Provided support and guidance to residents in university housing",
        "Planned and executed educational and social programs",
        "Mediated conflicts and enforced university policies",
        "Served as liaison between residents and university administration"
      ]
    },
    {
      title: "Software Engineering Extern",
      company: "FactSet Research Systems Inc.",
      location: "Norwalk, CT",
      period: "May 2024",
      type: "Externship",
      description: "Selected as one of 15 participants for an intensive two-week program focused on software engineering, AI/ML concepts, and professional development in the financial technology sector.",
      achievements: [
        "Selected as 1 of 15 participants for exclusive externship program",
        "Developed Kate AI smart portfolio manager for hackathon competition",
        "Completed intensive Python training and AI/ML workshops",
        "Engaged in professional development and networking activities"
      ]
    },
    {
      title: "Lab Software Developer Intern",
      company: "Alexion-AstraZeneca Rare Disease Unit",
      location: "New Haven, CT",
      period: "October 2023 – December 2023",
      type: "Internship",
      description: "Led development of comprehensive inventory management system for biological samples and chemical compounds, supporting protocol compliance and laboratory operations.",
      achievements: [
        "Led development of inventory management system using Python and Neptyne",
        "Managed 1,600+ biological samples and 20,000+ chemical inventory items",
        "Designed real-time database system for inventory tracking and retrieval",
        "Ensured BSL2 protocol compliance and laboratory safety standards"
      ]
    },
    {
      title: "Vice President",
      company: "Institute of Electrical and Electronics Engineering (IEEE)",
      location: "New Britain, CT",
      period: "July 2023 – April 2024",
      type: "Leadership",
      description: "Led membership recruitment and organizational initiatives while establishing partnerships with major technology and insurance companies for diversity-focused hiring events.",
      achievements: [
        "Recruited approximately 40 new members during involvement fair",
        "Overhauled Discord server with improved information organization",
        "Established partnerships with FactSet, COCC, The Hartford, and Travelers",
        "Spearheaded diversity-focused hiring initiatives and events"
      ]
    }
  ];

  return (
    <section id="experience" className="py-20">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16 animate-fade-up">
          <h2 className="text-4xl font-bold mb-4">Professional Experience</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            A comprehensive journey through technology, leadership, and innovation across diverse organizations and roles.
          </p>
        </div>
        
        <div className="max-w-4xl mx-auto">
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-4 lg:left-1/2 top-0 bottom-0 w-px bg-border lg:transform lg:-translate-x-px"></div>
            
            {experiences.map((exp, index) => (
              <div 
                key={index} 
                className={`relative flex items-start mb-12 animate-fade-up ${
                  index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'
                }`}
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                {/* Timeline dot */}
                <div className="absolute left-4 lg:left-1/2 w-3 h-3 bg-primary rounded-full lg:transform lg:-translate-x-1/2 z-10 shadow-glow"></div>
                
                {/* Content */}
                <div className={`ml-12 lg:ml-0 lg:w-1/2 ${index % 2 === 0 ? 'lg:pr-12' : 'lg:pl-12'}`}>
                  <Card className="p-6 shadow-card hover:shadow-elegant transition-smooth group">
                    <div className="space-y-4">
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <h3 className="text-xl font-semibold group-hover:text-primary transition-smooth">
                            {exp.title}
                          </h3>
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Building className="w-4 h-4" />
                            <span className="font-medium">{exp.company}</span>
                          </div>
                        </div>
                        <Badge variant="secondary" className="shrink-0">
                          {exp.type}
                        </Badge>
                      </div>
                      
                      <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          <span>{exp.period}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          <span>{exp.location}</span>
                        </div>
                      </div>
                      
                      <p className="text-muted-foreground leading-relaxed">
                        {exp.description}
                      </p>
                      
                      <div className="space-y-2">
                        <h4 className="font-medium text-sm">Key Achievements:</h4>
                        <ul className="space-y-1">
                          {exp.achievements.map((achievement, i) => (
                            <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                              <span className="w-1 h-1 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                              {achievement}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </Card>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Experience;