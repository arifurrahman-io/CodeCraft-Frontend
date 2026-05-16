import { useEffect, useState } from "react";
import { getAllProjects } from "@/services/projectService";
import { getAllServices } from "@/services/serviceService";
import { getSettings } from "@/services/settingsService";
import { getAllTeam } from "@/services/teamService";
import { getAllTestimonials } from "@/services/testimonialService";

const initialStats = {
  yearsExperience: "7+",
  businessStartYear: "2019",
  projectsCompleted: "0+",
  happyClients: "0+",
  industriesServed: "0+",
  expertsTeam: "0+",
  projectSuccess: "100%",
  supportAvailability: "24/7",
};

const getArray = (response) => {
  if (Array.isArray(response)) return response;
  if (Array.isArray(response?.data)) return response.data;
  if (Array.isArray(response?.data?.data)) return response.data.data;
  if (Array.isArray(response?.data?.projects)) return response.data.projects;
  if (Array.isArray(response?.data?.services)) return response.data.services;
  if (Array.isArray(response?.data?.team)) return response.data.team;
  if (Array.isArray(response?.data?.members)) return response.data.members;
  if (Array.isArray(response?.data?.testimonials)) {
    return response.data.testimonials;
  }
  return [];
};

const getSettingsData = (response) =>
  response?.data?.settings || response?.data?.data?.settings || response?.data || {};

const valueOrFallback = (value, fallback) => {
  const normalized = String(value || "").trim();
  return normalized || fallback;
};

const countLabel = (count) => `${count}+`;

const calculateYearsExperience = (startYearValue) => {
  const startYear = Number.parseInt(startYearValue, 10);
  const currentYear = new Date().getFullYear();

  if (!Number.isFinite(startYear) || startYear <= 0 || startYear > currentYear) {
    return "";
  }

  return countLabel(currentYear - startYear);
};

const isActiveRecord = (record = {}) =>
  typeof record.isActive === "boolean"
    ? record.isActive
    : record.status === "inactive"
      ? false
      : true;

const buildStats = ({ settings, projects, services, team, testimonials }) => {
  const configured = settings.statistics || {};
  const activeProjects = projects.filter(isActiveRecord);
  const activeServices = services.filter(isActiveRecord);
  const activeTeam = team.filter(isActiveRecord);
  const activeTestimonials = testimonials.filter(isActiveRecord);
  const industries = new Set(
    activeProjects
      .map((project) => project.category || project.industry)
      .filter(Boolean),
  );
  const industriesCount = industries.size || activeServices.length;

  return {
    businessStartYear: valueOrFallback(
      configured.businessStartYear,
      initialStats.businessStartYear,
    ),
    yearsExperience:
      calculateYearsExperience(
        valueOrFallback(
          configured.businessStartYear,
          initialStats.businessStartYear,
        ),
      ) ||
      valueOrFallback(configured.yearsExperience, initialStats.yearsExperience),
    projectsCompleted: valueOrFallback(
      configured.projectsCompleted,
      countLabel(activeProjects.length),
    ),
    happyClients: valueOrFallback(
      configured.happyClients,
      countLabel(activeTestimonials.length),
    ),
    industriesServed: valueOrFallback(
      configured.industriesServed,
      countLabel(industriesCount),
    ),
    expertsTeam: valueOrFallback(
      configured.expertsTeam,
      countLabel(activeTeam.length),
    ),
    projectSuccess: valueOrFallback(
      configured.projectSuccess,
      initialStats.projectSuccess,
    ),
    supportAvailability: valueOrFallback(
      configured.supportAvailability,
      initialStats.supportAvailability,
    ),
  };
};

export const useWebsiteStats = () => {
  const [stats, setStats] = useState(initialStats);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const loadStats = async () => {
      const [settings, projects, services, team, testimonials] =
        await Promise.allSettled([
          getSettings(),
          getAllProjects(),
          getAllServices(),
          getAllTeam(),
          getAllTestimonials(),
        ]);

      if (!mounted) return;

      setStats(
        buildStats({
          settings:
            settings.status === "fulfilled"
              ? getSettingsData(settings.value)
              : {},
          projects:
            projects.status === "fulfilled" ? getArray(projects.value) : [],
          services:
            services.status === "fulfilled" ? getArray(services.value) : [],
          team: team.status === "fulfilled" ? getArray(team.value) : [],
          testimonials:
            testimonials.status === "fulfilled"
              ? getArray(testimonials.value)
              : [],
        }),
      );
      setIsLoading(false);
    };

    loadStats();

    return () => {
      mounted = false;
    };
  }, []);

  return { stats, isLoading };
};

export default useWebsiteStats;
