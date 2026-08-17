import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

const DashboardCard = ({
  title,
  value,
  icon: Icon,
  trend,
  trendValue,
  color = "cyan",
  index = 0,
}) => {
  const colorClasses = {
    cyan: "bg-accent-soft text-accent",
    blue: "bg-sky-50 text-sky-600",
    purple: "bg-violet-50 text-violet-600",
    green: "bg-emerald-50 text-emerald-600",
    orange: "bg-amber-50 text-amber-600",
  };

  const getTrendIcon = () => {
    if (!trend) return null;
    if (trend === "up") return <TrendingUp className="w-4 h-4" />;
    if (trend === "down") return <TrendingDown className="w-4 h-4" />;
    return <Minus className="w-4 h-4" />;
  };

  const getTrendColor = () => {
    if (!trend) return "";
    if (trend === "up") return "text-emerald-600";
    if (trend === "down") return "text-red-600";
    return "text-ink-subtle";
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      className="bg-surface rounded-xl p-6 border border-border"
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-ink-muted mb-1">{title}</p>
          <p className="font-display text-3xl font-bold text-ink tracking-tight">{value}</p>
          {trendValue && (
            <div
              className={`flex items-center gap-1 mt-2 text-sm ${getTrendColor()}`}
            >
              {getTrendIcon()}
              <span>{trendValue}</span>
            </div>
          )}
        </div>
        <div
          className={`w-12 h-12 rounded-xl ${colorClasses[color] || colorClasses.cyan} flex items-center justify-center`}
        >
          {Icon && <Icon className="w-6 h-6" />}
        </div>
      </div>
    </motion.div>
  );
};

export default DashboardCard;
