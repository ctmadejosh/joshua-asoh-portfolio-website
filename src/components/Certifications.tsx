import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Award, Calendar } from "lucide-react";

const certifications = [
  {
    name: "BioLaunch Laboratory Operations",
    date: "February 2024",
    icon: "🧬",
    description: "Certified in laboratory operations, safety protocols, and compliance for biotech environments.",
  },
  {
    name: "Electronics Technician Certification",
    date: "May 2023",
    icon: "🔌",
    description: "Proficiency in electronic circuit analysis, troubleshooting, and repair techniques.",
  },
  {
    name: "SolidWorks Associate (CSWA)",
    date: "March 2021",
    icon: "📐",
    description: "Competency in 3D modeling, assembly design, and engineering drawings using SolidWorks.",
  },
  {
    name: "OSHA-10",
    date: "March 2019",
    icon: "🛡️",
    description: "Occupational safety and health standards for general industry workplace environments.",
  },
];

const Certifications = () => {
  return (
    <section id="certifications" className="py-20 bg-secondary/30">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16 animate-fade-up">
          <h2 className="text-4xl font-bold mb-4">Certifications</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Professional certifications demonstrating expertise across engineering, safety, and laboratory operations.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
          {certifications.map((cert, index) => (
            <Card
              key={cert.name}
              className="p-6 shadow-card hover:shadow-elegant transition-smooth group text-center animate-fade-up"
              style={{ animationDelay: `${index * 0.15}s` }}
            >
              <div className="text-4xl mb-4">{cert.icon}</div>
              <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-smooth">
                {cert.name}
              </h3>
              <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                {cert.description}
              </p>
              <Badge variant="secondary" className="gap-1">
                <Calendar className="w-3 h-3" />
                {cert.date}
              </Badge>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Certifications;
