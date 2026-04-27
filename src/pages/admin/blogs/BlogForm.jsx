import { useState } from "react";
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import Button from "@/components/common/Button";
import Input from "@/components/common/Input";
import TextArea from "@/components/common/TextArea";
import ImageUploader from "@/components/admin/ImageUploader";
import { createBlog, getBlogById, updateBlog } from "@/services/blogService";

const BlogFormPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = !!id;
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    shortDescription: "",
    content: "",
    author: {
      name: "Admin",
      image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100",
    },
    category: "Technology",
    tags: [],
    image: "",
    status: "published",
    isFeatured: false,
  });
  const [tagInput, setTagInput] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isEditing) {
      getBlogById(id).then((response) => {
        if (response.data) setFormData(response.data);
      });
    }
  }, [id, isEditing]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (name === "title") {
      const slug = value
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");
      setFormData((prev) => ({ ...prev, slug }));
    }
  };

  const handleAddTag = () => {
    if (tagInput.trim()) {
      setFormData({ ...formData, tags: [...formData.tags, tagInput.trim()] });
      setTagInput("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (isEditing) {
        await updateBlog(id, formData);
        toast.success("Blog updated successfully");
      } else {
        await createBlog(formData);
        toast.success("Blog created successfully");
      }
      navigate("/admin/blogs");
    } catch {
      toast.error("Failed to create blog");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-4xl">
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => navigate("/admin/blogs")}
          className="p-2 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-slate-100">
            {isEditing ? "Edit Blog" : "Create Blog"}
          </h1>
          <p className="text-slate-400">
            {isEditing ? "Update blog content" : "Write a new blog post"}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="glass rounded-xl p-6 border border-slate-700/50 space-y-6">
          <h2 className="text-lg font-semibold text-slate-100">
            Basic Information
          </h2>
          <Input
            label="Title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Blog Title"
            required
          />
          <Input
            label="Slug"
            name="slug"
            value={formData.slug}
            onChange={handleChange}
            placeholder="blog-slug"
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
            label="Content"
            name="content"
            value={formData.content}
            onChange={handleChange}
            placeholder="Blog content..."
            rows={10}
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
                <option value="Technology">Technology</option>
                <option value="Development">Development</option>
                <option value="Design">Design</option>
                <option value="Tutorial">Tutorial</option>
              </select>
            </div>
          </div>
        </div>

        <div className="glass rounded-xl p-6 border border-slate-700/50 space-y-6">
          <h2 className="text-lg font-semibold text-slate-100">Tags</h2>
          <div className="flex gap-3">
            <Input
              placeholder="Add tag..."
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyPress={(e) =>
                e.key === "Enter" && (e.preventDefault(), handleAddTag())
              }
            />
            <Button type="button" variant="secondary" onClick={handleAddTag}>
              Add
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {formData.tags.map((tag, index) => (
              <span
                key={index}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300"
              >
                #{tag}
                <button
                  type="button"
                  onClick={() =>
                    setFormData({
                      ...formData,
                      tags: formData.tags.filter((_, i) => i !== index),
                    })
                  }
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
            Featured Image
          </h2>
          <ImageUploader
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
              onChange={(e) =>
                setFormData({ ...formData, isFeatured: e.target.checked })
              }
              className="w-4 h-4 rounded border-slate-700 bg-slate-800 text-cyan-500"
            />
            <span className="text-slate-300">Featured Blog</span>
          </label>
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
              <option value="published">Published</option>
              <option value="draft">Draft</option>
            </select>
          </div>
        </div>

        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="ghost"
            onClick={() => navigate("/admin/blogs")}
          >
            Cancel
          </Button>
          <Button type="submit" isLoading={isSubmitting}>
            {isEditing ? "Update Blog" : "Create Blog"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default BlogFormPage;
