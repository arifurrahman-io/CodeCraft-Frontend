import { useEffect, useState } from "react";
import { toast } from "sonner";
import DataTable from "@/components/admin/DataTable";
import StatusBadge from "@/components/admin/StatusBadge";
import { deleteMessage, getAllMessages } from "@/services/contactService";

const MessageListPage = () => {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    getAllMessages().then((response) => setMessages(response.data || []));
  }, []);

  const handleDelete = async (id) => {
    try {
      await deleteMessage(id);
      setMessages(messages.filter((m) => m._id !== id));
      toast.success("Message deleted");
    } catch {
      toast.error("Failed to delete");
    }
  };

  const columns = [
    {
      header: "Contact",
      accessor: "name",
      render: (row) => (
        <div>
          <h3
            className={`font-medium ${row.isRead ? "text-slate-400" : "text-slate-100"}`}
          >
            {row.name}
          </h3>
          <p className="text-sm text-slate-500">{row.email}</p>
        </div>
      ),
    },
    { header: "Subject", accessor: "subject" },
    {
      header: "Status",
      accessor: "isRead",
      render: (row) => (
        <StatusBadge status={row.isRead ? "read" : "unread"} dot />
      ),
    },
    {
      header: "Date",
      accessor: "createdAt",
      render: (row) => (
        <span className="text-slate-400">
          {row.createdAt?.split("T")[0] || ""}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-100">Messages</h1>
          <p className="text-slate-400">View contact form submissions</p>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={messages}
        basePath="/admin/messages"
        showEdit={false}
        onDelete={handleDelete}
        emptyMessage="No messages"
      />
    </div>
  );
};

export default MessageListPage;
