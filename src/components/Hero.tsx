import { Download, Linkedin, Mail } from "lucide-react";
import heroPortrait from "@/assets/hero-portrait.jpg";
import Pipeline from "@/components/Pipeline";

const Hero = () => {
  return (
    <section id="home" className="bg-primary text-white">
      <div className="mx-auto max-w-6xl px-6 pb-12 pt-28 lg:pt-28">
        <div className="grid items-end gap-10 lg:grid-cols-[1fr_22rem] lg:gap-16">
          <div>
            <h1 className="text-[clamp(4rem,12vw,8.5rem)] font-bold leading-[0.9] tracking-[-0.04em]">
              Joshua Asoh
            </h1>
            <p className="mt-7 max-w-xl text-xl leading-relaxed text-sky sm:text-2xl sm:leading-relaxed">
              Platform engineer at The Hartford. I build the CI/CD automation and developer
              tools that 3,000+ engineers use to ship.
            </p>

            <div className="mt-9 flex flex-wrap items-center gap-3">
              <a
                href="#contact"
                className="inline-flex h-12 items-center gap-2 rounded-full bg-white px-6 font-semibold text-primary transition-colors hover:bg-signal hover:text-ink"
              >
                <Mail className="h-4 w-4" />
                Send me a message
              </a>
              <a
                href="/Josh_Asoh_Resume_020926.pdf"
                download
                className="inline-flex h-12 items-center gap-2 rounded-full border-2 border-white/50 px-6 font-semibold transition-colors hover:border-white hover:bg-white/10"
              >
                <Download className="h-4 w-4" />
                Download resume
              </a>
              <a
                href="https://www.linkedin.com/in/joshua-asoh"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Joshua Asoh on LinkedIn"
                className="inline-flex h-12 w-12 items-center justify-center rounded-full border-2 border-white/50 transition-colors hover:border-white hover:bg-white/10"
              >
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>

          <img
            src={heroPortrait}
            alt="Joshua Asoh working on a laptop at his desk"
            width={800}
            height={800}
            className="aspect-[4/5] w-full max-w-sm rounded-lg rounded-tl-[9rem] object-cover object-[56%_40%] lg:max-w-none"
          />
        </div>

        <div className="mt-12 border-t border-white/25 pt-7 lg:mt-14">
          <Pipeline />
        </div>
      </div>
    </section>
  );
};

export default Hero;
