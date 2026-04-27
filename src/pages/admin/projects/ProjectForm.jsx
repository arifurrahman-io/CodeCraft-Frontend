import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";

import Button from "@/components/common/Button";
import Input from "@/components/common/Input";
import TextArea from "@/components/common/TextArea";
import ImageUploader from "@/components/admin/ImageUploader";

import {
  createProject,
  getProjectById,
  updateProject,
} from "@/services/projectService";

const categoryOptions = [
  "Web Development",
  "Mobile App Development",
  "Desktop Software",
  "E-commerce",
  "SaaS Platform",
  "ERP Solution",
  "School Management",
  "Custom Software",
];

const initialFormData = {
  title: "",
  slug: "",
  category: "Web Development",
  clientName: "",
  shortDescription: "",
  description: "",
  problem: "",
  solution: "",
  features: [],
  technologies: [],
  coverImage: "",
  images: [],
  liveUrl: "",
  githubUrl: "",
  isFeatured: false,
  isActive: true,
  completedAt: "",
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

const getProjectFromResponse = (response) =>
  response?.data?.project ||
  response?.data?.data ||
  response?.data ||
  response?.project ||
  response ||
  null;

const normalizeProjectData = (data = {}) => ({
  ...initialFormData,
  ...data,
  title: data.title || "",
  slug: data.slug || "",
  category: data.category || "Web Development",
  clientName: data.clientName || data.client || "",
  shortDescription: data.shortDescription || "",
  description: data.description || "",
  problem: data.problem || "",
  solution: data.solution || "",
  features: ensureArray(data.features),
  technologies: ensureArray(data.technologies),
  coverImage: data.coverImage || data.image || "",
  images: ensureArray(data.images),
  liveUrl: data.liveUrl || "",
  githubUrl: data.githubUrl || "",
  isFeatured: Boolean(data.isFeatured),
  isActive:
    typeof data.isActive === "boolean"
      ? data.isActive
      : data.status === "inactive"
        ? false
        : true,
  completedAt: data.completedAt
    ? new Date(data.completedAt).toISOString().split("T")[0]
    : "",
  seoTitle: data.seoTitle || "",
  seoDescription: data.seoDescription || "",
});

const buildPayload = (formData) => ({
  title: formData.title.trim(),
  slug: formData.slug.trim() || generateSlug(formData.title),
  category: formData.category.trim(),
  clientName: formData.clientName.trim(),
  shortDescription: formData.shortDescription.trim(),
  description: formData.description.trim(),
  problem: formData.problem.trim(),
  solution: formData.solution.trim(),
  features: ensureArray(formData.features),
  technologies: ensureArray(formData.technologies),
  coverImage: formData.coverImage || "",
  images: ensureArray(formData.images),
  liveUrl: formData.liveUrl.trim(),
  githubUrl: formData.githubUrl.trim(),
  isFeatured: Boolean(formData.isFeatured),
  isActive: Boolean(formData.isActive),
  completedAt: formData.completedAt || null,
  seoTitle: formData.seoTitle.trim(),
  seoDescription: formData.seoDescription.trim(),
});

const ProjectFormPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = Boolean(id);

  const [formData, setFormData] = useState(initialFormData);
  const [featureInput, setFeatureInput] = useState("");
  const [techInput, setTechInput] = useState("");
  const [galleryInput, setGalleryInput] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(isEditing);

  useEffect(() => {
    let mounted = true;

    const fetchProject = async () => {
      if (!isEditing) return;

      try {
        const response = await getProjectById(id);
        const project = getProjectFromResponse(response);

        if (mounted && project) {
          setFormData(normalizeProjectData(project));
        }
      } catch (error) {
        toast.error(error?.response?.data?.message || "Failed to load project");
        navigate("/admin/projects");
      } finally {
        if (mounted) setIsLoading(false);
      }
    };

    fetchProject();

    return () => {
      mounted = false;
    };
  }, [id, isEditing, navigate]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => {
      const next = {
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      };

      if (name === "title") {
        next.slug = generateSlug(value);
      }

      return next;
    });
  };

  const addFeature = () => {
    const value = featureInput.trim();
    if (!value) return;

    setFormData((prev) => ({
      ...prev,
      features: [...prev.features, value],
    }));

    setFeatureInput("");
  };

  const removeFeature = (index) => {
    setFormData((prev) => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index),
    }));
  };

  const addTech = () => {
    const value = techInput.trim();
    if (!value) return;

    setFormData((prev) => ({
      ...prev,
      technologies: [...prev.technologies, value],
    }));

    setTechInput("");
  };

  const removeTech = (index) => {
    setFormData((prev) => ({
      ...prev,
      technologies: prev.technologies.filter((_, i) => i !== index),
    }));
  };

  const addGallery = () => {
    const value = galleryInput.trim();
    if (!value) return;

    setFormData((prev) => ({
      ...prev,
      images: [...prev.images, value],
    }));

    setGalleryInput("");
  };

  const removeGallery = (index) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = buildPayload(formData);

    if (
      !payload.title ||
      !payload.slug ||
      !payload.category ||
      !payload.shortDescription ||
      !payload.description
    ) {
      toast.error("Please fill required fields");
      return;
    }

    setIsSubmitting(true);

    try {
      if (isEditing) {
        await updateProject(id, payload);
        toast.success("Project updated successfully");
      } else {
        await createProject(payload);
        toast.success("Project created successfully");
      }

      navigate("/admin/projects");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to save project");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="mx-auto max-w-4xl">
        <div className="glass rounded-xl p-6 border border-slate-700/50">
          <p className="text-slate-300">Loading project...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-4xl">
      <div className="flex items-center gap-4 mb-6">
        <button
          type="button"
          onClick={() => navigate("/admin/projects")}
          className="p-2 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        <div>
          <h1 className="text-2xl font-bold text-slate-100">
            {isEditing ? "Edit Project" : "Create Project"}
          </h1>
          <p className="text-slate-400">
            {isEditing
              ? "Update project details"
              : "Add a new project to your portfolio"}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic */}
        <div className="glass rounded-xl p-6 border border-slate-700/50 space-y-6">
          <h2 className="text-lg font-semibold text-slate-100">
            Basic Information
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            <Input
              label="Project Title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
            />

            <Input
              label="Client Name"
              name="clientName"
              value={formData.clientName}
              onChange={handleChange}
            />
          </div>

          <Input
            label="Slug"
            name="slug"
            value={formData.slug}
            onChange={handleChange}
            required
          />

          <div>
            <label className="block text-sm text-slate-300 mb-2">
              Category
            </label>

            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-slate-100"
            >
              {categoryOptions.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
          </div>

          <TextArea
            label="Short Description"
            name="shortDescription"
            value={formData.shortDescription}
            onChange={handleChange}
            rows={3}
          />

          <TextArea
            label="Description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={5}
          />

          <TextArea
            label="Problem"
            name="problem"
            value={formData.problem}
            onChange={handleChange}
            rows={4}
          />

          <TextArea
            label="Solution"
            name="solution"
            value={formData.solution}
            onChange={handleChange}
            rows={4}
          />
        </div>

        {/* Features */}
        <div className="glass rounded-xl p-6 border border-slate-700/50">
          <h2 className="text-lg font-semibold text-slate-100 mb-5">
            Features
          </h2>

          <div className="flex gap-3 mb-4">
            <Input
              placeholder="Add feature..."
              value={featureInput}
              onChange={(e) => setFeatureInput(e.target.value)}
            />
            <Button type="button" onClick={addFeature}>
              Add
            </Button>
          </div>

          <div className="flex flex-wrap gap-2">
            {formData.features.map((item, i) => (
              <span
                key={i}
                className="px-3 py-1 rounded-lg bg-slate-800 text-slate-300"
              >
                {item}
                <button
                  type="button"
                  onClick={() => removeFeature(i)}
                  className="ml-2 text-red-400"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>

        {/* Technologies */}
        <div className="glass rounded-xl p-6 border border-slate-700/50">
          <h2 className="text-lg font-semibold text-slate-100 mb-5">
            Technologies
          </h2>

          <div className="flex gap-3 mb-4">
            <Input
              placeholder="Add technology..."
              value={techInput}
              onChange={(e) => setTechInput(e.target.value)}
            />
            <Button type="button" onClick={addTech}>
              Add
            </Button>
          </div>

          <div className="flex flex-wrap gap-2">
            {formData.technologies.map((item, i) => (
              <span
                key={i}
                className="px-3 py-1 rounded-lg bg-slate-800 text-slate-300"
              >
                {item}
                <button
                  type="button"
                  onClick={() => removeTech(i)}
                  className="ml-2 text-red-400"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>

        {/* Links */}
        <div className="glass rounded-xl p-6 border border-slate-700/50 space-y-5">
          <h2 className="text-lg font-semibold text-slate-100">Links & Date</h2>

          <Input
            label="Live URL"
            name="liveUrl"
            value={formData.liveUrl}
            onChange={handleChange}
          />

          <Input
            label="GitHub URL"
            name="githubUrl"
            value={formData.githubUrl}
            onChange={handleChange}
          />

          <Input
            label="Completed Date"
            type="date"
            name="completedAt"
            value={formData.completedAt}
            onChange={handleChange}
          />
        </div>

        {/* Images */}
        <div className="glass rounded-xl p-6 border border-slate-700/50 space-y-5">
          <h2 className="text-lg font-semibold text-slate-100">Cover Image</h2>

          <ImageUploader
            label="Cover Image"
            value={formData.coverImage}
            onChange={(img) =>
              setFormData((prev) => ({
                ...prev,
                coverImage: img,
              }))
            }
          />

          <div className="mt-5">
            <h3 className="text-slate-300 mb-3">Gallery Images (URLs)</h3>

            <div className="flex gap-3 mb-4">
              <Input
                placeholder="Paste image url..."
                value={galleryInput}
                onChange={(e) => setGalleryInput(e.target.value)}
              />
              <Button type="button" onClick={addGallery}>
                Add
              </Button>
            </div>

            <div className="space-y-2">
              {formData.images.map((img, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between rounded-lg bg-slate-800 px-3 py-2"
                >
                  <span className="text-slate-300 text-sm truncate">{img}</span>

                  <button
                    type="button"
                    onClick={() => removeGallery(i)}
                    className="text-red-400"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* SEO */}
        <div className="glass rounded-xl p-6 border border-slate-700/50 space-y-5">
          <h2 className="text-lg font-semibold text-slate-100">SEO</h2>

          <Input
            label="SEO Title"
            name="seoTitle"
            value={formData.seoTitle}
            onChange={handleChange}
          />

          <TextArea
            label="SEO Description"
            name="seoDescription"
            value={formData.seoDescription}
            onChange={handleChange}
            rows={3}
          />
        </div>

        {/* Settings */}
        <div className="glass rounded-xl p-6 border border-slate-700/50 space-y-5">
          <h2 className="text-lg font-semibold text-slate-100">Settings</h2>

          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              name="isFeatured"
              checked={formData.isFeatured}
              onChange={handleChange}
            />
            <span className="text-slate-300">Featured Project</span>
          </label>

          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              name="isActive"
              checked={formData.isActive}
              onChange={handleChange}
            />
            <span className="text-slate-300">Active</span>
          </label>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="ghost"
            onClick={() => navigate("/admin/projects")}
          >
            Cancel
          </Button>

          <Button type="submit" isLoading={isSubmitting}>
            {isEditing ? "Update Project" : "Create Project"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ProjectFormPage;
