import api, { request } from "@/services/api";

const toFrontendSettings = (settings = {}) => {
  if (settings.company || settings.social || settings.seo || settings.branding) {
    return settings;
  }

  return {
    ...settings,
    company: {
      name: settings.companyName || settings.name || "CodeCraft.BD",
      tagline: settings.tagline || "",
      description: settings.footerText || settings.description || "",
      email: settings.email || "",
      phone: settings.phone || "",
      address: settings.address || "",
      website: settings.website || "",
    },
    social: {
      facebook: settings.facebook || "",
      twitter: settings.twitter || "",
      linkedin: settings.linkedin || "",
      github: settings.github || "",
    },
    seo: {
      title: settings.seoTitle || settings.title || "",
      description: settings.seoDescription || settings.description || "",
      keywords: settings.keywords || "",
    },
    branding: {
      primaryColor: settings.primaryColor || "#06b6d4",
      secondaryColor: settings.secondaryColor || "#2563eb",
      accentColor: settings.accentColor || "#8b5cf6",
    },
  };
};

const toApiSettings = (settings = {}) => {
  if (!settings.company && !settings.social && !settings.seo) return settings;

  const payload = {
    companyName: settings.company?.name,
    tagline: settings.company?.tagline,
    email: settings.company?.email,
    phone: settings.company?.phone,
    address: settings.company?.address,
    website: settings.company?.website,
    facebook: settings.social?.facebook,
    twitter: settings.social?.twitter,
    linkedin: settings.social?.linkedin,
    github: settings.social?.github,
    seoTitle: settings.seo?.title,
    seoDescription: settings.seo?.description,
    keywords: settings.seo?.keywords,
    footerText: settings.company?.description,
    primaryColor: settings.branding?.primaryColor,
    secondaryColor: settings.branding?.secondaryColor,
    accentColor: settings.branding?.accentColor,
  };

  return Object.fromEntries(
    Object.entries(payload).filter(([, value]) => value !== undefined),
  );
};

export const getSettings = async () => {
  const response = await request(api.get("/settings"));
  return {
    ...response,
    data: toFrontendSettings(response.data),
  };
};

export const updateSettings = (settingsData) =>
  request(api.put("/settings", toApiSettings(settingsData)));

export { api };

export default {
  getSettings,
  updateSettings,
};
