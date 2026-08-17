import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

import ProjectCard from "@/components/website/ProjectCard";
import PageHero from "@/components/website/PageHero";
import CTASection from "@/components/website/CTASection";
import Loader from "@/components/common/Loader";
import EmptyState from "@/components/common/EmptyState";
import Button from "@/components/common/Button";
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
      : project.status !== "inactive",
  completedAt: project.completedAt || project.completionDate || null,
  technologies: Array.isArray(project.technologies) ? project.technologies : [],
});

const ProjectsPage = () => {
  const [projects, setProjects] = useState([]);
  const [activeCategory, setActiveCategory] = useState("All");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;

    const fetchProjects = async () => {
      try {
        setIsLoading(true);
        setError("");
        const response = await getAllProjects();
        const projectsData = getProjectsFromResponse(response)
          .map(normalizeProject)
          .filter((project) => project.isActive);
        if (mounted) setProjects(projectsData);
      } catch (err) {
        const message =
          err?.response?.data?.message || "Failed to load projects";
        toast.error(message);
        if (mounted) {
          setError(message);
          setProjects([]);
        }
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
    <div>
      <PageHero
        subtitle="Work"
        title="Selected projects"
        description="Case studies across products, platforms, and business systems."
      />

      <section className="pb-16 md:pb-20">
        <div className="container-custom">
          {!isLoading && categories.length > 1 && (
            <div className="flex flex-wrap gap-2 mb-10">
              {categories.map((category) => (
                <Button
                  key={category}
                  type="button"
                  size="sm"
                  variant={category === activeCategory ? "primary" : "outline"}
                  onClick={() => setActiveCategory(category)}
                >
                  {category}
                </Button>
              ))}
            </div>
          )}

          {isLoading ? (
            <Loader text="Loading projects..." className="py-20" />
          ) : error ? (
            <EmptyState title="Could not load projects" description={error} />
          ) : visibleProjects.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
              {visibleProjects.map((project, index) => (
                <ProjectCard
                  key={project._id || project.slug}
                  project={project}
                  index={index}
                />
              ))}
            </div>
          ) : (
            <EmptyState
              title="No projects found"
              description="There are no active projects in this category yet."
            />
          )}
        </div>
      </section>

      <CTASection />
    </div>
  );
};

export default ProjectsPage;
