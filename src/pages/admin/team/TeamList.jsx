import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Plus, Search } from "lucide-react";
import { toast } from "sonner";

import Button from "@/components/common/Button";
import Input from "@/components/common/Input";
import Loader from "@/components/common/Loader";
import DataTable from "@/components/admin/DataTable";
import StatusBadge from "@/components/admin/StatusBadge";
import { deleteTeamMember, getAllTeam } from "@/services/teamService";

const fallbackPhoto =
  "https://ui-avatars.com/api/?name=Team+Member&background=f0fdfa&color=0d9488";

const getTeamFromResponse = (response) => {
  if (Array.isArray(response)) return response;
  if (Array.isArray(response?.data)) return response.data;
  if (Array.isArray(response?.data?.team)) return response.data.team;
  if (Array.isArray(response?.data?.members)) return response.data.members;
  if (Array.isArray(response?.data?.data)) return response.data.data;
  if (Array.isArray(response?.team)) return response.team;
  if (Array.isArray(response?.members)) return response.members;
  return [];
};

const normalizeMember = (member = {}) => ({
  ...member,
  _id: member._id || member.id,
  name: member.name || "Unnamed Member",
  designation: member.designation || member.position || "Team Member",
  photo: member.photo || member.image || fallbackPhoto,
  bio: member.bio || "",
  skills: Array.isArray(member.skills) ? member.skills : [],
  facebook: member.facebook || "",
  linkedin: member.linkedin || "",
  github: member.github || "",
  website: member.website || "",
  order: Number(member.order || 0),
  isActive:
    typeof member.isActive === "boolean"
      ? member.isActive
      : member.status === "inactive"
        ? false
        : true,
});

const TeamListPage = () => {
  const [team, setTeam] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [isLoading, setIsLoading] = useState(true);

  const fetchTeam = useCallback(async () => {
    try {
      const response = await getAllTeam();
      const teamData = getTeamFromResponse(response)
        .map(normalizeMember)
        .sort((a, b) => a.order - b.order);

      setTeam(teamData);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to load team");
      setTeam([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    queueMicrotask(fetchTeam);
  }, [fetchTeam]);

  const handleDelete = async (id) => {
    try {
      await deleteTeamMember(id);
      setTeam((prev) => prev.filter((member) => member._id !== id));
      toast.success("Team member deleted successfully");
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Failed to delete team member",
      );
      throw error;
    }
  };

  const filteredTeam = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();

    return team.filter((member) => {
      const status = member.isActive ? "active" : "inactive";

      const matchesSearch =
        !query ||
        [member.name, member.designation, member.bio, member.skills.join(" ")]
          .join(" ")
          .toLowerCase()
          .includes(query);

      const matchesStatus = filterStatus === "all" || status === filterStatus;

      return matchesSearch && matchesStatus;
    });
  }, [team, searchTerm, filterStatus]);

  const columns = [
    {
      header: "Member",
      accessor: "name",
      render: (row) => (
        <div className="flex items-center gap-4">
          <img
            src={row.photo}
            alt={row.name}
            className="w-12 h-12 rounded-full object-cover border border-border"
            onError={(e) => {
              e.currentTarget.src = fallbackPhoto;
            }}
          />

          <div>
            <h3 className="font-medium text-ink">{row.name}</h3>
            <p className="text-sm text-ink-muted">{row.designation}</p>
          </div>
        </div>
      ),
    },
    {
      header: "Skills",
      accessor: "skills",
      render: (row) => (
        <div className="flex flex-wrap gap-1">
          {row.skills?.length ? (
            row.skills.slice(0, 3).map((skill, index) => (
              <span
                key={`${skill}-${index}`}
                className="px-2 py-1 rounded-md bg-canvas text-xs text-ink"
              >
                {skill}
              </span>
            ))
          ) : (
            <span className="text-ink-muted text-sm">No skills</span>
          )}
        </div>
      ),
    },
    {
      header: "Order",
      accessor: "order",
      render: (row) => <span className="text-ink">{row.order}</span>,
    },
    {
      header: "Status",
      accessor: "isActive",
      render: (row) => (
        <StatusBadge status={row.isActive ? "active" : "inactive"} />
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-ink">Team</h1>
          <p className="text-ink-muted">Manage team members</p>
        </div>

        <Link to="/admin/team/create">
          <Button icon={Plus}>Add Team Member</Button>
        </Link>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <Input
            placeholder="Search team members..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            icon={Search}
          />
        </div>

        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-4 py-2.5 bg-surface border border-border rounded-lg text-ink focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent"
        >
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>

      {isLoading ? (
        <div className="bg-surface rounded-xl p-12 border border-border">
          <Loader text="Loading team members..." />
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={filteredTeam}
          basePath="/admin/team"
          viewPath={() => "/about"}
          onDelete={handleDelete}
          deleteTitle="Delete team member"
          deleteMessage="Are you sure you want to delete this team member? This action cannot be undone."
          emptyMessage="No team members"
        />
      )}
    </div>
  );
};

export default TeamListPage;
