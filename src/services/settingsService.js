import api, { request } from "@/services/api";

const toFrontendSettings = (settings = {}) => {
  if (settings.company || settings.social || settings.seo || settings.branding) {
    return settings;
  }

  const statistics = settings.statistics || {};

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
      ogImage: settings.ogImage || "",
    },
    branding: {
      logo: settings.logo || "",
      favicon: settings.favicon || "",
      primaryColor: settings.primaryColor || "#0d9488",
      secondaryColor: settings.secondaryColor || "#0a1628",
      accentColor: settings.accentColor || "#0f766e",
    },
    statistics: {
      yearsExperience: statistics.yearsExperience || settings.yearsExperience || "",
      businessStartYear:
        statistics.businessStartYear || settings.businessStartYear || "",
      projectsCompleted:
        statistics.projectsCompleted || settings.projectsCompleted || "",
      happyClients: statistics.happyClients || settings.happyClients || "",
      industriesServed:
        statistics.industriesServed || settings.industriesServed || "",
      expertsTeam: statistics.expertsTeam || settings.expertsTeam || "",
      projectSuccess: statistics.projectSuccess || settings.projectSuccess || "",
      supportAvailability:
        statistics.supportAvailability || settings.supportAvailability || "",
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
    ogImage: settings.seo?.ogImage,
    logo: settings.branding?.logo,
    favicon: settings.branding?.favicon,
    footerText: settings.company?.description,
    primaryColor: settings.branding?.primaryColor,
    secondaryColor: settings.branding?.secondaryColor,
    accentColor: settings.branding?.accentColor,
    statistics: settings.statistics,
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
  request(api.put("/settings", toApiSettings(settingsData))).then((response) => ({
    ...response,
    data: toFrontendSettings(response.data),
  }));

export { api };

export default {
  getSettings,
  updateSettings,
};
