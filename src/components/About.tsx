import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Target, Users, Lightbulb, Award } from "lucide-react";

const About = () => {
  const highlights = [
    {
      icon: Target,
      title: "Cloud Infrastructure",
      description: "Expertise in AWS services, Terraform, and infrastructure-as-code practices"
    },
    {
      icon: Users,
      title: "Leadership",
      description: "Vice President of IEEE, managing teams and leading diversity initiatives"
    },
    {
      icon: Lightbulb,
      title: "Innovation",
      description: "Developing AI solutions and inventory management systems"
    },
    {
      icon: Award,
      title: "Academic Excellence",
      description: "3.43 GPA pursuing dual degrees in Computer Engineering Technology"
    }
  ];

  const skills = [
    "AWS (ECS, Lambda, S3, Bedrock)",
    "Terraform & Infrastructure-as-Code",
    "Python Development",
    "Cloud Architecture",
    "Software Engineering",
    "Team Leadership",
    "VHDL & Circuit Design",
    "Docker & DevOps",
    "Data Analysis",
    "Project Management"
  ];

  return (
    <section id="about" className="py-20 bg-secondary/30">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16 animate-fade-up">
          <h2 className="text-4xl font-bold mb-4">About Me</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Computer Engineering Technology student with hands-on experience in cloud infrastructure, software development, and leadership roles across diverse organizations.
          </p>
        </div>
        
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Left Column - Story */}
          <div className="space-y-6 animate-fade-up">
            <Card className="p-8 shadow-card hover:shadow-elegant transition-smooth">
              <h3 className="text-2xl font-semibold mb-4 text-primary">My Journey</h3>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  Currently pursuing dual degrees at Central Connecticut State University - a Master's in Computer Information Technology and Bachelor's in Computer Engineering Technology. My academic journey began at Gateway Community College where I earned an Electronics Technician Certification.
                </p>
                <p>
                  As a Cloud and Reliability Engineering Intern at The Hartford Insurance, I work with AWS infrastructure, Terraform, and develop innovative solutions like document chatbots using ECS, Lambda, and Bedrock. My experience spans from software development to leadership roles.
                </p>
                <p>
                  Through leadership positions like Vice President of IEEE and various internships, I've developed strong technical skills in cloud computing, software engineering, and team management while maintaining a 3.43 GPA and earning multiple certifications.
                </p>
              </div>
            </Card>
            
            {/* Skills */}
            <Card className="p-8 shadow-card">
              <h3 className="text-xl font-semibold mb-6 text-primary">Core Skills</h3>
              <div className="flex flex-wrap gap-2">
                {skills.map((skill, index) => (
                  <Badge 
                    key={skill} 
                    variant="secondary" 
                    className="hover:bg-primary hover:text-primary-foreground transition-smooth cursor-default"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    {skill}
                  </Badge>
                ))}
              </div>
            </Card>
          </div>
          
          {/* Right Column - Highlights */}
          <div className="space-y-6">
            {highlights.map((highlight, index) => (
              <Card 
                key={highlight.title} 
                className="p-6 shadow-card hover:shadow-elegant transition-smooth group animate-fade-up"
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-xl bg-primary/10 group-hover:bg-primary group-hover:text-primary-foreground transition-smooth">
                    <highlight.icon className="w-6 h-6 text-primary group-hover:text-primary-foreground transition-smooth" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-lg font-semibold mb-2">{highlight.title}</h4>
                    <p className="text-muted-foreground leading-relaxed">{highlight.description}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;