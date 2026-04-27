import api, { request } from "@/services/api";

export const getDashboardStats = () => request(api.get("/dashboard/stats"));

export default {
  getDashboardStats,
};
