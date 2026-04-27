import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";

import HeroSection from "@/components/website/HeroSection";
import ServiceCard from "@/components/website/ServiceCard";
import ProjectCard from "@/components/website/ProjectCard";
import BlogCard from "@/components/website/BlogCard";
import TestimonialCard from "@/components/website/TestimonialCard";
import TechStackSection from "@/components/website/TechStackSection";
import CTASection from "@/components/website/CTASection";
import SectionHeader from "@/components/common/SectionHeader";

import { getFeaturedServices } from "@/services/serviceService";
import { getFeaturedProjects } from "@/services/projectService";
import { getAllBlogs } from "@/services/blogService";
import { getAllTestimonials } from "@/services/testimonialService";

const getArray = (response) => {
  if (Array.isArray(response)) return response;
  if (Array.isArray(response?.data)) return response.data;
  if (Array.isArray(response?.data?.data)) return response.data.data;
  if (Array.isArray(response?.data?.services)) return response.data.services;
  if (Array.isArray(response?.data?.projects)) return response.data.projects;
  if (Array.isArray(response?.data?.blogs)) return response.data.blogs;
  if (Array.isArray(response?.data?.testimonials)) {
    return response.data.testimonials;
  }
  if (Array.isArray(response?.blogs)) return response.blogs;
  if (Array.isArray(response?.testimonials)) return response.testimonials;
  return [];
};

const normalizeBlog = (blog = {}) => ({
  ...blog,
  _id: blog._id || blog.id,
  title: blog.title || "Untitled Blog",
  slug: blog.slug || blog._id || blog.id,
  excerpt: blog.excerpt || blog.shortDescription || "",
  coverImage: blog.coverImage || blog.image || "",
  category: blog.category || "Blog",
  tags: Array.isArray(blog.tags) ? blog.tags : [],
  views: Number(blog.views || 0),
  isPublished:
    typeof blog.isPublished === "boolean"
      ? blog.isPublished
      : blog.status === "published",
  publishedAt: blog.publishedAt || blog.createdAt || null,
});

const normalizeTestimonial = (testimonial = {}) => ({
  ...testimonial,
  _id: testimonial._id || testimonial.id,
  clientName: testimonial.clientName || testimonial.name || "Client",
  company: testimonial.company || "",
  designation: testimonial.designation || testimonial.position || "",
  photo: testimonial.photo || testimonial.image || "",
  review: testimonial.review || testimonial.content || "",
  rating: Math.min(5, Math.max(1, Number(testimonial.rating || 5))),
  order: Number(testimonial.order || 0),
  isActive:
    typeof testimonial.isActive === "boolean"
      ? testimonial.isActive
      : testimonial.status === "inactive"
        ? false
        : true,
});

const HomePage = () => {
  const [featuredServices, setFeaturedServices] = useState([]);
  const [featuredProjects, setFeaturedProjects] = useState([]);
  const [latestBlogs, setLatestBlogs] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const loadHomeData = async () => {
      try {
        setLoading(true);

        const [services, projects, blogs, testimonialsResponse] =
          await Promise.all([
            getFeaturedServices(),
            getFeaturedProjects(),
            getAllBlogs(),
            getAllTestimonials(),
          ]);

        if (!mounted) return;

        setFeaturedServices(getArray(services).slice(0, 3));
        setFeaturedProjects(getArray(projects).slice(0, 3));

        setLatestBlogs(
          getArray(blogs)
            .map(normalizeBlog)
            .filter((blog) => blog.isPublished)
            .sort(
              (a, b) =>
                new Date(b.publishedAt || b.createdAt || 0) -
                new Date(a.publishedAt || a.createdAt || 0),
            )
            .slice(0, 3),
        );

        setTestimonials(
          getArray(testimonialsResponse)
            .map(normalizeTestimonial)
            .filter((testimonial) => testimonial.isActive)
            .sort((a, b) => a.order - b.order)
            .slice(0, 4),
        );
      } catch (error) {
        toast.error(
          error?.response?.data?.message || "Failed to load homepage data",
        );
      } finally {
        if (mounted) setLoading(false);
      }
    };

    loadHomeData();

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div className="min-h-screen">
      <HeroSection />

      <section className="py-16 md:py-20 bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            subtitle="Our Services"
            title="Comprehensive Software Solutions"
            description="We build modern websites, apps, SaaS products and business systems."
            className="mb-12"
          />

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredServices.map((service, index) => (
              <ServiceCard
                key={service._id || service.slug || index}
                service={service}
                index={index}
              />
            ))}
          </div>

          <div className="text-center mt-10">
            <Link to="/services">
              <button className="inline-flex items-center gap-2 px-6 py-3 bg-slate-800 text-slate-100 rounded-lg font-medium hover:bg-slate-700 transition-colors">
                View All Services
                <ArrowRight className="w-4 h-4" />
              </button>
            </Link>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-20 bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -18 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-4xl font-bold text-slate-100 mb-6">
                Why Choose <span className="text-cyan-500">CodeCraft.BD</span>
              </h2>

              <p className="text-slate-400 mb-8 leading-8">
                We combine technical excellence with creative innovation to
                deliver solutions that grow businesses.
              </p>

              <div className="space-y-4">
                {[
                  "Expert team with 5+ years of experience",
                  "Modern UI/UX focused solutions",
                  "Transparent communication & regular updates",
                  "Post-launch support & maintenance",
                  "Competitive pricing with no hidden costs",
                ].map((item, index) => (
                  <motion.div
                    key={item}
                    initial={{ opacity: 0, x: -15 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.08 }}
                    className="flex items-center gap-3"
                  >
                    <CheckCircle2 className="w-5 h-5 text-cyan-500 shrink-0" />
                    <span className="text-slate-300">{item}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <div className="grid grid-cols-2 gap-4">
              {[
                { number: "50+", label: "Projects Completed" },
                { number: "5+", label: "Years Experience" },
                { number: "30+", label: "Happy Clients" },
                { number: "100%", label: "Project Success" },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="glass rounded-xl p-6 border border-slate-700/50 text-center"
                >
                  <p className="text-4xl font-bold text-cyan-500 mb-2">
                    {stat.number}
                  </p>
                  <p className="text-slate-400 text-sm">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-20 bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            subtitle="Our Work"
            title="Featured Projects"
            description="Some of our recent successful digital products."
            className="mb-12"
          />

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredProjects.map((project, index) => (
              <ProjectCard
                key={project._id || project.slug || index}
                project={project}
                index={index}
              />
            ))}
          </div>

          <div className="text-center mt-10">
            <Link to="/projects">
              <button className="inline-flex items-center gap-2 px-6 py-3 bg-slate-800 text-slate-100 rounded-lg font-medium hover:bg-slate-700 transition-colors">
                View All Projects
                <ArrowRight className="w-4 h-4" />
              </button>
            </Link>
          </div>
        </div>
      </section>

      <TechStackSection />

      <section className="py-16 md:py-20 bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            subtitle="Testimonials"
            title="What Our Clients Say"
            description="Trusted by clients who value quality and professionalism."
            className="mb-12"
          />

          {loading ? (
            <p className="text-center text-slate-400">
              Loading testimonials...
            </p>
          ) : testimonials.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {testimonials.map((testimonial, index) => (
                <TestimonialCard
                  key={testimonial._id || index}
                  testimonial={testimonial}
                  index={index}
                />
              ))}
            </div>
          ) : (
            <p className="text-center text-slate-500">
              No testimonials available.
            </p>
          )}
        </div>
      </section>

      <section className="py-16 md:py-20 bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            subtitle="Latest Insights"
            title="From Our Blog"
            description="Articles on development, business growth and modern technology."
            className="mb-12"
          />

          {loading ? (
            <p className="text-center text-slate-400">Loading blogs...</p>
          ) : latestBlogs.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {latestBlogs.map((blog, index) => (
                <BlogCard
                  key={blog._id || blog.slug || index}
                  blog={blog}
                  index={index}
                />
              ))}
            </div>
          ) : (
            <p className="text-center text-slate-500">
              No published blogs available.
            </p>
          )}

          <div className="text-center mt-10">
            <Link to="/blogs">
              <button className="inline-flex items-center gap-2 px-6 py-3 bg-slate-800 text-slate-100 rounded-lg font-medium hover:bg-slate-700 transition-colors">
                View All Blogs
                <ArrowRight className="w-4 h-4" />
              </button>
            </Link>
          </div>
        </div>
      </section>

      <CTASection />
    </div>
  );
};

export default HomePage;
