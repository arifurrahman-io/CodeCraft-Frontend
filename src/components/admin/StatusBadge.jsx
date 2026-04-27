const statusColors = {
  active: {
    bg: "bg-green-500/20",
    text: "text-green-500",
    border: "border-green-500/30",
  },
  inactive: {
    bg: "bg-red-500/20",
    text: "text-red-500",
    border: "border-red-500/30",
  },
  pending: {
    bg: "bg-yellow-500/20",
    text: "text-yellow-500",
    border: "border-yellow-500/30",
  },
  draft: {
    bg: "bg-slate-500/20",
    text: "text-slate-500",
    border: "border-slate-500/30",
  },
  published: {
    bg: "bg-green-500/20",
    text: "text-green-500",
    border: "border-green-500/30",
  },
  archived: {
    bg: "bg-slate-500/20",
    text: "text-slate-500",
    border: "border-slate-500/30",
  },
  read: {
    bg: "bg-blue-500/20",
    text: "text-blue-500",
    border: "border-blue-500/30",
  },
  unread: {
    bg: "bg-cyan-500/20",
    text: "text-cyan-500",
    border: "border-cyan-500/30",
  },
  completed: {
    bg: "bg-green-500/20",
    text: "text-green-500",
    border: "border-green-500/30",
  },
  in_progress: {
    bg: "bg-yellow-500/20",
    text: "text-yellow-500",
    border: "border-yellow-500/30",
  },
};

const StatusBadge = ({ status, children, size = "md", dot = false }) => {
  const colors = statusColors[status] || statusColors.draft;

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
        <span
          className={`w-1.5 h-1.5 rounded-full ${colors.bg.replace("/20", "")}`}
        />
      )}
      {children || status}
    </span>
  );
};

export default StatusBadge;
