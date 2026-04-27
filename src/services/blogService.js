import api from "@/services/api";
import { createCrudService, filterFeatured } from "@/services/resourceService";

const blogApi = createCrudService("/blogs");

export const getAllBlogs = blogApi.getAll;

export const getFeaturedBlogs = async () => {
  const response = await getAllBlogs();
  return {
    ...response,
    data: filterFeatured(response.data, "status", "published"),
  };
};

export const getBlogBySlug = blogApi.getBySlug;
export const getBlogById = blogApi.getById;
export const createBlog = (blogData) =>
  blogApi.create({ ...blogData, views: blogData.views || 0 });
export const updateBlog = blogApi.update;
export const deleteBlog = blogApi.remove;

export { api };

export default {
  getAllBlogs,
  getFeaturedBlogs,
  getBlogBySlug,
  getBlogById,
  createBlog,
  updateBlog,
  deleteBlog,
};
