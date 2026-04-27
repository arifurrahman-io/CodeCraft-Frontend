import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import ProjectCard from "@/components/website/ProjectCard";
import CTASection from "@/components/website/CTASection";
import { getAllProjects } from "@/services/projectService";

const ProjectsPage = () => {
  const [projects, setProjects] = useState([]);
  const [activeCategory, setActiveCategory] = useState("All");
  const categories = ["All", ...new Set(projects.map((p) => p.category))];
  const visibleProjects =
    activeCategory === "All"
      ? projects
      : projects.filter((project) => project.category === activeCategory);

  useEffect(() => {
    getAllProjects().then((response) => setProjects(response.data || []));
  }, []);

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="pt-32 pb-16 bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-3xl mx-auto"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-slate-100 mb-6">
              Our <span className="text-cyan-500">Projects</span>
            </h1>
            <p className="text-lg text-slate-400">
              Explore our portfolio of successful projects across various
              industries. Each project represents our commitment to excellence.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Projects Grid */}
      <section className="py-16 md:py-20 bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Category Filter */}
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  category === activeCategory
                    ? "bg-cyan-500 text-slate-900"
                    : "bg-slate-800 text-slate-300 hover:bg-slate-700"
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {visibleProjects.map((project, index) => (
              <ProjectCard key={project._id} project={project} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { number: "50+", label: "Projects Completed" },
              { number: "10+", label: "Industries Served" },
              { number: "30+", label: "Happy Clients" },
              { number: "5+", label: "Years Experience" },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="glass rounded-xl p-6 border border-slate-700/50 text-center"
              >
                <p className="text-4xl font-bold text-cyan-500 mb-2">
                  {stat.number}
                </p>
                <p className="text-slate-400 text-sm">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <CTASection />
    </div>
  );
};

export default ProjectsPage;
