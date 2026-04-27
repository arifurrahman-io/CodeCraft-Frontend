import { useEffect, useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowUpRight,
  Briefcase,
  Calendar,
  Check,
  Copy,
  Eye,
  Mail,
  MessageCircle,
  Send,
  Share2,
  Tag,
} from "lucide-react";
import { toast } from "sonner";

import Button from "@/components/common/Button";
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

const openShareWindow = (url) => {
  window.open(url, "_blank", "noopener,noreferrer,width=720,height=560");
};

const BlogDetailsPage = () => {
  const { slug } = useParams();

  const [blog, setBlog] = useState(null);
  const [blogs, setBlogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  const normalizedBlog = useMemo(() => normalizeBlog(blog), [blog]);

  const normalizedBlogs = useMemo(
    () => blogs.map(normalizeBlog).filter(Boolean),
    [blogs],
  );

  const articleUrl = typeof window !== "undefined" ? window.location.href : "";

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

        const [blogResponse, blogsResponse] = await Promise.all([
          getBlogBySlug(slug),
          getAllBlogs(),
        ]);

        if (mounted) {
          setBlog(getBlogFromResponse(blogResponse));
          setBlogs(getBlogsFromResponse(blogsResponse));
        }
      } catch (error) {
        if (mounted) {
          setBlog(null);
          setBlogs([]);
          toast.error(error?.response?.data?.message || "Failed to load blog");
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

  const handleCopyLink = async () => {
    if (!articleUrl) return;

    try {
      await navigator.clipboard.writeText(articleUrl);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      toast.error("Failed to copy link");
    }
  };

  const shareItems = normalizedBlog
    ? [
        {
          name: "Facebook",
          icon: MessageCircle,
          action: () =>
            openShareWindow(
              `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
                articleUrl,
              )}`,
            ),
        },
        {
          name: "X",
          icon: Send,
          action: () =>
            openShareWindow(
              `https://twitter.com/intent/tweet?url=${encodeURIComponent(
                articleUrl,
              )}&text=${encodeURIComponent(normalizedBlog.title)}`,
            ),
        },
        {
          name: "LinkedIn",
          icon: Briefcase,
          action: () =>
            openShareWindow(
              `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
                articleUrl,
              )}`,
            ),
        },
        {
          name: "Email",
          icon: Mail,
          action: () => {
            window.location.href = `mailto:?subject=${encodeURIComponent(
              normalizedBlog.title,
            )}&body=${encodeURIComponent(articleUrl)}`;
          },
        },
      ]
    : [];

  const renderContent = (content) => {
    const lines = String(content || "").split("\n");

    return lines.map((line, index) => {
      if (line.startsWith("## ")) {
        return (
          <h2
            key={index}
            className="mt-12 mb-5 text-3xl font-bold tracking-tight text-slate-100"
          >
            {line.replace("## ", "")}
          </h2>
        );
      }

      if (line.startsWith("### ")) {
        return (
          <h3
            key={index}
            className="mt-8 mb-3 text-xl font-semibold text-cyan-100"
          >
            {line.replace("### ", "")}
          </h3>
        );
      }

      if (line.startsWith("- ")) {
        return (
          <li key={index} className="ml-6 list-disc text-slate-300">
            {line.replace("- ", "")}
          </li>
        );
      }

      if (line.trim() === "") {
        return <div key={index} className="h-3" />;
      }

      return (
        <p key={index} className="mb-5 text-lg leading-8 text-slate-300">
          {line}
        </p>
      );
    });
  };

  if (isLoading) {
    return <div className="min-h-screen bg-slate-950" />;
  }

  if (!normalizedBlog || !normalizedBlog.isPublished) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 px-4">
        <div className="text-center">
          <h1 className="mb-4 text-4xl font-bold text-slate-100">
            Blog Not Found
          </h1>
          <p className="mb-6 text-slate-400">
            The blog may be unavailable or unpublished.
          </p>
          <Link to="/blogs">
            <Button variant="outline">Back to Blogs</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950">
      <section className="relative overflow-hidden bg-slate-900 pt-32 pb-16">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(6,182,212,0.18),transparent_34%),linear-gradient(135deg,rgba(15,23,42,0.2),rgba(2,6,23,0.95))]" />
        <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-cyan-500/40 to-transparent" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Link
            to="/blogs"
            className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-slate-400 transition-colors hover:text-cyan-400"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Blogs
          </Link>

          <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45 }}
            >
              <div className="mb-6 flex flex-wrap items-center gap-3">
                <span className="rounded-full border border-cyan-500/30 bg-cyan-500/15 px-3 py-1 text-sm font-medium text-cyan-300">
                  {normalizedBlog.category}
                </span>
                <span className="rounded-full border border-slate-700 bg-slate-900/70 px-3 py-1 text-sm text-slate-300">
                  {readingTime} min read
                </span>
              </div>

              <h1 className="max-w-4xl text-4xl font-bold leading-tight text-slate-100 md:text-6xl">
                {normalizedBlog.title}
              </h1>

              <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
                {normalizedBlog.excerpt}
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-5 text-sm text-slate-400">
                <div>
                  <p className="font-medium text-slate-100">
                    {normalizedBlog.authorName}
                  </p>
                  <p className="text-slate-500">Author</p>
                </div>

                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-cyan-400" />
                  <span>{formatDate(normalizedBlog.publishedAt)}</span>
                </div>

                <div className="flex items-center gap-2">
                  <Eye className="h-4 w-4 text-cyan-400" />
                  <span>{normalizedBlog.views} views</span>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.45, delay: 0.1 }}
              className="overflow-hidden rounded-3xl border border-slate-700/60 bg-slate-800/40 shadow-2xl shadow-cyan-950/30"
            >
              <img
                src={normalizedBlog.coverImage}
                alt={normalizedBlog.title}
                className="h-72 w-full object-cover md:h-[28rem]"
                onError={(e) => {
                  e.currentTarget.src = fallbackImage;
                }}
              />
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-20">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[5rem_minmax(0,48rem)_1fr] lg:px-8">
          <aside className="hidden lg:block">
            <div className="sticky top-28 space-y-3">
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-700 bg-slate-900 text-cyan-300">
                <Share2 className="h-5 w-5" />
              </div>

              {shareItems.map((item) => (
                <button
                  key={item.name}
                  type="button"
                  onClick={item.action}
                  className="flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-700 bg-slate-900 text-slate-400 transition-colors hover:border-cyan-500/40 hover:text-cyan-300"
                  title={`Share on ${item.name}`}
                >
                  <item.icon className="h-5 w-5" />
                </button>
              ))}

              <button
                type="button"
                onClick={handleCopyLink}
                className="flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-700 bg-slate-900 text-slate-400 transition-colors hover:border-cyan-500/40 hover:text-cyan-300"
                title="Copy article link"
              >
                {copied ? (
                  <Check className="h-5 w-5" />
                ) : (
                  <Copy className="h-5 w-5" />
                )}
              </button>
            </div>
          </aside>

          <article className="min-w-0">
            <div className="rounded-3xl border border-slate-800 bg-slate-900/45 p-6 shadow-xl shadow-slate-950/30 md:p-10">
              <div className="border-b border-slate-800 pb-8">
                <p className="text-sm font-medium uppercase tracking-wider text-cyan-300">
                  Article
                </p>
                <p className="mt-2 text-slate-400">
                  Practical thinking from CodeCraft.BD on building better
                  digital products.
                </p>
              </div>

              <div className="pt-8">
                {renderContent(normalizedBlog.content)}
              </div>

              {normalizedBlog.tags.length > 0 && (
                <div className="mt-10 border-t border-slate-800 pt-8">
                  <div className="mb-4 flex items-center gap-2 text-sm font-medium text-slate-300">
                    <Tag className="h-4 w-4 text-cyan-400" />
                    Topics
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {normalizedBlog.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full border border-slate-700 bg-slate-800 px-3 py-1 text-sm text-slate-300"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </article>

          <aside className="hidden xl:block">
            <div className="sticky top-28 rounded-3xl border border-slate-800 bg-slate-900/60 p-6">
              <p className="text-sm font-semibold uppercase tracking-wider text-cyan-300">
                Share this insight
              </p>
              <p className="mt-3 text-sm leading-6 text-slate-400">
                Send this article to your team or save it for your next product
                planning session.
              </p>
              <button
                type="button"
                onClick={handleCopyLink}
                className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-cyan-500 px-4 py-3 text-sm font-semibold text-slate-950 transition-colors hover:bg-cyan-400"
              >
                {copied ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
                {copied ? "Link copied" : "Copy article link"}
              </button>
            </div>
          </aside>
        </div>
      </section>

      {relatedBlogs.length > 0 && (
        <section className="bg-slate-900 py-16 md:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
              <div>
                <p className="text-sm font-semibold uppercase tracking-wider text-cyan-300">
                  Keep reading
                </p>
                <h2 className="mt-2 text-3xl font-bold text-slate-100">
                  Related Articles
                </h2>
              </div>
              <Link
                to="/blogs"
                className="inline-flex items-center gap-2 text-sm font-medium text-cyan-300 hover:text-cyan-200"
              >
                View all articles
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              {relatedBlogs.map((relatedBlog, index) => (
                <motion.div
                  key={relatedBlog._id || relatedBlog.slug}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.08 }}
                >
                  <Link
                    to={`/blogs/${relatedBlog.slug}`}
                    className="group block overflow-hidden rounded-2xl border border-slate-700/50 bg-slate-950/60 transition-colors hover:border-cyan-500/40"
                  >
                    <img
                      src={relatedBlog.coverImage}
                      alt={relatedBlog.title}
                      className="h-44 w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      onError={(e) => {
                        e.currentTarget.src = fallbackImage;
                      }}
                    />
                    <div className="p-5">
                      <span className="text-xs font-medium uppercase tracking-wider text-cyan-300">
                        {relatedBlog.category}
                      </span>
                      <h3 className="mt-3 line-clamp-2 text-lg font-semibold text-slate-100">
                        {relatedBlog.title}
                      </h3>
                      <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-400">
                        {relatedBlog.excerpt}
                      </p>
                    </div>
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
