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

const formatPrice = (priceRange) => {
  if (priceRange == null || priceRange === "") return null;
  const raw = String(priceRange).trim();
  if (/^\d+(\.\d+)?$/.test(raw)) {
    const n = Number(raw);
    return `From ৳${n.toLocaleString("en-BD")}`;
  }
  return raw;
};

const ServiceCard = ({ service, index = 0 }) => {
  const Icon = iconMap[service.icon] || Globe;
  const priceLabel = formatPrice(service.priceRange);
  const order = String(index + 1).padStart(2, "0");

  return (
    <motion.article
      initial={{ opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{
        duration: 0.5,
        delay: index * 0.08,
        ease: [0.22, 1, 0.36, 1],
      }}
      className="group h-full"
    >
      <Link
        to={`/services/${service.slug}`}
        className="relative flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-surface p-6 md:p-7 transition-all duration-300 ease-smooth hover:border-accent/35 hover:shadow-lift"
      >
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent/50 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute -right-8 -top-8 h-28 w-28 rounded-full bg-accent/5 blur-2xl opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          aria-hidden="true"
        />

        <div className="relative mb-6 flex items-start justify-between gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent-soft text-accent ring-1 ring-accent/10 transition-transform duration-300 ease-smooth group-hover:scale-105">
            <Icon className="h-5 w-5" strokeWidth={1.75} />
          </div>
          <span className="font-display text-sm font-medium tabular-nums text-ink-subtle/80">
            {order}
          </span>
        </div>

        <h3 className="relative font-display text-xl font-semibold tracking-tight text-ink transition-colors duration-300 group-hover:text-accent">
          {service.title}
        </h3>

        <p className="relative mt-3 mb-5 line-clamp-3 flex-1 text-[15px] leading-relaxed text-ink-muted">
          {service.shortDescription}
        </p>

        {service.features?.length > 0 && (
          <ul className="relative mb-6 space-y-2.5">
            {service.features.slice(0, 3).map((feature, idx) => (
              <li
                key={idx}
                className="flex items-start gap-2.5 text-sm text-ink-subtle"
              >
                <span
                  className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent"
                  aria-hidden="true"
                />
                <span className="leading-snug">{feature}</span>
              </li>
            ))}
          </ul>
        )}

        <div className="relative mt-auto flex items-end justify-between gap-4 border-t border-border/80 pt-5">
          <div className="min-w-0">
            {priceLabel ? (
              <>
                <p className="text-[11px] font-medium uppercase tracking-wider text-ink-subtle">
                  Pricing
                </p>
                <p className="mt-1 truncate text-sm font-semibold text-ink">
                  {priceLabel}
                </p>
              </>
            ) : (
              <p className="text-sm text-ink-subtle">Scoped to your needs</p>
            )}
          </div>
          <span className="inline-flex shrink-0 items-center gap-1.5 text-sm font-medium text-accent">
            Learn more
            <ArrowRight className="h-4 w-4 transition-transform duration-300 ease-smooth group-hover:translate-x-1" />
          </span>
        </div>
      </Link>
    </motion.article>
  );
};

export default ServiceCard;
