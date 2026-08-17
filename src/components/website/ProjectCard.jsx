import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

const ProjectCard = ({ project, index = 0 }) => {
  return (
    <motion.article
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.45, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
      className="group"
    >
      <Link to={`/projects/${project.slug}`} className="block">
        <div className="relative aspect-[16/10] overflow-hidden rounded-2xl bg-canvas mb-5">
          <img
            src={project.coverImage || project.image}
            alt={project.title}
            className="w-full h-full object-cover transition-transform duration-700 ease-smooth group-hover:scale-[1.04]"
          />
          <div
            className="absolute inset-0 bg-gradient-to-t from-ink/40 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100"
            aria-hidden="true"
          />
        </div>
        <p className="text-xs font-semibold text-accent tracking-wide mb-2">
          {project.category}
        </p>
        <h3 className="font-display text-xl font-semibold text-ink mb-2 group-hover:text-accent transition-colors">
          {project.title}
        </h3>
        <p className="text-ink-muted text-sm line-clamp-2 mb-3 leading-relaxed">
          {project.shortDescription}
        </p>
        <span className="inline-flex items-center gap-1.5 text-sm font-medium text-ink">
          View case study
          <ArrowRight className="w-4 h-4 transition-transform duration-300 ease-smooth group-hover:translate-x-0.5" />
        </span>
      </Link>
    </motion.article>
  );
};

export default ProjectCard;
