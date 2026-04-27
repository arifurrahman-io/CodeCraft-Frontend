import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  CheckCircle2,
  Clock,
  DollarSign,
  Calendar,
} from "lucide-react";
import Button from "@/components/common/Button";
import SectionHeader from "@/components/common/SectionHeader";
import { getServiceBySlug } from "@/services/serviceService";

const iconMap = {
  Globe: "🌐",
  Smartphone: "📱",
  Palette: "🎨",
  Cloud: "☁️",
  ShoppingCart: "🛒",
  Code: "💻",
};

const ServiceDetailsPage = () => {
  const { slug } = useParams();
  const [service, setService] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getServiceBySlug(slug).then((response) => {
      setService(response.data);
      setIsLoading(false);
    });
  }, [slug]);

  if (!isLoading && !service) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-slate-100 mb-4">
            Service Not Found
          </h1>
          <Link to="/services">
            <Button variant="outline">Back to Services</Button>
          </Link>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return <div className="min-h-screen bg-slate-950" />;
  }

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="pt-32 pb-16 bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            to="/services"
            className="inline-flex items-center gap-2 text-slate-400 hover:text-cyan-500 mb-8 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Services
          </Link>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/20 mb-6">
                <span className="text-2xl">{iconMap[service.icon]}</span>
                <span className="text-cyan-400">{service.category}</span>
              </div>

              <h1 className="text-4xl md:text-5xl font-bold text-slate-100 mb-6">
                {service.title}
              </h1>

              <p className="text-lg text-slate-400 mb-8">
                {service.shortDescription}
              </p>

              <div className="grid grid-cols-3 gap-6 mb-8">
                <div className="glass rounded-xl p-4 border border-slate-700/50 text-center">
                  <DollarSign className="w-6 h-6 text-cyan-500 mx-auto mb-2" />
                  <p className="text-sm text-slate-400">Starting from</p>
                  <p className="text-lg font-semibold text-slate-100">
                    {service.priceRange || "Negotiable"}
                  </p>
                </div>
                <div className="glass rounded-xl p-4 border border-slate-700/50 text-center">
                  <Clock className="w-6 h-6 text-cyan-500 mx-auto mb-2" />
                  <p className="text-sm text-slate-400">Duration</p>
                  <p className="text-lg font-semibold text-slate-100">
                    {service.duration || "Negotiable"}
                  </p>
                </div>
                <div className="glass rounded-xl p-4 border border-slate-700/50 text-center">
                  <Calendar className="w-6 h-6 text-cyan-500 mx-auto mb-2" />
                  <p className="text-sm text-slate-400">Category</p>
                  <p className="text-lg font-semibold text-slate-100">
                    {service.category}
                  </p>
                </div>
              </div>

              <Link to="/contact">
                <Button size="lg" icon={ArrowLeft} iconPosition="left">
                  Get a Quote
                </Button>
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="glass rounded-2xl overflow-hidden border border-slate-700/50"
            >
              <img
                src={service.image}
                alt={service.title}
                className="w-full h-80 object-cover"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Description */}
      <section className="py-16 md:py-20 bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <SectionHeader title="Service Overview" className="mb-8" />
            <div className="prose prose-invert max-w-none">
              <p className="text-lg text-slate-400 leading-relaxed">
                {service.description}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 md:py-20 bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            subtitle="What's Included"
            title="Key Features"
            className="mb-12"
          />

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {service.features?.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="glass rounded-xl p-6 border border-slate-700/50"
              >
                <CheckCircle2 className="w-6 h-6 text-cyan-500 mb-4" />
                <h3 className="text-lg font-semibold text-slate-100 mb-2">
                  {feature}
                </h3>
                <p className="text-sm text-slate-400">
                  Professional implementation of {feature.toLowerCase()} for
                  your project
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 md:py-20 bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="glass rounded-2xl p-8 md:p-12 border border-slate-700/50 text-center">
            <h2 className="text-3xl font-bold text-slate-100 mb-4">
              Ready to Get Started?
            </h2>
            <p className="text-lg text-slate-400 mb-8 max-w-2xl mx-auto">
              Contact us today to discuss your project and get a custom quote
              tailored to your needs.
            </p>
            <Link to="/contact">
              <Button size="lg">Start Your Project</Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ServiceDetailsPage;
