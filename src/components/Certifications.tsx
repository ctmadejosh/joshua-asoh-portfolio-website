const certifications = [
  {
    name: "Terraform for the Absolute Beginners with Labs",
    date: "August 2025",
    description: "Udemy course covering Terraform fundamentals and hands-on infrastructure-as-code labs.",
  },
  {
    name: "BioLaunch Laboratory Operations",
    date: "February 2024",
    description: "Laboratory operations, safety protocols, and compliance for biotech environments.",
  },
  {
    name: "Electronics Technician Certification",
    date: "May 2023",
    description: "Electronic circuit analysis, troubleshooting, and repair techniques.",
  },
  {
    name: "SolidWorks Associate (CSWA)",
    date: "March 2021",
    description: "3D modeling, assembly design, and engineering drawings in SolidWorks.",
  },
  {
    name: "OSHA-10",
    date: "March 2019",
    description: "Occupational safety and health standards for general industry.",
  },
];

const Certifications = () => {
  return (
    <section id="certifications" className="py-20 lg:py-28">
      <div className="mx-auto grid max-w-6xl gap-10 px-6 lg:grid-cols-[1fr_2fr] lg:gap-20">
        <h2 className="text-4xl font-bold tracking-tight sm:text-5xl">Certifications</h2>
        <ul className="divide-y divide-border border-y border-border">
          {certifications.map((cert) => (
            <li key={cert.name} className="grid gap-x-8 gap-y-1 py-5 sm:grid-cols-[1fr_9rem]">
              <div>
                <h3 className="font-sans text-lg font-semibold">{cert.name}</h3>
                <p className="mt-1 text-muted-foreground">{cert.description}</p>
              </div>
              <p className="text-muted-foreground sm:text-right">{cert.date}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default Certifications;
