import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Award, Users, Clock, Globe, Zap } from "lucide-react";
import CTASection from "@/components/website/CTASection";
import SectionHeader from "@/components/common/SectionHeader";
import { getAllTeam } from "@/services/teamService";

const AboutPage = () => {
  const [team, setTeam] = useState([]);

  useEffect(() => {
    getAllTeam().then((response) => {
      setTeam((response.data || []).filter((member) => member.status === "active"));
    });
  }, []);

  const stats = [
    { icon: Award, number: "5+", label: "Years Experience" },
    { icon: Users, number: "50+", label: "Projects Completed" },
    { icon: Clock, number: "30+", label: "Happy Clients" },
    { icon: Globe, number: "10+", label: "Countries Served" },
  ];

  const values = [
    {
      icon: Zap,
      title: "Innovation",
      description:
        "We constantly explore new technologies and methodologies to deliver cutting-edge solutions.",
    },
    {
      icon: Users,
      title: "Collaboration",
      description:
        "We work closely with our clients, fostering transparent communication throughout the project.",
    },
    {
      icon: Award,
      title: "Excellence",
      description:
        "We are committed to delivering high-quality code and exceptional user experiences.",
    },
    {
      icon: Clock,
      title: "Reliability",
      description:
        "We meet deadlines consistently and provide reliable post-launch support.",
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-3xl mx-auto"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-slate-100 mb-6">
              About <span className="text-cyan-500">CodeCraft.BD</span>
            </h1>
            <p className="text-lg text-slate-400">
              We are a team of passionate developers, designers, and innovators
              dedicated to transforming ideas into powerful digital solutions.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="glass rounded-xl p-6 border border-slate-700/50 text-center"
              >
                <stat.icon className="w-8 h-8 text-cyan-500 mx-auto mb-4" />
                <p className="text-3xl font-bold text-slate-100 mb-2">
                  {stat.number}
                </p>
                <p className="text-sm text-slate-400">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Story */}
      <section className="py-16 md:py-20 bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-4xl font-bold text-slate-100 mb-6">
                Our <span className="text-cyan-500">Story</span>
              </h2>
              <div className="space-y-4 text-slate-400">
                <p>
                  Founded in 2020, CodeCraft.BD started with a simple mission:
                  to make premium software development accessible to businesses
                  of all sizes.
                </p>
                <p>
                  What began as a small team of passionate developers has grown
                  into a full-service software agency, serving clients across
                  Bangladesh and around the world.
                </p>
                <p>
                  We believe in the power of technology to transform businesses.
                  Our team combines technical expertise with creative thinking
                  to deliver solutions that not only meet but exceed our
                  clients' expectations.
                </p>
                <p>
                  Today, we continue to innovate and evolve, staying at the
                  forefront of web and mobile development technologies while
                  maintaining our commitment to quality and client satisfaction.
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="glass rounded-2xl p-8 border border-slate-700/50"
            >
              <img
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600"
                alt="Team working together"
                className="w-full rounded-xl"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 md:py-20 bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            subtitle="Our Values"
            title="What Drives Us"
            description="Our core values guide every project we undertake"
            className="mb-12"
          />

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="glass rounded-xl p-6 border border-slate-700/50"
              >
                <value.icon className="w-10 h-10 text-cyan-500 mb-4" />
                <h3 className="text-lg font-semibold text-slate-100 mb-2">
                  {value.title}
                </h3>
                <p className="text-sm text-slate-400">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-16 md:py-20 bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            subtitle="Our Team"
            title="Meet the Experts"
            description="The talented people behind our success"
            className="mb-12"
          />

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {team.slice(0, 3).map((member, index) => (
              <motion.div
                key={member._id}
                id={member.slug}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="glass rounded-xl overflow-hidden border border-slate-700/50"
              >
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-full h-64 object-cover"
                />
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-slate-100 mb-1">
                    {member.name}
                  </h3>
                  <p className="text-cyan-500 text-sm mb-2">
                    {member.position}
                  </p>
                  <p className="text-sm text-slate-400">
                    {member.shortDescription}
                  </p>
                </div>
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

export default AboutPage;
