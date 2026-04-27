import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import ServiceCard from "@/components/website/ServiceCard";
import CTASection from "@/components/website/CTASection";
import SectionHeader from "@/components/common/SectionHeader";
import { getAllServices } from "@/services/serviceService";

const ServicesPage = () => {
  const [services, setServices] = useState([]);

  useEffect(() => {
    getAllServices().then((response) => {
      setServices((response.data || []).filter((service) => service.isActive));
    });
  }, []);

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="pt-32 pb-16 bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-3xl mx-auto"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-slate-100 mb-6">
              Our <span className="text-cyan-500">Services</span>
            </h1>
            <p className="text-lg text-slate-400">
              Comprehensive software solutions tailored to your business needs.
              From web development to mobile apps, we've got you covered.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-16 md:py-20 bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service, index) => (
              <ServiceCard key={service._id} service={service} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="py-16 md:py-20 bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            subtitle="Our Process"
            title="How We Work"
            description="A streamlined approach to deliver exceptional results"
            className="mb-12"
          />

          <div className="grid md:grid-cols-4 gap-6">
            {[
              {
                step: "01",
                title: "Discovery",
                description:
                  "We analyze your requirements and create a detailed project plan",
              },
              {
                step: "02",
                title: "Design",
                description:
                  "Our designers create intuitive mockups and prototypes",
              },
              {
                step: "03",
                title: "Development",
                description:
                  "Our developers build your solution using cutting-edge technology",
              },
              {
                step: "04",
                title: "Delivery",
                description:
                  "We deploy your project and provide ongoing support",
              },
            ].map((item, index) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="glass rounded-xl p-6 border border-slate-700/50"
              >
                <p className="text-4xl font-bold text-cyan-500/30 mb-4">
                  {item.step}
                </p>
                <h3 className="text-lg font-semibold text-slate-100 mb-2">
                  {item.title}
                </h3>
                <p className="text-sm text-slate-400">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <CTASection />
    </div>
  );
};

export default ServicesPage;
