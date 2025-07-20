import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Building } from "lucide-react";

const Experience = () => {
  const experiences = [
    {
      title: "Senior Professional",
      company: "Leading Organization",
      location: "City, State",
      period: "2020 - Present",
      type: "Full-time",
      description: "Leading strategic initiatives and driving operational excellence across multiple departments. Responsible for team leadership, project management, and business development.",
      achievements: [
        "Increased operational efficiency by 25%",
        "Led cross-functional teams of 15+ members",
        "Implemented strategic initiatives resulting in significant growth",
        "Developed and maintained key client relationships"
      ]
    },
    {
      title: "Professional Role",
      company: "Previous Company",
      location: "City, State", 
      period: "2018 - 2020",
      type: "Full-time",
      description: "Managed complex projects and collaborated with diverse teams to deliver exceptional results. Focused on process improvement and stakeholder engagement.",
      achievements: [
        "Successfully delivered 20+ projects on time",
        "Improved client satisfaction scores by 30%",
        "Streamlined processes reducing costs by 15%",
        "Mentored junior team members"
      ]
    },
    {
      title: "Associate Position",
      company: "Earlier Organization",
      location: "City, State",
      period: "2016 - 2018", 
      type: "Full-time",
      description: "Contributed to team objectives while developing core professional skills. Gained valuable experience in analysis, planning, and execution.",
      achievements: [
        "Completed comprehensive training program",
        "Contributed to team goals and objectives",
        "Developed analytical and technical skills",
        "Built foundation for career advancement"
      ]
    }
  ];

  return (
    <section id="experience" className="py-20">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16 animate-fade-up">
          <h2 className="text-4xl font-bold mb-4">Professional Experience</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            A track record of driving results and building meaningful professional relationships across various roles and industries.
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