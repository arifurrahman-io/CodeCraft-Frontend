import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
import PageHero from "@/components/website/PageHero";
import SectionHeader from "@/components/common/SectionHeader";
import Loader from "@/components/common/Loader";
import EmptyState from "@/components/common/EmptyState";
import { getAllTeam } from "@/services/teamService";
import { useWebsiteStats } from "@/hooks/useWebsiteStats";

const fallbackPhoto =
  "https://ui-avatars.com/api/?name=Team+Member&background=f0fdfa&color=0d9488&size=400";

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

const SocialLink = ({ href, label, children }) => (
  <a
    href={href}
    target="_blank"
    rel="noreferrer"
    className="flex h-9 w-9 items-center justify-center rounded-xl border border-border/80 bg-canvas text-ink-muted transition-all duration-200 hover:border-accent/35 hover:bg-accent-soft hover:text-accent"
    aria-label={label}
  >
    {children}
  </a>
);

const TeamMemberCard = ({ member, isExpanded, onToggle, index = 0 }) => {
  const hasDetails = Boolean(member.bio) || member.skills.length > 0;
  const visibleSkills = member.skills.slice(0, 8);

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{
        duration: 0.45,
        delay: index * 0.07,
        ease: [0.22, 1, 0.36, 1],
      }}
      className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-surface transition-all duration-300 hover:-translate-y-0.5 hover:border-accent/25 hover:shadow-lift"
    >
      <div className="relative aspect-[4/5] overflow-hidden bg-canvas">
        <img
          src={member.photo}
          alt={member.name}
          className="h-full w-full object-cover object-top transition-transform duration-700 ease-smooth group-hover:scale-[1.04]"
          onError={(e) => {
            e.currentTarget.src = fallbackPhoto;
          }}
        />
        <div
          className="absolute inset-0 bg-gradient-to-t from-ink/75 via-ink/15 to-transparent"
          aria-hidden="true"
        />
        <div className="absolute inset-x-0 bottom-0 p-5">
          <p className="font-display text-xl font-semibold tracking-tight text-white">
            {member.name}
          </p>
          <p className="mt-1 text-sm font-medium text-accent">
            {member.designation}
          </p>
        </div>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-center justify-between gap-3">
          <p className="text-sm text-ink-muted">Connect</p>
          <div className="flex shrink-0 items-center gap-2">
            {member.linkedin && (
              <SocialLink
                href={member.linkedin}
                label={`${member.name} LinkedIn`}
              >
                <FaLinkedinIn className="h-3.5 w-3.5" />
              </SocialLink>
            )}
            {member.github && (
              <SocialLink href={member.github} label={`${member.name} GitHub`}>
                <FaGithub className="h-3.5 w-3.5" />
              </SocialLink>
            )}
            {member.website && (
              <SocialLink
                href={member.website}
                label={`${member.name} website`}
              >
                <Globe2 className="h-3.5 w-3.5" />
              </SocialLink>
            )}
            {!member.linkedin && !member.github && !member.website && (
              <span className="text-xs text-ink-subtle">—</span>
            )}
          </div>
        </div>

        {hasDetails && (
          <div className="mt-4 border-t border-border/80 pt-4">
            <button
              type="button"
              onClick={onToggle}
              className="flex w-full items-center justify-between gap-3 rounded-xl px-1 py-1 text-left text-sm font-medium text-ink transition-colors hover:text-accent"
              aria-expanded={isExpanded}
            >
              <span>{isExpanded ? "Hide profile" : "View profile"}</span>
              <span
                className={`flex h-8 w-8 items-center justify-center rounded-lg bg-canvas text-ink-muted transition-all duration-300 ${
                  isExpanded ? "rotate-180 bg-accent-soft text-accent" : ""
                }`}
              >
                <ChevronDown className="h-4 w-4" />
              </span>
            </button>

            <AnimatePresence initial={false}>
              {isExpanded && (
                <motion.div
                  key="details"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                  className="overflow-hidden"
                >
                  <div className="pt-3 pb-1">
                    {member.bio && (
                      <p className="text-sm leading-relaxed text-ink-muted">
                        {member.bio}
                      </p>
                    )}

                    {visibleSkills.length > 0 && (
                      <div className="mt-4 flex flex-wrap gap-2">
                        {visibleSkills.map((skill, idx) => (
                          <span
                            key={idx}
                            className="rounded-lg border border-accent/15 bg-accent-soft/70 px-2.5 py-1 text-xs font-medium text-accent"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
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
    <div>
      <PageHero
        subtitle="About"
        title="CodeCraft.BD"
        description="We are a modern software agency building professional websites, mobile apps, SaaS platforms, and business automation solutions."
      />

      <section className="pb-16 md:pb-20">
        <div className="container-custom">
          <div className="grid grid-cols-2 gap-6 md:grid-cols-4 md:gap-8">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="rounded-2xl border border-border bg-surface/80 px-4 py-5 transition-colors hover:border-accent/25"
              >
                <stat.icon className="mb-3 h-5 w-5 text-accent" />
                <p className="font-display text-3xl font-bold tracking-tight text-ink">
                  {stat.number}
                </p>
                <p className="mt-1 text-sm text-ink-muted">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding relative overflow-hidden border-y border-border bg-surface">
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_0%_0%,rgba(13,148,136,0.06),transparent_45%)]"
          aria-hidden="true"
        />
        <div className="relative container-custom">
          <SectionHeader
            alignment="left"
            subtitle="Our Values"
            title="What drives us"
            description="Principles behind every project"
            className="mb-12"
          />

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.06 }}
                className="rounded-2xl border border-border bg-canvas/50 p-5 transition-all duration-300 hover:border-accent/25 hover:bg-surface hover:shadow-soft"
              >
                <span className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-accent-soft text-accent">
                  <value.icon className="h-5 w-5" strokeWidth={1.75} />
                </span>
                <h3 className="font-display text-lg font-semibold text-ink mb-2">
                  {value.title}
                </h3>
                <p className="text-sm leading-relaxed text-ink-muted">
                  {value.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding relative overflow-hidden">
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_80%_0%,rgba(13,148,136,0.07),transparent_45%)]"
          aria-hidden="true"
        />
        <div className="relative container-custom">
          <div className="mb-12 md:mb-14 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <SectionHeader
              alignment="left"
              subtitle="Our Team"
              title="Meet the experts"
              description="The people shaping products, platforms, and delivery at CodeCraft.BD."
              className="mb-0"
            />
            {!isLoading && team.length > 0 && (
              <p className="text-sm text-ink-subtle lg:pb-1">
                {team.length} team member{team.length === 1 ? "" : "s"}
              </p>
            )}
          </div>

          {isLoading ? (
            <Loader text="Loading team members..." className="py-20" />
          ) : team.length === 0 ? (
            <EmptyState
              title="No team members yet"
              description="Published team profiles will appear here."
            />
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
              {team.map((member, index) => (
                <TeamMemberCard
                  key={member._id}
                  member={member}
                  index={index}
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
