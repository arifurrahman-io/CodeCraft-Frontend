import { useState, useEffect } from "react";
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

const ProjectFormPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = !!id;

  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    client: "",
    shortDescription: "",
    description: "",
    technologies: [],
    image: "",
    thumbnail: "",
    category: "Web Development",
    status: "completed",
    isFeatured: true,
    liveUrl: "",
    completionDate: "",
    duration: "",
  });
  const [techInput, setTechInput] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isEditing) {
      getProjectById(id).then((response) => {
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

    if (name === "title") {
      const slug = value
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");
      setFormData((prev) => ({ ...prev, slug }));
    }
  };

  const handleAddTech = () => {
    if (techInput.trim()) {
      setFormData({
        ...formData,
        technologies: [...formData.technologies, techInput.trim()],
      });
      setTechInput("");
    }
  };

  const handleRemoveTech = (index) => {
    setFormData({
      ...formData,
      technologies: formData.technologies.filter((_, i) => i !== index),
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (isEditing) {
        await updateProject(id, formData);
        toast.success("Project updated successfully");
      } else {
        await createProject(formData);
        toast.success("Project created successfully");
      }
      navigate("/admin/projects");
    } catch {
      toast.error("Failed to save project");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-4xl">
      <div className="flex items-center gap-4 mb-6">
        <button
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
            {isEditing ? "Update project details" : "Add a new project to your portfolio"}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
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
              placeholder="E-commerce Platform"
              required
            />
            <Input
              label="Client Name"
              name="client"
              value={formData.client}
              onChange={handleChange}
              placeholder="Client Company"
              required
            />
          </div>

          <Input
            label="Slug"
            name="slug"
            value={formData.slug}
            onChange={handleChange}
            placeholder="ecommerce-platform"
            required
          />

          <TextArea
            label="Short Description"
            name="shortDescription"
            value={formData.shortDescription}
            onChange={handleChange}
            placeholder="Brief description..."
            rows={3}
          />

          <TextArea
            label="Full Description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Detailed description..."
            rows={5}
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
                className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-slate-100"
              >
                <option value="Web Development">Web Development</option>
                <option value="Mobile App">Mobile App</option>
                <option value="E-commerce">E-commerce</option>
                <option value="SaaS">SaaS</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Status
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-slate-100"
              >
                <option value="completed">Completed</option>
                <option value="in_progress">In Progress</option>
              </select>
            </div>
          </div>
        </div>

        <div className="glass rounded-xl p-6 border border-slate-700/50 space-y-6">
          <h2 className="text-lg font-semibold text-slate-100">Technologies</h2>

          <div className="flex gap-3">
            <Input
              placeholder="Add technology..."
              value={techInput}
              onChange={(e) => setTechInput(e.target.value)}
              onKeyPress={(e) =>
                e.key === "Enter" && (e.preventDefault(), handleAddTech())
              }
            />
            <Button type="button" variant="secondary" onClick={handleAddTech}>
              Add
            </Button>
          </div>

          <div className="flex flex-wrap gap-2">
            {formData.technologies.map((tech, index) => (
              <span
                key={index}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300"
              >
                {tech}
                <button
                  type="button"
                  onClick={() => handleRemoveTech(index)}
                  className="text-slate-500 hover:text-red-500"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>

        <div className="glass rounded-xl p-6 border border-slate-700/50 space-y-6">
          <h2 className="text-lg font-semibold text-slate-100">
            Project Details
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            <Input
              label="Duration"
              name="duration"
              value={formData.duration}
              onChange={handleChange}
              placeholder="3 months"
            />
            <Input
              label="Completion Date"
              name="completionDate"
              type="date"
              value={formData.completionDate}
              onChange={handleChange}
            />
            <Input
              label="Live URL"
              name="liveUrl"
              value={formData.liveUrl}
              onChange={handleChange}
              placeholder="https://example.com"
            />
          </div>
        </div>

        <div className="glass rounded-xl p-6 border border-slate-700/50 space-y-6">
          <h2 className="text-lg font-semibold text-slate-100">Images</h2>

          <ImageUploader
            label="Project Image"
            value={formData.image}
            onChange={(image) => setFormData({ ...formData, image })}
          />
        </div>

        <div className="glass rounded-xl p-6 border border-slate-700/50 space-y-6">
          <h2 className="text-lg font-semibold text-slate-100">Settings</h2>

          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              name="isFeatured"
              checked={formData.isFeatured}
              onChange={handleChange}
              className="w-4 h-4 rounded border-slate-700 bg-slate-800 text-cyan-500"
            />
            <span className="text-slate-300">Featured Project</span>
          </label>
        </div>

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
