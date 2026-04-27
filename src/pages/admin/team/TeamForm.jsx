import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";

import Button from "@/components/common/Button";
import Input from "@/components/common/Input";
import TextArea from "@/components/common/TextArea";
import ImageUploader from "@/components/admin/ImageUploader";
import {
  createTeamMember,
  getTeamMemberById,
  updateTeamMember,
} from "@/services/teamService";

const initialFormData = {
  name: "",
  designation: "",
  photo: "",
  bio: "",
  skills: [],
  facebook: "",
  linkedin: "",
  github: "",
  website: "",
  isActive: true,
  order: 0,
};

const ensureArray = (value) => {
  if (Array.isArray(value)) return value;
  if (!value) return [];

  return String(value)
    .split(/\n|,/)
    .map((item) => item.trim())
    .filter(Boolean);
};

const getTeamMemberFromResponse = (response) =>
  response?.data?.member ||
  response?.data?.teamMember ||
  response?.data?.data ||
  response?.data ||
  response?.member ||
  response?.teamMember ||
  response ||
  null;

const normalizeTeamMemberData = (data = {}) => ({
  ...initialFormData,
  ...data,
  name: data.name || "",
  designation: data.designation || data.position || "",
  photo: data.photo || data.image || "",
  bio: data.bio || data.description || data.shortDescription || "",
  skills: ensureArray(data.skills),
  facebook: data.facebook || "",
  linkedin: data.linkedin || "",
  github: data.github || "",
  website: data.website || "",
  isActive:
    typeof data.isActive === "boolean"
      ? data.isActive
      : data.status === "inactive"
        ? false
        : true,
  order: Number(data.order || 0),
});

const buildPayload = (formData) => ({
  name: formData.name.trim(),
  designation: formData.designation.trim(),
  photo: formData.photo || "",
  bio: formData.bio.trim(),
  skills: ensureArray(formData.skills),
  facebook: formData.facebook.trim(),
  linkedin: formData.linkedin.trim(),
  github: formData.github.trim(),
  website: formData.website.trim(),
  isActive: Boolean(formData.isActive),
  order: Number(formData.order || 0),
});

const TeamFormPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = Boolean(id);

  const [formData, setFormData] = useState(initialFormData);
  const [skillInput, setSkillInput] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(isEditing);

  useEffect(() => {
    let mounted = true;

    const fetchTeamMember = async () => {
      if (!isEditing) return;

      try {
        setIsLoading(true);

        const response = await getTeamMemberById(id);
        const member = getTeamMemberFromResponse(response);

        if (mounted && member) {
          setFormData(normalizeTeamMemberData(member));
        }
      } catch (error) {
        toast.error(
          error?.response?.data?.message || "Failed to load team member",
        );
        navigate("/admin/team");
      } finally {
        if (mounted) setIsLoading(false);
      }
    };

    fetchTeamMember();

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

  const handleAddSkill = () => {
    const value = skillInput.trim();
    if (!value) return;

    setFormData((prev) => ({
      ...prev,
      skills: [...ensureArray(prev.skills), value],
    }));

    setSkillInput("");
  };

  const handleRemoveSkill = (index) => {
    setFormData((prev) => ({
      ...prev,
      skills: ensureArray(prev.skills).filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = buildPayload(formData);

    if (!payload.name || !payload.designation) {
      toast.error("Name and designation are required");
      return;
    }

    setIsSubmitting(true);

    try {
      if (isEditing) {
        await updateTeamMember(id, payload);
        toast.success("Team member updated successfully");
      } else {
        await createTeamMember(payload);
        toast.success("Team member created successfully");
      }

      navigate("/admin/team");
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Failed to save team member",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="mx-auto w-full max-w-4xl">
        <div className="glass rounded-xl p-6 border border-slate-700/50">
          <p className="text-slate-300">Loading team member...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-4xl">
      <div className="flex items-center gap-4 mb-6">
        <button
          type="button"
          onClick={() => navigate("/admin/team")}
          className="p-2 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        <div>
          <h1 className="text-2xl font-bold text-slate-100">
            {isEditing ? "Edit Team Member" : "Add Team Member"}
          </h1>
          <p className="text-slate-400">
            {isEditing ? "Update team member details" : "Add a new team member"}
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
              label="Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="John Doe"
              required
            />

            <Input
              label="Designation"
              name="designation"
              value={formData.designation}
              onChange={handleChange}
              placeholder="Senior Developer"
              required
            />
          </div>

          <Input
            label="Order"
            name="order"
            type="number"
            value={formData.order}
            onChange={handleChange}
            placeholder="0"
          />

          <TextArea
            label="Bio"
            name="bio"
            value={formData.bio}
            onChange={handleChange}
            placeholder="Short professional bio..."
            rows={5}
          />
        </div>

        <div className="glass rounded-xl p-6 border border-slate-700/50 space-y-6">
          <h2 className="text-lg font-semibold text-slate-100">Photo</h2>

          <ImageUploader
            label="Member Photo"
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
          <h2 className="text-lg font-semibold text-slate-100">Skills</h2>

          <div className="flex gap-3">
            <Input
              placeholder="Add skill..."
              value={skillInput}
              onChange={(e) => setSkillInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleAddSkill();
                }
              }}
            />

            <Button type="button" variant="secondary" onClick={handleAddSkill}>
              Add
            </Button>
          </div>

          <div className="flex flex-wrap gap-2">
            {ensureArray(formData.skills).map((skill, index) => (
              <span
                key={`${skill}-${index}`}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300"
              >
                {skill}
                <button
                  type="button"
                  onClick={() => handleRemoveSkill(index)}
                  className="text-slate-500 hover:text-red-500"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>

        <div className="glass rounded-xl p-6 border border-slate-700/50 space-y-6">
          <h2 className="text-lg font-semibold text-slate-100">Social Links</h2>

          <div className="grid md:grid-cols-2 gap-6">
            <Input
              label="Facebook"
              name="facebook"
              value={formData.facebook}
              onChange={handleChange}
              placeholder="https://facebook.com/..."
            />

            <Input
              label="LinkedIn"
              name="linkedin"
              value={formData.linkedin}
              onChange={handleChange}
              placeholder="https://linkedin.com/..."
            />

            <Input
              label="GitHub"
              name="github"
              value={formData.github}
              onChange={handleChange}
              placeholder="https://github.com/..."
            />

            <Input
              label="Website"
              name="website"
              value={formData.website}
              onChange={handleChange}
              placeholder="https://example.com"
            />
          </div>
        </div>

        <div className="glass rounded-xl p-6 border border-slate-700/50 space-y-6">
          <h2 className="text-lg font-semibold text-slate-100">Settings</h2>

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
            onClick={() => navigate("/admin/team")}
          >
            Cancel
          </Button>

          <Button type="submit" isLoading={isSubmitting}>
            {isEditing ? "Update Team Member" : "Create Team Member"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default TeamFormPage;
