import { FileQuestion } from "lucide-react";

const EmptyState = ({
  icon: Icon = FileQuestion,
  title = "No data found",
  description = "There is nothing to display here yet.",
  action,
  className = "",
}) => {
  return (
    <div
      className={`flex flex-col items-center justify-center py-16 ${className}`}
    >
      <div className="w-14 h-14 rounded-xl bg-accent-soft flex items-center justify-center mb-4">
        <Icon className="w-7 h-7 text-accent" />
      </div>
      <h3 className="text-lg font-semibold text-ink mb-2">{title}</h3>
      <p className="text-ink-muted text-center max-w-md mb-6">{description}</p>
      {action && <div>{action}</div>}
    </div>
  );
};

export default EmptyState;
