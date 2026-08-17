import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Plus, Search } from "lucide-react";
import { toast } from "sonner";

import Button from "@/components/common/Button";
import Input from "@/components/common/Input";
import Loader from "@/components/common/Loader";
import DataTable from "@/components/admin/DataTable";
import StatusBadge from "@/components/admin/StatusBadge";
import {
  deleteTestimonial,
  getAllTestimonials,
} from "@/services/testimonialService";

const fallbackPhoto =
  "https://ui-avatars.com/api/?name=Client&background=0a1628&color=0d9488";

const getTestimonialsFromResponse = (response) => {
  if (Array.isArray(response)) return response;
  if (Array.isArray(response?.data)) return response.data;
  if (Array.isArray(response?.data?.testimonials)) {
    return response.data.testimonials;
  }
  if (Array.isArray(response?.data?.data)) return response.data.data;
  if (Array.isArray(response?.testimonials)) return response.testimonials;
  return [];
};

const normalizeTestimonial = (testimonial = {}) => ({
  ...testimonial,
  _id: testimonial._id || testimonial.id,
  clientName: testimonial.clientName || testimonial.name || "Unknown Client",
  company: testimonial.company || "",
  designation: testimonial.designation || testimonial.position || "",
  photo: testimonial.photo || testimonial.image || fallbackPhoto,
  review: testimonial.review || testimonial.content || "",
  rating: Math.min(5, Math.max(1, Number(testimonial.rating || 5))),
  order: Number(testimonial.order || 0),
  isActive:
    typeof testimonial.isActive === "boolean"
      ? testimonial.isActive
      : testimonial.status === "inactive"
        ? false
        : true,
});

const TestimonialListPage = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [isLoading, setIsLoading] = useState(true);

  const fetchTestimonials = useCallback(async () => {
    try {
      const response = await getAllTestimonials();
      const data = getTestimonialsFromResponse(response)
        .map(normalizeTestimonial)
        .sort((a, b) => a.order - b.order);

      setTestimonials(data);
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Failed to load testimonials",
      );
      setTestimonials([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      fetchTestimonials();
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [fetchTestimonials]);

  const handleDelete = async (id) => {
    try {
      await deleteTestimonial(id);
      setTestimonials((prev) =>
        prev.filter((testimonial) => testimonial._id !== id),
      );
      toast.success("Testimonial deleted successfully");
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Failed to delete testimonial",
      );
      throw error;
    }
  };

  const filteredTestimonials = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();

    return testimonials.filter((testimonial) => {
      const status = testimonial.isActive ? "active" : "inactive";

      const matchesSearch =
        !query ||
        [
          testimonial.clientName,
          testimonial.company,
          testimonial.designation,
          testimonial.review,
        ]
          .join(" ")
          .toLowerCase()
          .includes(query);

      const matchesStatus = filterStatus === "all" || status === filterStatus;

      return matchesSearch && matchesStatus;
    });
  }, [testimonials, searchTerm, filterStatus]);

  const columns = [
    {
      header: "Client",
      accessor: "clientName",
      render: (row) => (
        <div className="flex items-center gap-4">
          <img
            src={row.photo}
            alt={row.clientName}
            className="w-12 h-12 rounded-full object-cover border border-border"
            onError={(e) => {
              e.currentTarget.src = fallbackPhoto;
            }}
          />

          <div>
            <h3 className="font-medium text-ink">{row.clientName}</h3>
            <p className="text-sm text-ink-muted">
              {row.company || "No company"}
            </p>
          </div>
        </div>
      ),
    },
    {
      header: "Designation",
      accessor: "designation",
      render: (row) => (
        <span className="text-ink">
          {row.designation || "Not specified"}
        </span>
      ),
    },
    {
      header: "Rating",
      accessor: "rating",
      render: (row) => (
        <div className="flex items-center gap-1">
          {[...Array(5)].map((_, i) => (
            <span
              key={i}
              className={i < row.rating ? "text-yellow-500" : "text-ink-subtle"}
            >
              ★
            </span>
          ))}
        </div>
      ),
    },
    {
      header: "Order",
      accessor: "order",
      render: (row) => <span className="text-ink">{row.order}</span>,
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
          <h1 className="text-2xl font-bold text-ink">Testimonials</h1>
          <p className="text-ink-muted">Manage client testimonials</p>
        </div>

        <Link to="/admin/testimonials/create">
          <Button icon={Plus}>Add Testimonial</Button>
        </Link>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <Input
            placeholder="Search testimonials..."
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
          <Loader text="Loading testimonials..." />
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={filteredTestimonials}
          basePath="/admin/testimonials"
          viewPath={() => "/"}
          onDelete={handleDelete}
          deleteTitle="Delete testimonial"
          deleteMessage="Are you sure you want to delete this testimonial? This action cannot be undone."
          emptyMessage="No testimonials"
        />
      )}
    </div>
  );
};

export default TestimonialListPage;
