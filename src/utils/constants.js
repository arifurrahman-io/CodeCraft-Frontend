// Company Information
export const COMPANY = {
  name: "CodeCraft.BD",
  tagline: "Building Digital Excellence",
  description:
    "We craft premium software solutions that transform businesses. From web applications to mobile apps, we bring your digital vision to life.",
  email: "hello@codecraft.bd",
  phone: "+880 1234 567890",
  address: "Dhaka, Bangladesh",
  website: "https://codecraft.bd",
  facebook: "https://facebook.com/codecraftbd",
  twitter: "https://twitter.com/codecraftbd",
  linkedin: "https://linkedin.com/company/codecraftbd",
  github: "https://github.com/codecraftbd",
};

// Navigation Links
export const NAV_LINKS = [
  { label: "Home", path: "/" },
  { label: "About", path: "/about" },
  { label: "Services", path: "/services" },
  { label: "Projects", path: "/projects" },
  { label: "Blogs", path: "/blogs" },
  { label: "Contact", path: "/contact" },
];

// Admin Navigation Links
export const ADMIN_NAV_LINKS = [
  { label: "Dashboard", path: "/admin/dashboard", icon: "LayoutDashboard" },
  { label: "Services", path: "/admin/services", icon: "Briefcase" },
  { label: "Projects", path: "/admin/projects", icon: "FolderKanban" },
  { label: "Blogs", path: "/admin/blogs", icon: "FileText" },
  { label: "Team", path: "/admin/team", icon: "Users" },
  { label: "Testimonials", path: "/admin/testimonials", icon: "MessageSquare" },
  { label: "Messages", path: "/admin/messages", icon: "MessageSquare" },
  { label: "Settings", path: "/admin/settings", icon: "Settings" },
];

// Service Categories
export const SERVICE_CATEGORIES = [
  "Web Development",
  "Mobile App Development",
  "UI/UX Design",
  "SaaS Development",
  "E-commerce Solutions",
  "API Development",
  "Cloud Solutions",
  "Consulting",
];

// Tech Stack
export const TECH_STACK = [
  { name: "React", icon: "react" },
  { name: "Vue", icon: "vue" },
  { name: "Angular", icon: "angular" },
  { name: "Node.js", icon: "nodejs" },
  { name: "Python", icon: "python" },
  { name: "TypeScript", icon: "typescript" },
  { name: "MongoDB", icon: "mongodb" },
  { name: "PostgreSQL", icon: "postgresql" },
  { name: "AWS", icon: "aws" },
  { name: "Docker", icon: "docker" },
  { name: "Kubernetes", icon: "kubernetes" },
  { name: "GraphQL", icon: "graphql" },
];

// Status Options
export const STATUS_OPTIONS = [
  { value: "active", label: "Active", color: "green" },
  { value: "inactive", label: "Inactive", color: "red" },
  { value: "pending", label: "Pending", color: "yellow" },
  { value: "draft", label: "Draft", color: "gray" },
];

// Pagination
export const PAGINATION = {
  defaultPageSize: 10,
  pageSizeOptions: [5, 10, 20, 50],
};

// Date Formats
export const DATE_FORMATS = {
  short: "MMM DD, YYYY",
  long: "MMMM DD, YYYY",
  withTime: "MMM DD, YYYY HH:mm",
};

// Social Links
export const SOCIAL_LINKS = [
  { name: "Facebook", url: COMPANY.facebook, icon: "Facebook" },
  { name: "Twitter", url: COMPANY.twitter, icon: "Twitter" },
  { name: "LinkedIn", url: COMPANY.linkedin, icon: "Linkedin" },
  { name: "GitHub", url: COMPANY.github, icon: "Github" },
];
