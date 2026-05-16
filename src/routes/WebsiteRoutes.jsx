import { Routes, Route } from "react-router-dom";
import WebsiteLayout from "@/layouts/WebsiteLayout";
import HomePage from "@/pages/website/Home";
import AboutPage from "@/pages/website/About";
import ServicesPage from "@/pages/website/Services";
import ServiceDetailsPage from "@/pages/website/ServiceDetails";
import ProjectsPage from "@/pages/website/Projects";
import ProjectDetailsPage from "@/pages/website/ProjectDetails";
import BlogsPage from "@/pages/website/Blogs";
import BlogDetailsPage from "@/pages/website/BlogDetails";
import ContactPage from "@/pages/website/Contact";
import SubmitCvPage from "@/pages/website/SubmitCv";
import PrivacyPage from "@/pages/website/Privacy";
import TermsPage from "@/pages/website/Terms";
import NotFoundPage from "@/pages/website/NotFound";

const WebsiteRoutes = () => {
  return (
    <Routes>
      <Route element={<WebsiteLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/services" element={<ServicesPage />} />
        <Route path="/services/:slug" element={<ServiceDetailsPage />} />
        <Route path="/projects" element={<ProjectsPage />} />
        <Route path="/projects/:slug" element={<ProjectDetailsPage />} />
        <Route path="/blogs" element={<BlogsPage />} />
        <Route path="/blogs/:slug" element={<BlogDetailsPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/submit-cv" element={<SubmitCvPage />} />
        <Route path="/privacy" element={<PrivacyPage />} />
        <Route path="/terms" element={<TermsPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
};

export default WebsiteRoutes;
