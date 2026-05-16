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
import SEO from "@/components/common/SEO";
import SectionHeader from "@/components/common/SectionHeader";
import ShareActions from "@/components/common/ShareActions";
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
    seoTitle: project.seoTitle || project.title || "",
    seoDescription:
      project.seoDescription ||
      project.shortDescription ||
      project.description ||
      "",
    isFeatured: Boolean(project.isFeatured),
    isActive:
      typeof project.isActive === "boolean"
        ? project.isActive
        : project.status === "inactive"
          ? false
          : true,
  };
};

const renderParagraphs = (text) => {
  const paragraphs = String(text || "")
    .split(/\n{2,}/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);

  if (!paragraphs.length) return null;

  return (
    <div className="space-y-6">
      {paragraphs.map((paragraph, index) => (
        <p
          key={index}
          className="whitespace-pre-line text-lg leading-9 text-slate-400"
        >
          {paragraph}
        </p>
      ))}
    </div>
  );
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
  const projectUrl =
    typeof window !== "undefined"
      ? window.location.href
      : `https://codecraft.bd/projects/${normalizedProject.slug}`;
  const projectDescription =
    normalizedProject.seoDescription || normalizedProject.shortDescription;
  const projectSchema = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: normalizedProject.title,
    description: projectDescription,
    image: normalizedProject.coverImage,
    url: projectUrl,
    creator: {
      "@type": "Organization",
      name: "CodeCraft.BD",
    },
    dateCreated: normalizedProject.completedAt,
    keywords: [
      normalizedProject.category,
      ...normalizedProject.technologies,
      ...normalizedProject.features,
    ].join(", "),
  };

  return (
    <div className="min-h-screen">
      <SEO
        title={normalizedProject.seoTitle || normalizedProject.title}
        description={projectDescription}
        keywords={[
          normalizedProject.category,
          ...normalizedProject.technologies,
          ...normalizedProject.features,
        ].join(", ")}
        image={normalizedProject.coverImage}
        path={`/projects/${normalizedProject.slug}`}
        type="article"
        structuredData={projectSchema}
      />

      <section className="relative overflow-hidden bg-slate-950 pt-28 pb-14 md:pt-32 md:pb-16">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_12%_8%,rgba(6,182,212,0.22),transparent_30%),radial-gradient(circle_at_86%_16%,rgba(59,130,246,0.14),transparent_28%),linear-gradient(135deg,rgba(15,23,42,0.88),rgba(2,6,23,0.98))]" />
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-400/40 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-slate-700/80 to-transparent" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            to="/projects"
            className="mb-8 inline-flex items-center gap-2 rounded-full border border-slate-800 bg-slate-900/70 px-4 py-2 text-sm font-medium text-slate-300 transition-colors hover:border-cyan-500/40 hover:text-cyan-300"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Projects
          </Link>

          <div className="grid gap-10 lg:grid-cols-[0.94fr_1.06fr] lg:items-center xl:gap-14">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45 }}
            >
              <div className="mb-5 flex flex-wrap items-center gap-2.5">
                <span className="rounded-full border border-cyan-500/30 bg-cyan-500/15 px-3 py-1 text-xs font-semibold text-cyan-200">
                  {normalizedProject.category}
                </span>

                {normalizedProject.isFeatured && (
                  <span className="rounded-full border border-yellow-500/30 bg-yellow-500/15 px-3 py-1 text-xs font-semibold text-yellow-300">
                    Featured
                  </span>
                )}
              </div>

              <h1 className="max-w-3xl text-3xl font-bold leading-[1.15] text-slate-50 sm:text-4xl lg:text-5xl">
                {normalizedProject.title}
              </h1>

              <p className="mt-5 max-w-2xl text-base leading-8 text-slate-300 md:text-lg">
                {normalizedProject.shortDescription}
              </p>

              <div className="mt-7 flex flex-wrap items-center gap-3 text-sm text-slate-400">
                <div className="flex min-h-12 items-center gap-2 rounded-2xl border border-slate-800 bg-slate-900/65 px-4 py-3">
                  <Calendar className="w-4 h-4 text-cyan-400" />
                  <span>
                    Completed: {formatDate(normalizedProject.completedAt)}
                  </span>
                </div>

                <div className="flex min-h-12 items-center gap-2 rounded-2xl border border-slate-800 bg-slate-900/65 px-4 py-3">
                  <User className="w-4 h-4 text-cyan-400" />
                  <span>{normalizedProject.clientName}</span>
                </div>

                <div className="flex min-h-12 items-center gap-2 rounded-2xl border border-slate-800 bg-slate-900/65 px-4 py-3">
                  <Tag className="w-4 h-4 text-cyan-400" />
                  <span>{normalizedProject.category}</span>
                </div>
              </div>

              <div className="mt-8 flex flex-wrap gap-3">
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

              <ShareActions
                title={normalizedProject.title}
                text={projectDescription}
                url={projectUrl}
                className="mt-6"
                label="Share this project"
                compact
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.45, delay: 0.1 }}
              className="relative overflow-hidden rounded-3xl border border-slate-700/60 bg-slate-900/70 p-2 shadow-2xl shadow-cyan-950/30"
            >
              <div className="absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-cyan-300/70 to-transparent" />
              <img
                src={normalizedProject.coverImage}
                alt={normalizedProject.title}
                className="h-72 w-full rounded-2xl object-cover md:h-[26rem] lg:h-[29rem]"
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
            {renderParagraphs(normalizedProject.description)}
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
                  {renderParagraphs(normalizedProject.problem)}
                </div>
              )}

              {normalizedProject.solution && (
                <div className="glass rounded-2xl p-6 border border-slate-700/50">
                  <h2 className="text-2xl font-bold text-slate-100 mb-4">
                    Solution
                  </h2>
                  {renderParagraphs(normalizedProject.solution)}
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
