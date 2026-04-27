import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Mail, Phone, Calendar } from "lucide-react";
import Button from "@/components/common/Button";
import { getMessageById, markMessageAsRead } from "@/services/contactService";

const MessageDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [message, setMessage] = useState(null);

  useEffect(() => {
    const loadMessage = async () => {
      const response = await getMessageById(id);
      if (response.data) {
        setMessage({ ...response.data, isRead: true, status: "read" });
        if (!response.data.isRead) {
          await markMessageAsRead(id);
        }
      }
    };

    loadMessage();
  }, [id]);

  if (!message) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-400">Message not found</p>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-4xl">
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => navigate("/admin/messages")}
          className="p-2 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-slate-100">Message Details</h1>
          <p className="text-slate-400">View message information</p>
        </div>
      </div>

      <div className="glass rounded-xl p-6 border border-slate-700/50 space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-100">
            {message.subject}
          </h2>
          <span
            className={`px-3 py-1 rounded-full text-sm ${message.isRead ? "bg-blue-500/20 text-blue-500" : "bg-cyan-500/20 text-cyan-500"}`}
          >
            {message.isRead ? "Read" : "Unread"}
          </span>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center">
              <span className="text-slate-300 font-medium">
                {message.name.charAt(0)}
              </span>
            </div>
            <div>
              <p className="text-sm text-slate-500">From</p>
              <p className="text-slate-100">{message.name}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Mail className="w-5 h-5 text-slate-500" />
            <div>
              <p className="text-sm text-slate-500">Email</p>
              <p className="text-slate-100">{message.email}</p>
            </div>
          </div>
          {message.phone && (
            <div className="flex items-center gap-3">
              <Phone className="w-5 h-5 text-slate-500" />
              <div>
                <p className="text-sm text-slate-500">Phone</p>
                <p className="text-slate-100">{message.phone}</p>
              </div>
            </div>
          )}
          <div className="flex items-center gap-3">
            <Calendar className="w-5 h-5 text-slate-500" />
            <div>
              <p className="text-sm text-slate-500">Date</p>
              <p className="text-slate-100">
                {message.createdAt?.split("T")[0] || ""}
              </p>
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-slate-700">
          <p className="text-sm text-slate-500 mb-2">Message</p>
          <p className="text-slate-300">{message.message}</p>
        </div>
      </div>

      <div className="flex justify-end gap-4 mt-6">
        <Button variant="ghost" onClick={() => navigate("/admin/messages")}>
          Back
        </Button>
        <a href={`mailto:${message.email}`}>
          <Button icon={Mail}>Reply via Email</Button>
        </a>
      </div>
    </div>
  );
};

export default MessageDetailsPage;
