import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowDown, Download, Mail, Linkedin, MapPin } from "lucide-react";
import heroPortrait from "@/assets/hero-portrait.jpg";

const Hero = () => {
  return (
    <section className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 gradient-hero opacity-10"></div>
      
      {/* Floating elements for visual interest */}
      <div className="absolute top-20 left-20 w-20 h-20 bg-primary/20 rounded-full animate-float"></div>
      <div className="absolute bottom-32 right-32 w-16 h-16 bg-accent/30 rounded-full animate-float" style={{ animationDelay: '1s' }}></div>
      <div className="absolute top-1/2 left-10 w-12 h-12 bg-primary/10 rounded-full animate-float" style={{ animationDelay: '2s' }}></div>
      
      <div className="container mx-auto px-6 py-20 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8 animate-fade-up">
            <div className="space-y-4">
              <Badge className="w-fit gradient-primary text-white border-0 shadow-elegant">
                <MapPin className="w-3 h-3 mr-1" />
                Available for Opportunities
              </Badge>
              
              <h1 className="text-5xl lg:text-6xl font-bold tracking-tight">
                Hi, I'm{" "}
                <span className="gradient-primary bg-clip-text text-transparent">
                  Joshua Asoh
                </span>
              </h1>
              
              <p className="text-xl text-muted-foreground max-w-lg leading-relaxed">
                Computer Engineering Technology student and Cloud Engineering Intern passionate about AWS infrastructure, software development, and innovation in technology.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Button variant="hero" size="lg" className="group">
                <Mail className="w-4 h-4 mr-2 group-hover:animate-bounce" />
                Get In Touch
              </Button>
              
              <Button variant="outline" size="lg" className="group">
                <Download className="w-4 h-4 mr-2 group-hover:animate-bounce" />
                Download Resume
              </Button>
            </div>
            
            <div className="flex items-center gap-6 pt-4">
              <Button variant="ghost" size="icon" className="hover:text-primary hover:scale-110 transition-bounce">
                <Linkedin className="w-5 h-5" />
              </Button>
              <div className="h-6 w-px bg-border"></div>
              <span className="text-sm text-muted-foreground">Connect with me on LinkedIn</span>
            </div>
          </div>
          
          {/* Right Content - Image */}
          <div className="relative animate-scale-in">
            <div className="relative w-full max-w-lg mx-auto">
              <div className="absolute -inset-4 gradient-primary rounded-3xl blur-2xl opacity-20 animate-pulse"></div>
              <div className="relative bg-card rounded-3xl p-2 shadow-card">
                <img
                  src={heroPortrait}
                  alt="Joshua Asoh - Professional Portrait"
                  className="w-full h-auto rounded-2xl object-cover shadow-elegant"
                />
              </div>
            </div>
          </div>
        </div>
        
        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <ArrowDown className="w-6 h-6 text-primary" />
        </div>
      </div>
    </section>
  );
};

export default Hero;