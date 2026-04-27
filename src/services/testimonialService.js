import api from "@/services/api";
import { createCrudService, filterFeatured } from "@/services/resourceService";

const testimonialApi = createCrudService("/testimonials");

export const getAllTestimonials = testimonialApi.getAll;

export const getFeaturedTestimonials = async () => {
  const response = await getAllTestimonials();
  return {
    ...response,
    data: filterFeatured(response.data, "isActive", true),
  };
};

export const getTestimonialById = testimonialApi.getById;
export const createTestimonial = testimonialApi.create;
export const updateTestimonial = testimonialApi.update;
export const deleteTestimonial = testimonialApi.remove;

export { api };

export default {
  getAllTestimonials,
  getFeaturedTestimonials,
  getTestimonialById,
  createTestimonial,
  updateTestimonial,
  deleteTestimonial,
};
