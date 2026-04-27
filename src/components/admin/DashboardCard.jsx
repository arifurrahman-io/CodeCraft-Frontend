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
    cyan: "from-cyan-500/20 to-cyan-600/10 text-cyan-500",
    blue: "from-blue-500/20 to-blue-600/10 text-blue-500",
    purple: "from-purple-500/20 to-purple-600/10 text-purple-500",
    green: "from-green-500/20 to-green-600/10 text-green-500",
    orange: "from-orange-500/20 to-orange-600/10 text-orange-500",
  };

  const getTrendIcon = () => {
    if (!trend) return null;
    if (trend === "up") return <TrendingUp className="w-4 h-4" />;
    if (trend === "down") return <TrendingDown className="w-4 h-4" />;
    return <Minus className="w-4 h-4" />;
  };

  const getTrendColor = () => {
    if (!trend) return "";
    if (trend === "up") return "text-green-500";
    if (trend === "down") return "text-red-500";
    return "text-slate-500";
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      className="glass rounded-xl p-6 border border-slate-700/50"
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-slate-500 mb-1">{title}</p>
          <p className="text-3xl font-bold text-slate-100">{value}</p>
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
          className={`w-12 h-12 rounded-xl bg-gradient-to-br ${colorClasses[color]} flex items-center justify-center`}
        >
          {Icon && <Icon className="w-6 h-6" />}
        </div>
      </div>
    </motion.div>
  );
};

export default DashboardCard;
