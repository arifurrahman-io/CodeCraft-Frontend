import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Star } from "lucide-react";
import { toast } from "sonner";

import Button from "@/components/common/Button";
import Input from "@/components/common/Input";
import TextArea from "@/components/common/TextArea";
import ImageUploader from "@/components/admin/ImageUploader";
import {
  createTestimonial,
  getTestimonialById,
  updateTestimonial,
} from "@/services/testimonialService";

const initialFormData = {
  clientName: "",
  company: "",
  designation: "",
  photo: "",
  review: "",
  rating: 5,
  isActive: true,
  order: 0,
};

const getTestimonialFromResponse = (response) =>
  response?.data?.testimonial ||
  response?.data?.data ||
  response?.data ||
  response?.testimonial ||
  response ||
  null;

const normalizeTestimonial = (data = {}) => ({
  ...initialFormData,
  ...data,
  clientName: data.clientName || data.name || "",
  company: data.company || "",
  designation: data.designation || data.position || "",
  photo: data.photo || data.image || "",
  review: data.review || data.content || data.shortDescription || "",
  rating: Number(data.rating || 5),
  isActive:
    typeof data.isActive === "boolean"
      ? data.isActive
      : data.status === "inactive"
        ? false
        : true,
  order: Number(data.order || 0),
});

const buildPayload = (formData) => ({
  clientName: formData.clientName.trim(),
  company: formData.company.trim(),
  designation: formData.designation.trim(),
  photo: formData.photo || "",
  review: formData.review.trim(),
  rating: Math.min(5, Math.max(1, Number(formData.rating || 5))),
  isActive: Boolean(formData.isActive),
  order: Number(formData.order || 0),
});

const TestimonialFormPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = Boolean(id);

  const [formData, setFormData] = useState(initialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(isEditing);

  useEffect(() => {
    let mounted = true;

    const fetchTestimonial = async () => {
      if (!isEditing) return;

      try {
        setIsLoading(true);

        const response = await getTestimonialById(id);
        const testimonial = getTestimonialFromResponse(response);

        if (mounted && testimonial) {
          setFormData(normalizeTestimonial(testimonial));
        }
      } catch (error) {
        toast.error(
          error?.response?.data?.message || "Failed to load testimonial",
        );
        navigate("/admin/testimonials");
      } finally {
        if (mounted) setIsLoading(false);
      }
    };

    fetchTestimonial();

    return () => {
      mounted = false;
    };
  }, [id, isEditing, navigate]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = buildPayload(formData);

    if (!payload.clientName || !payload.review) {
      toast.error("Client name and review are required");
      return;
    }

    setIsSubmitting(true);

    try {
      if (isEditing) {
        await updateTestimonial(id, payload);
        toast.success("Testimonial updated successfully");
      } else {
        await createTestimonial(payload);
        toast.success("Testimonial created successfully");
      }

      navigate("/admin/testimonials");
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Failed to save testimonial",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="mx-auto w-full max-w-4xl">
        <div className="glass rounded-xl p-6 border border-slate-700/50">
          <p className="text-slate-300">Loading testimonial...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-4xl">
      <div className="flex items-center gap-4 mb-6">
        <button
          type="button"
          onClick={() => navigate("/admin/testimonials")}
          className="p-2 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        <div>
          <h1 className="text-2xl font-bold text-slate-100">
            {isEditing ? "Edit Testimonial" : "Add Testimonial"}
          </h1>
          <p className="text-slate-400">
            {isEditing
              ? "Update client testimonial"
              : "Add a client testimonial"}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="glass rounded-xl p-6 border border-slate-700/50 space-y-6">
          <h2 className="text-lg font-semibold text-slate-100">
            Client Information
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            <Input
              label="Client Name"
              name="clientName"
              value={formData.clientName}
              onChange={handleChange}
              placeholder="John Doe"
              required
            />

            <Input
              label="Designation"
              name="designation"
              value={formData.designation}
              onChange={handleChange}
              placeholder="CEO"
            />
          </div>

          <Input
            label="Company"
            name="company"
            value={formData.company}
            onChange={handleChange}
            placeholder="Company Name"
          />

          <TextArea
            label="Review"
            name="review"
            value={formData.review}
            onChange={handleChange}
            rows={5}
            placeholder="What the client said..."
            required
          />
        </div>

        <div className="glass rounded-xl p-6 border border-slate-700/50 space-y-6">
          <h2 className="text-lg font-semibold text-slate-100">Photo</h2>

          <ImageUploader
            label="Client Photo"
            value={formData.photo}
            onChange={(photo) =>
              setFormData((prev) => ({
                ...prev,
                photo,
              }))
            }
          />
        </div>

        <div className="glass rounded-xl p-6 border border-slate-700/50 space-y-6">
          <h2 className="text-lg font-semibold text-slate-100">Settings</h2>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Rating
            </label>

            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() =>
                    setFormData((prev) => ({
                      ...prev,
                      rating: star,
                    }))
                  }
                  className={`p-1 ${
                    star <= Number(formData.rating)
                      ? "text-yellow-500"
                      : "text-slate-600"
                  }`}
                >
                  <Star className="w-6 h-6 fill-current" />
                </button>
              ))}
            </div>
          </div>

          <Input
            label="Order"
            name="order"
            type="number"
            value={formData.order}
            onChange={handleChange}
            placeholder="0"
          />

          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              name="isActive"
              checked={formData.isActive}
              onChange={handleChange}
              className="w-4 h-4 rounded border-slate-700 bg-slate-800 text-cyan-500"
            />
            <span className="text-slate-300">Active</span>
          </label>
        </div>

        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="ghost"
            onClick={() => navigate("/admin/testimonials")}
          >
            Cancel
          </Button>

          <Button type="submit" isLoading={isSubmitting}>
            {isEditing ? "Update Testimonial" : "Create Testimonial"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default TestimonialFormPage;
