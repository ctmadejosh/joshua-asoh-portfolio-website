import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Building } from "lucide-react";

const Experience = () => {
  const experiences = [
    {
      title: "T&O LDP Associate – DevOps Engineer",
      company: "The Hartford Insurance",
      location: "Hartford, CT",
      period: "January 2026 – Present",
      type: "Full-time",
      description: "DevOps engineering role as part of The Hartford's Technology & Operations Leadership Development Program.",
      achievements: []
    },
    {
      title: "Digital Manufacturing Intern",
      company: "Zygo AMETEK Precision Metrology",
      location: "Middlefield, CT",
      period: "September 2025 – January 2026",
      type: "Internship",
      description: "Created digital work instructions and leveraged data analytics and IIoT to enhance manufacturing efficiency.",
      achievements: [
        "Developed and documented digital work instructions for 15 optical products across semiconductor, standard, and defense optics, covering 11–43 manufacturing processes per part",
        "Queried internal databases using SQL and Copilot to identify high-frequency operations and process optimization opportunities",
        "Implemented IIoT devices across the production floor to capture runtime data and analyze operational efficiency",
        "Conducted structured interviews with senior opticians to translate tribal knowledge into specification-driven digital work instructions"
      ]
    },
    {
      title: "Early Career LDP Intern – Cloud & Reliability Engineering",
      company: "The Hartford Insurance",
      location: "Hartford, CT",
      period: "May 2025 – August 2025",
      type: "Internship",
      description: "Engineered generative AI and cloud solutions to improve documentation accessibility and automation for engineering teams.",
      achievements: [
        "Provisioned cloud infrastructure with Terraform; ensured compliance with AWS IAM and security protocols",
        "Developed and deployed a responsive Angular UI integrated with AWS Bedrock for real-time chatbot interactions",
        "Led prompt engineering and modular pipeline design for processing unstructured internal documentation",
        "Deployed agentic workflows for autonomous information retrieval, reducing queries by 80% across 800+ engineers",
        "Engineered a GenAI-powered document chatbot using Claude 3.5 Sonnet and Bedrock, integrating AWS ECS, Lambda, and S3 within a RAG workflow"
      ]
    },
    {
      title: "Resident Assistant",
      company: "Central Connecticut State University",
      location: "New Britain, CT",
      period: "August 2024 – May 2025",
      type: "Part-time",
      description: "Provided support and guidance to residents while fostering a safe and inclusive community environment.",
      achievements: [
        "Planned and executed educational and social programs to promote student engagement",
        "Mediated conflicts and enforced university policies to maintain a positive living environment",
        "Served as liaison between residents and university administration"
      ]
    },
    {
      title: "College Operations Intern and Assistant Trainer",
      company: "Connecticut Center for Arts and Technology",
      location: "New Haven, CT",
      period: "May 2024 – January 2025",
      type: "Internship",
      description: "Managing inventory systems, developing SOPs, and training staff on software tools while supporting BioLaunch operations.",
      achievements: [
        "Managed inventory using Monday.com and Quartzy for efficient tracking",
        "Developed and maintained SOPs for inventory management systems",
        "Recommended and implemented critical software for improved BioLaunch operations",
        "Trained staff on software tools, ensuring adherence to SOPs and best practices"
      ]
    },
    {
      title: "Software Engineering Extern",
      company: "FactSet Research Systems Inc.",
      location: "Norwalk, CT",
      period: "May 2024",
      type: "Externship",
      description: "Selected as one of 15 participants for an intensive two-week program focused on software engineering and AI/ML.",
      achievements: [
        "Selected as 1 of 15 participants for exclusive externship program",
        "Developed Kate AI, a smart portfolio manager, for a hackathon competition",
        "Completed intensive Python training and participated in AI/ML tech talks"
      ]
    },
    {
      title: "Client Experience Associate",
      company: "The Computer Company",
      location: "Cromwell, CT",
      period: "February 2024 – March 2024",
      type: "Contract",
      description: "Managed IT operations including PC imaging, cybersecurity, and network management.",
      achievements: [
        "Managed PC imaging and Service Board tickets, ensuring efficient IT operations",
        "Implemented cybersecurity measures based on Bitdefender recommendations",
        "Utilized Cisco Meraki Portal for network management and optimization",
        "Leveraged ConnectWise Automate and ConnectWise Manage for streamlined IT operations"
      ]
    },
    {
      title: "Lab Software Developer Intern",
      company: "Alexion-AstraZeneca Rare Disease Unit",
      location: "New Haven, CT",
      period: "October 2023 – December 2023",
      type: "Internship",
      description: "Led development of a comprehensive inventory management system for biological samples and chemical compounds.",
      achievements: [
        "Led development of inventory management system using Python and Neptyne",
        "Handled 1,600+ biological samples and oversaw BSL2 chemical inventory of 20,000+ items",
        "Designed real-time database system for inventory tracking with barcodes, quantities, and unique IDs"
      ]
    },
    {
      title: "Information Technology Student Technician",
      company: "Gateway IT Department",
      location: "New Haven, CT",
      period: "October 2022 – May 2023",
      type: "Part-time",
      description: "Collaborated with IT professionals on infrastructure support across Connecticut's community college system.",
      achievements: [
        "Collaborated to repair a script malfunction affecting 36,000+ students and faculty across 12 colleges",
        "Troubleshot technical issues in virtual environments for improved user data access",
        "Installed and configured hardware, software, and networks across campus"
      ]
    },
    {
      title: "Vice President",
      company: "Institute of Electrical and Electronics Engineering (IEEE)",
      location: "New Britain, CT",
      period: "July 2023 – April 2024",
      type: "Leadership",
      description: "Led membership recruitment and partnerships with major technology and insurance companies.",
      achievements: [
        "Recruited approximately 40 new members during the CCSU involvement fair",
        "Spearheaded partnerships with FactSet, COCC, The Hartford, and Travelers for diversity-focused hiring events",
        "Hosted professional development workshop with Travelers on marketable skills"
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