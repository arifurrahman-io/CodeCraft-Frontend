import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import BlogCard from "@/components/website/BlogCard";
import PageHero from "@/components/website/PageHero";
import CTASection from "@/components/website/CTASection";
import Loader from "@/components/common/Loader";
import EmptyState from "@/components/common/EmptyState";
import Button from "@/components/common/Button";
import { getAllBlogs } from "@/services/blogService";

const getBlogs = (response) => {
  if (Array.isArray(response)) return response;
  if (Array.isArray(response?.data)) return response.data;
  if (Array.isArray(response?.data?.blogs)) return response.data.blogs;
  return [];
};

const BlogsPage = () => {
  const [blogs, setBlogs] = useState([]);
  const [activeCategory, setActiveCategory] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        setError("");
        const response = await getAllBlogs();
        if (!mounted) return;
        setBlogs(getBlogs(response));
      } catch (err) {
        const message = err?.response?.data?.message || "Failed to load blogs";
        toast.error(message);
        if (mounted) {
          setError(message);
          setBlogs([]);
        }
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const publishedBlogs = useMemo(
    () =>
      blogs.filter((blog) =>
        typeof blog.isPublished === "boolean"
          ? blog.isPublished
          : blog.status === "published",
      ),
    [blogs],
  );

  const categories = useMemo(
    () => [
      "All",
      ...new Set(publishedBlogs.map((b) => b.category).filter(Boolean)),
    ],
    [publishedBlogs],
  );

  const visibleBlogs =
    activeCategory === "All"
      ? publishedBlogs
      : publishedBlogs.filter((blog) => blog.category === activeCategory);

  return (
    <div>
      <PageHero
        subtitle="Insights"
        title="From the blog"
        description="Practical notes on product engineering, delivery, and digital growth."
      />

      <section className="pb-16 md:pb-20">
        <div className="container-custom">
          {!loading && categories.length > 1 && (
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

          {loading ? (
            <Loader text="Loading articles..." className="py-20" />
          ) : error ? (
            <EmptyState title="Could not load articles" description={error} />
          ) : visibleBlogs.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
              {visibleBlogs.map((blog, index) => (
                <BlogCard
                  key={blog._id || blog.slug}
                  blog={blog}
                  index={index}
                />
              ))}
            </div>
          ) : (
            <EmptyState
              title="No articles found"
              description="Published posts in this category will appear here."
            />
          )}
        </div>
      </section>

      <CTASection />
    </div>
  );
};

export default BlogsPage;
