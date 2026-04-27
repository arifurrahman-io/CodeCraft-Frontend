import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Mail,
  Phone,
  Calendar,
  Building2,
  Briefcase,
  Wallet,
  User,
} from "lucide-react";
import { toast } from "sonner";

import Button from "@/components/common/Button";
import { getMessageById, markMessageAsRead } from "@/services/contactService";

const getMessageFromResponse = (response) =>
  response?.data?.message ||
  response?.data?.contact ||
  response?.data?.data ||
  response?.data ||
  response?.message ||
  response?.contact ||
  response ||
  null;

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

  return new Date(date).toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
};

const MessageDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [message, setMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const loadMessage = async () => {
      try {
        setIsLoading(true);

        const response = await getMessageById(id);
        const messageData = normalizeMessage(getMessageFromResponse(response));

        if (mounted) {
          setMessage({
            ...messageData,
            status:
              messageData.status === "unread" ? "read" : messageData.status,
          });
        }

        if (messageData.status === "unread") {
          await markMessageAsRead(id);
        }
      } catch (error) {
        toast.error(error?.response?.data?.message || "Failed to load message");
        if (mounted) setMessage(null);
      } finally {
        if (mounted) setIsLoading(false);
      }
    };

    if (id) loadMessage();

    return () => {
      mounted = false;
    };
  }, [id]);

  if (isLoading) {
    return (
      <div className="mx-auto w-full max-w-4xl">
        <div className="glass rounded-xl p-6 border border-slate-700/50">
          <p className="text-slate-300">Loading message...</p>
        </div>
      </div>
    );
  }

  if (!message) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-400 mb-4">Message not found</p>
        <Button variant="outline" onClick={() => navigate("/admin/messages")}>
          Back to Messages
        </Button>
      </div>
    );
  }

  const mailSubject = encodeURIComponent(
    `Re: ${message.projectType || "Project Inquiry"}`,
  );

  const mailBody = encodeURIComponent(
    `Hello ${message.name},\n\nThank you for contacting us.\n\n`,
  );

  return (
    <div className="mx-auto w-full max-w-4xl">
      <div className="flex items-center gap-4 mb-6">
        <button
          type="button"
          onClick={() => navigate("/admin/messages")}
          className="p-2 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        <div>
          <h1 className="text-2xl font-bold text-slate-100">Message Details</h1>
          <p className="text-slate-400">View contact form submission</p>
        </div>
      </div>

      <div className="glass rounded-xl p-6 border border-slate-700/50 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-slate-100">
              {message.projectType || "Project Inquiry"}
            </h2>
            <p className="text-sm text-slate-500">
              Budget: {message.budgetRange || "Not specified"}
            </p>
          </div>

          <span
            className={`px-3 py-1 rounded-full text-sm w-fit ${
              message.status === "replied"
                ? "bg-green-500/20 text-green-500"
                : message.status === "read"
                  ? "bg-blue-500/20 text-blue-500"
                  : "bg-cyan-500/20 text-cyan-500"
            }`}
          >
            {message.status}
          </span>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center">
              <User className="w-5 h-5 text-slate-300" />
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
              <p className="text-slate-100 break-all">{message.email}</p>
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

          {message.company && (
            <div className="flex items-center gap-3">
              <Building2 className="w-5 h-5 text-slate-500" />
              <div>
                <p className="text-sm text-slate-500">Company</p>
                <p className="text-slate-100">{message.company}</p>
              </div>
            </div>
          )}

          {message.projectType && (
            <div className="flex items-center gap-3">
              <Briefcase className="w-5 h-5 text-slate-500" />
              <div>
                <p className="text-sm text-slate-500">Project Type</p>
                <p className="text-slate-100">{message.projectType}</p>
              </div>
            </div>
          )}

          {message.budgetRange && (
            <div className="flex items-center gap-3">
              <Wallet className="w-5 h-5 text-slate-500" />
              <div>
                <p className="text-sm text-slate-500">Budget Range</p>
                <p className="text-slate-100">{message.budgetRange}</p>
              </div>
            </div>
          )}

          <div className="flex items-center gap-3">
            <Calendar className="w-5 h-5 text-slate-500" />
            <div>
              <p className="text-sm text-slate-500">Date</p>
              <p className="text-slate-100">{formatDate(message.createdAt)}</p>
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-slate-700">
          <p className="text-sm text-slate-500 mb-2">Message</p>
          <p className="text-slate-300 whitespace-pre-line leading-7">
            {message.message}
          </p>
        </div>
      </div>

      <div className="flex justify-end gap-4 mt-6">
        <Button variant="ghost" onClick={() => navigate("/admin/messages")}>
          Back
        </Button>

        {message.email && (
          <a
            href={`mailto:${message.email}?subject=${mailSubject}&body=${mailBody}`}
          >
            <Button icon={Mail}>Reply via Email</Button>
          </a>
        )}
      </div>
    </div>
  );
};

export default MessageDetailsPage;
