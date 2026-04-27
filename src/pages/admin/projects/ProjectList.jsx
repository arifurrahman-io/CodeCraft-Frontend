import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Plus, Search } from "lucide-react";
import { toast } from "sonner";
import Button from "@/components/common/Button";
import Input from "@/components/common/Input";
import DataTable from "@/components/admin/DataTable";
import StatusBadge from "@/components/admin/StatusBadge";
import { deleteProject, getAllProjects } from "@/services/projectService";

const ProjectListPage = () => {
  const [projects, setProjects] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    getAllProjects().then((response) => setProjects(response.data || []));
  }, []);

  const handleDelete = async (id) => {
    try {
      await deleteProject(id);
      setProjects(projects.filter((p) => p._id !== id));
      toast.success("Project deleted successfully");
    } catch {
      toast.error("Failed to delete project");
    }
  };

  const filteredProjects = projects.filter((project) =>
    [project.title, project.client, project.category]
      .join(" ")
      .toLowerCase()
      .includes(searchTerm.toLowerCase()),
  );

  const columns = [
    {
      header: "Project",
      accessor: "title",
      render: (row) => (
        <div className="flex items-center gap-4">
          <img
            src={row.thumbnail}
            alt={row.title}
            className="w-16 h-12 rounded-lg object-cover"
          />
          <div>
            <h3 className="font-medium text-slate-100">{row.title}</h3>
            <p className="text-sm text-slate-500">{row.client}</p>
          </div>
        </div>
      ),
    },
    {
      header: "Category",
      accessor: "category",
    },
    {
      header: "Status",
      accessor: "status",
      render: (row) => <StatusBadge status={row.status} dot />,
    },
    {
      header: "Featured",
      accessor: "isFeatured",
      render: (row) => (
        <span
          className={`px-2 py-1 rounded-full text-xs ${
            row.isFeatured
              ? "bg-cyan-500/20 text-cyan-500"
              : "bg-slate-700 text-slate-400"
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
          <h1 className="text-2xl font-bold text-slate-100">Projects</h1>
          <p className="text-slate-400">Manage your project portfolio</p>
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
      </div>

      <DataTable
        columns={columns}
        data={filteredProjects}
        basePath="/admin/projects"
        viewPath={(row) => `/projects/${row.slug}`}
        onDelete={handleDelete}
        emptyMessage="No projects found"
      />
    </div>
  );
};

export default ProjectListPage;
