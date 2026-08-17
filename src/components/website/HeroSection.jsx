import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import Button from "@/components/common/Button";
import { COMPANY } from "@/utils/constants";
import { getSettings } from "@/services/settingsService";

const HeroSection = () => {
  const [company, setCompany] = useState(COMPANY);

  useEffect(() => {
    getSettings().then((response) => {
      if (response.data?.company) setCompany(response.data.company);
    });
  }, []);

  return (
    <section className="relative min-h-screen flex items-end overflow-hidden">
      <motion.div
        className="absolute inset-0 bg-cover bg-center will-change-transform"
        style={{
          backgroundImage:
            "url(https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=2000&q=80)",
        }}
        initial={{ scale: 1 }}
        animate={{ scale: 1.06 }}
        transition={{ duration: 24, ease: "linear" }}
        aria-hidden="true"
      />
      <div className="absolute inset-0 bg-ink/70" aria-hidden="true" />
      <div
        className="absolute inset-0 bg-gradient-to-t from-ink via-ink/55 to-ink/25"
        aria-hidden="true"
      />
      <div
        className="absolute inset-0 bg-[radial-gradient(ellipse_at_20%_80%,rgba(13,148,136,0.22),transparent_50%)]"
        aria-hidden="true"
      />

      <div className="relative container-custom pb-20 pt-28 md:pb-28 md:pt-36 w-full">
        <div className="max-w-3xl">
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-[3.5rem] font-bold text-white tracking-tight mb-5 md:mb-6"
          >
            {company.name}
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.6,
              delay: 0.1,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="text-2xl sm:text-3xl md:text-4xl font-semibold text-white/95 tracking-tight text-balance leading-[1.15] mb-5"
          >
            Software that moves your business forward
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.55,
              delay: 0.2,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="text-base md:text-lg text-slate-300 leading-relaxed max-w-xl mb-9"
          >
            Custom web apps, products, and platforms — designed and built in
            Bangladesh for teams that need clarity and delivery.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.5,
              delay: 0.32,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="flex flex-col sm:flex-row gap-3"
          >
            <Link to="/contact">
              <Button size="lg" icon={ArrowRight} iconPosition="right">
                Start a project
              </Button>
            </Link>
            <Link to="/projects">
              <Button
                variant="outline"
                size="lg"
                className="border-white/25 bg-white/5 text-white backdrop-blur-sm hover:bg-white/12 hover:text-white hover:border-white/40 focus:ring-offset-ink"
              >
                View work
              </Button>
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
