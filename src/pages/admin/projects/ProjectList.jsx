import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Plus, Search } from "lucide-react";
import { toast } from "sonner";

import Button from "@/components/common/Button";
import Input from "@/components/common/Input";
import Loader from "@/components/common/Loader";
import DataTable from "@/components/admin/DataTable";
import StatusBadge from "@/components/admin/StatusBadge";
import { deleteProject, getAllProjects } from "@/services/projectService";

const fallbackImage =
  "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400&auto=format&fit=crop&q=80";

const getProjectsFromResponse = (response) => {
  if (Array.isArray(response)) return response;
  if (Array.isArray(response?.data)) return response.data;
  if (Array.isArray(response?.data?.projects)) return response.data.projects;
  if (Array.isArray(response?.data?.data)) return response.data.data;
  if (Array.isArray(response?.projects)) return response.projects;
  return [];
};

const normalizeProject = (project = {}) => ({
  ...project,
  _id: project._id || project.id,
  title: project.title || "Untitled Project",
  slug: project.slug || project._id || project.id,
  category: project.category || "Uncategorized",
  clientName: project.clientName || project.client || "",
  shortDescription: project.shortDescription || "",
  coverImage:
    project.coverImage || project.image || project.thumbnail || fallbackImage,
  isFeatured: Boolean(project.isFeatured),
  isActive:
    typeof project.isActive === "boolean"
      ? project.isActive
      : project.status === "inactive"
        ? false
        : true,
  completedAt: project.completedAt || null,
});

const formatDate = (date) => {
  if (!date) return "Not set";

  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const ProjectListPage = () => {
  const [projects, setProjects] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [isLoading, setIsLoading] = useState(true);

  const fetchProjects = useCallback(async () => {
    try {
      const response = await getAllProjects();
      const projectsData =
        getProjectsFromResponse(response).map(normalizeProject);

      setProjects(projectsData);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to load projects");
      setProjects([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    queueMicrotask(fetchProjects);
  }, [fetchProjects]);

  const handleDelete = async (id) => {
    try {
      await deleteProject(id);
      setProjects((prev) => prev.filter((project) => project._id !== id));
      toast.success("Project deleted successfully");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to delete project");
      throw error;
    }
  };

  const filteredProjects = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();

    return projects.filter((project) => {
      const status = project.isActive ? "active" : "inactive";

      const matchesSearch =
        !query ||
        [
          project.title,
          project.clientName,
          project.category,
          project.shortDescription,
        ]
          .join(" ")
          .toLowerCase()
          .includes(query);

      const matchesStatus = filterStatus === "all" || status === filterStatus;

      return matchesSearch && matchesStatus;
    });
  }, [projects, searchTerm, filterStatus]);

  const columns = [
    {
      header: "Project",
      accessor: "title",
      render: (row) => (
        <div className="flex items-center gap-4">
          <img
            src={row.coverImage}
            alt={row.title}
            className="w-16 h-12 rounded-lg object-cover border border-border"
            onError={(e) => {
              e.currentTarget.src = fallbackImage;
            }}
          />

          <div>
            <h3 className="font-medium text-ink">{row.title}</h3>
            <p className="text-sm text-ink-muted">
              {row.clientName || "No client name"}
            </p>
          </div>
        </div>
      ),
    },
    {
      header: "Category",
      accessor: "category",
      render: (row) => <span className="text-ink">{row.category}</span>,
    },
    {
      header: "Completed",
      accessor: "completedAt",
      render: (row) => (
        <span className="text-ink">{formatDate(row.completedAt)}</span>
      ),
    },
    {
      header: "Status",
      accessor: "isActive",
      render: (row) => (
        <StatusBadge status={row.isActive ? "active" : "inactive"} dot />
      ),
    },
    {
      header: "Featured",
      accessor: "isFeatured",
      render: (row) => (
        <span
          className={`px-2 py-1 rounded-full text-xs ${
            row.isFeatured
              ? "bg-accent-soft text-accent"
              : "bg-canvas text-ink-muted"
          }`}
        >
          {row.isFeatured ? "Yes" : "No"}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-ink">Projects</h1>
          <p className="text-ink-muted">Manage your project portfolio</p>
        </div>

        <Link to="/admin/projects/create">
          <Button icon={Plus}>Add Project</Button>
        </Link>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <Input
            placeholder="Search projects..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            icon={Search}
          />
        </div>

        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-4 py-2.5 bg-surface border border-border rounded-lg text-ink focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent"
        >
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>

      {isLoading ? (
        <div className="bg-surface rounded-xl p-12 border border-border">
          <Loader text="Loading projects..." />
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={filteredProjects}
          basePath="/admin/projects"
          viewPath={(row) => `/projects/${row.slug}`}
          onDelete={handleDelete}
          deleteTitle="Delete project"
          deleteMessage="Are you sure you want to delete this project? This action cannot be undone."
          emptyMessage="No projects found"
        />
      )}
    </div>
  );
};

export default ProjectListPage;
