import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import Button from "@/components/common/Button";
import Input from "@/components/common/Input";
import TextArea from "@/components/common/TextArea";
import ImageUploader from "@/components/admin/ImageUploader";
import {
  createService,
  getServiceById,
  updateService,
} from "@/services/serviceService";

const iconOptions = [
  "Globe",
  "Smartphone",
  "Palette",
  "Cloud",
  "ShoppingCart",
  "Code",
];
const categoryOptions = [
  "Web Development",
  "Mobile App Development",
  "UI/UX Design",
  "SaaS Development",
  "E-commerce Solutions",
  "API Development",
];

const ServiceFormPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = !!id;

  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    shortDescription: "",
    description: "",
    icon: "Globe",
    features: [],
    priceRange: "",
    category: "Web Development",
    isFeatured: false,
    isActive: true,
    image: "",
  });
  const [featureInput, setFeatureInput] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isEditing) {
      getServiceById(id).then((response) => {
        if (response.data) setFormData(response.data);
      });
    }
  }, [id, isEditing]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });

    // Auto-generate slug from title
    if (name === "title") {
      const slug = value
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");
      setFormData((prev) => ({ ...prev, slug }));
    }
  };

  const handleAddFeature = () => {
    if (featureInput.trim()) {
      setFormData({
        ...formData,
        features: [...formData.features, featureInput.trim()],
      });
      setFeatureInput("");
    }
  };

  const handleRemoveFeature = (index) => {
    setFormData({
      ...formData,
      features: formData.features.filter((_, i) => i !== index),
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (isEditing) {
        await updateService(id, formData);
        toast.success("Service updated successfully");
      } else {
        await createService(formData);
        toast.success("Service created successfully");
      }
      navigate("/admin/services");
    } catch {
      toast.error("Failed to save service");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-4xl">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => navigate("/admin/services")}
          className="p-2 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-slate-100">
            {isEditing ? "Edit Service" : "Create Service"}
          </h1>
          <p className="text-slate-400">
            {isEditing
              ? "Update service information"
              : "Add a new service to your portfolio"}
          </p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="glass rounded-xl p-6 border border-slate-700/50 space-y-6">
          <h2 className="text-lg font-semibold text-slate-100">
            Basic Information
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            <Input
              label="Service Title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Web Application Development"
              required
            />
            <Input
              label="Slug"
              name="slug"
              value={formData.slug}
              onChange={handleChange}
              placeholder="web-application-development"
              required
            />
          </div>

          <TextArea
            label="Short Description"
            name="shortDescription"
            value={formData.shortDescription}
            onChange={handleChange}
            placeholder="A brief description of the service..."
            rows={3}
            required
          />

          <TextArea
            label="Full Description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Detailed description of the service..."
            rows={5}
            required
          />

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Category
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-slate-100 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              >
                {categoryOptions.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Icon
              </label>
              <select
                name="icon"
                value={formData.icon}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-slate-100 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              >
                {iconOptions.map((icon) => (
                  <option key={icon} value={icon}>
                    {icon}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="glass rounded-xl p-6 border border-slate-700/50 space-y-6">
          <h2 className="text-lg font-semibold text-slate-100">
            Pricing & Duration
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            <Input
              label="Price"
              name="price"
              value={formData.price}
              onChange={handleChange}
              placeholder="From $2,000"
            />
            <Input
              label="Duration"
              name="duration"
              value={formData.duration}
              onChange={handleChange}
              placeholder="4-8 weeks"
            />
          </div>
        </div>

        <div className="glass rounded-xl p-6 border border-slate-700/50 space-y-6">
          <h2 className="text-lg font-semibold text-slate-100">Features</h2>

          <div className="flex gap-3">
            <Input
              placeholder="Add a feature..."
              value={featureInput}
              onChange={(e) => setFeatureInput(e.target.value)}
              onKeyPress={(e) =>
                e.key === "Enter" && (e.preventDefault(), handleAddFeature())
              }
            />
            <Button
              type="button"
              variant="secondary"
              onClick={handleAddFeature}
            >
              Add
            </Button>
          </div>

          <div className="flex flex-wrap gap-2">
            {formData.features.map((feature, index) => (
              <span
                key={index}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300"
              >
                {feature}
                <button
                  type="button"
                  onClick={() => handleRemoveFeature(index)}
                  className="text-slate-500 hover:text-red-500"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>

        <div className="glass rounded-xl p-6 border border-slate-700/50 space-y-6">
          <h2 className="text-lg font-semibold text-slate-100">Image</h2>

          <ImageUploader
            label="Service Image"
            value={formData.image}
            onChange={(image) => setFormData({ ...formData, image })}
          />
        </div>

        <div className="glass rounded-xl p-6 border border-slate-700/50 space-y-6">
          <h2 className="text-lg font-semibold text-slate-100">Settings</h2>

          <div className="flex flex-col gap-4">
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                name="isFeatured"
                checked={formData.isFeatured}
                onChange={handleChange}
                className="w-4 h-4 rounded border-slate-700 bg-slate-800 text-cyan-500 focus:ring-cyan-500"
              />
              <span className="text-slate-300">Featured Service</span>
            </label>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Status
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-slate-100 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="ghost"
            onClick={() => navigate("/admin/services")}
          >
            Cancel
          </Button>
          <Button type="submit" isLoading={isSubmitting}>
            {isEditing ? "Update Service" : "Create Service"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ServiceFormPage;
