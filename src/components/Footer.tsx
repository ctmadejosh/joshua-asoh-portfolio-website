const Footer = () => {
  return (
    <footer className="bg-ink text-white">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-6 py-8 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-white/80">© {new Date().getFullYear()} Joshua Asoh</p>
        <ul className="flex gap-6 font-medium">
          <li>
            <a href="https://www.linkedin.com/in/joshua-asoh" target="_blank" rel="noopener noreferrer" className="hover:text-signal">
              LinkedIn
            </a>
          </li>
          <li>
            <a href="https://github.com/ctmadejosh" target="_blank" rel="noopener noreferrer" className="hover:text-signal">
              GitHub
            </a>
          </li>
          <li>
            <a href="#home" className="hover:text-signal">
              Back to top
            </a>
          </li>
        </ul>
      </div>
    </footer>
  );
};

export default Footer;
