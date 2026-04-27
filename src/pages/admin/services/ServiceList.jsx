import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Plus, Search } from "lucide-react";
import { toast } from "sonner";

import Button from "@/components/common/Button";
import Input from "@/components/common/Input";
import DataTable from "@/components/admin/DataTable";
import StatusBadge from "@/components/admin/StatusBadge";
import { deleteService, getAllServices } from "@/services/serviceService";

const getServicesFromResponse = (response) => {
  if (Array.isArray(response)) return response;
  if (Array.isArray(response?.data)) return response.data;
  if (Array.isArray(response?.data?.services)) return response.data.services;
  if (Array.isArray(response?.data?.data)) return response.data.data;
  if (Array.isArray(response?.services)) return response.services;
  return [];
};

const normalizeService = (service = {}) => ({
  ...service,
  _id: service._id || service.id,
  title: service.title || "Untitled Service",
  slug: service.slug || service._id || service.id,
  shortDescription: service.shortDescription || "",
  priceRange: service.priceRange || "N/A",
  order: Number(service.order || 0),
  isFeatured: Boolean(service.isFeatured),
  isActive:
    typeof service.isActive === "boolean"
      ? service.isActive
      : service.status === "inactive"
        ? false
        : true,
});

const ServiceListPage = () => {
  const [services, setServices] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [isLoading, setIsLoading] = useState(true);

  const fetchServices = useCallback(async () => {
    try {
      const response = await getAllServices();
      const servicesData = getServicesFromResponse(response)
        .map(normalizeService)
        .sort((a, b) => a.order - b.order);

      setServices(servicesData);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to load services");
      setServices([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    queueMicrotask(fetchServices);
  }, [fetchServices]);

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this service?",
    );

    if (!confirmed) return;

    try {
      await deleteService(id);

      setServices((prev) => prev.filter((service) => service._id !== id));
      toast.success("Service deleted successfully");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to delete service");
    }
  };

  const filteredServices = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();

    return services.filter((service) => {
      const status = service.isActive ? "active" : "inactive";

      const matchesSearch =
        !query ||
        service.title.toLowerCase().includes(query) ||
        service.shortDescription.toLowerCase().includes(query) ||
        service.priceRange.toLowerCase().includes(query);

      const matchesStatus = filterStatus === "all" || status === filterStatus;

      return matchesSearch && matchesStatus;
    });
  }, [services, searchTerm, filterStatus]);

  const columns = [
    {
      header: "Service",
      accessor: "title",
      render: (row) => (
        <div>
          <h3 className="font-medium text-slate-100">{row.title}</h3>
          <p className="text-sm text-slate-500 line-clamp-1">
            {row.shortDescription || "No short description"}
          </p>
        </div>
      ),
    },
    {
      header: "Price Range",
      accessor: "priceRange",
      render: (row) => (
        <span className="text-cyan-500 font-medium">{row.priceRange}</span>
      ),
    },
    {
      header: "Order",
      accessor: "order",
      render: (row) => <span className="text-slate-300">{row.order}</span>,
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
      accessor: "isActive",
      render: (row) => (
        <StatusBadge status={row.isActive ? "active" : "inactive"} />
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-100">Services</h1>
          <p className="text-slate-400">Manage your service offerings</p>
        </div>

        <Link to="/admin/services/create">
          <Button icon={Plus}>Add Service</Button>
        </Link>
      </div>

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

      {isLoading ? (
        <div className="glass rounded-xl p-6 border border-slate-700/50">
          <p className="text-slate-300">Loading services...</p>
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={filteredServices}
          basePath="/admin/services"
          viewPath={(row) => `/services/${row.slug}`}
          onDelete={handleDelete}
          emptyMessage="No services found"
        />
      )}
    </div>
  );
};

export default ServiceListPage;
