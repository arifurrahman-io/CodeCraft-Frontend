import { useState, useEffect } from "react";
import { toast } from "sonner";
import Button from "@/components/common/Button";
import Input from "@/components/common/Input";
import TextArea from "@/components/common/TextArea";
import ImageUploader from "@/components/admin/ImageUploader";
import { SETTINGS_DATA } from "@/utils/dummyData";
import { getSettings, updateSettings } from "@/services/settingsService";

const mergeSettings = (settings = {}) => ({
  ...SETTINGS_DATA,
  ...settings,
  company: { ...SETTINGS_DATA.company, ...settings.company },
  social: { ...SETTINGS_DATA.social, ...settings.social },
  seo: { ...SETTINGS_DATA.seo, ...settings.seo },
  branding: { ...SETTINGS_DATA.branding, ...settings.branding },
  statistics: { ...SETTINGS_DATA.statistics, ...settings.statistics },
});

const WebsiteSettingsPage = () => {
  const [formData, setFormData] = useState(SETTINGS_DATA);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    getSettings().then((response) => setFormData(mergeSettings(response.data)));
  }, []);

  const handleChange = (section, field, value) => {
    setFormData({
      ...formData,
      [section]: {
        ...formData[section],
        [field]: value,
      },
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const response = await updateSettings(formData);
      setFormData(mergeSettings(response.data));
      toast.success("Settings saved successfully");
    } catch {
      toast.error("Failed to save settings");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-4xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-100">Website Settings</h1>
        <p className="text-slate-400">Manage your website configuration</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Company Info */}
        <div className="glass rounded-xl p-6 border border-slate-700/50 space-y-6">
          <h2 className="text-lg font-semibold text-slate-100">
            Company Information
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <Input
              label="Company Name"
              value={formData.company.name}
              onChange={(e) => handleChange("company", "name", e.target.value)}
            />
            <Input
              label="Tagline"
              value={formData.company.tagline}
              onChange={(e) =>
                handleChange("company", "tagline", e.target.value)
              }
            />
          </div>
          <TextArea
            label="Description"
            value={formData.company.description}
            onChange={(e) =>
              handleChange("company", "description", e.target.value)
            }
            rows={3}
          />
          <div className="grid md:grid-cols-2 gap-6">
            <Input
              label="Email"
              value={formData.company.email}
              onChange={(e) => handleChange("company", "email", e.target.value)}
            />
            <Input
              label="Phone"
              value={formData.company.phone}
              onChange={(e) => handleChange("company", "phone", e.target.value)}
            />
            <Input
              label="Address"
              value={formData.company.address}
              onChange={(e) =>
                handleChange("company", "address", e.target.value)
              }
            />
            <Input
              label="Website URL"
              value={formData.company.website}
              onChange={(e) =>
                handleChange("company", "website", e.target.value)
              }
            />
          </div>
        </div>

        {/* Social Links */}
        <div className="glass rounded-xl p-6 border border-slate-700/50 space-y-6">
          <h2 className="text-lg font-semibold text-slate-100">Social Links</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <Input
              label="Facebook"
              value={formData.social.facebook}
              onChange={(e) =>
                handleChange("social", "facebook", e.target.value)
              }
            />
            <Input
              label="Twitter"
              value={formData.social.twitter}
              onChange={(e) =>
                handleChange("social", "twitter", e.target.value)
              }
            />
            <Input
              label="LinkedIn"
              value={formData.social.linkedin}
              onChange={(e) =>
                handleChange("social", "linkedin", e.target.value)
              }
            />
            <Input
              label="GitHub"
              value={formData.social.github}
              onChange={(e) => handleChange("social", "github", e.target.value)}
            />
          </div>
        </div>

        {/* Website Statistics */}
        <div className="glass rounded-xl p-6 border border-slate-700/50 space-y-6">
          <div>
            <h2 className="text-lg font-semibold text-slate-100">
              Website Statistics
            </h2>
            <p className="mt-1 text-sm text-slate-400">
              Years experience is calculated from the business start year. Leave
              collection-based fields empty to calculate them from live
              projects, team, and testimonials.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <Input
              label="Business Start Year"
              type="number"
              min="1900"
              value={formData.statistics.businessStartYear}
              onChange={(e) =>
                handleChange("statistics", "businessStartYear", e.target.value)
              }
              placeholder="2019"
            />
            <Input
              label="Projects Completed"
              value={formData.statistics.projectsCompleted}
              onChange={(e) =>
                handleChange("statistics", "projectsCompleted", e.target.value)
              }
              placeholder="Auto from projects"
            />
            <Input
              label="Happy Clients"
              value={formData.statistics.happyClients}
              onChange={(e) =>
                handleChange("statistics", "happyClients", e.target.value)
              }
              placeholder="Auto from testimonials"
            />
            <Input
              label="Industries Served"
              value={formData.statistics.industriesServed}
              onChange={(e) =>
                handleChange("statistics", "industriesServed", e.target.value)
              }
              placeholder="Auto from project categories"
            />
            <Input
              label="Experts Team"
              value={formData.statistics.expertsTeam}
              onChange={(e) =>
                handleChange("statistics", "expertsTeam", e.target.value)
              }
              placeholder="Auto from team members"
            />
            <Input
              label="Project Success"
              value={formData.statistics.projectSuccess}
              onChange={(e) =>
                handleChange("statistics", "projectSuccess", e.target.value)
              }
              placeholder="100%"
            />
            <Input
              label="Support Availability"
              value={formData.statistics.supportAvailability}
              onChange={(e) =>
                handleChange(
                  "statistics",
                  "supportAvailability",
                  e.target.value,
                )
              }
              placeholder="24/7"
            />
          </div>
        </div>

        {/* SEO Settings */}
        <div className="glass rounded-xl p-6 border border-slate-700/50 space-y-6">
          <h2 className="text-lg font-semibold text-slate-100">SEO Settings</h2>
          <Input
            label="Meta Title"
            value={formData.seo.title}
            onChange={(e) => handleChange("seo", "title", e.target.value)}
          />
          <TextArea
            label="Meta Description"
            value={formData.seo.description}
            onChange={(e) => handleChange("seo", "description", e.target.value)}
            rows={3}
          />
          <Input
            label="Keywords"
            value={formData.seo.keywords}
            onChange={(e) => handleChange("seo", "keywords", e.target.value)}
          />
        </div>

        {/* Branding */}
        <div className="glass rounded-xl p-6 border border-slate-700/50 space-y-6">
          <h2 className="text-lg font-semibold text-slate-100">Branding</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <ImageUploader
                label="Website Logo"
                value={formData.branding.logo}
                onChange={(logo) => handleChange("branding", "logo", logo || "")}
                maxSize={2}
              />
              <Input
                label="Logo URL"
                value={formData.branding.logo}
                onChange={(e) =>
                  handleChange("branding", "logo", e.target.value)
                }
                placeholder="https://example.com/logo.png"
              />
            </div>
            <div className="space-y-3">
              <ImageUploader
                label="Fav Icon"
                value={formData.branding.favicon}
                onChange={(favicon) =>
                  handleChange("branding", "favicon", favicon || "")
                }
                maxSize={1}
              />
              <Input
                label="Fav Icon URL"
                value={formData.branding.favicon}
                onChange={(e) =>
                  handleChange("branding", "favicon", e.target.value)
                }
                placeholder="https://example.com/favicon.png"
              />
            </div>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Primary Color
              </label>
              <div className="flex gap-3">
                <input
                  type="color"
                  value={formData.branding.primaryColor}
                  onChange={(e) =>
                    handleChange("branding", "primaryColor", e.target.value)
                  }
                  className="w-12 h-12 rounded-lg border border-slate-700 cursor-pointer"
                />
                <Input
                  value={formData.branding.primaryColor}
                  onChange={(e) =>
                    handleChange("branding", "primaryColor", e.target.value)
                  }
                  className="flex-1"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Secondary Color
              </label>
              <div className="flex gap-3">
                <input
                  type="color"
                  value={formData.branding.secondaryColor}
                  onChange={(e) =>
                    handleChange("branding", "secondaryColor", e.target.value)
                  }
                  className="w-12 h-12 rounded-lg border border-slate-700 cursor-pointer"
                />
                <Input
                  value={formData.branding.secondaryColor}
                  onChange={(e) =>
                    handleChange("branding", "secondaryColor", e.target.value)
                  }
                  className="flex-1"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Accent Color
              </label>
              <div className="flex gap-3">
                <input
                  type="color"
                  value={formData.branding.accentColor}
                  onChange={(e) =>
                    handleChange("branding", "accentColor", e.target.value)
                  }
                  className="w-12 h-12 rounded-lg border border-slate-700 cursor-pointer"
                />
                <Input
                  value={formData.branding.accentColor}
                  onChange={(e) =>
                    handleChange("branding", "accentColor", e.target.value)
                  }
                  className="flex-1"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <Button type="submit" isLoading={isSubmitting}>
            Save Settings
          </Button>
        </div>
      </form>
    </div>
  );
};

export default WebsiteSettingsPage;
