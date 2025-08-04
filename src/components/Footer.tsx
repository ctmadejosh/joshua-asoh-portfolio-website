import { Button } from "@/components/ui/button";
import { Heart, ArrowUp } from "lucide-react";

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-card border-t border-border">
      <div className="container mx-auto px-6 py-12">
        <div className="flex flex-col items-center text-center space-y-6">
          {/* Logo */}
          <div className="font-bold text-2xl">
            <span className="text-primary"> 
              Joshua Asoh
            </span>
          </div>
          
          {/* Quote */}
          <p className="text-muted-foreground max-w-md leading-relaxed">
            "Excellence is not a destination; it is a continuous journey that never ends."
          </p>
          
          {/* Copyright */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>© 2024 Joshua Asoh. Built with</span>
            <Heart className="w-4 h-4 text-red-500 fill-red-500" />
            <span>and professional care.</span>
          </div>
          
          {/* Back to top */}
          <Button 
            variant="ghost" 
            size="icon"
            onClick={scrollToTop}
            className="rounded-full hover:bg-primary hover:text-primary-foreground transition-smooth"
          >
            <ArrowUp className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;