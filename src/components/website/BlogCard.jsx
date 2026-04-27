import { Link } from "react-router-dom";
import { ArrowRight, Calendar, Eye, User } from "lucide-react";
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

const getAuthorName = (author) => {
  if (!author) return "Admin";
  if (typeof author === "string") return "Admin";
  return author.name || author.email || "Admin";
};

const BlogCard = ({ blog = {}, index = 0 }) => {
  const image = blog.coverImage || blog.image || fallbackImage;
  const authorName = getAuthorName(blog.author);
  const date = blog.publishedAt || blog.createdAt;
  const excerpt = blog.excerpt || blog.shortDescription || "";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
      className="group h-full"
    >
      <div className="h-full glass rounded-2xl overflow-hidden border border-slate-700/50 hover:border-cyan-500/30 transition-all duration-300">
        <div className="relative h-48 overflow-hidden">
          <img
            src={image}
            alt={blog.title || "Blog cover"}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            onError={(e) => {
              e.currentTarget.src = fallbackImage;
            }}
          />

          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent" />

          <div className="absolute top-4 left-4">
            <span className="px-3 py-1 rounded-full bg-cyan-500/20 border border-cyan-500/30 text-cyan-400 text-xs font-medium">
              {blog.category || "Blog"}
            </span>
          </div>

          {!blog.isPublished && (
            <div className="absolute top-4 right-4">
              <span className="px-3 py-1 rounded-full bg-yellow-500/20 border border-yellow-500/30 text-yellow-400 text-xs font-medium">
                Draft
              </span>
            </div>
          )}
        </div>

        <div className="p-6">
          <div className="flex flex-wrap items-center gap-3 mb-3 text-sm text-slate-500">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4" />
              <span>{authorName}</span>
            </div>

            <span>•</span>

            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              <span>{formatDate(date)}</span>
            </div>
          </div>

          <h3 className="text-xl font-semibold text-slate-100 mb-2 group-hover:text-cyan-400 transition-colors line-clamp-2">
            {blog.title || "Untitled Blog"}
          </h3>

          <p className="text-slate-400 mb-4 line-clamp-2">{excerpt}</p>

          {blog.tags?.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {blog.tags.slice(0, 3).map((tag, idx) => (
                <span
                  key={`${tag}-${idx}`}
                  className="px-2 py-1 rounded-md bg-slate-800 text-slate-500 text-xs"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}

          <div className="flex items-center justify-between pt-4 border-t border-slate-700/50">
            <div className="flex items-center gap-2 text-sm text-slate-500">
              <Eye className="w-4 h-4" />
              <span>{Number(blog.views || 0)} views</span>
            </div>

            <Link
              to={`/blogs/${blog.slug}`}
              className="inline-flex items-center gap-2 text-sm font-medium text-cyan-500 hover:text-cyan-400 transition-colors"
            >
              Read More
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default BlogCard;
