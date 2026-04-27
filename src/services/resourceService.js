import api, { request } from "@/services/api";

export const asArray = (value) => {
  if (Array.isArray(value)) return value;
  return value ? [value] : [];
};

export const findRecord = (records, id) =>
  asArray(records).find((record) => record._id === id || record.id === id);

export const createCrudService = (endpoint) => ({
  getAll: () => request(api.get(endpoint)),
  getBySlug: (slug) => request(api.get(`${endpoint}/${slug}`)),
  getById: async (id) => {
    const response = await request(api.get(endpoint));
    return {
      ...response,
      data: findRecord(response.data, id),
    };
  },
  create: (payload) => request(api.post(endpoint, payload)),
  update: (id, payload) => request(api.put(`${endpoint}/${id}`, payload)),
  remove: (id) => request(api.delete(`${endpoint}/${id}`)),
});

export const filterFeatured = (records, statusField, activeValue) =>
  asArray(records).filter((record) => {
    const featured = record.isFeatured || record.featured;
    if (!statusField) return featured;
    return featured && (!record[statusField] || record[statusField] === activeValue);
  });
