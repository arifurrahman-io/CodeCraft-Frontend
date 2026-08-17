import { Outlet, useLocation } from "react-router-dom";
import SEO from "@/components/common/SEO";
import Navbar from "@/components/website/Navbar";
import Footer from "@/components/website/Footer";
import ContactDock from "@/components/website/ContactDock";

const pageSeo = {
  "/": {
    title: "CodeCraft.BD - Premium Software Solutions",
    description:
      "CodeCraft.BD builds fast, secure, and scalable web applications, mobile apps, SaaS products, e-commerce platforms, and UI/UX experiences.",
    keywords:
      "software development Bangladesh, web development Bangladesh, mobile app development, SaaS development, UI UX design, CodeCraft.BD",
  },
  "/about": {
    title: "About CodeCraft.BD",
    description:
      "Meet CodeCraft.BD, a Bangladesh-based software team crafting reliable web, mobile, SaaS, and digital product experiences.",
    keywords:
      "about CodeCraft.BD, software company Bangladesh, development team Bangladesh",
  },
  "/services": {
    title: "Software Development Services",
    description:
      "Explore CodeCraft.BD services including web development, mobile apps, SaaS platforms, e-commerce systems, cloud solutions, and UI/UX design.",
    keywords:
      "software services, web development services, app development services, e-commerce development, SaaS development",
  },
  "/projects": {
    title: "Software Projects and Case Studies",
    description:
      "Browse CodeCraft.BD projects and case studies across web applications, mobile apps, SaaS products, e-commerce, and custom business systems.",
    keywords:
      "software case studies, web development portfolio, app development portfolio, CodeCraft projects",
  },
  "/blogs": {
    title: "Software Development Blog",
    description:
      "Read practical insights from CodeCraft.BD on web development, product engineering, SaaS, mobile apps, UI/UX, and digital growth.",
    keywords:
      "software development blog, web development tips, SaaS blog, UI UX insights, CodeCraft.BD blog",
  },
  "/contact": {
    title: "Contact CodeCraft.BD",
    description:
      "Contact CodeCraft.BD to discuss custom software, web applications, mobile apps, SaaS platforms, e-commerce, and digital product work.",
    keywords:
      "contact software company Bangladesh, hire web developer Bangladesh, hire app developer",
  },
};

const WebsiteLayout = () => {
  const location = useLocation();
  const seo = pageSeo[location.pathname];
  const isHome = location.pathname === "/";

  return (
    <div className="min-h-screen flex flex-col">
      {seo && <SEO {...seo} path={location.pathname} />}
      <Navbar />
      <main className={`flex-1 ${isHome ? "" : "pt-16 md:pt-20"}`}>
        <Outlet />
      </main>
      <ContactDock />
      <Footer />
    </div>
  );
};

export default WebsiteLayout;
