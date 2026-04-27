import { useEffect, useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Calendar,
  ExternalLink,
  CheckCircle2,
  User,
  Tag,
} from "lucide-react";
import { FaGithub } from "react-icons/fa";
import { toast } from "sonner";

import Button from "@/components/common/Button";
import SectionHeader from "@/components/common/SectionHeader";
import { getProjectBySlug } from "@/services/projectService";

const fallbackImage =
  "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=1200&auto=format&fit=crop&q=80";

const getProjectFromResponse = (response) =>
  response?.data?.project ||
  response?.data?.data ||
  response?.data ||
  response?.project ||
  response ||
  null;

const ensureArray = (value) => {
  if (Array.isArray(value)) return value;
  if (!value) return [];

  return String(value)
    .split(/\n|,/)
    .map((item) => item.trim())
    .filter(Boolean);
};

const formatDate = (date) => {
  if (!date) return "Not specified";

  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const normalizeProject = (project) => {
  if (!project) return null;

  return {
    ...project,
    title: project.title || "Untitled Project",
    slug: project.slug || "",
    category: project.category || "Project",
    clientName: project.clientName || project.client || "Confidential",
    shortDescription: project.shortDescription || "",
    description: project.description || "",
    problem: project.problem || "",
    solution: project.solution || "",
    features: ensureArray(project.features),
    technologies: ensureArray(project.technologies),
    coverImage: project.coverImage || project.image || fallbackImage,
    images: ensureArray(project.images),
    liveUrl: project.liveUrl || "",
    githubUrl: project.githubUrl || "",
    completedAt: project.completedAt || project.completionDate || null,
    isFeatured: Boolean(project.isFeatured),
    isActive:
      typeof project.isActive === "boolean"
        ? project.isActive
        : project.status === "inactive"
          ? false
          : true,
  };
};

const ProjectDetailsPage = () => {
  const { slug } = useParams();

  const [project, setProject] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const normalizedProject = useMemo(() => normalizeProject(project), [project]);

  useEffect(() => {
    let mounted = true;

    const fetchProject = async () => {
      try {
        setIsLoading(true);

        const response = await getProjectBySlug(slug);
        const projectData = getProjectFromResponse(response);

        if (mounted) setProject(projectData);
      } catch (error) {
        if (mounted) {
          setProject(null);
          toast.error(
            error?.response?.data?.message || "Failed to load project",
          );
        }
      } finally {
        if (mounted) setIsLoading(false);
      }
    };

    if (slug) fetchProject();

    return () => {
      mounted = false;
    };
  }, [slug]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <p className="text-slate-400">Loading project...</p>
      </div>
    );
  }

  if (!normalizedProject || !normalizedProject.isActive) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-slate-100 mb-4">
            Project Not Found
          </h1>
          <p className="text-slate-400 mb-6">
            The project may be unavailable or inactive.
          </p>
          <Link to="/projects">
            <Button variant="outline">Back to Projects</Button>
          </Link>
        </div>
      </div>
    );
  }

  const galleryImages = [
    normalizedProject.coverImage,
    ...normalizedProject.images,
  ].filter(Boolean);

  return (
    <div className="min-h-screen">
      <section className="pt-32 pb-16 bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            to="/projects"
            className="inline-flex items-center gap-2 text-slate-400 hover:text-cyan-500 mb-8 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Projects
          </Link>

          <div className="grid lg:grid-cols-2 gap-12 items-start">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="flex flex-wrap items-center gap-4 mb-6">
                <span className="px-3 py-1 rounded-full bg-cyan-500/20 border border-cyan-500/30 text-cyan-400 text-sm font-medium">
                  {normalizedProject.category}
                </span>

                {normalizedProject.isFeatured && (
                  <span className="px-3 py-1 rounded-full bg-yellow-500/20 border border-yellow-500/30 text-yellow-400 text-sm font-medium">
                    Featured
                  </span>
                )}
              </div>

              <h1 className="text-4xl md:text-5xl font-bold text-slate-100 mb-4">
                {normalizedProject.title}
              </h1>

              <p className="text-lg text-slate-400 mb-6">
                {normalizedProject.shortDescription}
              </p>

              <div className="flex flex-wrap gap-4 mb-8">
                <div className="flex items-center gap-2 text-slate-400">
                  <Calendar className="w-5 h-5 text-cyan-500" />
                  <span>
                    Completed: {formatDate(normalizedProject.completedAt)}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-slate-400">
                  <User className="w-5 h-5 text-cyan-500" />
                  <span>{normalizedProject.clientName}</span>
                </div>

                <div className="flex items-center gap-2 text-slate-400">
                  <Tag className="w-5 h-5 text-cyan-500" />
                  <span>{normalizedProject.category}</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-4">
                {normalizedProject.liveUrl && (
                  <a
                    href={normalizedProject.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button icon={ExternalLink} iconPosition="right">
                      View Live
                    </Button>
                  </a>
                )}

                {normalizedProject.githubUrl && (
                  <a
                    href={normalizedProject.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button variant="outline">
                      <span className="inline-flex items-center gap-2">
                        <FaGithub className="text-base" />
                        GitHub
                      </span>
                    </Button>
                  </a>
                )}

                <Link to="/contact">
                  <Button variant="outline">Start Similar Project</Button>
                </Link>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="glass rounded-2xl overflow-hidden border border-slate-700/50"
            >
              <img
                src={normalizedProject.coverImage}
                alt={normalizedProject.title}
                className="w-full h-80 object-cover"
                onError={(e) => {
                  e.currentTarget.src = fallbackImage;
                }}
              />
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-20 bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <SectionHeader title="Project Overview" className="mb-8" />
            <p className="text-lg text-slate-400 leading-relaxed whitespace-pre-line">
              {normalizedProject.description}
            </p>
          </div>
        </div>
      </section>

      {(normalizedProject.problem || normalizedProject.solution) && (
        <section className="py-16 md:py-20 bg-slate-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-2 gap-6">
              {normalizedProject.problem && (
                <div className="glass rounded-2xl p-6 border border-slate-700/50">
                  <h2 className="text-2xl font-bold text-slate-100 mb-4">
                    Problem
                  </h2>
                  <p className="text-slate-400 leading-relaxed whitespace-pre-line">
                    {normalizedProject.problem}
                  </p>
                </div>
              )}

              {normalizedProject.solution && (
                <div className="glass rounded-2xl p-6 border border-slate-700/50">
                  <h2 className="text-2xl font-bold text-slate-100 mb-4">
                    Solution
                  </h2>
                  <p className="text-slate-400 leading-relaxed whitespace-pre-line">
                    {normalizedProject.solution}
                  </p>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {normalizedProject.features.length > 0 && (
        <section className="py-16 md:py-20 bg-slate-950">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionHeader
              subtitle="Key Capabilities"
              title="Project Features"
              className="mb-12"
            />

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {normalizedProject.features.map((feature, index) => (
                <motion.div
                  key={`${feature}-${index}`}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.06 }}
                  className="glass rounded-xl p-6 border border-slate-700/50"
                >
                  <CheckCircle2 className="w-6 h-6 text-cyan-500 mb-4" />
                  <h3 className="text-lg font-semibold text-slate-100">
                    {feature}
                  </h3>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {normalizedProject.technologies.length > 0 && (
        <section className="py-16 md:py-20 bg-slate-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionHeader
              subtitle="Tech Stack"
              title="Technologies Used"
              className="mb-12"
            />

            <div className="flex flex-wrap gap-3">
              {normalizedProject.technologies.map((tech, index) => (
                <motion.span
                  key={`${tech}-${index}`}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                  className="px-4 py-2 rounded-lg bg-slate-800 border border-slate-700 text-slate-300"
                >
                  {tech}
                </motion.span>
              ))}
            </div>
          </div>
        </section>
      )}

      {galleryImages.length > 1 && (
        <section className="py-16 md:py-20 bg-slate-950">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionHeader title="Project Gallery" className="mb-12" />

            <div className="grid md:grid-cols-2 gap-6">
              {galleryImages.map((image, index) => (
                <motion.div
                  key={`${image}-${index}`}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="glass rounded-2xl overflow-hidden border border-slate-700/50"
                >
                  <img
                    src={image}
                    alt={`${normalizedProject.title} ${index + 1}`}
                    className="w-full h-72 object-cover"
                    onError={(e) => {
                      e.currentTarget.src = fallbackImage;
                    }}
                  />
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="py-16 md:py-20 bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="glass rounded-2xl p-8 md:p-12 border border-slate-700/50 text-center">
            <h2 className="text-3xl font-bold text-slate-100 mb-4">
              Have a Similar Project in Mind?
            </h2>
            <p className="text-lg text-slate-400 mb-8 max-w-2xl mx-auto">
              Let's discuss your ideas and create something amazing together.
            </p>
            <Link to="/contact">
              <Button size="lg">Start Your Project</Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ProjectDetailsPage;
