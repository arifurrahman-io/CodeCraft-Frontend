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
      className={`flex flex-col items-center justify-center py-12 ${className}`}
    >
      <div className="w-16 h-16 rounded-full bg-slate-800 flex items-center justify-center mb-4">
        <Icon className="w-8 h-8 text-slate-500" />
      </div>
      <h3 className="text-lg font-semibold text-slate-300 mb-2">{title}</h3>
      <p className="text-slate-500 text-center max-w-md mb-6">{description}</p>
      {action && <div>{action}</div>}
    </div>
  );
};

export default EmptyState;
