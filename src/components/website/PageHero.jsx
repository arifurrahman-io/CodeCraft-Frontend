import { motion } from "framer-motion";

/**
 * Shared intro for interior marketing pages — one job, brand-adjacent typography.
 */
const PageHero = ({
  subtitle,
  title,
  description,
  className = "",
}) => {
  return (
    <section className={`page-hero ${className}`}>
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_0%_0%,rgba(13,148,136,0.07),transparent_50%)]"
        aria-hidden="true"
      />
      <div className="relative container-custom">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-3xl"
        >
          {subtitle && (
            <p className="text-sm font-semibold text-accent tracking-wide mb-3">
              {subtitle}
            </p>
          )}
          <h1 className="font-display text-4xl md:text-5xl font-bold text-ink tracking-tight text-balance leading-[1.1] mb-4">
            {title}
          </h1>
          {description && (
            <p className="text-lg text-ink-muted leading-relaxed max-w-2xl">
              {description}
            </p>
          )}
        </motion.div>
      </div>
    </section>
  );
};

export default PageHero;
