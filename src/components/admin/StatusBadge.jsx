const statusColors = {
  active: {
    bg: "bg-emerald-50",
    text: "text-emerald-700",
    border: "border-emerald-200",
    dot: "bg-emerald-500",
  },
  inactive: {
    bg: "bg-red-50",
    text: "text-red-700",
    border: "border-red-200",
    dot: "bg-red-500",
  },
  pending: {
    bg: "bg-amber-50",
    text: "text-amber-700",
    border: "border-amber-200",
    dot: "bg-amber-500",
  },
  draft: {
    bg: "bg-canvas",
    text: "text-ink-muted",
    border: "border-border",
    dot: "bg-ink-subtle",
  },
  published: {
    bg: "bg-emerald-50",
    text: "text-emerald-700",
    border: "border-emerald-200",
    dot: "bg-emerald-500",
  },
  archived: {
    bg: "bg-canvas",
    text: "text-ink-muted",
    border: "border-border",
    dot: "bg-ink-subtle",
  },
  read: {
    bg: "bg-sky-50",
    text: "text-sky-700",
    border: "border-sky-200",
    dot: "bg-sky-500",
  },
  unread: {
    bg: "bg-accent-soft",
    text: "text-accent",
    border: "border-accent/30",
    dot: "bg-accent",
  },
  replied: {
    bg: "bg-emerald-50",
    text: "text-emerald-700",
    border: "border-emerald-200",
    dot: "bg-emerald-500",
  },
  completed: {
    bg: "bg-emerald-50",
    text: "text-emerald-700",
    border: "border-emerald-200",
    dot: "bg-emerald-500",
  },
  in_progress: {
    bg: "bg-amber-50",
    text: "text-amber-700",
    border: "border-amber-200",
    dot: "bg-amber-500",
  },
  paid: {
    bg: "bg-emerald-50",
    text: "text-emerald-700",
    border: "border-emerald-200",
    dot: "bg-emerald-500",
  },
  sent: {
    bg: "bg-sky-50",
    text: "text-sky-700",
    border: "border-sky-200",
    dot: "bg-sky-500",
  },
  overdue: {
    bg: "bg-red-50",
    text: "text-red-700",
    border: "border-red-200",
    dot: "bg-red-500",
  },
  new: {
    bg: "bg-accent-soft",
    text: "text-accent",
    border: "border-accent/30",
    dot: "bg-accent",
  },
  reviewing: {
    bg: "bg-amber-50",
    text: "text-amber-700",
    border: "border-amber-200",
    dot: "bg-amber-500",
  },
  shortlisted: {
    bg: "bg-emerald-50",
    text: "text-emerald-700",
    border: "border-emerald-200",
    dot: "bg-emerald-500",
  },
  rejected: {
    bg: "bg-red-50",
    text: "text-red-700",
    border: "border-red-200",
    dot: "bg-red-500",
  },
  cancelled: {
    bg: "bg-amber-50",
    text: "text-amber-700",
    border: "border-amber-200",
    dot: "bg-amber-500",
  },
};

const normalizeStatus = (status) =>
  String(status || "draft")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "_");

const StatusBadge = ({ status, children, size = "md", dot = false }) => {
  const key = normalizeStatus(status);
  const colors = statusColors[key] || statusColors.draft;

  const sizes = {
    sm: "px-2 py-0.5 text-xs",
    md: "px-3 py-1 text-sm",
    lg: "px-4 py-1.5 text-base",
  };

  return (
    <span
      className={`
        inline-flex items-center gap-1.5 rounded-full font-medium
        ${colors.bg} ${colors.text} ${colors.border}
        border ${sizes[size]}
      `}
    >
      {dot && (
        <span className={`w-1.5 h-1.5 rounded-full ${colors.dot}`} />
      )}
      {children || status}
    </span>
  );
};

export default StatusBadge;
