import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";

import Button from "@/components/common/Button";
import Input from "@/components/common/Input";
import Loader from "@/components/common/Loader";
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

const initialFormData = {
  title: "",
  slug: "",
  shortDescription: "",
  description: "",
  icon: "Globe",
  image: "",
  features: [],
  technologies: [],
  priceRange: "",
  isFeatured: false,
  isActive: true,
  order: 0,
  seoTitle: "",
  seoDescription: "",
};

const ensureArray = (value) => {
  if (Array.isArray(value)) return value;
  if (!value) return [];

  return String(value)
    .split(/\n|,/)
    .map((item) => item.trim())
    .filter(Boolean);
};

const generateSlug = (value) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

const getServiceFromResponse = (response) =>
  response?.data?.service ||
  response?.data?.data ||
  response?.data ||
  response?.service ||
  response ||
  null;

const normalizeServiceData = (data = {}) => ({
  ...initialFormData,
  ...data,
  features: ensureArray(data.features),
  technologies: ensureArray(data.technologies),
  priceRange: data.priceRange || "",
  isFeatured: Boolean(data.isFeatured),
  isActive:
    typeof data.isActive === "boolean"
      ? data.isActive
      : data.status === "inactive"
        ? false
        : true,
  order: Number(data.order || 0),
  seoTitle: data.seoTitle || "",
  seoDescription: data.seoDescription || "",
  image: data.image || "",
});

const buildPayload = (formData) => ({
  title: formData.title.trim(),
  slug: formData.slug.trim() || generateSlug(formData.title),
  shortDescription: formData.shortDescription.trim(),
  description: formData.description.trim(),
  icon: formData.icon || "",
  image: formData.image || "",
  features: ensureArray(formData.features),
  technologies: ensureArray(formData.technologies),
  priceRange: formData.priceRange.trim(),
  isFeatured: Boolean(formData.isFeatured),
  isActive: Boolean(formData.isActive),
  order: Number(formData.order || 0),
  seoTitle: formData.seoTitle.trim(),
  seoDescription: formData.seoDescription.trim(),
});

const ServiceFormPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = Boolean(id);

  const [formData, setFormData] = useState(initialFormData);
  const [featureInput, setFeatureInput] = useState("");
  const [technologyInput, setTechnologyInput] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(isEditing);

  useEffect(() => {
    let isMounted = true;

    const fetchService = async () => {
      if (!isEditing) return;

      try {
        setIsLoading(true);
        const response = await getServiceById(id);
        const service = getServiceFromResponse(response);

        if (isMounted && service) {
          setFormData(normalizeServiceData(service));
        }
      } catch (error) {
        toast.error(
          error?.response?.data?.message || "Failed to load service details",
        );
        navigate("/admin/services");
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    fetchService();

    return () => {
      isMounted = false;
    };
  }, [id, isEditing, navigate]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => {
      const nextData = {
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      };

      if (name === "title") {
        nextData.slug = generateSlug(value);
      }

      return nextData;
    });
  };

  const handleStatusChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      isActive: e.target.value === "active",
    }));
  };

  const handleAddFeature = () => {
    const value = featureInput.trim();
    if (!value) return;

    setFormData((prev) => ({
      ...prev,
      features: [...ensureArray(prev.features), value],
    }));

    setFeatureInput("");
  };

  const handleRemoveFeature = (index) => {
    setFormData((prev) => ({
      ...prev,
      features: ensureArray(prev.features).filter((_, i) => i !== index),
    }));
  };

  const handleAddTechnology = () => {
    const value = technologyInput.trim();
    if (!value) return;

    setFormData((prev) => ({
      ...prev,
      technologies: [...ensureArray(prev.technologies), value],
    }));

    setTechnologyInput("");
  };

  const handleRemoveTechnology = (index) => {
    setFormData((prev) => ({
      ...prev,
      technologies: ensureArray(prev.technologies).filter(
        (_, i) => i !== index,
      ),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = buildPayload(formData);

    if (
      !payload.title ||
      !payload.slug ||
      !payload.shortDescription ||
      !payload.description
    ) {
      toast.error("Please fill all required fields");
      return;
    }

    setIsSubmitting(true);

    try {
      if (isEditing) {
        await updateService(id, payload);
        toast.success("Service updated successfully");
      } else {
        await createService(payload);
        toast.success("Service created successfully");
      }

      navigate("/admin/services");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to save service");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="mx-auto w-full max-w-4xl">
        <div className="bg-surface rounded-xl p-12 border border-border">
          <Loader text="Loading service..." />
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-4xl">
      <div className="flex items-center gap-4 mb-6">
        <button
          type="button"
          onClick={() => navigate("/admin/services")}
          className="p-2 rounded-lg text-ink-muted hover:text-ink hover:bg-ink/5 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        <div>
          <h1 className="text-2xl font-bold text-ink">
            {isEditing ? "Edit Service" : "Create Service"}
          </h1>
          <p className="text-ink-muted">
            {isEditing
              ? "Update service information"
              : "Add a new service to your portfolio"}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-surface rounded-xl p-6 border border-border space-y-6">
          <h2 className="text-lg font-semibold text-ink">
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
              <label className="block text-sm font-medium text-ink mb-2">
                Icon
              </label>
              <select
                name="icon"
                value={formData.icon}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-surface border border-border rounded-lg text-ink focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent"
              >
                {iconOptions.map((icon) => (
                  <option key={icon} value={icon}>
                    {icon}
                  </option>
                ))}
              </select>
            </div>

            <Input
              label="Order"
              name="order"
              type="number"
              value={formData.order}
              onChange={handleChange}
              placeholder="0"
            />
          </div>
        </div>

        <div className="bg-surface rounded-xl p-6 border border-border space-y-6">
          <h2 className="text-lg font-semibold text-ink">Pricing</h2>

          <Input
            label="Price Range"
            name="priceRange"
            value={formData.priceRange}
            onChange={handleChange}
            placeholder="৳20,000 - ৳50,000 / Negotiable"
          />
        </div>

        <div className="bg-surface rounded-xl p-6 border border-border space-y-6">
          <h2 className="text-lg font-semibold text-ink">Features</h2>

          <div className="flex gap-3">
            <Input
              placeholder="Add a feature..."
              value={featureInput}
              onChange={(e) => setFeatureInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleAddFeature();
                }
              }}
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
            {ensureArray(formData.features).map((feature, index) => (
              <span
                key={`${feature}-${index}`}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-canvas text-ink"
              >
                {feature}
                <button
                  type="button"
                  onClick={() => handleRemoveFeature(index)}
                  className="text-ink-muted hover:text-red-500"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>

        <div className="bg-surface rounded-xl p-6 border border-border space-y-6">
          <h2 className="text-lg font-semibold text-ink">Technologies</h2>

          <div className="flex gap-3">
            <Input
              placeholder="Add a technology..."
              value={technologyInput}
              onChange={(e) => setTechnologyInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleAddTechnology();
                }
              }}
            />

            <Button
              type="button"
              variant="secondary"
              onClick={handleAddTechnology}
            >
              Add
            </Button>
          </div>

          <div className="flex flex-wrap gap-2">
            {ensureArray(formData.technologies).map((technology, index) => (
              <span
                key={`${technology}-${index}`}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-canvas text-ink"
              >
                {technology}
                <button
                  type="button"
                  onClick={() => handleRemoveTechnology(index)}
                  className="text-ink-muted hover:text-red-500"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>

        <div className="bg-surface rounded-xl p-6 border border-border space-y-6">
          <h2 className="text-lg font-semibold text-ink">Image</h2>

          <ImageUploader
            label="Service Image"
            value={formData.image}
            onChange={(image) =>
              setFormData((prev) => ({
                ...prev,
                image,
              }))
            }
          />
        </div>

        <div className="bg-surface rounded-xl p-6 border border-border space-y-6">
          <h2 className="text-lg font-semibold text-ink">SEO</h2>

          <Input
            label="SEO Title"
            name="seoTitle"
            value={formData.seoTitle}
            onChange={handleChange}
            placeholder="SEO optimized title"
          />

          <TextArea
            label="SEO Description"
            name="seoDescription"
            value={formData.seoDescription}
            onChange={handleChange}
            placeholder="SEO optimized description..."
            rows={3}
          />
        </div>

        <div className="bg-surface rounded-xl p-6 border border-border space-y-6">
          <h2 className="text-lg font-semibold text-ink">Settings</h2>

          <div className="flex flex-col gap-4">
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                name="isFeatured"
                checked={formData.isFeatured}
                onChange={handleChange}
                className="w-4 h-4 rounded border-border bg-canvas text-accent focus:ring-accent"
              />
              <span className="text-ink">Featured Service</span>
            </label>

            <div>
              <label className="block text-sm font-medium text-ink mb-2">
                Status
              </label>
              <select
                value={formData.isActive ? "active" : "inactive"}
                onChange={handleStatusChange}
                className="w-full px-4 py-2.5 bg-surface border border-border rounded-lg text-ink focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>
        </div>

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
