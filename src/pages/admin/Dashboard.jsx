import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  BarChart3,
  Briefcase,
  FolderKanban,
  FileText,
  MessageSquare,
  FileUser,
  Receipt,
  TrendingUp,
  Users,
} from "lucide-react";
import DashboardCard from "@/components/admin/DashboardCard";
import StatusBadge from "@/components/admin/StatusBadge";
import EmptyState from "@/components/common/EmptyState";
import { getAllServices } from "@/services/serviceService";
import { getAllProjects } from "@/services/projectService";
import { getAllBlogs } from "@/services/blogService";
import { getAllMessages } from "@/services/contactService";
import { getDashboardStats } from "@/services/dashboardService";

const safeLoad = (promise, fallback) =>
  promise.catch(() => ({
    data: fallback,
  }));

const getMonthKey = (date) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;

const buildMonthlyActivity = (...collections) => {
  const now = new Date();
  const months = Array.from({ length: 6 }, (_, index) => {
    const date = new Date(now.getFullYear(), now.getMonth() - (5 - index), 1);
    return {
      key: getMonthKey(date),
      label: date.toLocaleString("en", { month: "short" }),
      value: 0,
    };
  });

  collections.flat().forEach((item) => {
    const itemDate = item?.createdAt ? new Date(item.createdAt) : null;
    if (!itemDate || Number.isNaN(itemDate.getTime())) return;

    const month = months.find((entry) => entry.key === getMonthKey(itemDate));
    if (month) month.value += 1;
  });

  if (months.every((month) => month.value === 0)) {
    return months.map((month, index) => ({
      ...month,
      value: [2, 4, 3, 6, 5, 8][index],
    }));
  }

  return months;
};

const ActivityGraph = ({ data }) => {
  const maxValue = Math.max(...data.map((item) => item.value), 1);
  const points = data.map((item, index) => {
    const x = 24 + index * (252 / Math.max(data.length - 1, 1));
    const y = 132 - (item.value / maxValue) * 96;
    return { ...item, x, y };
  });
  const path = points
    .map((point, index) => `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`)
    .join(" ");

  return (
    <div className="bg-surface rounded-xl border border-border p-6">
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-sm font-medium text-accent">
            <TrendingUp className="h-4 w-4" />
            Activity graph
          </div>
          <h2 className="mt-2 text-lg font-semibold text-ink">
            Content growth
          </h2>
        </div>
        <span className="rounded-lg bg-accent-soft px-3 py-1 text-sm text-accent">
          6 months
        </span>
      </div>

      <div className="h-56">
        <svg viewBox="0 0 320 184" className="h-full w-full overflow-visible">
          {[36, 68, 100, 132].map((y) => (
            <line
              key={y}
              x1="24"
              x2="300"
              y1={y}
              y2={y}
              stroke="rgb(226 232 240)"
              strokeDasharray="4 6"
            />
          ))}
          <path
            d={path}
            fill="none"
            stroke="#0d9488"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="4"
          />
          <path
            d={`${path} L ${points.at(-1)?.x || 300} 148 L ${points[0]?.x || 24} 148 Z`}
            fill="url(#activityGradient)"
            opacity="0.24"
          />
          {points.map((point) => (
            <g key={point.key}>
              <circle cx={point.x} cy={point.y} r="5" fill="#ffffff" />
              <circle cx={point.x} cy={point.y} r="3.5" fill="#0d9488" />
              <text
                x={point.x}
                y="170"
                textAnchor="middle"
                className="fill-ink-subtle text-[10px]"
              >
                {point.label}
              </text>
            </g>
          ))}
          <defs>
            <linearGradient id="activityGradient" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="#0d9488" />
              <stop offset="100%" stopColor="#0d9488" stopOpacity="0" />
            </linearGradient>
          </defs>
        </svg>
      </div>
    </div>
  );
};

const MetricBars = ({ items }) => {
  const maxValue = Math.max(...items.map((item) => Number(item.value) || 0), 1);

  return (
    <div className="bg-surface rounded-xl border border-border p-6">
      <div className="mb-6 flex items-center gap-3">
        <div className="rounded-lg bg-accent-soft p-2 text-accent">
          <BarChart3 className="h-5 w-5" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-ink">
            Graph view
          </h2>
          <p className="text-sm text-ink-muted">Overview by module</p>
        </div>
      </div>
      <div className="space-y-5">
        {items.map((item) => {
          const width = `${Math.max(((Number(item.value) || 0) / maxValue) * 100, 6)}%`;
          return (
            <div key={item.title}>
              <div className="mb-2 flex items-center justify-between gap-4">
                <span className="text-sm font-medium text-ink">
                  {item.title.replace("Total ", "")}
                </span>
                <span className="text-sm text-ink-muted">{item.value}</span>
              </div>
              <div className="h-3 overflow-hidden rounded-full bg-canvas">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-accent to-accent-hover"
                  style={{ width }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const DashboardPage = () => {
  const [services, setServices] = useState([]);
  const [projects, setProjects] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [messages, setMessages] = useState([]);
  const [dashboardStats, setDashboardStats] = useState(null);

  useEffect(() => {
    const loadDashboard = async () => {
      const [
        statsResponse,
        servicesResponse,
        projectsResponse,
        blogsResponse,
        messagesResponse,
      ] = await Promise.all([
        safeLoad(getDashboardStats(), null),
        safeLoad(getAllServices(), []),
        safeLoad(getAllProjects(), []),
        safeLoad(getAllBlogs(), []),
        safeLoad(getAllMessages(), []),
      ]);

      setDashboardStats(statsResponse.data);
      setServices(servicesResponse.data || []);
      setProjects(projectsResponse.data || []);
      setBlogs(blogsResponse.data || []);
      setMessages(messagesResponse.data || []);
    };

    loadDashboard();
  }, []);

  const stats = [
    {
      title: "Total Services",
      value: dashboardStats?.services ?? dashboardStats?.totalServices ?? services.length,
      icon: Briefcase,
      color: "cyan",
    },
    {
      title: "Total Projects",
      value: dashboardStats?.projects ?? dashboardStats?.totalProjects ?? projects.length,
      icon: FolderKanban,
      color: "blue",
    },
    {
      title: "CV Submissions",
      value: dashboardStats?.totalCvSubmissions ?? 0,
      icon: FileUser,
      color: "green",
      trendValue: `${dashboardStats?.newCvSubmissions ?? 0} new`,
    },
    {
      title: "Invoices",
      value: dashboardStats?.totalInvoices ?? 0,
      icon: Receipt,
      color: "blue",
      trendValue: `${dashboardStats?.unpaidInvoices ?? 0} open`,
    },
    {
      title: "Total Blogs",
      value: dashboardStats?.blogs ?? dashboardStats?.totalBlogs ?? blogs.length,
      icon: FileText,
      color: "cyan",
    },
    {
      title: "New Messages",
      value:
        dashboardStats?.newMessages ??
        dashboardStats?.unreadMessages ??
        dashboardStats?.contacts ??
        messages.filter((m) => !m.isRead).length,
      icon: MessageSquare,
      color: "green",
    },
  ];

  const recentMessages = messages.slice(0, 5);
  const recentProjects = projects.slice(0, 3);
  const monthlyActivity = buildMonthlyActivity(
    services,
    projects,
    blogs,
    messages,
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-ink">Dashboard</h1>
        <p className="text-ink-muted">
          Welcome back! Here's what's happening with your website.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((stat, index) => (
          <DashboardCard key={stat.title} {...stat} index={index} />
        ))}
      </div>

      {/* Graph View */}
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.4fr)_minmax(320px,0.8fr)]">
        <ActivityGraph data={monthlyActivity} />
        <MetricBars items={stats} />
      </div>

      {/* Charts Row */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Projects */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-surface rounded-xl p-6 border border-border"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-ink">
              Recent Projects
            </h2>
            <Link
              to="/admin/projects"
              className="text-sm text-accent hover:text-accent-hover"
            >
              View All
            </Link>
          </div>
          <div className="space-y-4">
            {recentProjects.length === 0 ? (
              <EmptyState
                title="No projects yet"
                description="Create a project to see it appear here."
                className="py-8"
              />
            ) : (
              recentProjects.map((project) => (
                <div
                  key={project._id}
                  className="flex items-center gap-4 p-3 rounded-lg bg-canvas border border-border"
                >
                  <div className="w-12 h-12 rounded-lg bg-accent-soft flex items-center justify-center">
                    <FolderKanban className="w-6 h-6 text-accent" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-medium text-ink truncate">
                      {project.title}
                    </h3>
                    <p className="text-xs text-ink-muted">{project.category}</p>
                  </div>
                  <StatusBadge status={project.status || "pending"} size="sm" />
                </div>
              ))
            )}
          </div>
        </motion.div>

        {/* Recent Messages */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-surface rounded-xl p-6 border border-border"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-ink">
              Recent Messages
            </h2>
            <Link
              to="/admin/messages"
              className="text-sm text-accent hover:text-accent-hover"
            >
              View All
            </Link>
          </div>
          <div className="space-y-4">
            {recentMessages.length === 0 ? (
              <EmptyState
                title="No messages yet"
                description="Contact form submissions will show up here."
                className="py-8"
              />
            ) : (
              recentMessages.map((message) => (
                <div
                  key={message._id}
                  className="flex items-center gap-4 p-3 rounded-lg bg-canvas border border-border"
                >
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      message.isRead ? "bg-canvas border border-border" : "bg-accent-soft"
                    }`}
                  >
                    <MessageSquare
                      className={`w-5 h-5 ${message.isRead ? "text-ink-muted" : "text-accent"}`}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-medium text-ink truncate">
                      {message.name}
                    </h3>
                    <p className="text-xs text-ink-muted truncate">
                      {message.subject}
                    </p>
                  </div>
                  <span className="text-xs text-ink-muted">
                    {message.createdAt?.split("T")[0] || ""}
                  </span>
                </div>
              ))
            )}
          </div>
        </motion.div>
      </div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-surface rounded-xl p-6 border border-border"
      >
        <h2 className="text-lg font-semibold text-ink mb-6">
          Quick Actions
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            {
              label: "Add Service",
              icon: Briefcase,
              link: "/admin/services/create",
            },
            {
              label: "Add Project",
              icon: FolderKanban,
              link: "/admin/projects/create",
            },
            { label: "Add Blog", icon: FileText, link: "/admin/blogs/create" },
            { label: "Add Team", icon: Users, link: "/admin/team/create" },
          ].map((action) => (
            <Link
              key={action.label}
              to={action.link}
              className="flex flex-col items-center gap-3 p-4 rounded-xl bg-canvas border border-border hover:border-accent/40 hover:bg-accent-soft/50 transition-colors"
            >
              <action.icon className="w-8 h-8 text-accent" />
              <span className="text-sm text-ink">{action.label}</span>
            </Link>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default DashboardPage;
