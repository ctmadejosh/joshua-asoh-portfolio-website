import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Mail, Phone, MapPin, Linkedin, Send, Clock } from "lucide-react";

const Contact = () => {
  const contactInfo = [
    {
      icon: Mail,
      label: "Email",
      value: "Joshua.asoh@my.ccsu.edu",
      href: "mailto:Joshua.asoh@my.ccsu.edu"
    },
    {
      icon: Phone,
      label: "Phone", 
      value: "203-613-0475",
      href: "tel:2036130475"
    },
    {
      icon: MapPin,
      label: "Location",
      value: "New Haven, CT",
      href: null
    },
    {
      icon: Linkedin,
      label: "LinkedIn",
      value: "linkedin.com/in/joshua-asoh",
      href: "https://www.linkedin.com/in/joshua-asoh"
    }
  ];

  return (
    <section id="contact" className="py-20 bg-secondary/30">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16 animate-fade-up">
          <h2 className="text-4xl font-bold mb-4">Let's Connect</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Ready to explore new opportunities and build meaningful professional relationships. I'd love to hear from you.
          </p>
        </div>
        
        <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* Contact Info */}
          <div className="space-y-8 animate-fade-up">
            <Card className="p-8 shadow-card">
              <h3 className="text-2xl font-semibold mb-6 text-primary">Get In Touch</h3>
              <div className="space-y-6">
                {contactInfo.map((info, index) => (
                  <div key={index} className="flex items-center gap-4 group">
                    <div className="p-3 rounded-xl bg-primary/10 group-hover:bg-primary group-hover:text-primary-foreground transition-smooth">
                      <info.icon className="w-5 h-5 text-primary group-hover:text-primary-foreground transition-smooth" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-muted-foreground">{info.label}</p>
                      {info.href ? (
                        <a 
                          href={info.href}
                          className="text-foreground hover:text-primary transition-smooth font-medium"
                        >
                          {info.value}
                        </a>
                      ) : (
                        <p className="text-foreground font-medium">{info.value}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </Card>
            
            <Card className="p-8 shadow-card">
              <div className="flex items-center gap-3 mb-4">
                <Clock className="w-5 h-5 text-primary" />
                <h4 className="text-lg font-semibold">Response Time</h4>
              </div>
              <p className="text-muted-foreground mb-4">
                I typically respond to messages within 24 hours during business days.
              </p>
              <Badge className="gradient-primary text-white border-0">
                Usually responds within 24 hours
              </Badge>
            </Card>
          </div>
          
          {/* Contact Form */}
          <div className="animate-scale-in">
            <Card className="p-8 shadow-card hover:shadow-elegant transition-smooth">
              <h3 className="text-2xl font-semibold mb-6 text-primary">Send a Message</h3>
              <form className="space-y-6">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Name</label>
                    <Input placeholder="Your name" className="transition-smooth focus:shadow-elegant" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Email</label>
                    <Input type="email" placeholder="your.email@example.com" className="transition-smooth focus:shadow-elegant" />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Subject</label>
                  <Input placeholder="What's this about?" className="transition-smooth focus:shadow-elegant" />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Message</label>
                  <Textarea 
                    placeholder="Tell me about your project, opportunity, or just say hello..." 
                    rows={6}
                    className="transition-smooth focus:shadow-elegant resize-none"
                  />
                </div>
                
                <Button variant="hero" size="lg" className="w-full group">
                  <Send className="w-4 h-4 mr-2 group-hover:animate-bounce" />
                  Send Message
                </Button>
              </form>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;