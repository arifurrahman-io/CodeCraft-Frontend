import { Link } from "react-router-dom";
import { ArrowRight, Calendar, Eye } from "lucide-react";
import { motion } from "framer-motion";

const BlogCard = ({ blog, index = 0 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      className="group"
    >
      <div className="h-full glass rounded-2xl overflow-hidden border border-slate-700/50 hover:border-cyan-500/30 transition-all duration-300">
        {/* Image */}
        <div className="relative h-48 overflow-hidden">
          <img
            src={blog.image}
            alt={blog.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent" />

          {/* Category Badge */}
          <div className="absolute top-4 left-4">
            <span className="px-3 py-1 rounded-full bg-cyan-500/20 border border-cyan-500/30 text-cyan-400 text-xs font-medium">
              {blog.category}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Meta */}
          <div className="flex items-center gap-4 mb-3 text-sm text-slate-500">
            <div className="flex items-center gap-2">
              <img
                src={blog.author?.image}
                alt={blog.author?.name}
                className="w-6 h-6 rounded-full object-cover"
              />
              <span>{blog.author?.name}</span>
            </div>
            <span>•</span>
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              <span>{blog.createdAt}</span>
            </div>
          </div>

          <h3 className="text-xl font-semibold text-slate-100 mb-2 group-hover:text-cyan-400 transition-colors line-clamp-2">
            {blog.title}
          </h3>
          <p className="text-slate-400 mb-4 line-clamp-2">
            {blog.shortDescription}
          </p>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-4">
            {blog.tags?.slice(0, 3).map((tag, idx) => (
              <span
                key={idx}
                className="px-2 py-1 rounded-md bg-slate-800 text-slate-500 text-xs"
              >
                #{tag}
              </span>
            ))}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-700/50">
            <div className="flex items-center gap-2 text-sm text-slate-500">
              <Eye className="w-4 h-4" />
              <span>{blog.views} views</span>
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
