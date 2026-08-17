import { motion } from "framer-motion";
import {
  SiReact,
  SiVuedotjs,
  SiAngular,
  SiTypescript,
  SiNodedotjs,
  SiPython,
  SiGraphql,
  SiMongodb,
  SiPostgresql,
  SiDocker,
  SiKubernetes,
} from "react-icons/si";
import { FaAws } from "react-icons/fa";
import { TECH_STACK } from "@/utils/constants";

const TECH_META = {
  React: { Icon: SiReact, color: "#61DAFB" },
  Vue: { Icon: SiVuedotjs, color: "#42B883" },
  Angular: { Icon: SiAngular, color: "#DD0031" },
  TypeScript: { Icon: SiTypescript, color: "#3178C6" },
  "Node.js": { Icon: SiNodedotjs, color: "#339933" },
  Python: { Icon: SiPython, color: "#3776AB" },
  GraphQL: { Icon: SiGraphql, color: "#E10098" },
  MongoDB: { Icon: SiMongodb, color: "#47A248" },
  PostgreSQL: { Icon: SiPostgresql, color: "#4169E1" },
  AWS: { Icon: FaAws, color: "#FF9900" },
  Docker: { Icon: SiDocker, color: "#2496ED" },
  Kubernetes: { Icon: SiKubernetes, color: "#326CE5" },
};

const TECH_GROUPS = [
  {
    label: "Frontend",
    description: "Interfaces people enjoy using",
    items: ["React", "Vue", "Angular", "TypeScript"],
  },
  {
    label: "Backend",
    description: "APIs built for scale",
    items: ["Node.js", "Python", "GraphQL"],
  },
  {
    label: "Data",
    description: "Reliable storage layers",
    items: ["MongoDB", "PostgreSQL"],
  },
  {
    label: "Cloud & DevOps",
    description: "Ship and run with confidence",
    items: ["AWS", "Docker", "Kubernetes"],
  },
];

const TechStackSection = () => {
  const marqueeItems = TECH_STACK.map((t) => t.name);

  return (
    <section className="section-padding relative overflow-hidden border-y border-border bg-surface">
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_0%_0%,rgba(13,148,136,0.08),transparent_40%),radial-gradient(ellipse_at_100%_100%,rgba(10,22,40,0.04),transparent_45%)]"
        aria-hidden="true"
      />

      <div className="relative container-custom">
        <div className="mb-12 md:mb-14 grid gap-6 lg:grid-cols-12 lg:items-end">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-8"
          >
            <div className="mb-4 inline-flex items-center gap-2 rounded-lg border border-accent/15 bg-accent-soft/80 px-3 py-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-accent" />
              <span className="text-xs font-semibold tracking-wide text-accent">
                Technology
              </span>
            </div>
            <h2 className="font-display text-3xl md:text-4xl lg:text-[2.85rem] font-bold text-ink tracking-tight mb-3 leading-[1.12]">
              Tools we ship with
            </h2>
            <p className="max-w-xl text-lg leading-relaxed text-ink-muted">
              Modern, proven stack choices for products that need to stay
              maintainable and fast.
            </p>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.15 }}
            className="lg:col-span-4 lg:text-right text-sm leading-relaxed text-ink-subtle"
          >
            Chosen for delivery speed, reliability, and long-term ownership —
            not for trend chasing.
          </motion.p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {TECH_GROUPS.map((group, groupIndex) => (
            <motion.div
              key={group.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.45,
                delay: groupIndex * 0.08,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="group relative overflow-hidden rounded-2xl border border-border bg-canvas/40 p-5 md:p-6 transition-all duration-300 hover:-translate-y-0.5 hover:border-accent/25 hover:bg-surface hover:shadow-lift"
            >
              <div
                className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent/50 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                aria-hidden="true"
              />

              <div className="mb-5">
                <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-accent">
                  {group.label}
                </p>
                <p className="mt-1.5 text-sm text-ink-subtle">
                  {group.description}
                </p>
              </div>

              <ul className="space-y-2">
                {group.items.map((name) => {
                  const meta = TECH_META[name];
                  const Icon = meta?.Icon;
                  return (
                    <li
                      key={name}
                      className="flex items-center gap-3 rounded-xl border border-border/70 bg-surface px-3 py-2.5 transition-colors duration-200 hover:border-accent/20"
                    >
                      <span
                        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-canvas"
                        style={{ color: meta?.color || "var(--color-accent)" }}
                      >
                        {Icon ? (
                          <Icon className="h-4 w-4" aria-hidden="true" />
                        ) : (
                          <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                        )}
                      </span>
                      <span className="text-sm font-medium text-ink">
                        {name}
                      </span>
                    </li>
                  );
                })}
              </ul>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative mt-10 overflow-hidden rounded-2xl border border-border bg-ink"
        >
          <div
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_20%_50%,rgba(13,148,136,0.25),transparent_55%)]"
            aria-hidden="true"
          />
          <div className="relative overflow-hidden py-5">
            <div className="flex w-max gap-3 animate-tech-marquee px-4">
              {[...marqueeItems, ...marqueeItems].map((name, i) => {
                const meta = TECH_META[name];
                const Icon = meta?.Icon;
                return (
                  <span
                    key={`${name}-${i}`}
                    className="inline-flex items-center gap-2.5 rounded-xl border border-white/10 bg-white/[0.04] px-3.5 py-2 text-sm font-medium text-white/80 whitespace-nowrap"
                  >
                    {Icon && (
                      <Icon
                        className="h-3.5 w-3.5"
                        style={{ color: meta.color }}
                        aria-hidden="true"
                      />
                    )}
                    {name}
                  </span>
                );
              })}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default TechStackSection;
