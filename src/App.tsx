import { Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import Layout from "./components/site/Layout";
import Home from "./pages/Home";
import Work from "./pages/Work";
import AboutPage from "./pages/AboutPage";
import CaseStudy from "./pages/CaseStudy";
import ProjectsPage from "./pages/ProjectsPage";
import ExperiencePage from "./pages/ExperiencePage";
import ContactPage from "./pages/ContactPage";
import NotFound from "./pages/NotFound";

/** Routes only; the router itself comes from main.tsx (browser) or entry-server.tsx (pre-render). */
const App = () => (
  <>
    <Toaster position="bottom-center" />
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/work" element={<Work />} />
        <Route path="/work/:slug" element={<CaseStudy />} />
        <Route path="/projects" element={<ProjectsPage />} />
        <Route path="/experience" element={<ExperiencePage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  </>
);

export default App;
