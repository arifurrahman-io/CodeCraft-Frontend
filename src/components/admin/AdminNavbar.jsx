import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, User, ChevronDown, LogOut } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

const AdminNavbar = ({ onMenuClick, isSidebarCollapsed }) => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/admin/login");
  };

  const getPageTitle = () => {
    const path = location.pathname;
    if (path === "/admin/dashboard") return "Dashboard";
    if (path.startsWith("/admin/services")) return "Services";
    if (path.startsWith("/admin/projects")) return "Projects";
    if (path.startsWith("/admin/blogs")) return "Blogs";
    if (path.startsWith("/admin/team")) return "Team";
    if (path.startsWith("/admin/testimonials")) return "Testimonials";
    if (path.startsWith("/admin/messages")) return "Messages";
    if (path.startsWith("/admin/cv-submissions")) return "CV Submissions";
    if (path.startsWith("/admin/invoices")) return "Invoices";
    if (path.startsWith("/admin/settings")) return "Settings";
    return "Admin";
  };

  return (
    <header
      className={`print:hidden fixed right-0 top-0 z-30 h-16 border-b border-border bg-surface transition-all duration-300 ${
        isSidebarCollapsed ? "left-0 lg:left-20" : "left-0 lg:left-64"
      }`}
    >
      <div className="h-full flex items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={onMenuClick}
            className="p-2 rounded-lg text-ink-muted hover:text-ink hover:bg-ink/5 transition-colors lg:hidden"
          >
            <Menu className="w-5 h-5" />
          </button>
          <h1 className="text-xl font-semibold text-ink">{getPageTitle()}</h1>
        </div>

        <div className="relative">
          <button
            type="button"
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="flex items-center gap-3 p-2 rounded-lg hover:bg-ink/5 transition-colors"
          >
            <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center">
              <span className="text-white text-sm font-medium">
                {user?.name?.charAt(0) || "A"}
              </span>
            </div>
            <span className="hidden md:block text-sm text-ink-muted">
              {user?.name || "Admin"}
            </span>
            <ChevronDown className="w-4 h-4 text-ink-subtle" />
          </button>

          {isProfileOpen && (
            <>
              <button
                type="button"
                aria-label="Close profile menu"
                className="fixed inset-0 z-10"
                onClick={() => setIsProfileOpen(false)}
              />
              <div className="absolute right-0 top-full mt-2 z-20 w-48 bg-surface border border-border rounded-lg shadow-soft overflow-hidden">
                <div className="p-3 border-b border-border">
                  <p className="text-sm font-medium text-ink">
                    {user?.name || "Admin"}
                  </p>
                  <p className="text-xs text-ink-subtle">
                    {user?.email || "admin@codecraft.bd"}
                  </p>
                </div>
                <div className="p-2">
                  <Link
                    to="/admin/settings"
                    onClick={() => setIsProfileOpen(false)}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg text-ink-muted hover:text-ink hover:bg-ink/5 transition-colors text-sm"
                  >
                    <User className="w-4 h-4" />
                    Profile
                  </Link>
                  <Link
                    to="/"
                    onClick={() => setIsProfileOpen(false)}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg text-ink-muted hover:text-ink hover:bg-ink/5 transition-colors text-sm"
                  >
                    View Website
                  </Link>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-ink-muted hover:text-red-600 hover:bg-red-50 transition-colors text-sm"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default AdminNavbar;
