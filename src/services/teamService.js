import api from "@/services/api";
import { createCrudService } from "@/services/resourceService";

const teamApi = createCrudService("/team");

const extractTeamMembers = (payload) => {
  if (Array.isArray(payload)) return payload;
  if (!payload || typeof payload !== "object") return [];

  const collectionKeys = [
    "teamMembers",
    "teamMember",
    "members",
    "member",
    "team",
    "data",
    "items",
    "docs",
    "results",
  ];

  for (const key of collectionKeys) {
    const value = payload[key];
    if (Array.isArray(value)) return value;
    if (value && typeof value === "object") {
      const nested = extractTeamMembers(value);
      if (nested.length) return nested;
    }
  }

  return [];
};

const normalizeTeamMember = (member = {}) => {
  const designation = member.designation || member.position || "Team Member";
  const photo = member.photo || member.image || "";
  const bio =
    member.bio || member.description || member.shortDescription || "";
  const isActive =
    typeof member.isActive === "boolean"
      ? member.isActive
      : member.status === "inactive"
        ? false
        : true;

  return {
    ...member,
    _id: member._id || member.id,
    id: member.id || member._id,
    name: member.name || "Unnamed Member",
    designation,
    position: designation,
    photo,
    image: photo,
    bio,
    shortDescription: member.shortDescription || bio,
    description: member.description || bio,
    skills: Array.isArray(member.skills) ? member.skills : [],
    isActive,
    status: isActive ? "active" : "inactive",
    order: Number(member.order || 0),
  };
};

const normalizeTeamPayload = (memberData = {}) => {
  const designation = memberData.designation || memberData.position || "";
  const photo = memberData.photo || memberData.image || "";
  const bio =
    memberData.bio ||
    memberData.description ||
    memberData.shortDescription ||
    "";
  const isActive =
    typeof memberData.isActive === "boolean"
      ? memberData.isActive
      : memberData.status === "inactive"
        ? false
        : true;

  return {
    ...memberData,
    designation,
    position: designation,
    photo,
    image: photo,
    bio,
    shortDescription: memberData.shortDescription || bio,
    description: memberData.description || bio,
    skills: Array.isArray(memberData.skills) ? memberData.skills : [],
    isActive,
    status: isActive ? "active" : "inactive",
    order: Number(memberData.order || 0),
  };
};

export const getAllTeam = async () => {
  const response = await teamApi.getAll();
  return {
    ...response,
    data: extractTeamMembers(response.data)
      .map(normalizeTeamMember)
      .sort((a, b) => a.order - b.order),
  };
};

export const getTeamBySlug = async (slug) => {
  const response = await getAllTeam();
  return {
    ...response,
    data: response.data.find((member) => member.slug === slug),
  };
};

export const getTeamMemberById = async (id) => {
  const response = await getAllTeam();
  return {
    ...response,
    data: response.data.find(
      (member) => member._id === id || member.id === id,
    ),
  };
};

export const createTeamMember = (memberData) =>
  teamApi.create({
    ...normalizeTeamPayload(memberData),
    joinDate: memberData.joinDate || new Date().toISOString().slice(0, 10),
  });

export const updateTeamMember = (id, memberData) =>
  teamApi.update(id, normalizeTeamPayload(memberData));

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
