import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  CheckCircle2,
  MessagesSquare,
  Palette,
  ShieldCheck,
  Sparkles,
  Headset,
} from "lucide-react";
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
import Button from "@/components/common/Button";
import Loader from "@/components/common/Loader";
import EmptyState from "@/components/common/EmptyState";

import { getFeaturedServices } from "@/services/serviceService";
import { getFeaturedProjects } from "@/services/projectService";
import { getAllBlogs } from "@/services/blogService";
import { getAllTestimonials } from "@/services/testimonialService";
import { useWebsiteStats } from "@/hooks/useWebsiteStats";

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
      : testimonial.status !== "inactive",
});

const HomePage = () => {
  const [featuredServices, setFeaturedServices] = useState([]);
  const [featuredProjects, setFeaturedProjects] = useState([]);
  const [latestBlogs, setLatestBlogs] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const { stats } = useWebsiteStats();

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

  const whyChooseItems = useMemo(
    () => [
      {
        icon: Sparkles,
        text: `Expert team with ${stats.yearsExperience} years of experience`,
      },
      {
        icon: Palette,
        text: "Modern UI/UX focused solutions",
      },
      {
        icon: MessagesSquare,
        text: "Transparent communication and regular updates",
      },
      {
        icon: Headset,
        text: "Post-launch support and maintenance",
      },
      {
        icon: ShieldCheck,
        text: "Clear pricing with no hidden costs",
      },
    ],
    [stats.yearsExperience],
  );

  const homeStats = useMemo(
    () => [
      { number: stats.projectsCompleted, label: "Projects completed" },
      { number: stats.yearsExperience, label: "Years experience" },
      { number: stats.happyClients, label: "Happy clients" },
      { number: stats.projectSuccess, label: "Project success" },
    ],
    [stats],
  );

  return (
    <div>
      <HeroSection />

      <section className="section-padding relative overflow-hidden">
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_0%_0%,rgba(13,148,136,0.06),transparent_45%)]"
          aria-hidden="true"
        />
        <div className="relative container-custom">
          <SectionHeader
            alignment="left"
            subtitle="Services"
            title="What we build"
            description="Web applications, products, and platforms tailored to how your team works."
            className="mb-14"
          />

          {loading ? (
            <Loader text="Loading services..." className="py-16" />
          ) : featuredServices.length === 0 ? (
            <EmptyState
              title="No featured services yet"
              description="Services will appear here once published."
            />
          ) : (
            <div className="grid gap-5 md:grid-cols-2 md:gap-6 lg:grid-cols-3">
              {featuredServices.map((service, index) => (
                <ServiceCard
                  key={service._id || service.slug || index}
                  service={service}
                  index={index}
                />
              ))}
            </div>
          )}

          <div className="mt-12">
            <Link to="/services">
              <Button variant="outline" icon={ArrowRight} iconPosition="right">
                View all services
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="section-padding relative overflow-hidden">
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_85%_15%,rgba(13,148,136,0.09),transparent_45%),linear-gradient(180deg,rgba(255,255,255,0.0),rgba(244,246,248,0.85))]"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute -left-24 top-1/3 h-64 w-64 rounded-full bg-accent/[0.04] blur-3xl"
          aria-hidden="true"
        />

        <div className="relative container-custom">
          <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-14">
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
              className="lg:col-span-6"
            >
              <div className="mb-5 inline-flex items-center gap-2 rounded-lg border border-accent/15 bg-accent-soft/80 px-3 py-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                <span className="text-xs font-semibold tracking-wide text-accent">
                  Why us
                </span>
              </div>
              <h2 className="font-display text-3xl md:text-4xl lg:text-[2.85rem] font-bold text-ink tracking-tight mb-5 leading-[1.12]">
                Built for clarity
                <span className="block text-ink/80">and delivery</span>
              </h2>
              <p className="text-ink-muted mb-9 max-w-lg text-lg leading-relaxed">
                We combine technical excellence with practical product thinking
                so you know what you are getting — and when.
              </p>

              <ul className="relative space-y-0">
                <div
                  className="pointer-events-none absolute left-[21px] top-4 bottom-4 w-px bg-gradient-to-b from-accent/40 via-border to-transparent"
                  aria-hidden="true"
                />
                {whyChooseItems.map((item, index) => {
                  const Icon = item.icon || CheckCircle2;
                  return (
                    <motion.li
                      key={item.text}
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.06, duration: 0.4 }}
                      className="group relative flex items-start gap-4 py-3.5"
                    >
                      <span className="relative z-[1] flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-border bg-surface text-accent shadow-soft transition-all duration-300 group-hover:border-accent/30 group-hover:bg-accent-soft group-hover:shadow-lift">
                        <Icon className="h-4.5 w-4.5 h-[18px] w-[18px]" strokeWidth={1.75} />
                      </span>
                      <div className="min-w-0 flex-1 rounded-2xl border border-transparent px-3 py-2.5 transition-all duration-300 group-hover:border-border group-hover:bg-surface/90 group-hover:shadow-soft">
                        <p className="text-[15px] font-medium leading-snug text-ink">
                          {item.text}
                        </p>
                      </div>
                    </motion.li>
                  );
                })}
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 22 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="lg:col-span-6 lg:sticky lg:top-28"
            >
              <div className="relative overflow-hidden rounded-[1.75rem] bg-ink p-1 shadow-lift">
                <div
                  className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_15%_0%,rgba(13,148,136,0.45),transparent_50%),radial-gradient(ellipse_at_100%_100%,rgba(13,148,136,0.12),transparent_40%)]"
                  aria-hidden="true"
                />
                <div
                  className="pointer-events-none absolute inset-0 opacity-[0.07]"
                  style={{
                    backgroundImage:
                      "linear-gradient(rgba(255,255,255,.35) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.35) 1px, transparent 1px)",
                    backgroundSize: "28px 28px",
                  }}
                  aria-hidden="true"
                />

                <div className="relative rounded-[1.5rem] p-6 sm:p-8 md:p-9">
                  <div className="mb-8 flex items-center justify-between gap-4">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent">
                        Impact
                      </p>
                      <p className="mt-1 font-display text-lg font-semibold text-white">
                        By the numbers
                      </p>
                    </div>
                    <div className="hidden h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 sm:flex">
                      <span className="h-2 w-2 rounded-full bg-accent animate-pulse" />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 sm:gap-4">
                    {homeStats.map((stat, index) => (
                      <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, scale: 0.96 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{
                          delay: 0.15 + index * 0.07,
                          duration: 0.4,
                        }}
                        className="group/stat rounded-2xl border border-white/10 bg-white/[0.045] px-4 py-5 sm:px-5 sm:py-6 backdrop-blur-sm transition-colors duration-300 hover:border-accent/35 hover:bg-white/[0.08]"
                      >
                        <p className="font-display text-3xl sm:text-[2.5rem] font-bold tracking-tight text-white">
                          {stat.number}
                        </p>
                        <p className="mt-2 text-sm leading-snug text-white/50 group-hover/stat:text-white/65 transition-colors">
                          {stat.label}
                        </p>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-custom">
          <SectionHeader
            alignment="left"
            subtitle="Work"
            title="Featured projects"
            description="Selected deliveries across products, platforms, and business systems."
            className="mb-12"
          />

          {loading ? (
            <Loader text="Loading projects..." className="py-16" />
          ) : featuredProjects.length === 0 ? (
            <EmptyState
              title="No featured projects yet"
              description="Projects will appear here once published."
            />
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
              {featuredProjects.map((project, index) => (
                <ProjectCard
                  key={project._id || project.slug || index}
                  project={project}
                  index={index}
                />
              ))}
            </div>
          )}

          <div className="mt-12">
            <Link to="/projects">
              <Button variant="outline" icon={ArrowRight} iconPosition="right">
                View all projects
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <TechStackSection />

      <section className="section-padding">
        <div className="container-custom">
          <SectionHeader
            alignment="left"
            subtitle="Clients"
            title="What partners say"
            description="Feedback from teams who value clear process and solid delivery."
            className="mb-12"
          />

          {loading ? (
            <Loader text="Loading testimonials..." className="py-16" />
          ) : testimonials.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10">
              {testimonials.map((testimonial, index) => (
                <TestimonialCard
                  key={testimonial._id || index}
                  testimonial={testimonial}
                  index={index}
                />
              ))}
            </div>
          ) : (
            <EmptyState
              title="No testimonials yet"
              description="Client feedback will appear here when available."
            />
          )}
        </div>
      </section>

      <section className="section-padding bg-surface border-y border-border">
        <div className="container-custom">
          <SectionHeader
            alignment="left"
            subtitle="Insights"
            title="From the blog"
            description="Notes on product engineering, delivery, and growing with software."
            className="mb-12"
          />

          {loading ? (
            <Loader text="Loading articles..." className="py-16" />
          ) : latestBlogs.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
              {latestBlogs.map((blog, index) => (
                <BlogCard
                  key={blog._id || blog.slug || index}
                  blog={blog}
                  index={index}
                />
              ))}
            </div>
          ) : (
            <EmptyState
              title="No articles yet"
              description="Published blog posts will appear here."
            />
          )}

          <div className="mt-12">
            <Link to="/blogs">
              <Button variant="outline" icon={ArrowRight} iconPosition="right">
                View all articles
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <CTASection />
    </div>
  );
};

export default HomePage;
