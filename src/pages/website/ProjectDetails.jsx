import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Calendar, ExternalLink } from "lucide-react";
import Button from "@/components/common/Button";
import SectionHeader from "@/components/common/SectionHeader";
import { getProjectBySlug } from "@/services/projectService";

const ProjectDetailsPage = () => {
  const { slug } = useParams();
  const [project, setProject] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getProjectBySlug(slug).then((response) => {
      setProject(response.data);
      setIsLoading(false);
    });
  }, [slug]);

  if (!isLoading && !project) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-slate-100 mb-4">
            Project Not Found
          </h1>
          <Link to="/projects">
            <Button variant="outline">Back to Projects</Button>
          </Link>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return <div className="min-h-screen bg-slate-950" />;
  }

  return (
    <div className="min-h-screen">
      {/* Hero */}
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
              <div className="flex items-center gap-4 mb-6">
                <span className="px-3 py-1 rounded-full bg-cyan-500/20 border border-cyan-500/30 text-cyan-400 text-sm font-medium">
                  {project.category}
                </span>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    project.status === "completed"
                      ? "bg-green-500/20 border border-green-500/30 text-green-400"
                      : "bg-yellow-500/20 border border-yellow-500/30 text-yellow-400"
                  }`}
                >
                  {project.status === "completed" ? "Completed" : "In Progress"}
                </span>
              </div>

              <h1 className="text-4xl md:text-5xl font-bold text-slate-100 mb-4">
                {project.title}
              </h1>

              <p className="text-lg text-slate-400 mb-6">
                {project.shortDescription}
              </p>

              <div className="flex flex-wrap gap-4 mb-8">
                <div className="flex items-center gap-2 text-slate-400">
                  <Calendar className="w-5 h-5 text-cyan-500" />
                  <span>Completed: {project.completionDate}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-400">
                  <span className="text-slate-500">Duration:</span>
                  <span>{project.duration}</span>
                </div>
              </div>

              <div className="flex gap-4">
                {project.liveUrl && (
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button icon={ExternalLink} iconPosition="right">
                      View Live
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
                src={project.image}
                alt={project.title}
                className="w-full h-80 object-cover"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Description */}
      <section className="py-16 md:py-20 bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <SectionHeader title="Project Overview" className="mb-8" />
            <p className="text-lg text-slate-400 leading-relaxed">
              {project.description}
            </p>
          </div>
        </div>
      </section>

      {/* Technologies */}
      <section className="py-16 md:py-20 bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            subtitle="Tech Stack"
            title="Technologies Used"
            className="mb-12"
          />

          <div className="flex flex-wrap gap-3">
            {project.technologies?.map((tech, index) => (
              <motion.span
                key={tech}
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

      {/* Client */}
      <section className="py-16 md:py-20 bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="glass rounded-2xl p-8 border border-slate-700/50">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <p className="text-sm text-slate-500 mb-2">Client</p>
                <h3 className="text-2xl font-semibold text-slate-100">
                  {project.client}
                </h3>
              </div>
              <div className="text-right">
                <p className="text-sm text-slate-500 mb-2">Project Status</p>
                <p className="text-2xl font-semibold text-cyan-500 capitalize">
                  {project.status}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
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
