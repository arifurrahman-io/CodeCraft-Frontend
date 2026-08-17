import api, { request } from "@/services/api";

const endpoint = "/cv-submissions";

export const submitCv = (cvData) => request(api.post(endpoint, cvData));
export const getAllCvSubmissions = () => request(api.get(endpoint));
export const getCvSubmissionById = (id) =>
  request(api.get(`${endpoint}/${id}`));
export const updateCvSubmissionStatus = (id, payload) =>
  request(api.patch(`${endpoint}/${id}/status`, payload));

export { api };

export default {
  submitCv,
  getAllCvSubmissions,
  getCvSubmissionById,
  updateCvSubmissionStatus,
};
