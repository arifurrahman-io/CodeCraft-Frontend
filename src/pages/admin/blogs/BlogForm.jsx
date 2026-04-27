import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";

import Button from "@/components/common/Button";
import Input from "@/components/common/Input";
import TextArea from "@/components/common/TextArea";
import ImageUploader from "@/components/admin/ImageUploader";
import { createBlog, getBlogById, updateBlog } from "@/services/blogService";

const categoryOptions = ["Technology", "Development", "Design", "Tutorial"];

const initialFormData = {
  title: "",
  slug: "",
  excerpt: "",
  content: "",
  coverImage: "",
  category: "Technology",
  tags: [],
  isPublished: false,
  publishedAt: "",
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

const getBlogFromResponse = (response) =>
  response?.data?.blog ||
  response?.data?.data ||
  response?.data ||
  response?.blog ||
  response ||
  null;

const toDateInputValue = (date) => {
  if (!date) return "";
  return new Date(date).toISOString().split("T")[0];
};

const normalizeBlogData = (data = {}) => ({
  ...initialFormData,
  ...data,
  title: data.title || "",
  slug: data.slug || "",
  excerpt: data.excerpt || data.shortDescription || "",
  content: data.content || "",
  coverImage: data.coverImage || data.image || "",
  category: data.category || "Technology",
  tags: ensureArray(data.tags),
  isPublished:
    typeof data.isPublished === "boolean"
      ? data.isPublished
      : data.status === "published",
  publishedAt: toDateInputValue(data.publishedAt),
  seoTitle: data.seoTitle || "",
  seoDescription: data.seoDescription || "",
});

const buildPayload = (formData) => ({
  title: formData.title.trim(),
  slug: formData.slug.trim() || generateSlug(formData.title),
  excerpt: formData.excerpt.trim(),
  content: formData.content.trim(),
  coverImage: formData.coverImage || "",
  category: formData.category.trim(),
  tags: ensureArray(formData.tags),
  isPublished: Boolean(formData.isPublished),
  publishedAt: formData.isPublished
    ? formData.publishedAt || new Date().toISOString()
    : null,
  seoTitle: formData.seoTitle.trim(),
  seoDescription: formData.seoDescription.trim(),
});

const BlogFormPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = Boolean(id);

  const [formData, setFormData] = useState(initialFormData);
  const [tagInput, setTagInput] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(isEditing);

  useEffect(() => {
    let mounted = true;

    const fetchBlog = async () => {
      if (!isEditing) return;

      try {
        const response = await getBlogById(id);
        const blog = getBlogFromResponse(response);

        if (mounted && blog) {
          setFormData(normalizeBlogData(blog));
        }
      } catch (error) {
        toast.error(error?.response?.data?.message || "Failed to load blog");
        navigate("/admin/blogs");
      } finally {
        if (mounted) setIsLoading(false);
      }
    };

    fetchBlog();

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

  const handleAddTag = () => {
    const value = tagInput.trim();
    if (!value) return;

    setFormData((prev) => ({
      ...prev,
      tags: [...ensureArray(prev.tags), value],
    }));

    setTagInput("");
  };

  const handleRemoveTag = (index) => {
    setFormData((prev) => ({
      ...prev,
      tags: ensureArray(prev.tags).filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = buildPayload(formData);

    if (
      !payload.title ||
      !payload.slug ||
      !payload.excerpt ||
      !payload.content ||
      !payload.category
    ) {
      toast.error("Please fill all required fields");
      return;
    }

    setIsSubmitting(true);

    try {
      if (isEditing) {
        await updateBlog(id, payload);
        toast.success("Blog updated successfully");
      } else {
        await createBlog(payload);
        toast.success("Blog created successfully");
      }

      navigate("/admin/blogs");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to save blog");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="mx-auto w-full max-w-4xl">
        <div className="glass rounded-xl p-6 border border-slate-700/50">
          <p className="text-slate-300">Loading blog...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-4xl">
      <div className="flex items-center gap-4 mb-6">
        <button
          type="button"
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
            label="Excerpt"
            name="excerpt"
            value={formData.excerpt}
            onChange={handleChange}
            placeholder="Short blog excerpt..."
            rows={3}
            required
          />

          <TextArea
            label="Content"
            name="content"
            value={formData.content}
            onChange={handleChange}
            placeholder="Blog content..."
            rows={12}
            required
          />

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
              {categoryOptions.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="glass rounded-xl p-6 border border-slate-700/50 space-y-6">
          <h2 className="text-lg font-semibold text-slate-100">Tags</h2>

          <div className="flex gap-3">
            <Input
              placeholder="Add tag..."
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleAddTag();
                }
              }}
            />

            <Button type="button" variant="secondary" onClick={handleAddTag}>
              Add
            </Button>
          </div>

          <div className="flex flex-wrap gap-2">
            {ensureArray(formData.tags).map((tag, index) => (
              <span
                key={`${tag}-${index}`}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300"
              >
                #{tag}
                <button
                  type="button"
                  onClick={() => handleRemoveTag(index)}
                  className="text-slate-500 hover:text-red-500"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>

        <div className="glass rounded-xl p-6 border border-slate-700/50 space-y-6">
          <h2 className="text-lg font-semibold text-slate-100">Cover Image</h2>

          <ImageUploader
            label="Cover Image"
            value={formData.coverImage}
            onChange={(coverImage) =>
              setFormData((prev) => ({
                ...prev,
                coverImage,
              }))
            }
          />
        </div>

        <div className="glass rounded-xl p-6 border border-slate-700/50 space-y-6">
          <h2 className="text-lg font-semibold text-slate-100">SEO</h2>

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

        <div className="glass rounded-xl p-6 border border-slate-700/50 space-y-6">
          <h2 className="text-lg font-semibold text-slate-100">Settings</h2>

          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              name="isPublished"
              checked={formData.isPublished}
              onChange={handleChange}
              className="w-4 h-4 rounded border-slate-700 bg-slate-800 text-cyan-500"
            />
            <span className="text-slate-300">Published</span>
          </label>

          {formData.isPublished && (
            <Input
              label="Published Date"
              name="publishedAt"
              type="date"
              value={formData.publishedAt}
              onChange={handleChange}
            />
          )}
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
