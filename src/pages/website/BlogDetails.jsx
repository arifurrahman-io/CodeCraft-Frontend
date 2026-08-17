import { useEffect, useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowUpRight,
  Calendar,
  Eye,
  Tag,
} from "lucide-react";
import { toast } from "sonner";

import Button from "@/components/common/Button";
import SEO from "@/components/common/SEO";
import ShareActions from "@/components/common/ShareActions";
import Loader from "@/components/common/Loader";
import EmptyState from "@/components/common/EmptyState";
import { getAllBlogs, getBlogBySlug } from "@/services/blogService";

const fallbackImage =
  "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=1200&auto=format&fit=crop&q=80";

const getBlogFromResponse = (response) =>
  response?.data?.blog ||
  response?.data?.data ||
  response?.data ||
  response?.blog ||
  response ||
  null;

const getBlogsFromResponse = (response) => {
  if (Array.isArray(response)) return response;
  if (Array.isArray(response?.data)) return response.data;
  if (Array.isArray(response?.data?.blogs)) return response.data.blogs;
  if (Array.isArray(response?.data?.data)) return response.data.data;
  if (Array.isArray(response?.blogs)) return response.blogs;
  return [];
};

const ensureArray = (value) => {
  if (Array.isArray(value)) return value;
  if (!value) return [];

  return String(value)
    .split(/\n|,/)
    .map((item) => item.trim())
    .filter(Boolean);
};

const getAuthorName = (author) => {
  if (!author) return "CodeCraft.BD Team";
  if (typeof author === "string") return "CodeCraft.BD Team";
  return author.name || author.email || "CodeCraft.BD Team";
};

const normalizeBlog = (blog) => {
  if (!blog) return null;

  return {
    ...blog,
    _id: blog._id || blog.id,
    title: blog.title || "Untitled Blog",
    slug: blog.slug || "",
    excerpt: blog.excerpt || blog.shortDescription || "",
    content: blog.content || "",
    coverImage: blog.coverImage || blog.image || fallbackImage,
    category: blog.category || "Blog",
    tags: ensureArray(blog.tags),
    views: Number(blog.views || 0),
    authorName: getAuthorName(blog.author),
    isPublished:
      typeof blog.isPublished === "boolean"
        ? blog.isPublished
        : blog.status === "published",
    publishedAt: blog.publishedAt || blog.createdAt || null,
    seoTitle: blog.seoTitle || blog.title || "",
    seoDescription: blog.seoDescription || blog.excerpt || "",
  };
};

const formatDate = (date) => {
  if (!date) return "Not published";

  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const BlogDetailsPage = () => {
  const { slug } = useParams();

  const [blog, setBlog] = useState(null);
  const [blogs, setBlogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const normalizedBlog = useMemo(() => normalizeBlog(blog), [blog]);

  const normalizedBlogs = useMemo(
    () => blogs.map(normalizeBlog).filter(Boolean),
    [blogs],
  );

  const articleUrl =
    typeof window !== "undefined"
      ? window.location.href
      : `https://codecraft.bd/blogs/${slug || ""}`;

  const readingTime = useMemo(() => {
    const words =
      normalizedBlog?.content?.trim().split(/\s+/).filter(Boolean).length || 0;

    return Math.max(1, Math.ceil(words / 220));
  }, [normalizedBlog]);

  const relatedBlogs = useMemo(() => {
    if (!normalizedBlog) return [];

    return normalizedBlogs
      .filter(
        (item) =>
          item._id !== normalizedBlog._id && item.isPublished && item.slug,
      )
      .sort(
        (a, b) =>
          Number(b.category === normalizedBlog.category) -
          Number(a.category === normalizedBlog.category),
      )
      .slice(0, 3);
  }, [normalizedBlogs, normalizedBlog]);

  useEffect(() => {
    let mounted = true;

    const loadBlog = async () => {
      try {
        setIsLoading(true);
        setError("");

        const [blogResponse, blogsResponse] = await Promise.all([
          getBlogBySlug(slug),
          getAllBlogs(),
        ]);

        if (mounted) {
          setBlog(getBlogFromResponse(blogResponse));
          setBlogs(getBlogsFromResponse(blogsResponse));
        }
      } catch (err) {
        if (mounted) {
          const message =
            err?.response?.data?.message || "Failed to load blog";
          setBlog(null);
          setBlogs([]);
          setError(message);
          toast.error(message);
        }
      } finally {
        if (mounted) setIsLoading(false);
      }
    };

    if (slug) loadBlog();

    return () => {
      mounted = false;
    };
  }, [slug]);

  const renderContent = (content) => {
    const blocks = String(content || "")
      .split(/\n{2,}/)
      .map((block) => block.trim())
      .filter(Boolean);

    return blocks.map((block, index) => {
      if (block.startsWith("## ")) {
        return (
          <h2
            key={index}
            className="mt-12 mb-5 text-3xl font-bold leading-tight tracking-tight text-ink"
          >
            {block.replace(/^##\s+/, "")}
          </h2>
        );
      }

      if (block.startsWith("### ")) {
        return (
          <h3
            key={index}
            className="mt-8 mb-4 text-xl font-semibold leading-snug text-ink"
          >
            {block.replace(/^###\s+/, "")}
          </h3>
        );
      }

      const lines = block.split("\n").map((line) => line.trim());
      const isList = lines.every((line) => line.startsWith("- "));

      if (isList) {
        return (
          <ul key={index} className="my-7 space-y-3 pl-6">
            {lines.map((line, lineIndex) => (
              <li
                key={`${line}-${lineIndex}`}
                className="list-disc text-lg leading-relaxed text-ink-muted marker:text-accent"
              >
                {line.replace(/^-\s+/, "")}
              </li>
            ))}
          </ul>
        );
      }

      return (
        <p
          key={index}
          className="mb-7 whitespace-pre-line text-lg leading-relaxed text-ink-muted"
        >
          {block}
        </p>
      );
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader text="Loading article..." className="py-20" />
      </div>
    );
  }

  if (error || !normalizedBlog || !normalizedBlog.isPublished) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4">
        <EmptyState
          title="Article not found"
          description={
            error || "The blog may be unavailable or unpublished."
          }
          action={
            <Link to="/blogs">
              <Button variant="outline" icon={ArrowLeft}>
                Back to Blogs
              </Button>
            </Link>
          }
        />
      </div>
    );
  }

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: normalizedBlog.title,
    description: normalizedBlog.seoDescription || normalizedBlog.excerpt,
    image: normalizedBlog.coverImage,
    author: {
      "@type": "Person",
      name: normalizedBlog.authorName,
    },
    publisher: {
      "@type": "Organization",
      name: "CodeCraft.BD",
    },
    datePublished: normalizedBlog.publishedAt,
    dateModified: normalizedBlog.updatedAt || normalizedBlog.publishedAt,
    mainEntityOfPage: articleUrl,
  };

  return (
    <div>
      <SEO
        title={normalizedBlog.seoTitle || normalizedBlog.title}
        description={normalizedBlog.seoDescription || normalizedBlog.excerpt}
        keywords={normalizedBlog.tags.join(", ")}
        image={normalizedBlog.coverImage}
        path={`/blogs/${normalizedBlog.slug}`}
        type="article"
        structuredData={articleSchema}
      />

      <section className="pt-12 pb-10 md:pt-16 md:pb-14">
        <div className="container-custom">
          <Link
            to="/blogs"
            className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-ink-muted transition-colors hover:text-accent"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Blogs
          </Link>

          <div className="grid gap-10 lg:grid-cols-2 lg:items-start lg:gap-14">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="mb-4 flex flex-wrap items-center gap-2">
                <span className="rounded-md bg-accent-soft px-2.5 py-1 text-xs font-semibold text-accent">
                  {normalizedBlog.category}
                </span>
                <span className="rounded-md border border-border px-2.5 py-1 text-xs text-ink-muted">
                  {readingTime} min read
                </span>
              </div>

              <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-ink tracking-tight leading-tight">
                {normalizedBlog.title}
              </h1>

              <p className="mt-5 text-lg text-ink-muted leading-relaxed max-w-2xl">
                {normalizedBlog.excerpt}
              </p>

              <div className="mt-7 flex flex-wrap gap-6 text-sm">
                <div className="border-t border-border pt-3 min-w-[140px]">
                  <p className="text-ink font-semibold">
                    {normalizedBlog.authorName}
                  </p>
                  <p className="text-ink-subtle">Author</p>
                </div>
                <div className="border-t border-border pt-3 min-w-[140px]">
                  <div className="flex items-center gap-2 text-ink-subtle mb-1">
                    <Calendar className="h-4 w-4 text-accent" />
                    Published
                  </div>
                  <p className="text-ink font-medium">
                    {formatDate(normalizedBlog.publishedAt)}
                  </p>
                </div>
                <div className="border-t border-border pt-3 min-w-[140px]">
                  <div className="flex items-center gap-2 text-ink-subtle mb-1">
                    <Eye className="h-4 w-4 text-accent" />
                    Views
                  </div>
                  <p className="text-ink font-medium">
                    {normalizedBlog.views} views
                  </p>
                </div>
              </div>

              <ShareActions
                title={normalizedBlog.title}
                text={normalizedBlog.seoDescription || normalizedBlog.excerpt}
                url={articleUrl}
                className="mt-6"
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
                src={normalizedBlog.coverImage}
                alt={normalizedBlog.title}
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
        <div className="container-custom max-w-3xl">
          <article>
            <div className="border-b border-border pb-8 mb-8">
              <p className="text-sm font-semibold text-accent mb-2">Article</p>
              <p className="text-ink-muted">
                Practical thinking from CodeCraft.BD on building better digital
                products.
              </p>
            </div>

            <div>{renderContent(normalizedBlog.content)}</div>

            {normalizedBlog.tags.length > 0 && (
              <div className="mt-10 border-t border-border pt-8">
                <div className="mb-4 flex items-center gap-2 text-sm font-medium text-ink">
                  <Tag className="h-4 w-4 text-accent" />
                  Topics
                </div>
                <div className="flex flex-wrap gap-2">
                  {normalizedBlog.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-md bg-accent-soft px-3 py-1 text-sm text-accent"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </article>
        </div>
      </section>

      {relatedBlogs.length > 0 && (
        <section className="section-padding">
          <div className="container-custom">
            <div className="mb-10 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
              <div>
                <p className="text-sm font-semibold text-accent mb-2">
                  Keep reading
                </p>
                <h2 className="text-3xl font-bold text-ink tracking-tight">
                  Related articles
                </h2>
              </div>
              <Link
                to="/blogs"
                className="inline-flex items-center gap-2 text-sm font-medium text-accent hover:text-accent-hover"
              >
                View all articles
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="grid gap-10 md:grid-cols-3">
              {relatedBlogs.map((relatedBlog, index) => (
                <motion.div
                  key={relatedBlog._id || relatedBlog.slug}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.06 }}
                >
                  <Link
                    to={`/blogs/${relatedBlog.slug}`}
                    className="group block border-t border-border pt-5"
                  >
                    <img
                      src={relatedBlog.coverImage}
                      alt={relatedBlog.title}
                      className="mb-5 h-44 w-full rounded-xl object-cover border border-border"
                      onError={(e) => {
                        e.currentTarget.src = fallbackImage;
                      }}
                    />
                    <span className="text-xs font-semibold uppercase tracking-wider text-accent">
                      {relatedBlog.category}
                    </span>
                    <h3 className="mt-2 line-clamp-2 text-lg font-semibold text-ink group-hover:text-accent transition-colors">
                      {relatedBlog.title}
                    </h3>
                    <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-ink-muted">
                      {relatedBlog.excerpt}
                    </p>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default BlogDetailsPage;
