import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, Bell, Search, User, ChevronDown, LogOut } from "lucide-react";
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

  // Get page title from location
  const getPageTitle = () => {
    const path = location.pathname;
    if (path === "/admin/dashboard") return "Dashboard";
    if (path.startsWith("/admin/services")) return "Services";
    if (path.startsWith("/admin/projects")) return "Projects";
    if (path.startsWith("/admin/blogs")) return "Blogs";
    if (path.startsWith("/admin/team")) return "Team";
    if (path.startsWith("/admin/testimonials")) return "Testimonials";
    if (path.startsWith("/admin/messages")) return "Messages";
    if (path.startsWith("/admin/settings")) return "Settings";
    return "Admin";
  };

  return (
    <header
      className={`fixed right-0 top-0 z-30 h-16 border-b border-slate-800 bg-slate-900 transition-all duration-300 ${
        isSidebarCollapsed ? "left-0 lg:left-20" : "left-0 lg:left-64"
      }`}
    >
      <div className="h-full flex items-center justify-between px-6">
        {/* Left - Page Title */}
        <div className="flex items-center gap-4">
          <button
            onClick={onMenuClick}
            className="p-2 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors lg:hidden"
          >
            <Menu className="w-5 h-5" />
          </button>
          <h1 className="text-xl font-semibold text-slate-100">
            {getPageTitle()}
          </h1>
        </div>

        {/* Right - Actions */}
        <div className="flex items-center gap-4">
          {/* Search */}
          <div className="hidden md:flex items-center">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search..."
                className="w-64 pl-10 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-sm"
              />
            </div>
          </div>

          {/* Notifications */}
          <button className="relative p-2 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-cyan-500" />
          </button>

          {/* Profile */}
          <div className="relative">
            <button
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-800 transition-colors"
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
                <span className="text-white text-sm font-medium">
                  {user?.name?.charAt(0) || "A"}
                </span>
              </div>
              <span className="hidden md:block text-sm text-slate-300">
                {user?.name || "Admin"}
              </span>
              <ChevronDown className="w-4 h-4 text-slate-500" />
            </button>

            {/* Profile Dropdown */}
            {isProfileOpen && (
              <div className="absolute right-0 top-full mt-2 w-48 bg-slate-800 border border-slate-700 rounded-lg shadow-lg overflow-hidden">
                <div className="p-3 border-b border-slate-700">
                  <p className="text-sm font-medium text-slate-100">
                    {user?.name || "Admin"}
                  </p>
                  <p className="text-xs text-slate-500">
                    {user?.email || "admin@codecraft.bd"}
                  </p>
                </div>
                <div className="p-2">
                  <Link
                    to="/admin/settings"
                    className="flex items-center gap-2 px-3 py-2 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-700 transition-colors text-sm"
                  >
                    <User className="w-4 h-4" />
                    Profile
                  </Link>
                  <Link
                    to="/"
                    className="flex items-center gap-2 px-3 py-2 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-700 transition-colors text-sm"
                  >
                    View Website
                  </Link>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-slate-400 hover:text-red-400 hover:bg-slate-700 transition-colors text-sm"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminNavbar;
