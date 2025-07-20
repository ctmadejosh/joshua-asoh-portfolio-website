import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Target, Users, Lightbulb, Award } from "lucide-react";

const About = () => {
  const highlights = [
    {
      icon: Target,
      title: "Strategic Vision",
      description: "Focused on long-term goals with a clear strategic mindset"
    },
    {
      icon: Users,
      title: "Team Leadership",
      description: "Experience building and leading high-performing teams"
    },
    {
      icon: Lightbulb,
      title: "Innovation",
      description: "Passionate about implementing creative solutions"
    },
    {
      icon: Award,
      title: "Excellence",
      description: "Committed to delivering exceptional results"
    }
  ];

  const skills = [
    "Strategic Planning",
    "Team Leadership",
    "Project Management",
    "Business Development",
    "Data Analysis",
    "Communication",
    "Problem Solving",
    "Innovation"
  ];

  return (
    <section id="about" className="py-20 bg-secondary/30">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16 animate-fade-up">
          <h2 className="text-4xl font-bold mb-4">About Me</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Professional with a passion for excellence and innovation, dedicated to making a meaningful impact in every endeavor.
          </p>
        </div>
        
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Left Column - Story */}
          <div className="space-y-6 animate-fade-up">
            <Card className="p-8 shadow-card hover:shadow-elegant transition-smooth">
              <h3 className="text-2xl font-semibold mb-4 text-primary">My Journey</h3>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  Throughout my career, I've been driven by a commitment to excellence and a passion for creating meaningful solutions. My experience spans various industries and roles, each contributing to a well-rounded professional perspective.
                </p>
                <p>
                  I believe in the power of collaboration, continuous learning, and strategic thinking. Whether leading teams, developing strategies, or solving complex challenges, I approach every opportunity with dedication and enthusiasm.
                </p>
                <p>
                  My goal is to leverage my skills and experience to drive positive outcomes while building lasting professional relationships and contributing to organizational success.
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