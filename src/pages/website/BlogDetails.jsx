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
            className="mt-12 mb-5 text-3xl font-bold leading-tight tracking-tight text-slate-100"
          >
            {block.replace(/^##\s+/, "")}
          </h2>
        );
      }

      if (block.startsWith("### ")) {
        return (
          <h3
            key={index}
            className="mt-8 mb-4 text-xl font-semibold leading-snug text-cyan-100"
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
                className="list-disc text-lg leading-8 text-slate-300 marker:text-cyan-400"
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
          className="mb-7 whitespace-pre-line text-lg leading-9 text-slate-300"
        >
          {block}
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
    <div className="min-h-screen bg-slate-950">
      <SEO
        title={normalizedBlog.seoTitle || normalizedBlog.title}
        description={normalizedBlog.seoDescription || normalizedBlog.excerpt}
        keywords={normalizedBlog.tags.join(", ")}
        image={normalizedBlog.coverImage}
        path={`/blogs/${normalizedBlog.slug}`}
        type="article"
        structuredData={articleSchema}
      />

      <section className="relative overflow-hidden bg-slate-950 pt-28 pb-14 md:pt-32 md:pb-16">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_12%_8%,rgba(6,182,212,0.22),transparent_30%),radial-gradient(circle_at_86%_16%,rgba(59,130,246,0.14),transparent_28%),linear-gradient(135deg,rgba(15,23,42,0.88),rgba(2,6,23,0.98))]" />
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-400/40 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-slate-700/80 to-transparent" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Link
            to="/blogs"
            className="mb-8 inline-flex items-center gap-2 rounded-full border border-slate-800 bg-slate-900/70 px-4 py-2 text-sm font-medium text-slate-300 transition-colors hover:border-cyan-500/40 hover:text-cyan-300"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Blogs
          </Link>

          <div className="grid gap-10 lg:grid-cols-[0.94fr_1.06fr] lg:items-center xl:gap-14">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45 }}
            >
              <div className="mb-5 flex flex-wrap items-center gap-2.5">
                <span className="rounded-full border border-cyan-500/30 bg-cyan-500/15 px-3 py-1 text-xs font-semibold text-cyan-200">
                  {normalizedBlog.category}
                </span>
                <span className="rounded-full border border-slate-700/80 bg-slate-900/70 px-3 py-1 text-xs text-slate-300">
                  {readingTime} min read
                </span>
              </div>

              <h1 className="max-w-3xl text-3xl font-bold leading-[1.15] text-slate-50 sm:text-4xl lg:text-5xl">
                {normalizedBlog.title}
              </h1>

              <p className="mt-5 max-w-2xl text-base leading-8 text-slate-300 md:text-lg">
                {normalizedBlog.excerpt}
              </p>

              <div className="mt-7 flex flex-wrap items-center gap-3 text-sm text-slate-400">
                <div className="rounded-2xl border border-slate-800 bg-slate-900/65 px-4 py-3">
                  <p className="text-sm font-semibold text-slate-100">
                    {normalizedBlog.authorName}
                  </p>
                  <p className="text-slate-500">Author</p>
                </div>

                <div className="flex min-h-12 items-center gap-2 rounded-2xl border border-slate-800 bg-slate-900/65 px-4 py-3">
                  <Calendar className="h-4 w-4 text-cyan-400" />
                  <span>{formatDate(normalizedBlog.publishedAt)}</span>
                </div>

                <div className="flex min-h-12 items-center gap-2 rounded-2xl border border-slate-800 bg-slate-900/65 px-4 py-3">
                  <Eye className="h-4 w-4 text-cyan-400" />
                  <span>{normalizedBlog.views} views</span>
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
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.45, delay: 0.1 }}
              className="relative overflow-hidden rounded-3xl border border-slate-700/60 bg-slate-900/70 p-2 shadow-2xl shadow-cyan-950/30"
            >
              <div className="absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-cyan-300/70 to-transparent" />
              <img
                src={normalizedBlog.coverImage}
                alt={normalizedBlog.title}
                className="h-72 w-full rounded-2xl object-cover md:h-[26rem] lg:h-[29rem]"
                onError={(e) => {
                  e.currentTarget.src = fallbackImage;
                }}
              />
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <article className="w-full">
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
