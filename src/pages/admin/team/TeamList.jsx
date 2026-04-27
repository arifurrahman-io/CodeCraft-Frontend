import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import Button from "@/components/common/Button";
import DataTable from "@/components/admin/DataTable";
import { deleteTeamMember, getAllTeam } from "@/services/teamService";

const TeamListPage = () => {
  const [team, setTeam] = useState([]);

  useEffect(() => {
    getAllTeam()
      .then((response) => {
        const teamData = response.data;
        // Ensure data is always an array
        setTeam(Array.isArray(teamData) ? teamData : []);
      })
      .catch(() => setTeam([]));
  }, []);

  const handleDelete = async (id) => {
    try {
      await deleteTeamMember(id);
      setTeam(team.filter((t) => t._id !== id));
      toast.success("Team member deleted");
    } catch {
      toast.error("Failed to delete");
    }
  };

  const columns = [
    {
      header: "Member",
      accessor: "name",
      render: (row) => (
        <div className="flex items-center gap-4">
          <img
            src={row.photo}
            alt={row.name}
            className="w-12 h-12 rounded-full object-cover"
          />
          <div>
            <h3 className="font-medium text-slate-100">{row.name}</h3>
            <p className="text-sm text-slate-500">{row.email}</p>
          </div>
        </div>
      ),
    },
    { header: "Position", accessor: "designation" },
    {
      header: "Status",
      accessor: "status",
      render: (row) => (
        <span
          className={`px-2 py-1 rounded-full text-xs ${row.status === "active" ? "bg-green-500/20 text-green-500" : "bg-slate-700 text-slate-400"}`}
        >
          {row.status}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-100">Team</h1>
          <p className="text-slate-400">Manage team members</p>
        </div>
        <Link to="/admin/team/create">
          <Button icon={Plus}>Add Team Member</Button>
        </Link>
      </div>

      <DataTable
        columns={columns}
        data={team}
        basePath="/admin/team"
        viewPath={(row) => `/about#${row.slug}`}
        onDelete={handleDelete}
        emptyMessage="No team members"
      />
    </div>
  );
};

export default TeamListPage;
