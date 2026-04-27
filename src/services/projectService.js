import api from "@/services/api";
import { createCrudService, filterFeatured } from "@/services/resourceService";

const projectApi = createCrudService("/projects");

const withThumbnail = (projectData) => ({
  ...projectData,
  thumbnail: projectData.thumbnail || projectData.image,
});

export const getAllProjects = projectApi.getAll;

export const getFeaturedProjects = async () => {
  const response = await getAllProjects();
  return {
    ...response,
    data: filterFeatured(response.data),
  };
};

export const getProjectBySlug = projectApi.getBySlug;
export const getProjectById = projectApi.getById;
export const createProject = (projectData) =>
  projectApi.create(withThumbnail(projectData));
export const updateProject = (id, projectData) =>
  projectApi.update(id, withThumbnail(projectData));
export const deleteProject = projectApi.remove;

export { api };

export default {
  getAllProjects,
  getFeaturedProjects,
  getProjectBySlug,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
};
