import { useCallback, useEffect, useMemo, useState } from "react";
import { Search } from "lucide-react";
import { toast } from "sonner";

import Input from "@/components/common/Input";
import DataTable from "@/components/admin/DataTable";
import StatusBadge from "@/components/admin/StatusBadge";
import { deleteMessage, getAllMessages } from "@/services/contactService";

const getMessagesFromResponse = (response) => {
  if (Array.isArray(response)) return response;
  if (Array.isArray(response?.data)) return response.data;
  if (Array.isArray(response?.data?.messages)) return response.data.messages;
  if (Array.isArray(response?.data?.contacts)) return response.data.contacts;
  if (Array.isArray(response?.data?.data)) return response.data.data;
  if (Array.isArray(response?.messages)) return response.messages;
  return [];
};

const normalizeMessage = (message = {}) => ({
  ...message,
  _id: message._id || message.id,
  name: message.name || "Unknown",
  email: message.email || "",
  phone: message.phone || "",
  company: message.company || "",
  projectType: message.projectType || "",
  budgetRange: message.budgetRange || "",
  message: message.message || "",
  status: message.status || (message.isRead ? "read" : "unread"),
  createdAt: message.createdAt || "",
});

const formatDate = (date) => {
  if (!date) return "";

  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const MessageListPage = () => {
  const [messages, setMessages] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [isLoading, setIsLoading] = useState(true);

  const fetchMessages = useCallback(async () => {
    try {
      setIsLoading(true);

      const response = await getAllMessages();
      const messageData =
        getMessagesFromResponse(response).map(normalizeMessage);

      setMessages(messageData);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to load messages");
      setMessages([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this message?",
    );

    if (!confirmed) return;

    try {
      await deleteMessage(id);
      setMessages((prev) => prev.filter((message) => message._id !== id));
      toast.success("Message deleted successfully");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to delete message");
    }
  };

  const filteredMessages = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();

    return messages.filter((message) => {
      const matchesSearch =
        !query ||
        [
          message.name,
          message.email,
          message.phone,
          message.company,
          message.projectType,
          message.budgetRange,
          message.message,
          message.status,
        ]
          .join(" ")
          .toLowerCase()
          .includes(query);

      const matchesStatus =
        filterStatus === "all" || message.status === filterStatus;

      return matchesSearch && matchesStatus;
    });
  }, [messages, searchTerm, filterStatus]);

  const columns = [
    {
      header: "Contact",
      accessor: "name",
      render: (row) => (
        <div>
          <h3
            className={`font-medium ${
              row.status === "unread" ? "text-slate-100" : "text-slate-400"
            }`}
          >
            {row.name}
          </h3>
          <p className="text-sm text-slate-500">{row.email}</p>
          {row.phone && <p className="text-xs text-slate-600">{row.phone}</p>}
        </div>
      ),
    },
    {
      header: "Company",
      accessor: "company",
      render: (row) => (
        <span className="text-slate-300">{row.company || "N/A"}</span>
      ),
    },
    {
      header: "Project",
      accessor: "projectType",
      render: (row) => (
        <div>
          <p className="text-slate-300">{row.projectType || "N/A"}</p>
          <p className="text-xs text-slate-500">
            {row.budgetRange || "No budget"}
          </p>
        </div>
      ),
    },
    {
      header: "Message",
      accessor: "message",
      render: (row) => (
        <p className="max-w-xs truncate text-slate-400">{row.message}</p>
      ),
    },
    {
      header: "Status",
      accessor: "status",
      render: (row) => <StatusBadge status={row.status} dot />,
    },
    {
      header: "Date",
      accessor: "createdAt",
      render: (row) => (
        <span className="text-slate-400">{formatDate(row.createdAt)}</span>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-100">Messages</h1>
        <p className="text-slate-400">View contact form submissions</p>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <Input
            placeholder="Search messages..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            icon={Search}
          />
        </div>

        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-100 focus:outline-none focus:ring-2 focus:ring-cyan-500"
        >
          <option value="all">All Status</option>
          <option value="unread">Unread</option>
          <option value="read">Read</option>
          <option value="replied">Replied</option>
        </select>
      </div>

      {isLoading ? (
        <div className="glass rounded-xl p-6 border border-slate-700/50">
          <p className="text-slate-300">Loading messages...</p>
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={filteredMessages}
          basePath="/admin/messages"
          showEdit={false}
          onDelete={handleDelete}
          emptyMessage="No messages"
        />
      )}
    </div>
  );
};

export default MessageListPage;
