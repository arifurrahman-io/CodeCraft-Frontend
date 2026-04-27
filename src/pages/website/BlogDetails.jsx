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
import Button from "@/components/common/Button";
import { getAllBlogs, getBlogBySlug } from "@/services/blogService";

const BlogDetailsPage = () => {
  const { slug } = useParams();
  const [blog, setBlog] = useState(null);
  const [blogs, setBlogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const loadBlog = async () => {
      setIsLoading(true);
      const [blogResponse, blogsResponse] = await Promise.all([
        getBlogBySlug(slug),
        getAllBlogs(),
      ]);

      setBlog(blogResponse.data);
      setBlogs(blogsResponse.data || []);
      setIsLoading(false);
    };

    loadBlog();
  }, [slug]);

  const articleUrl = typeof window !== "undefined" ? window.location.href : "";

  const readingTime = useMemo(() => {
    const words = blog?.content?.trim().split(/\s+/).filter(Boolean).length || 0;
    return Math.max(1, Math.ceil(words / 220));
  }, [blog]);

  const relatedBlogs = useMemo(
    () =>
      blogs
        .filter((item) => item._id !== blog?._id && item.status === "published")
        .sort((a, b) => Number(b.category === blog?.category) - Number(a.category === blog?.category))
        .slice(0, 3),
    [blogs, blog],
  );

  const handleCopyLink = async () => {
    if (!articleUrl) return;

    await navigator.clipboard.writeText(articleUrl);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  };

  const openShareWindow = (url) => {
    window.open(url, "_blank", "noopener,noreferrer,width=720,height=560");
  };

  const shareItems = [
    {
      name: "Facebook",
      icon: MessageCircle,
      action: () =>
        openShareWindow(
          `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(articleUrl)}`,
        ),
    },
    {
      name: "X",
      icon: Send,
      action: () =>
        openShareWindow(
          `https://twitter.com/intent/tweet?url=${encodeURIComponent(articleUrl)}&text=${encodeURIComponent(blog?.title || "")}`,
        ),
    },
    {
      name: "LinkedIn",
      icon: Briefcase,
      action: () =>
        openShareWindow(
          `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(articleUrl)}`,
        ),
    },
    {
      name: "Email",
      icon: Mail,
      action: () => {
        window.location.href = `mailto:?subject=${encodeURIComponent(blog?.title || "")}&body=${encodeURIComponent(articleUrl)}`;
      },
    },
  ];

  const renderContent = (content) => {
    const lines = content.split("\n");

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

  if (!isLoading && !blog) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950">
        <div className="text-center">
          <h1 className="mb-4 text-4xl font-bold text-slate-100">
            Blog Not Found
          </h1>
          <Link to="/blogs">
            <Button variant="outline">Back to Blogs</Button>
          </Link>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return <div className="min-h-screen bg-slate-950" />;
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
                  {blog.category}
                </span>
                <span className="rounded-full border border-slate-700 bg-slate-900/70 px-3 py-1 text-sm text-slate-300">
                  {readingTime} min read
                </span>
              </div>

              <h1 className="max-w-4xl text-4xl font-bold leading-tight text-slate-100 md:text-6xl">
                {blog.title}
              </h1>

              <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
                {blog.shortDescription}
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-5 text-sm text-slate-400">
                <div className="flex items-center gap-3">
                  <img
                    src={blog.author?.image}
                    alt={blog.author?.name}
                    className="h-11 w-11 rounded-full border border-slate-700 object-cover"
                  />
                  <div>
                    <p className="font-medium text-slate-100">
                      {blog.author?.name || "CodeCraft.BD Team"}
                    </p>
                    <p className="text-slate-500">Author</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-cyan-400" />
                  <span>{blog.createdAt}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Eye className="h-4 w-4 text-cyan-400" />
                  <span>{blog.views || 0} views</span>
                </div>
              </div>

              <div className="mt-8 flex flex-wrap items-center gap-3 lg:hidden">
                {shareItems.map((item) => (
                  <button
                    key={item.name}
                    type="button"
                    onClick={item.action}
                    className="inline-flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-900/80 px-3 py-2 text-sm text-slate-300 transition-colors hover:border-cyan-500/40 hover:text-cyan-300"
                  >
                    <item.icon className="h-4 w-4" />
                    {item.name}
                  </button>
                ))}
                <button
                  type="button"
                  onClick={handleCopyLink}
                  className="inline-flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-900/80 px-3 py-2 text-sm text-slate-300 transition-colors hover:border-cyan-500/40 hover:text-cyan-300"
                >
                  {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  {copied ? "Copied" : "Copy"}
                </button>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.45, delay: 0.1 }}
              className="overflow-hidden rounded-3xl border border-slate-700/60 bg-slate-800/40 shadow-2xl shadow-cyan-950/30"
            >
              <img
                src={blog.image}
                alt={blog.title}
                className="h-72 w-full object-cover md:h-[28rem]"
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
                {copied ? <Check className="h-5 w-5" /> : <Copy className="h-5 w-5" />}
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
                  Practical thinking from CodeCraft.BD on building better digital products.
                </p>
              </div>

              <div className="pt-8">{renderContent(blog.content || "")}</div>

              <div className="mt-10 border-t border-slate-800 pt-8">
                <div className="mb-4 flex items-center gap-2 text-sm font-medium text-slate-300">
                  <Tag className="h-4 w-4 text-cyan-400" />
                  Topics
                </div>
                <div className="flex flex-wrap gap-2">
                  {blog.tags?.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full border border-slate-700 bg-slate-800 px-3 py-1 text-sm text-slate-300"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </article>

          <aside className="hidden xl:block">
            <div className="sticky top-28 rounded-3xl border border-slate-800 bg-slate-900/60 p-6">
              <p className="text-sm font-semibold uppercase tracking-wider text-cyan-300">
                Share this insight
              </p>
              <p className="mt-3 text-sm leading-6 text-slate-400">
                Send this article to your team or save it for your next product planning session.
              </p>
              <button
                type="button"
                onClick={handleCopyLink}
                className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-cyan-500 px-4 py-3 text-sm font-semibold text-slate-950 transition-colors hover:bg-cyan-400"
              >
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                {copied ? "Link copied" : "Copy article link"}
              </button>
            </div>
          </aside>
        </div>
      </section>

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
                key={relatedBlog._id}
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
                    src={relatedBlog.image}
                    alt={relatedBlog.title}
                    className="h-44 w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="p-5">
                    <span className="text-xs font-medium uppercase tracking-wider text-cyan-300">
                      {relatedBlog.category}
                    </span>
                    <h3 className="mt-3 line-clamp-2 text-lg font-semibold text-slate-100">
                      {relatedBlog.title}
                    </h3>
                    <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-400">
                      {relatedBlog.shortDescription}
                    </p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default BlogDetailsPage;
