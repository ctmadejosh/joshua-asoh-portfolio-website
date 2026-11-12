import { Link } from "react-router-dom";
import Seo from "@/components/site/Seo";
import { Container } from "@/components/site/Cards";
import { NAV_PAGES } from "@/data/site";

const NotFound = () => (
  <Container>
    <Seo title="Page not found" description="There's nothing at this address." noindex />
    <div className="flex min-h-[60vh] flex-col justify-center py-16">
      <p className="eyebrow mb-4">404</p>
      <h1 className="text-5xl font-bold tracking-tight sm:text-6xl">Page not found</h1>
      <p className="mt-6 max-w-md text-lg text-muted-foreground">
        There's nothing at this address. Try one of these instead:
      </p>
      <ul className="mt-8 flex flex-wrap gap-3">
        <li>
          <Link to="/" className="btn-primary">
            Home
          </Link>
        </li>
        {NAV_PAGES.map((page) => (
          <li key={page.to}>
            <Link to={page.to} className="btn-secondary">
              {page.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  </Container>
);

export default NotFound;
