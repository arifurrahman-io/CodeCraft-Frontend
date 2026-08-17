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
import EmptyState from "@/components/common/EmptyState";
import Loader from "@/components/common/Loader";
import StatusBadge from "@/components/admin/StatusBadge";
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
        <div className="bg-surface rounded-xl p-12 border border-border">
          <Loader text="Loading message..." />
        </div>
      </div>
    );
  }

  if (!message) {
    return (
      <EmptyState
        title="Message not found"
        description="This message may have been deleted or the link is invalid."
        action={
          <Button variant="outline" onClick={() => navigate("/admin/messages")}>
            Back to Messages
          </Button>
        }
      />
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
          className="p-2 rounded-lg text-ink-muted hover:text-ink hover:bg-ink/5"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        <div>
          <h1 className="text-2xl font-bold text-ink">Message Details</h1>
          <p className="text-ink-muted">View contact form submission</p>
        </div>
      </div>

      <div className="bg-surface rounded-xl p-6 border border-border space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-ink">
              {message.projectType || "Project Inquiry"}
            </h2>
            <p className="text-sm text-ink-muted">
              Budget: {message.budgetRange || "Not specified"}
            </p>
          </div>

          <StatusBadge status={message.status} />
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-canvas flex items-center justify-center">
              <User className="w-5 h-5 text-ink" />
            </div>
            <div>
              <p className="text-sm text-ink-muted">From</p>
              <p className="text-ink">{message.name}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Mail className="w-5 h-5 text-ink-muted" />
            <div>
              <p className="text-sm text-ink-muted">Email</p>
              <p className="text-ink break-all">{message.email}</p>
            </div>
          </div>

          {message.phone && (
            <div className="flex items-center gap-3">
              <Phone className="w-5 h-5 text-ink-muted" />
              <div>
                <p className="text-sm text-ink-muted">Phone</p>
                <p className="text-ink">{message.phone}</p>
              </div>
            </div>
          )}

          {message.company && (
            <div className="flex items-center gap-3">
              <Building2 className="w-5 h-5 text-ink-muted" />
              <div>
                <p className="text-sm text-ink-muted">Company</p>
                <p className="text-ink">{message.company}</p>
              </div>
            </div>
          )}

          {message.projectType && (
            <div className="flex items-center gap-3">
              <Briefcase className="w-5 h-5 text-ink-muted" />
              <div>
                <p className="text-sm text-ink-muted">Project Type</p>
                <p className="text-ink">{message.projectType}</p>
              </div>
            </div>
          )}

          {message.budgetRange && (
            <div className="flex items-center gap-3">
              <Wallet className="w-5 h-5 text-ink-muted" />
              <div>
                <p className="text-sm text-ink-muted">Budget Range</p>
                <p className="text-ink">{message.budgetRange}</p>
              </div>
            </div>
          )}

          <div className="flex items-center gap-3">
            <Calendar className="w-5 h-5 text-ink-muted" />
            <div>
              <p className="text-sm text-ink-muted">Date</p>
              <p className="text-ink">{formatDate(message.createdAt)}</p>
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-border">
          <p className="text-sm text-ink-muted mb-2">Message</p>
          <p className="text-ink whitespace-pre-line leading-7">
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
