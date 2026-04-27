import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Briefcase,
  FolderKanban,
  FileText,
  Users,
  MessageSquare,
  Settings,
  ChevronLeft,
  LogOut,
} from "lucide-react";
import { ADMIN_NAV_LINKS } from "@/utils/constants";
import { useAuth } from "@/hooks/useAuth";

const iconMap = {
  LayoutDashboard,
  Briefcase,
  FolderKanban,
  FileText,
  Users,
  MessageSquare,
  Settings,
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
      className={`fixed left-0 top-0 z-40 h-screen border-r border-slate-800 bg-slate-900 transition-all duration-300 ${
        isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      } ${
        isCollapsed ? "w-20" : "w-64"
      }`}
    >
      {/* Logo */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-slate-800">
        <Link
          to="/admin/dashboard"
          onClick={handleNavigate}
          className="flex items-center gap-3"
        >
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center flex-shrink-0">
            <span className="text-white font-bold text-lg">C</span>
          </div>
          {!isCollapsed && (
            <span className="text-lg font-bold text-slate-100">Admin</span>
          )}
        </Link>
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors"
        >
          <ChevronLeft
            className={`w-5 h-5 transition-transform ${isCollapsed ? "rotate-180" : ""}`}
          />
        </button>
      </div>

      {/* Navigation */}
      <nav className="p-4 space-y-1">
        {ADMIN_NAV_LINKS.map((link) => {
          const Icon = iconMap[link.icon] || LayoutDashboard;
          return (
            <Link
              key={link.path}
              to={link.path}
              onClick={handleNavigate}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 ${
                isActive(link.path)
                  ? "bg-cyan-500/10 text-cyan-500 border-l-2 border-cyan-500"
                  : "text-slate-400 hover:text-slate-100 hover:bg-slate-800"
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

      {/* Logout */}
      <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-slate-800">
        <button
          onClick={logout}
          className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-500/10 transition-colors ${
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
