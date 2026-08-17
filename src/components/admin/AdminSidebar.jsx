import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Briefcase,
  FolderKanban,
  FileText,
  FileUser,
  Users,
  MessageSquare,
  Settings,
  ChevronLeft,
  LogOut,
  Receipt,
} from "lucide-react";
import { ADMIN_NAV_LINKS } from "@/utils/constants";
import { useAuth } from "@/hooks/useAuth";

const iconMap = {
  LayoutDashboard,
  Briefcase,
  FolderKanban,
  FileText,
  FileUser,
  Users,
  MessageSquare,
  Settings,
  Receipt,
};

const AdminSidebar = ({
  isCollapsed,
  setIsCollapsed,
  isMobileOpen = false,
  onCloseMobile,
}) => {
  const location = useLocation();
  const { logout } = useAuth();

  const isActive = (path) => location.pathname.startsWith(path);
  const handleNavigate = () => {
    if (onCloseMobile) onCloseMobile();
  };

  return (
    <aside
      className={`print:hidden fixed left-0 top-0 z-40 h-screen border-r border-border bg-surface transition-all duration-300 ${
        isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      } ${isCollapsed ? "w-20" : "w-64"}`}
    >
      <div className="h-16 flex items-center justify-between px-4 border-b border-border">
        <Link
          to="/admin/dashboard"
          onClick={handleNavigate}
          className="flex items-center gap-3 min-w-0"
        >
          <div className="w-10 h-10 rounded-lg bg-accent flex items-center justify-center flex-shrink-0">
            <span className="font-display text-white font-bold text-lg">C</span>
          </div>
          {!isCollapsed && (
            <span className="font-display text-lg font-bold text-ink truncate">
              Admin
            </span>
          )}
        </Link>
        <button
          type="button"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="hidden lg:inline-flex p-1.5 rounded-lg text-ink-muted hover:text-ink hover:bg-ink/5 transition-colors"
        >
          <ChevronLeft
            className={`w-5 h-5 transition-transform ${isCollapsed ? "rotate-180" : ""}`}
          />
        </button>
      </div>

      <nav className="p-4 space-y-1 overflow-y-auto max-h-[calc(100vh-8rem)]">
        {ADMIN_NAV_LINKS.map((link) => {
          const Icon = iconMap[link.icon] || LayoutDashboard;
          return (
            <Link
              key={link.path}
              to={link.path}
              onClick={handleNavigate}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors duration-200 ${
                isActive(link.path)
                  ? "bg-accent-soft text-accent border-l-2 border-accent"
                  : "text-ink-muted hover:text-ink hover:bg-ink/5"
              }`}
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              {!isCollapsed && (
                <span className="text-sm font-medium">{link.label}</span>
              )}
            </Link>
          );
        })}
      </nav>

      <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-border bg-surface">
        <button
          type="button"
          onClick={logout}
          className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-ink-muted hover:text-red-600 hover:bg-red-50 transition-colors ${
            isCollapsed ? "justify-center" : ""
          }`}
        >
          <LogOut className="w-5 h-5" />
          {!isCollapsed && <span className="text-sm font-medium">Logout</span>}
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;
