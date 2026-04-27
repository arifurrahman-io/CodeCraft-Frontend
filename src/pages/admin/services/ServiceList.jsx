import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Plus, Search } from "lucide-react";
import { toast } from "sonner";
import Button from "@/components/common/Button";
import Input from "@/components/common/Input";
import DataTable from "@/components/admin/DataTable";
import StatusBadge from "@/components/admin/StatusBadge";
import { deleteService, getAllServices } from "@/services/serviceService";

const ServiceListPage = () => {
  const [services, setServices] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  useEffect(() => {
    getAllServices().then((response) => setServices(response.data || []));
  }, []);

  const handleDelete = async (id) => {
    try {
      await deleteService(id);
      setServices(services.filter((s) => s._id !== id));
      toast.success("Service deleted successfully");
    } catch {
      toast.error("Failed to delete service");
    }
  };

  const filteredServices = services.filter((service) => {
    const matchesSearch =
      service.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      filterStatus === "all" || service.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const columns = [
    {
      header: "Service",
      accessor: "title",
      render: (row) => (
        <div>
          <h3 className="font-medium text-slate-100">{row.title}</h3>
          <p className="text-sm text-slate-500">{row.category}</p>
        </div>
      ),
    },
    {
      header: "Price",
      accessor: "price",
      render: (row) => (
        <span className="text-cyan-500 font-medium">{row.price}</span>
      ),
    },
    {
      header: "Duration",
      accessor: "duration",
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
    {
      header: "Status",
      accessor: "status",
      render: (row) => <StatusBadge status={row.status} />,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-100">Services</h1>
          <p className="text-slate-400">Manage your service offerings</p>
        </div>
        <Link to="/admin/services/create">
          <Button icon={Plus}>Add Service</Button>
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <Input
            placeholder="Search services..."
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
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>

      {/* Table */}
      <DataTable
        columns={columns}
        data={filteredServices}
        basePath="/admin/services"
        viewPath={(row) => `/services/${row.slug}`}
        onDelete={handleDelete}
        emptyMessage="No services found"
      />
    </div>
  );
};

export default ServiceListPage;
