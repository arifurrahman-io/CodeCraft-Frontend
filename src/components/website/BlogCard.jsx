import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

const fallbackImage =
  "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800&auto=format&fit=crop&q=80";

const formatDate = (date) => {
  if (!date) return "Draft";
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const BlogCard = ({ blog = {}, index = 0 }) => {
  const image = blog.coverImage || blog.image || fallbackImage;
  const date = blog.publishedAt || blog.createdAt;
  const excerpt = blog.excerpt || blog.shortDescription || "";

  return (
    <motion.article
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.45, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
      className="group"
    >
      <Link to={`/blogs/${blog.slug}`} className="block">
        <div className="relative aspect-[16/10] overflow-hidden rounded-2xl bg-canvas mb-5">
          <img
            src={image}
            alt={blog.title || "Blog cover"}
            className="w-full h-full object-cover transition-transform duration-700 ease-smooth group-hover:scale-[1.04]"
            onError={(e) => {
              e.currentTarget.src = fallbackImage;
            }}
          />
        </div>
        <div className="flex items-center gap-2 text-xs text-ink-subtle mb-2">
          <span className="font-semibold text-accent">
            {blog.category || "Blog"}
          </span>
          <span aria-hidden="true">·</span>
          <time dateTime={date}>{formatDate(date)}</time>
        </div>
        <h3 className="font-display text-xl font-semibold text-ink mb-2 group-hover:text-accent transition-colors line-clamp-2">
          {blog.title || "Untitled Blog"}
        </h3>
        <p className="text-ink-muted text-sm line-clamp-2 mb-3 leading-relaxed">
          {excerpt}
        </p>
        <span className="inline-flex items-center gap-1.5 text-sm font-medium text-ink">
          Read article
          <ArrowRight className="w-4 h-4 transition-transform duration-300 ease-smooth group-hover:translate-x-0.5" />
        </span>
      </Link>
    </motion.article>
  );
};

export default BlogCard;
