import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Plus, Search } from "lucide-react";
import { toast } from "sonner";
import Button from "@/components/common/Button";
import Input from "@/components/common/Input";
import DataTable from "@/components/admin/DataTable";
import StatusBadge from "@/components/admin/StatusBadge";
import { deleteBlog, getAllBlogs } from "@/services/blogService";

const BlogListPage = () => {
  const [blogs, setBlogs] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    getAllBlogs().then((response) => setBlogs(response.data || []));
  }, []);

  const handleDelete = async (id) => {
    try {
      await deleteBlog(id);
      setBlogs(blogs.filter((b) => b._id !== id));
      toast.success("Blog deleted successfully");
    } catch {
      toast.error("Failed to delete blog");
    }
  };

  const filteredBlogs = blogs.filter((blog) =>
    [blog.title, blog.category, blog.author?.name]
      .join(" ")
      .toLowerCase()
      .includes(searchTerm.toLowerCase()),
  );

  const columns = [
    {
      header: "Blog",
      accessor: "title",
      render: (row) => (
        <div className="flex items-center gap-4">
          <img
            src={row.image}
            alt={row.title}
            className="w-16 h-12 rounded-lg object-cover"
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
      accessor: "author",
      render: (row) => (
        <div className="flex items-center gap-2">
          <img
            src={row.author?.image}
            alt={row.author?.name}
            className="w-6 h-6 rounded-full"
          />
          <span className="text-slate-300">{row.author?.name}</span>
        </div>
      ),
    },
    {
      header: "Views",
      accessor: "views",
    },
    {
      header: "Status",
      accessor: "status",
      render: (row) => <StatusBadge status={row.status} />,
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

      <Input
        placeholder="Search blogs..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        icon={Search}
      />

      <DataTable
        columns={columns}
        data={filteredBlogs}
        basePath="/admin/blogs"
        viewPath={(row) => `/blogs/${row.slug}`}
        onDelete={handleDelete}
        emptyMessage="No blogs found"
      />
    </div>
  );
};

export default BlogListPage;
