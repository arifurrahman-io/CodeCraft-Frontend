import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "sonner";
import {
  ArrowRight,
  Compass,
  PenTool,
  Code2,
  Rocket,
  ShieldCheck,
  Timer,
  MessagesSquare,
} from "lucide-react";

import ServiceCard from "@/components/website/ServiceCard";
import CTASection from "@/components/website/CTASection";
import Button from "@/components/common/Button";
import Loader from "@/components/common/Loader";
import EmptyState from "@/components/common/EmptyState";
import { getAllServices } from "@/services/serviceService";

const getServices = (response) => {
  if (Array.isArray(response)) return response;
  if (Array.isArray(response?.data)) return response.data;
  if (Array.isArray(response?.data?.services)) return response.data.services;
  return [];
};

const PROCESS_STEPS = [
  {
    step: "01",
    title: "Discovery",
    description: "We clarify goals, constraints, and a realistic plan.",
    icon: Compass,
  },
  {
    step: "02",
    title: "Design",
    description: "Interfaces and flows that match how users actually work.",
    icon: PenTool,
  },
  {
    step: "03",
    title: "Build",
    description: "Iterate in visible slices with modern, maintainable code.",
    icon: Code2,
  },
  {
    step: "04",
    title: "Deliver",
    description: "Ship confidently, then support what goes live.",
    icon: Rocket,
  },
];

const HIGHLIGHTS = [
  {
    icon: ShieldCheck,
    title: "Clear scope",
    text: "Defined deliverables before work begins",
  },
  {
    icon: Timer,
    title: "Visible progress",
    text: "Regular demos and checkpoint reviews",
  },
  {
    icon: MessagesSquare,
    title: "Direct communication",
    text: "One team, one thread, no runaround",
  },
];

const ServicesPage = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        setError("");
        const response = await getAllServices();
        if (!mounted) return;
        setServices(getServices(response).filter((s) => s.isActive !== false));
      } catch (err) {
        const message =
          err?.response?.data?.message || "Failed to load services";
        if (mounted) {
          setError(message);
          setServices([]);
        }
        toast.error(message);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const categories = useMemo(() => {
    const set = new Set(
      services.map((s) => s.category).filter(Boolean),
    );
    return ["All", ...set];
  }, [services]);

  const visibleServices = useMemo(() => {
    if (activeCategory === "All") return services;
    return services.filter((s) => s.category === activeCategory);
  }, [services, activeCategory]);

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden pt-10 pb-16 md:pt-14 md:pb-20">
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_0%_0%,rgba(13,148,136,0.12),transparent_50%),radial-gradient(ellipse_at_100%_20%,rgba(10,22,40,0.05),transparent_45%)]"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute right-[-10%] top-8 hidden h-72 w-72 rounded-full border border-accent/10 lg:block"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute right-[8%] top-24 hidden h-40 w-40 rounded-full border border-border lg:block"
          aria-hidden="true"
        />

        <div className="relative container-custom">
          <div className="grid lg:grid-cols-12 gap-10 lg:gap-12 items-end">
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
              className="lg:col-span-7"
            >
              <p className="text-sm font-semibold text-accent tracking-wide mb-3">
                Services
              </p>
              <h1 className="font-display text-4xl md:text-5xl lg:text-[3.25rem] font-bold text-ink tracking-tight text-balance leading-[1.08] mb-5">
                Solutions for growing products
              </h1>
              <p className="text-lg text-ink-muted leading-relaxed max-w-xl mb-8">
                From web platforms to mobile apps — scoped clearly, built to
                last, and delivered with a process you can follow.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Link to="/contact">
                  <Button size="lg" icon={ArrowRight} iconPosition="right">
                    Start a project
                  </Button>
                </Link>
                <a href="#service-catalog">
                  <Button variant="outline" size="lg">
                    Browse catalog
                  </Button>
                </a>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.55,
                delay: 0.12,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="lg:col-span-5"
            >
              <div className="relative overflow-hidden rounded-3xl border border-border bg-ink p-6 sm:p-7">
                <div
                  className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_30%_0%,rgba(13,148,136,0.4),transparent_55%)]"
                  aria-hidden="true"
                />
                <p className="relative text-sm font-medium text-white/50 mb-5">
                  What you can expect
                </p>
                <ul className="relative space-y-4">
                  {HIGHLIGHTS.map((item, index) => {
                    const Icon = item.icon;
                    return (
                      <motion.li
                        key={item.title}
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 + index * 0.08 }}
                        className="flex items-start gap-3.5 rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3.5"
                      >
                        <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-accent/20 text-accent">
                          <Icon className="h-4 w-4" strokeWidth={1.75} />
                        </span>
                        <div>
                          <p className="text-sm font-semibold text-white">
                            {item.title}
                          </p>
                          <p className="mt-0.5 text-sm text-white/55">
                            {item.text}
                          </p>
                        </div>
                      </motion.li>
                    );
                  })}
                </ul>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Catalog */}
      <section
        id="service-catalog"
        className="relative pb-20 md:pb-24 scroll-mt-24"
      >
        <div className="container-custom">
          <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-semibold text-accent mb-2">Catalog</p>
              <h2 className="font-display text-2xl md:text-3xl font-bold text-ink tracking-tight">
                Choose what you need
              </h2>
            </div>
            {!loading && services.length > 0 && (
              <p className="text-sm text-ink-subtle">
                {visibleServices.length} service
                {visibleServices.length === 1 ? "" : "s"}
                {activeCategory !== "All" ? ` in ${activeCategory}` : ""}
              </p>
            )}
          </div>

          {!loading && categories.length > 1 && (
            <div className="mb-8 flex flex-wrap gap-2">
              {categories.map((category) => {
                const active = category === activeCategory;
                return (
                  <button
                    key={category}
                    type="button"
                    onClick={() => setActiveCategory(category)}
                    className={`rounded-lg px-3.5 py-2 text-sm font-medium transition-all duration-200 ${
                      active
                        ? "bg-ink text-white shadow-soft"
                        : "border border-border bg-surface text-ink-muted hover:border-ink/20 hover:text-ink"
                    }`}
                  >
                    {category}
                  </button>
                );
              })}
            </div>
          )}

          {loading ? (
            <Loader text="Loading services..." className="py-20" />
          ) : error ? (
            <EmptyState title="Could not load services" description={error} />
          ) : visibleServices.length === 0 ? (
            <EmptyState
              title="No services yet"
              description="Published services will appear here."
            />
          ) : (
            <div className="grid gap-5 md:grid-cols-2 md:gap-6 lg:grid-cols-3">
              {visibleServices.map((service, index) => (
                <ServiceCard
                  key={service._id || service.slug}
                  service={service}
                  index={index}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Process */}
      <section className="section-padding relative overflow-hidden bg-surface border-y border-border">
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_0%_50%,rgba(13,148,136,0.06),transparent_50%)]"
          aria-hidden="true"
        />
        <div className="relative container-custom">
          <div className="max-w-2xl mb-12 md:mb-14">
            <p className="text-sm font-semibold text-accent mb-3">Process</p>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-ink tracking-tight mb-3 leading-[1.15]">
              How we work
            </h2>
            <p className="text-ink-muted text-lg leading-relaxed">
              A clear path from discovery to delivery — so nothing important
              stays fuzzy.
            </p>
          </div>

          <div className="relative grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <div
              className="pointer-events-none absolute left-[12%] right-[12%] top-10 hidden h-px bg-gradient-to-r from-transparent via-accent/30 to-transparent xl:block"
              aria-hidden="true"
            />
            {PROCESS_STEPS.map((item, index) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={item.step}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{
                    delay: index * 0.07,
                    duration: 0.45,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  className="relative rounded-2xl border border-border bg-canvas/70 p-5 md:p-6 transition-all duration-300 hover:border-accent/30 hover:shadow-soft"
                >
                  <div className="mb-5 flex items-center justify-between">
                    <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent-soft text-accent ring-1 ring-accent/10">
                      <Icon className="h-5 w-5" strokeWidth={1.75} />
                    </span>
                    <span className="font-display text-sm font-medium tabular-nums text-ink-subtle">
                      {item.step}
                    </span>
                  </div>
                  <h3 className="font-display text-lg font-semibold text-ink mb-2">
                    {item.title}
                  </h3>
                  <p className="text-sm text-ink-muted leading-relaxed">
                    {item.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      <CTASection
        title="Not sure which service fits?"
        description="Tell us the outcome you need. We will suggest a clear approach, timeline, and next step."
        ctaText="Talk to us"
      />
    </div>
  );
};

export default ServicesPage;
