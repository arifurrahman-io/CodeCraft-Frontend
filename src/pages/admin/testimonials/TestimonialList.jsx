import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import Button from "@/components/common/Button";
import DataTable from "@/components/admin/DataTable";
import StatusBadge from "@/components/admin/StatusBadge";
import {
  deleteTestimonial,
  getAllTestimonials,
} from "@/services/testimonialService";

const TestimonialListPage = () => {
  const [testimonials, setTestimonials] = useState([]);

  useEffect(() => {
    getAllTestimonials().then((response) =>
      setTestimonials(response.data || []),
    );
  }, []);

  const handleDelete = async (id) => {
    try {
      await deleteTestimonial(id);
      setTestimonials(testimonials.filter((t) => t._id !== id));
      toast.success("Testimonial deleted");
    } catch {
      toast.error("Failed to delete");
    }
  };

  const columns = [
    {
      header: "Client",
      accessor: "clientName",
      render: (row) => (
        <div className="flex items-center gap-4">
          <img
            src={row.photo}
            alt={row.clientName}
            className="w-12 h-12 rounded-full object-cover"
          />
          <div>
            <h3 className="font-medium text-slate-100">{row.clientName}</h3>
            <p className="text-sm text-slate-500">{row.company}</p>
          </div>
        </div>
      ),
    },
    { header: "Position", accessor: "designation" },
    {
      header: "Rating",
      accessor: "rating",
      render: (row) => (
        <div className="flex items-center gap-1">
          {[...Array(5)].map((_, i) => (
            <span
              key={i}
              className={i < row.rating ? "text-yellow-500" : "text-slate-600"}
            >
              ★
            </span>
          ))}
        </div>
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
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-100">Testimonials</h1>
          <p className="text-slate-400">Manage client testimonials</p>
        </div>
        <Link to="/admin/testimonials/create">
          <Button icon={Plus}>Add Testimonial</Button>
        </Link>
      </div>

      <DataTable
        columns={columns}
        data={testimonials}
        basePath="/admin/testimonials"
        viewPath={() => "/"}
        onDelete={handleDelete}
        emptyMessage="No testimonials"
      />
    </div>
  );
};

export default TestimonialListPage;
