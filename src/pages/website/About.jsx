import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  Award,
  Users,
  Clock,
  Globe,
  Zap,
  Globe2,
  ChevronDown,
} from "lucide-react";

import { FaGithub, FaLinkedinIn } from "react-icons/fa";

import CTASection from "@/components/website/CTASection";
import SectionHeader from "@/components/common/SectionHeader";
import { getAllTeam } from "@/services/teamService";
import { useWebsiteStats } from "@/hooks/useWebsiteStats";

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

const TeamMemberCard = ({ member, isExpanded, onToggle }) => {
  const hasDetails = member.bio || member.skills.length > 0;
  const visibleSkills = member.skills.slice(0, 6);

  return (
    <motion.article
      layout
      className="overflow-hidden rounded-3xl border border-slate-800/80 bg-slate-900/80 shadow-xl shadow-slate-950/40"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-slate-800">
        <img
          src={member.photo}
          alt={member.name}
          className="h-full w-full object-cover"
          onError={(e) => {
            e.currentTarget.src = fallbackPhoto;
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/10 to-transparent" />

        <div className="absolute left-5 right-5 bottom-5">
          <span className="inline-flex rounded-full border border-cyan-400/30 bg-cyan-400/10 px-3 py-1 text-xs font-medium text-cyan-300 backdrop-blur">
            {member.designation}
          </span>
        </div>
      </div>

      <div className="p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-xl font-semibold text-slate-100">
              {member.name}
            </h3>
            <p className="mt-1 text-sm text-slate-400">
              {member.designation}
            </p>
          </div>

          <div className="flex shrink-0 items-center gap-2 text-slate-400">
            {member.linkedin && (
              <a
                href={member.linkedin}
                target="_blank"
                rel="noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-800 transition hover:bg-cyan-500 hover:text-slate-950"
                aria-label={`${member.name} LinkedIn`}
              >
                <FaLinkedinIn />
              </a>
            )}

            {member.github && (
              <a
                href={member.github}
                target="_blank"
                rel="noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-800 transition hover:bg-cyan-500 hover:text-slate-950"
                aria-label={`${member.name} GitHub`}
              >
                <FaGithub />
              </a>
            )}

            {member.website && (
              <a
                href={member.website}
                target="_blank"
                rel="noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-800 transition hover:bg-cyan-500 hover:text-slate-950"
                aria-label={`${member.name} website`}
              >
                <Globe2 className="h-4 w-4" />
              </a>
            )}
          </div>
        </div>

        {hasDetails && (
          <>
            <button
              type="button"
              onClick={onToggle}
              className="mt-5 flex w-full items-center justify-between rounded-2xl border border-slate-800 bg-slate-950/70 px-4 py-3 text-left text-sm font-medium text-slate-200 transition hover:border-cyan-500/40 hover:text-cyan-300"
              aria-expanded={isExpanded}
            >
              <span>{isExpanded ? "Hide details" : "View profile"}</span>
              <ChevronDown
                className={`h-4 w-4 transition-transform ${
                  isExpanded ? "rotate-180" : ""
                }`}
              />
            </button>

            <motion.div
              initial={false}
              animate={{
                height: isExpanded ? "auto" : 0,
                opacity: isExpanded ? 1 : 0,
              }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="overflow-hidden"
            >
              <div className="pt-5">
                {member.bio && (
                  <p className="text-sm leading-7 text-slate-400">
                    {member.bio}
                  </p>
                )}

                {visibleSkills.length > 0 && (
                  <div className="mt-5 flex flex-wrap gap-2">
                    {visibleSkills.map((skill, idx) => (
                      <span
                        key={idx}
                        className="rounded-full bg-slate-800 px-3 py-1.5 text-xs font-medium text-slate-300 ring-1 ring-slate-700/80"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </div>
    </motion.article>
  );
};

const AboutPage = () => {
  const [team, setTeam] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedMembers, setExpandedMembers] = useState(() => new Set());
  const { stats: websiteStats } = useWebsiteStats();

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
      {
        icon: Award,
        number: websiteStats.yearsExperience,
        label: "Years Experience",
      },
      { icon: Users, number: websiteStats.expertsTeam, label: "Experts Team" },
      {
        icon: Clock,
        number: websiteStats.projectsCompleted,
        label: "Projects Completed",
      },
      {
        icon: Globe,
        number: websiteStats.industriesServed,
        label: "Industries Served",
      },
    ],
    [websiteStats],
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

  const toggleMember = (memberId) => {
    setExpandedMembers((prev) => {
      const next = new Set(prev);

      if (next.has(memberId)) {
        next.delete(memberId);
      } else {
        next.add(memberId);
      }

      return next;
    });
  };

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
                <TeamMemberCard
                  key={member._id}
                  member={member}
                  isExpanded={expandedMembers.has(member._id)}
                  onToggle={() => toggleMember(member._id)}
                />
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
