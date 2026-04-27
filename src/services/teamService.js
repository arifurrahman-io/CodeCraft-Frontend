import api from "@/services/api";
import { createCrudService } from "@/services/resourceService";

const teamApi = createCrudService("/team");

export const getAllTeam = teamApi.getAll;
export const getTeamBySlug = teamApi.getBySlug;
export const getTeamMemberById = teamApi.getById;
export const createTeamMember = (memberData) =>
  teamApi.create({
    ...memberData,
    joinDate: memberData.joinDate || new Date().toISOString().slice(0, 10),
  });
export const updateTeamMember = teamApi.update;
export const deleteTeamMember = teamApi.remove;

export { api };

export default {
  getAllTeam,
  getTeamBySlug,
  getTeamMemberById,
  createTeamMember,
  updateTeamMember,
  deleteTeamMember,
};
