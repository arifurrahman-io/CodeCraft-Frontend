import { useState, useEffect } from "react";
import { toast } from "sonner";
import Button from "@/components/common/Button";
import Input from "@/components/common/Input";
import TextArea from "@/components/common/TextArea";
import { SETTINGS_DATA } from "@/utils/dummyData";
import { getSettings, updateSettings } from "@/services/settingsService";

const mergeSettings = (settings = {}) => ({
  ...SETTINGS_DATA,
  ...settings,
  company: { ...SETTINGS_DATA.company, ...settings.company },
  social: { ...SETTINGS_DATA.social, ...settings.social },
  seo: { ...SETTINGS_DATA.seo, ...settings.seo },
  branding: { ...SETTINGS_DATA.branding, ...settings.branding },
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
      await updateSettings(formData);
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
