import api from "@/services/api";
import { createCrudService, filterFeatured } from "@/services/resourceService";

const serviceApi = createCrudService("/services");

export const getAllServices = serviceApi.getAll;

export const getFeaturedServices = async () => {
  const response = await getAllServices();
  return {
    ...response,
    data: filterFeatured(response.data, "status", "active"),
  };
};

export const getServiceBySlug = serviceApi.getBySlug;
export const getServiceById = serviceApi.getById;
export const createService = serviceApi.create;
export const updateService = serviceApi.update;
export const deleteService = serviceApi.remove;

export { api };

export default {
  getAllServices,
  getFeaturedServices,
  getServiceBySlug,
  getServiceById,
  createService,
  updateService,
  deleteService,
};
