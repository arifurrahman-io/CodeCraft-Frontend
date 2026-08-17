import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import Button from "@/components/common/Button";

const CTASection = ({
  title = "Ready to build something reliable?",
  description = "Tell us what you need. We will respond with a clear next step — scope, timeline, and approach.",
  ctaText = "Start a project",
  ctaLink = "/contact",
  secondaryCtaText = "View our work",
  secondaryCtaLink = "/projects",
}) => {
  return (
    <section className="section-padding">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="relative overflow-hidden rounded-3xl bg-ink px-8 py-14 md:px-16 md:py-20 text-center"
        >
          <div
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_30%_0%,rgba(13,148,136,0.28),transparent_55%)]"
            aria-hidden="true"
          />
          <div
            className="pointer-events-none absolute -right-20 -bottom-24 h-64 w-64 rounded-full bg-accent/10 blur-3xl"
            aria-hidden="true"
          />

          <div className="relative">
            <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-white tracking-tight text-balance mb-4">
              {title}
            </h2>
            <p className="text-slate-300 text-lg max-w-2xl mx-auto mb-10 leading-relaxed">
              {description}
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link to={ctaLink}>
                <Button size="lg" icon={ArrowRight} iconPosition="right">
                  {ctaText}
                </Button>
              </Link>
              <Link to={secondaryCtaLink}>
                <Button
                  variant="outline"
                  size="lg"
                  className="border-white/25 bg-white/5 text-white hover:bg-white/12 hover:text-white focus:ring-offset-ink"
                >
                  {secondaryCtaText}
                </Button>
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CTASection;
