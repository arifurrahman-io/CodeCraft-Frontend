import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";
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
import { getFeaturedBlogs } from "@/services/blogService";
import { getFeaturedTestimonials } from "@/services/testimonialService";

const HomePage = () => {
  const [featuredServices, setFeaturedServices] = useState([]);
  const [featuredProjects, setFeaturedProjects] = useState([]);
  const [featuredBlogs, setFeaturedBlogs] = useState([]);
  const [featuredTestimonials, setFeaturedTestimonials] = useState([]);

  useEffect(() => {
    const loadHomeData = async () => {
      const [services, projects, blogs, testimonials] = await Promise.all([
        getFeaturedServices(),
        getFeaturedProjects(),
        getFeaturedBlogs(),
        getFeaturedTestimonials(),
      ]);

      setFeaturedServices((services.data || []).slice(0, 3));
      setFeaturedProjects((projects.data || []).slice(0, 3));
      setFeaturedBlogs((blogs.data || []).slice(0, 3));
      setFeaturedTestimonials((testimonials.data || []).slice(0, 3));
    };

    loadHomeData();
  }, []);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <HeroSection />

      {/* Services Section */}
      <section className="py-16 md:py-20 bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            subtitle="Our Services"
            title="Comprehensive Software Solutions"
            description="We offer end-to-end development services to bring your digital vision to life"
            className="mb-12"
          />

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredServices.map((service, index) => (
              <ServiceCard key={service._id} service={service} index={index} />
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

      {/* Why Choose Us */}
      <section className="py-16 md:py-20 bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-4xl font-bold text-slate-100 mb-6">
                Why Choose <span className="text-cyan-500">CodeCraft.BD</span>
              </h2>
              <p className="text-slate-400 mb-8">
                We combine technical expertise with creative innovation to
                deliver exceptional digital solutions that drive business
                growth.
              </p>

              <div className="space-y-4">
                {[
                  "Expert team with 5+ years of experience",
                  "Agile development methodology",
                  "Transparent communication & regular updates",
                  "Post-launch support & maintenance",
                  "Competitive pricing with no hidden costs",
                ].map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center gap-3"
                  >
                    <CheckCircle2 className="w-5 h-5 text-cyan-500 flex-shrink-0" />
                    <span className="text-slate-300">{item}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="grid grid-cols-2 gap-4"
            >
              {[
                { number: "50+", label: "Projects Completed" },
                { number: "5+", label: "Years Experience" },
                { number: "30+", label: "Happy Clients" },
                { number: "100%", label: "Project Success" },
              ].map((stat, index) => (
                <div
                  key={index}
                  className="glass rounded-xl p-6 border border-slate-700/50 text-center"
                >
                  <p className="text-4xl font-bold text-cyan-500 mb-2">
                    {stat.number}
                  </p>
                  <p className="text-slate-400 text-sm">{stat.label}</p>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section className="py-16 md:py-20 bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            subtitle="Our Work"
            title="Featured Projects"
            description="Explore our portfolio of successful projects across various industries"
            className="mb-12"
          />

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredProjects.map((project, index) => (
              <ProjectCard key={project._id} project={project} index={index} />
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

      {/* Tech Stack */}
      <TechStackSection />

      {/* Testimonials */}
      <section className="py-16 md:py-20 bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            subtitle="Testimonials"
            title="What Our Clients Say"
            description="Hear from our satisfied clients about their experience working with us"
            className="mb-12"
          />

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredTestimonials.map((testimonial, index) => (
              <TestimonialCard
                key={testimonial._id}
                testimonial={testimonial}
                index={index}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Blogs Section */}
      <section className="py-16 md:py-20 bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            subtitle="Latest Insights"
            title="From Our Blog"
            description="Stay updated with the latest trends and insights in software development"
            className="mb-12"
          />

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredBlogs.map((blog, index) => (
              <BlogCard key={blog._id} blog={blog} index={index} />
            ))}
          </div>

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

      {/* CTA Section */}
      <CTASection />
    </div>
  );
};

export default HomePage;
