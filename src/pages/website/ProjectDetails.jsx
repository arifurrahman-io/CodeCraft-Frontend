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
import Loader from "@/components/common/Loader";
import EmptyState from "@/components/common/EmptyState";
import CTASection from "@/components/website/CTASection";
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
          className="whitespace-pre-line text-lg leading-relaxed text-ink-muted"
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
  const [error, setError] = useState("");

  const normalizedProject = useMemo(() => normalizeProject(project), [project]);

  useEffect(() => {
    let mounted = true;

    const fetchProject = async () => {
      try {
        setIsLoading(true);
        setError("");

        const response = await getProjectBySlug(slug);
        const projectData = getProjectFromResponse(response);

        if (mounted) setProject(projectData);
      } catch (err) {
        if (mounted) {
          const message =
            err?.response?.data?.message || "Failed to load project";
          setProject(null);
          setError(message);
          toast.error(message);
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
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader text="Loading project..." className="py-20" />
      </div>
    );
  }

  if (error || !normalizedProject || !normalizedProject.isActive) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4">
        <EmptyState
          title="Project not found"
          description={
            error || "The project may be unavailable or inactive."
          }
          action={
            <Link to="/projects">
              <Button variant="outline" icon={ArrowLeft}>
                Back to Projects
              </Button>
            </Link>
          }
        />
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
    <div>
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

      <section className="pt-12 pb-10 md:pt-16 md:pb-14">
        <div className="container-custom">
          <Link
            to="/projects"
            className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-ink-muted transition-colors hover:text-accent"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Projects
          </Link>

          <div className="grid gap-10 lg:grid-cols-2 lg:items-start lg:gap-14">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="mb-4 flex flex-wrap items-center gap-2">
                <span className="rounded-md bg-accent-soft px-2.5 py-1 text-xs font-semibold text-accent">
                  {normalizedProject.category}
                </span>
                {normalizedProject.isFeatured && (
                  <span className="rounded-md border border-border px-2.5 py-1 text-xs font-semibold text-ink-muted">
                    Featured
                  </span>
                )}
              </div>

              <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-ink tracking-tight leading-tight">
                {normalizedProject.title}
              </h1>

              <p className="mt-5 text-lg text-ink-muted leading-relaxed max-w-2xl">
                {normalizedProject.shortDescription}
              </p>

              <div className="mt-7 flex flex-wrap gap-6 text-sm">
                <div className="border-t border-border pt-3 min-w-[140px]">
                  <div className="flex items-center gap-2 text-ink-subtle mb-1">
                    <Calendar className="w-4 h-4 text-accent" />
                    Completed
                  </div>
                  <p className="text-ink font-medium">
                    {formatDate(normalizedProject.completedAt)}
                  </p>
                </div>
                <div className="border-t border-border pt-3 min-w-[140px]">
                  <div className="flex items-center gap-2 text-ink-subtle mb-1">
                    <User className="w-4 h-4 text-accent" />
                    Client
                  </div>
                  <p className="text-ink font-medium">
                    {normalizedProject.clientName}
                  </p>
                </div>
                <div className="border-t border-border pt-3 min-w-[140px]">
                  <div className="flex items-center gap-2 text-ink-subtle mb-1">
                    <Tag className="w-4 h-4 text-accent" />
                    Category
                  </div>
                  <p className="text-ink font-medium">
                    {normalizedProject.category}
                  </p>
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
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.08 }}
              className="overflow-hidden rounded-xl border border-border bg-surface"
            >
              <img
                src={normalizedProject.coverImage}
                alt={normalizedProject.title}
                className="h-72 w-full object-cover md:h-[26rem]"
                onError={(e) => {
                  e.currentTarget.src = fallbackImage;
                }}
              />
            </motion.div>
          </div>
        </div>
      </section>

      <section className="section-padding bg-surface border-y border-border">
        <div className="container-custom">
          <div className="max-w-3xl">
            <SectionHeader
              alignment="left"
              title="Project overview"
              className="mb-8"
            />
            {renderParagraphs(normalizedProject.description)}
          </div>
        </div>
      </section>

      {(normalizedProject.problem || normalizedProject.solution) && (
        <section className="section-padding">
          <div className="container-custom">
            <div className="grid md:grid-cols-2 gap-10">
              {normalizedProject.problem && (
                <div className="border-t border-border pt-6">
                  <h2 className="text-2xl font-bold text-ink mb-4">Problem</h2>
                  {renderParagraphs(normalizedProject.problem)}
                </div>
              )}

              {normalizedProject.solution && (
                <div className="border-t border-border pt-6">
                  <h2 className="text-2xl font-bold text-ink mb-4">Solution</h2>
                  {renderParagraphs(normalizedProject.solution)}
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {normalizedProject.features.length > 0 && (
        <section className="section-padding bg-surface border-y border-border">
          <div className="container-custom">
            <SectionHeader
              alignment="left"
              subtitle="Key Capabilities"
              title="Project features"
              className="mb-12"
            />

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {normalizedProject.features.map((feature, index) => (
                <motion.div
                  key={`${feature}-${index}`}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.06 }}
                  className="border-t border-border pt-5"
                >
                  <CheckCircle2 className="w-5 h-5 text-accent mb-3" />
                  <h3 className="text-lg font-semibold text-ink">{feature}</h3>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {normalizedProject.technologies.length > 0 && (
        <section className="section-padding">
          <div className="container-custom">
            <SectionHeader
              alignment="left"
              subtitle="Tech Stack"
              title="Technologies used"
              className="mb-10"
            />

            <div className="flex flex-wrap gap-2">
              {normalizedProject.technologies.map((tech, index) => (
                <motion.span
                  key={`${tech}-${index}`}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.04 }}
                  className="rounded-md border border-border bg-surface px-3 py-1.5 text-sm text-ink-muted"
                >
                  {tech}
                </motion.span>
              ))}
            </div>
          </div>
        </section>
      )}

      {galleryImages.length > 1 && (
        <section className="section-padding bg-surface border-y border-border">
          <div className="container-custom">
            <SectionHeader
              alignment="left"
              title="Project gallery"
              className="mb-12"
            />

            <div className="grid md:grid-cols-2 gap-6">
              {galleryImages.map((image, index) => (
                <motion.div
                  key={`${image}-${index}`}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="overflow-hidden rounded-xl border border-border"
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

      <CTASection
        title="Have a similar project in mind?"
        description="Let's discuss your ideas and create something amazing together."
        ctaText="Start your project"
      />
    </div>
  );
};

export default ProjectDetailsPage;
