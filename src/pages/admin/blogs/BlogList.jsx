import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Plus, Search } from "lucide-react";
import { toast } from "sonner";

import Button from "@/components/common/Button";
import Input from "@/components/common/Input";
import DataTable from "@/components/admin/DataTable";
import StatusBadge from "@/components/admin/StatusBadge";
import { deleteBlog, getAllBlogs } from "@/services/blogService";

const fallbackImage =
  "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=400&auto=format&fit=crop&q=80";

const getBlogsFromResponse = (response) => {
  if (Array.isArray(response)) return response;
  if (Array.isArray(response?.data)) return response.data;
  if (Array.isArray(response?.data?.blogs)) return response.data.blogs;
  if (Array.isArray(response?.data?.data)) return response.data.data;
  if (Array.isArray(response?.blogs)) return response.blogs;
  return [];
};

const normalizeAuthor = (author) => {
  if (!author) return "Admin";
  if (typeof author === "string") return author;
  return author.name || author.email || "Admin";
};

const normalizeBlog = (blog = {}) => ({
  ...blog,
  _id: blog._id || blog.id,
  title: blog.title || "Untitled Blog",
  slug: blog.slug || blog._id || blog.id,
  excerpt: blog.excerpt || blog.shortDescription || "",
  category: blog.category || "Uncategorized",
  coverImage: blog.coverImage || blog.image || fallbackImage,
  views: Number(blog.views || 0),
  authorName: normalizeAuthor(blog.author),
  isPublished:
    typeof blog.isPublished === "boolean"
      ? blog.isPublished
      : blog.status === "published",
  publishedAt: blog.publishedAt || null,
});

const formatDate = (date) => {
  if (!date) return "Not published";

  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const BlogListPage = () => {
  const [blogs, setBlogs] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [isLoading, setIsLoading] = useState(true);

  const fetchBlogs = useCallback(async () => {
    try {
      const response = await getAllBlogs();
      const blogData = getBlogsFromResponse(response).map(normalizeBlog);

      setBlogs(blogData);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to load blogs");
      setBlogs([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    queueMicrotask(fetchBlogs);
  }, [fetchBlogs]);

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this blog?",
    );

    if (!confirmed) return;

    try {
      await deleteBlog(id);
      setBlogs((prev) => prev.filter((blog) => blog._id !== id));
      toast.success("Blog deleted successfully");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to delete blog");
    }
  };

  const filteredBlogs = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();

    return blogs.filter((blog) => {
      const status = blog.isPublished ? "published" : "draft";

      const matchesSearch =
        !query ||
        [blog.title, blog.category, blog.authorName, blog.excerpt]
          .join(" ")
          .toLowerCase()
          .includes(query);

      const matchesStatus = filterStatus === "all" || status === filterStatus;

      return matchesSearch && matchesStatus;
    });
  }, [blogs, searchTerm, filterStatus]);

  const columns = [
    {
      header: "Blog",
      accessor: "title",
      render: (row) => (
        <div className="flex items-center gap-4">
          <img
            src={row.coverImage}
            alt={row.title}
            className="w-16 h-12 rounded-lg object-cover border border-slate-700"
            onError={(e) => {
              e.currentTarget.src = fallbackImage;
            }}
          />

          <div>
            <h3 className="font-medium text-slate-100">{row.title}</h3>
            <p className="text-sm text-slate-500">{row.category}</p>
          </div>
        </div>
      ),
    },
    {
      header: "Author",
      accessor: "authorName",
      render: (row) => <span className="text-slate-300">{row.authorName}</span>,
    },
    {
      header: "Views",
      accessor: "views",
      render: (row) => <span className="text-slate-300">{row.views}</span>,
    },
    {
      header: "Published At",
      accessor: "publishedAt",
      render: (row) => (
        <span className="text-slate-300">{formatDate(row.publishedAt)}</span>
      ),
    },
    {
      header: "Status",
      accessor: "isPublished",
      render: (row) => (
        <StatusBadge status={row.isPublished ? "published" : "draft"} />
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-100">Blogs</h1>
          <p className="text-slate-400">Manage your blog posts</p>
        </div>

        <Link to="/admin/blogs/create">
          <Button icon={Plus}>Add Blog</Button>
        </Link>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <Input
            placeholder="Search blogs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            icon={Search}
          />
        </div>

        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-100 focus:outline-none focus:ring-2 focus:ring-cyan-500"
        >
          <option value="all">All Status</option>
          <option value="published">Published</option>
          <option value="draft">Draft</option>
        </select>
      </div>

      {isLoading ? (
        <div className="glass rounded-xl p-6 border border-slate-700/50">
          <p className="text-slate-300">Loading blogs...</p>
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={filteredBlogs}
          basePath="/admin/blogs"
          viewPath={(row) => `/blogs/${row.slug}`}
          onDelete={handleDelete}
          emptyMessage="No blogs found"
        />
      )}
    </div>
  );
};

export default BlogListPage;
