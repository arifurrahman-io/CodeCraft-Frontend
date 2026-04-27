import { Link } from "react-router-dom";
import {
  ArrowRight,
  Globe,
  Smartphone,
  Palette,
  Cloud,
  ShoppingCart,
  Code,
} from "lucide-react";
import { motion } from "framer-motion";

const iconMap = {
  Globe,
  Smartphone,
  Palette,
  Cloud,
  ShoppingCart,
  Code,
};

const ServiceCard = ({ service, index = 0 }) => {
  const Icon = iconMap[service.icon] || Globe;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      className="group"
    >
      <div className="h-full glass rounded-2xl p-6 border border-slate-700/50 hover:border-cyan-500/30 transition-all duration-300">
        {/* Icon */}
        <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-600/20 flex items-center justify-center mb-6 group-hover:from-cyan-500/30 group-hover:to-blue-600/30 transition-all">
          <Icon className="w-7 h-7 text-cyan-500" />
        </div>

        {/* Content */}
        <h3 className="text-xl font-semibold text-slate-100 mb-3 group-hover:text-cyan-400 transition-colors">
          {service.title}
        </h3>
        <p className="text-slate-400 mb-4 line-clamp-2">
          {service.shortDescription}
        </p>

        {/* Features */}
        {service.features && (
          <ul className="space-y-2 mb-6">
            {service.features.slice(0, 3).map((feature, idx) => (
              <li
                key={idx}
                className="flex items-center gap-2 text-sm text-slate-500"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-500" />
                {feature}
              </li>
            ))}
          </ul>
        )}

        {/* Price & Duration */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-700/50 mb-4">
          <div>
            <p className="text-xs text-slate-500">Starting from</p>
            <p className="text-lg font-semibold text-cyan-500">
              {service.priceRange}
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs text-slate-500">Duration</p>
            <p className="text-sm text-slate-300">
              {service.duration || "Negotiable"}
            </p>
          </div>
        </div>

        {/* Link */}
        <Link
          to={`/services/${service.slug}`}
          className="inline-flex items-center gap-2 text-sm font-medium text-cyan-500 hover:text-cyan-400 transition-colors"
        >
          Learn More
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </motion.div>
  );
};

export default ServiceCard;
