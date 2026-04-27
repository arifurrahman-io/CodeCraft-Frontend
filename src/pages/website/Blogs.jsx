import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import BlogCard from "@/components/website/BlogCard";
import CTASection from "@/components/website/CTASection";
import { getAllBlogs } from "@/services/blogService";

const BlogsPage = () => {
  const [blogs, setBlogs] = useState([]);
  const [activeCategory, setActiveCategory] = useState("All");
  const publishedBlogs = blogs.filter((blog) => blog.isPublished);
  const categories = ["All", ...new Set(publishedBlogs.map((b) => b.category))];
  const visibleBlogs =
    activeCategory === "All"
      ? publishedBlogs
      : publishedBlogs.filter((blog) => blog.category === activeCategory);

  useEffect(() => {
    getAllBlogs().then((response) => setBlogs(response.data || []));
  }, []);

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="pt-32 pb-16 bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-3xl mx-auto"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-slate-100 mb-6">
              Our <span className="text-cyan-500">Blog</span>
            </h1>
            <p className="text-lg text-slate-400">
              Stay updated with the latest insights, tutorials, and news from
              the world of software development.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Blogs Grid */}
      <section className="py-16 md:py-20 bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Category Filter */}
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            {categories.map((category) => (
              <button
                key={category}
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

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {visibleBlogs.map((blog, index) => (
              <BlogCard key={blog._id} blog={blog} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-16 md:py-20 bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="glass rounded-2xl p-8 md:p-12 border border-slate-700/50 text-center">
            <h2 className="text-3xl font-bold text-slate-100 mb-4">
              Subscribe to Our Newsletter
            </h2>
            <p className="text-lg text-slate-400 mb-8 max-w-2xl mx-auto">
              Get the latest articles and insights delivered directly to your
              inbox.
            </p>
            <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
              <button
                type="submit"
                className="px-6 py-3 bg-cyan-500 text-slate-900 rounded-lg font-medium hover:bg-cyan-400 transition-colors"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* CTA */}
      <CTASection />
    </div>
  );
};

export default BlogsPage;
