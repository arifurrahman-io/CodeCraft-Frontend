import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";

import ProjectCard from "@/components/website/ProjectCard";
import CTASection from "@/components/website/CTASection";
import { getAllProjects } from "@/services/projectService";

const getProjectsFromResponse = (response) => {
  if (Array.isArray(response)) return response;
  if (Array.isArray(response?.data)) return response.data;
  if (Array.isArray(response?.data?.projects)) return response.data.projects;
  if (Array.isArray(response?.data?.data)) return response.data.data;
  if (Array.isArray(response?.projects)) return response.projects;
  return [];
};

const normalizeProject = (project = {}) => ({
  ...project,
  _id: project._id || project.id,
  title: project.title || "Untitled Project",
  slug: project.slug || project._id || project.id,
  category: project.category || "Uncategorized",
  clientName: project.clientName || project.client || "",
  shortDescription: project.shortDescription || "",
  coverImage: project.coverImage || project.image || project.thumbnail || "",
  isFeatured: Boolean(project.isFeatured),
  isActive:
    typeof project.isActive === "boolean"
      ? project.isActive
      : project.status === "inactive"
        ? false
        : true,
  completedAt: project.completedAt || project.completionDate || null,
  technologies: Array.isArray(project.technologies) ? project.technologies : [],
});

const ProjectsPage = () => {
  const [projects, setProjects] = useState([]);
  const [activeCategory, setActiveCategory] = useState("All");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const fetchProjects = async () => {
      try {
        setIsLoading(true);

        const response = await getAllProjects();
        const projectsData = getProjectsFromResponse(response)
          .map(normalizeProject)
          .filter((project) => project.isActive);

        if (mounted) setProjects(projectsData);
      } catch (error) {
        toast.error(
          error?.response?.data?.message || "Failed to load projects",
        );
        if (mounted) setProjects([]);
      } finally {
        if (mounted) setIsLoading(false);
      }
    };

    fetchProjects();

    return () => {
      mounted = false;
    };
  }, []);

  const categories = useMemo(() => {
    const uniqueCategories = new Set(
      projects.map((project) => project.category).filter(Boolean),
    );

    return ["All", ...uniqueCategories];
  }, [projects]);

  const visibleProjects = useMemo(() => {
    if (activeCategory === "All") return projects;

    return projects.filter((project) => project.category === activeCategory);
  }, [projects, activeCategory]);

  return (
    <div className="min-h-screen">
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

      <section className="py-16 md:py-20 bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {!isLoading && categories.length > 1 && (
            <div className="flex flex-wrap justify-center gap-3 mb-12">
              {categories.map((category) => (
                <button
                  key={category}
                  type="button"
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
          )}

          {isLoading ? (
            <div className="glass rounded-xl p-6 border border-slate-700/50 text-center">
              <p className="text-slate-400">Loading projects...</p>
            </div>
          ) : visibleProjects.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {visibleProjects.map((project, index) => (
                <ProjectCard
                  key={project._id || project.slug}
                  project={project}
                  index={index}
                />
              ))}
            </div>
          ) : (
            <div className="glass rounded-xl p-8 border border-slate-700/50 text-center">
              <h2 className="text-xl font-semibold text-slate-100 mb-2">
                No projects found
              </h2>
              <p className="text-slate-400">
                There are no active projects in this category yet.
              </p>
            </div>
          )}
        </div>
      </section>

      <section className="py-16 bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { number: `${projects.length}+`, label: "Projects Completed" },
              {
                number: `${Math.max(categories.length - 1, 0)}+`,
                label: "Categories",
              },
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

      <CTASection />
    </div>
  );
};

export default ProjectsPage;
