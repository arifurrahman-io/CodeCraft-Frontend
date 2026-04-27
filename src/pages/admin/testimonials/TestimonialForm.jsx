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

const TestimonialFormPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = !!id;
  const [formData, setFormData] = useState({
    clientName: "",
    designation: "",
    company: "",
    shortDescription: "",
    review: "",
    photo: "",
    rating: 5,
    isActive: true,
    isFeatured: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isEditing) {
      getTestimonialById(id).then((response) => {
        if (response.data) setFormData(response.data);
      });
    }
  }, [id, isEditing]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (isEditing) {
        await updateTestimonial(id, formData);
        toast.success("Testimonial updated");
      } else {
        await createTestimonial(formData);
        toast.success("Testimonial created");
      }
      navigate("/admin/testimonials");
    } catch {
      toast.error("Failed to create");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-4xl">
      <div className="flex items-center gap-4 mb-6">
        <button
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
              label="Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="John Doe"
              required
            />
            <Input
              label="Position"
              name="position"
              value={formData.position}
              onChange={handleChange}
              placeholder="CEO, Company"
              required
            />
          </div>
          <Input
            label="Company"
            name="company"
            value={formData.company}
            onChange={handleChange}
            placeholder="Company Name"
            required
          />
          <TextArea
            label="Testimonial Content"
            name="content"
            value={formData.content}
            onChange={handleChange}
            rows={5}
            placeholder="What the client said..."
          />
        </div>

        <div className="glass rounded-xl p-6 border border-slate-700/50 space-y-6">
          <h2 className="text-lg font-semibold text-slate-100">Photo</h2>
          <ImageUploader
            value={formData.image}
            onChange={(image) => setFormData({ ...formData, image })}
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
                  onClick={() => setFormData({ ...formData, rating: star })}
                  className={`p-1 ${star <= formData.rating ? "text-yellow-500" : "text-slate-600"}`}
                >
                  <Star className="w-6 h-6 fill-current" />
                </button>
              ))}
            </div>
          </div>
          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              name="isFeatured"
              checked={formData.isFeatured}
              onChange={(e) =>
                setFormData({ ...formData, isFeatured: e.target.checked })
              }
              className="w-4 h-4 rounded border-slate-700 bg-slate-800 text-cyan-500"
            />
            <span className="text-slate-300">Featured</span>
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
