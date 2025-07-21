import React from "react";

const projects = [
  {
    title: "Cloud Portfolio",
    description: "A showcase of AWS infrastructure projects, including serverless apps and automation scripts.",
    link: "https://github.com/yourusername/cloud-portfolio",
  },
  {
    title: "Personal Website",
    description: "This portfolio website built with React, Vite, and Tailwind CSS.",
    link: "https://github.com/yourusername/portfolio-website",
  },
  {
    title: "IoT Sensor Dashboard",
    description: "A real-time dashboard for monitoring IoT sensor data using Node.js and WebSockets.",
    link: "https://github.com/yourusername/iot-dashboard",
  },
];

const Projects: React.FC = () => (
  <section id="projects" className="container mx-auto px-6 py-20">
    <h1 className="text-4xl font-bold mb-8">Projects</h1>
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
      {projects.map((project) => (
        <div key={project.title} className="bg-card rounded-xl shadow-card p-6 flex flex-col">
          <h2 className="text-2xl font-semibold mb-2">{project.title}</h2>
          <p className="text-muted-foreground mb-4">{project.description}</p>
          <a
            href={project.link}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-auto text-primary font-medium hover:underline"
          >
            View on GitHub
          </a>
        </div>
      ))}
    </div>
  </section>
);

export default Projects;