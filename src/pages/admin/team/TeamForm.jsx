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

const TeamFormPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = !!id;
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    designation: "",
    shortDescription: "",
    description: "",
    photo: "",
    email: "",
    phone: "",
    facebook: "",
    linkedin: "",
    github: "",
    skills: [],
    isActive: true,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isEditing) {
      getTeamMemberById(id).then((response) => {
        if (response.data) setFormData(response.data);
      });
    }
  }, [id, isEditing]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (name === "name") {
      const slug = value
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");
      setFormData((prev) => ({ ...prev, slug }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (isEditing) {
        await updateTeamMember(id, formData);
        toast.success("Team member updated");
      } else {
        await createTeamMember(formData);
        toast.success("Team member created");
      }
      navigate("/admin/team");
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
              label="Position"
              name="position"
              value={formData.position}
              onChange={handleChange}
              placeholder="Senior Developer"
              required
            />
          </div>
          <Input
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="john@example.com"
          />
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
        </div>

        <div className="glass rounded-xl p-6 border border-slate-700/50 space-y-6">
          <h2 className="text-lg font-semibold text-slate-100">Photo</h2>
          <ImageUploader
            value={formData.image}
            onChange={(image) => setFormData({ ...formData, image })}
          />
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
          </div>
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
