import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, LogIn, Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { COMPANY, NAV_LINKS } from "@/utils/constants";
import { getSettings } from "@/services/settingsService";
import { useAuth } from "@/hooks/useAuth";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [settings, setSettings] = useState({ company: COMPANY, branding: {} });
  const location = useLocation();
  const { isAuthenticated } = useAuth();

  const isHome = location.pathname === "/";
  const useLightNav = isHome && !isScrolled && !isMobileMenuOpen;

  const adminAction = isAuthenticated
    ? {
        label: "Dashboard",
        path: "/admin/dashboard",
        icon: LayoutDashboard,
      }
    : {
        label: "Login",
        path: "/admin/login",
        icon: LogIn,
      };
  const AdminActionIcon = adminAction.icon;

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 24);
    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    getSettings().then((response) => {
      if (response.data) {
        setSettings((prev) => ({
          ...prev,
          ...response.data,
          company: {
            ...prev.company,
            ...response.data.company,
          },
          branding: {
            ...prev.branding,
            ...response.data.branding,
          },
        }));
      }
    });
  }, []);

  const company = settings.company || COMPANY;
  const logo = settings.branding?.logo;

  const isActive = (path) => {
    if (path === "/") return location.pathname === "/";
    return location.pathname.startsWith(path);
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled || isMobileMenuOpen
          ? "bg-surface/90 backdrop-blur-md border-b border-border shadow-soft"
          : "bg-transparent"
      }`}
    >
      <div className="container-custom">
        <div className="flex items-center justify-between h-16 md:h-20">
          <Link
            to="/"
            className="relative z-10 flex items-center shrink-0 py-1"
            aria-label={company.name}
          >
            {logo ? (
              <img
                src={logo}
                alt={`${company.name} logo`}
                className={`h-10 w-auto max-w-[160px] object-contain object-left md:h-12 md:max-w-[210px] transition-all ${
                  useLightNav ? "brightness-0 invert" : ""
                }`}
              />
            ) : (
              <>
                <div
                  className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                    useLightNav ? "bg-white/15 text-white" : "bg-ink text-white"
                  }`}
                >
                  <span className="font-display font-bold text-base">C</span>
                </div>
                <span
                  className={`ml-2.5 font-display text-lg md:text-xl font-bold truncate transition-colors ${
                    useLightNav ? "text-white" : "text-ink"
                  }`}
                >
                  {company.name}
                </span>
              </>
            )}
          </Link>

          <nav className="hidden lg:flex items-center gap-0.5">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive(link.path)
                    ? useLightNav
                      ? "text-white bg-white/12"
                      : "text-accent bg-accent-soft"
                    : useLightNav
                      ? "text-white/75 hover:text-white hover:bg-white/10"
                      : "text-ink-muted hover:text-ink hover:bg-ink/5"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="hidden lg:flex items-center gap-2">
            <Link
              to={adminAction.path}
              className={`inline-flex items-center gap-2 px-3 py-2 text-sm rounded-lg font-medium transition-colors ${
                useLightNav
                  ? "text-white/75 hover:text-white hover:bg-white/10"
                  : "text-ink-muted hover:text-ink hover:bg-ink/5"
              }`}
            >
              <AdminActionIcon className="w-4 h-4" />
              {adminAction.label}
            </Link>
            <Link
              to="/contact"
              className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                useLightNav
                  ? "bg-white text-ink hover:bg-white/90"
                  : "bg-accent text-white hover:bg-accent-hover"
              }`}
            >
              Get Started
            </Link>
          </div>

          <button
            type="button"
            className={`lg:hidden p-2 rounded-lg transition-colors ${
              useLightNav
                ? "text-white/80 hover:text-white hover:bg-white/10"
                : "text-ink-muted hover:text-ink hover:bg-ink/5"
            }`}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-surface border-t border-border overflow-hidden"
          >
            <div className="px-4 py-4 space-y-1">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`block px-4 py-3 rounded-lg text-base font-medium ${
                    isActive(link.path)
                      ? "text-accent bg-accent-soft"
                      : "text-ink-muted hover:text-ink hover:bg-ink/5"
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              <Link
                to={adminAction.path}
                className="flex items-center justify-center gap-2 px-4 py-3 mt-3 border border-border text-ink rounded-lg text-center font-medium"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <AdminActionIcon className="w-5 h-5" />
                {adminAction.label}
              </Link>
              <Link
                to="/contact"
                className="block px-4 py-3 bg-accent text-white rounded-lg text-center font-medium"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Get Started
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;
