import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import Button from "@/components/common/Button";

const CTASection = ({
  title = "Ready to Transform Your Business?",
  description = "Let's discuss your project and see how we can help you achieve your goals.",
  ctaText = "Get Started",
  ctaLink = "/contact",
  secondaryCtaText = "View Our Work",
  secondaryCtaLink = "/projects",
}) => {
  return (
    <section className="py-16 md:py-20 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900" />
      <div className="absolute inset-0 opacity-20">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `linear-gradient(rgba(6, 182, 212, 0.1) 1px, transparent 1px),
                           linear-gradient(90deg, rgba(6, 182, 212, 0.1) 1px, transparent 1px)`,
            backgroundSize: "50px 50px",
          }}
        />
      </div>
      <div className="absolute top-0 left-1/4 w-64 h-64 bg-cyan-500/20 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="glass rounded-3xl p-8 md:p-12 border border-slate-700/50"
        >
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            {/* Content */}
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-100 mb-4">
                {title}
              </h2>
              <p className="text-lg text-slate-400 mb-8">{description}</p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to={ctaLink}>
                  <Button size="lg" icon={ArrowRight} iconPosition="right">
                    {ctaText}
                  </Button>
                </Link>
                <Link to={secondaryCtaLink}>
                  <Button variant="outline" size="lg">
                    {secondaryCtaText}
                  </Button>
                </Link>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4">
              {[
                { number: "50+", label: "Projects Completed" },
                { number: "5+", label: "Years Experience" },
                { number: "30+", label: "Happy Clients" },
                { number: "24/7", label: "Support Available" },
              ].map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="glass rounded-xl p-6 border border-slate-700/50 text-center"
                >
                  <p className="text-3xl md:text-4xl font-bold text-cyan-500 mb-2">
                    {stat.number}
                  </p>
                  <p className="text-sm text-slate-400">{stat.label}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CTASection;
