import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Award, Users, Clock, Globe, Zap, Globe2 } from "lucide-react";

import { FaGithub, FaLinkedinIn } from "react-icons/fa";

import CTASection from "@/components/website/CTASection";
import SectionHeader from "@/components/common/SectionHeader";
import { getAllTeam } from "@/services/teamService";

const fallbackPhoto =
  "https://ui-avatars.com/api/?name=Team+Member&background=0f172a&color=06b6d4&size=400";

const getTeamFromResponse = (response) => {
  if (Array.isArray(response)) return response;
  if (Array.isArray(response?.data)) return response.data;
  if (Array.isArray(response?.data?.team)) return response.data.team;
  if (Array.isArray(response?.data?.members)) return response.data.members;
  if (Array.isArray(response?.data?.data)) return response.data.data;
  return [];
};

const normalizeMember = (member = {}) => ({
  ...member,
  _id: member._id || member.id,
  name: member.name || "Team Member",
  designation: member.designation || "Professional",
  photo: member.photo || fallbackPhoto,
  bio:
    member.bio ||
    "Dedicated professional committed to excellence and innovation.",
  skills: Array.isArray(member.skills) ? member.skills : [],
  linkedin: member.linkedin || "",
  github: member.github || "",
  website: member.website || "",
  order: Number(member.order || 0),
  isActive: typeof member.isActive === "boolean" ? member.isActive : true,
});

const AboutPage = () => {
  const [team, setTeam] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const fetchTeam = async () => {
      try {
        const response = await getAllTeam();

        const members = getTeamFromResponse(response)
          .map(normalizeMember)
          .filter((member) => member.isActive)
          .sort((a, b) => a.order - b.order);

        if (mounted) setTeam(members);
      } catch {
        if (mounted) setTeam([]);
      } finally {
        if (mounted) setIsLoading(false);
      }
    };

    fetchTeam();

    return () => {
      mounted = false;
    };
  }, []);

  const stats = useMemo(
    () => [
      { icon: Award, number: "5+", label: "Years Experience" },
      { icon: Users, number: `${team.length || 5}+`, label: "Experts Team" },
      { icon: Clock, number: "50+", label: "Projects Completed" },
      { icon: Globe, number: "10+", label: "Industries Served" },
    ],
    [team],
  );

  const values = [
    {
      icon: Zap,
      title: "Innovation",
      description:
        "We continuously adopt modern technologies to create future-ready solutions.",
    },
    {
      icon: Users,
      title: "Collaboration",
      description:
        "We work closely with clients through transparent communication and teamwork.",
    },
    {
      icon: Award,
      title: "Excellence",
      description:
        "We deliver high-quality products with precision, performance, and reliability.",
    },
    {
      icon: Clock,
      title: "Commitment",
      description:
        "We respect deadlines and provide dependable long-term support.",
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="pt-28 pb-16 bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold text-slate-100 mb-6">
              About <span className="text-cyan-500">CodeCraft.BD</span>
            </h1>

            <p className="text-lg text-slate-400 leading-8">
              We are a modern software agency building professional websites,
              mobile apps, SaaS platforms, and business automation solutions.
            </p>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="glass rounded-xl p-6 border border-slate-700/50 text-center"
              >
                <stat.icon className="w-8 h-8 text-cyan-500 mx-auto mb-4" />
                <p className="text-3xl font-bold text-slate-100 mb-2">
                  {stat.number}
                </p>
                <p className="text-sm text-slate-400">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            subtitle="Our Values"
            title="What Drives Us"
            description="Principles behind every project"
            className="mb-12"
          />

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value) => (
              <div
                key={value.title}
                className="glass rounded-xl p-6 border border-slate-700/50"
              >
                <value.icon className="w-10 h-10 text-cyan-500 mb-4" />
                <h3 className="text-lg font-semibold text-slate-100 mb-2">
                  {value.title}
                </h3>
                <p className="text-sm text-slate-400 leading-7">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-16 bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            subtitle="Our Team"
            title="Meet the Experts"
            description="Professionals behind our success"
            className="mb-12"
          />

          {isLoading ? (
            <div className="text-center text-slate-400">
              Loading team members...
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {team.map((member) => (
                <motion.div
                  key={member._id}
                  whileHover={{ y: -6 }}
                  className="glass rounded-2xl overflow-hidden border border-slate-700/50"
                >
                  <img
                    src={member.photo}
                    alt={member.name}
                    className="w-full h-72 object-cover"
                    onError={(e) => {
                      e.currentTarget.src = fallbackPhoto;
                    }}
                  />

                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-slate-100 mb-1">
                      {member.name}
                    </h3>

                    <p className="text-cyan-500 text-sm mb-3">
                      {member.designation}
                    </p>

                    <p className="text-sm text-slate-400 leading-7 mb-4">
                      {member.bio}
                    </p>

                    {member.skills.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {member.skills.slice(0, 4).map((skill, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-1 rounded-md bg-slate-800 text-xs text-slate-300"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    )}

                    <div className="flex items-center gap-4 text-slate-400 text-lg">
                      {member.linkedin && (
                        <a
                          href={member.linkedin}
                          target="_blank"
                          rel="noreferrer"
                          className="hover:text-cyan-400"
                        >
                          <FaLinkedinIn />
                        </a>
                      )}

                      {member.github && (
                        <a
                          href={member.github}
                          target="_blank"
                          rel="noreferrer"
                          className="hover:text-cyan-400"
                        >
                          <FaGithub />
                        </a>
                      )}

                      {member.website && (
                        <a
                          href={member.website}
                          target="_blank"
                          rel="noreferrer"
                          className="hover:text-cyan-400"
                        >
                          <Globe2 className="w-5 h-5" />
                        </a>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      <CTASection />
    </div>
  );
};

export default AboutPage;
