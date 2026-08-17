import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Mail,
  Phone,
  MapPin,
  MessageCircle,
  Send,
  Briefcase,
  GitBranch,
  Globe,
} from "lucide-react";
import { COMPANY, NAV_LINKS } from "@/utils/constants";
import { getSettings } from "@/services/settingsService";

const socialIcons = {
  Facebook: MessageCircle,
  Twitter: Send,
  Linkedin: Briefcase,
  Github: GitBranch,
};

const socialLinksConfig = [
  { name: "Facebook", key: "facebook", icon: "Facebook" },
  { name: "Twitter", key: "twitter", icon: "Twitter" },
  { name: "LinkedIn", key: "linkedin", icon: "Linkedin" },
  { name: "GitHub", key: "github", icon: "Github" },
];

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const [settings, setSettings] = useState({
    company: COMPANY,
    branding: {},
    social: {
      facebook: "",
      twitter: "",
      linkedin: "",
      github: "",
    },
  });

  useEffect(() => {
    getSettings().then((response) => {
      const settingsData =
        response?.data?.settings ||
        response?.data?.data?.settings ||
        response?.data;

      if (settingsData) {
        setSettings((prev) => ({
          ...prev,
          ...settingsData,
          company: {
            ...prev.company,
            ...settingsData.company,
          },
          branding: {
            ...prev.branding,
            ...settingsData.branding,
          },
          social: {
            ...prev.social,
            ...settingsData.social,
          },
        }));
      }
    });
  }, []);

  const company = settings.company || COMPANY;
  const logo = settings.branding?.logo;
  const socialLinks = socialLinksConfig
    .map((social) => ({
      ...social,
      url: settings.social?.[social.key] || "",
    }))
    .filter((social) => social.url);

  return (
    <footer className="relative bg-ink text-white mt-auto overflow-hidden">
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_0%_0%,rgba(13,148,136,0.18),transparent_45%)]"
        aria-hidden="true"
      />

      <div className="relative container-custom py-16 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-14">
          <div className="lg:col-span-1">
            <Link to="/" className="flex items-center gap-2.5 mb-5">
              {logo ? (
                <img
                  src={logo}
                  alt={`${company.name} logo`}
                  className="h-7 max-w-36 object-contain brightness-0 invert md:h-8 md:max-w-40"
                />
              ) : (
                <>
                  <div className="w-9 h-9 rounded-lg bg-accent flex items-center justify-center">
                    <span className="font-display text-white font-bold text-base">
                      C
                    </span>
                  </div>
                  <span className="font-display text-lg font-bold">
                    {company.name}
                  </span>
                </>
              )}
            </Link>
            <p className="text-slate-400 text-sm leading-relaxed mb-6 max-w-xs">
              {company.description}
            </p>
            <div className="flex items-center gap-2">
              {socialLinks.map((social) => {
                const SocialIcon = socialIcons[social.icon] || Globe;
                return (
                  <a
                    key={social.name}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-9 h-9 rounded-lg bg-white/5 flex items-center justify-center text-slate-400 hover:text-white hover:bg-accent/80 transition-colors"
                    aria-label={social.name}
                  >
                    <SocialIcon className="w-4 h-4" />
                  </a>
                );
              })}
            </div>
          </div>

          <div>
            <h4 className="font-display text-sm font-semibold tracking-wide text-white mb-5">
              Explore
            </h4>
            <ul className="space-y-3">
              {NAV_LINKS.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-slate-400 hover:text-white text-sm transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-display text-sm font-semibold tracking-wide text-white mb-5">
              Services
            </h4>
            <ul className="space-y-3 text-sm text-slate-400">
              <li>
                <Link
                  to="/services"
                  className="hover:text-white transition-colors"
                >
                  Web Development
                </Link>
              </li>
              <li>
                <Link
                  to="/services"
                  className="hover:text-white transition-colors"
                >
                  Mobile Apps
                </Link>
              </li>
              <li>
                <Link
                  to="/services"
                  className="hover:text-white transition-colors"
                >
                  UI/UX Design
                </Link>
              </li>
              <li>
                <Link
                  to="/services"
                  className="hover:text-white transition-colors"
                >
                  SaaS Development
                </Link>
              </li>
              <li>
                <Link
                  to="/services"
                  className="hover:text-white transition-colors"
                >
                  E-commerce
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-display text-sm font-semibold tracking-wide text-white mb-5">
              Contact
            </h4>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-accent mt-0.5 shrink-0" />
                <span className="text-slate-400">{company.address}</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-accent shrink-0" />
                <a
                  href={`mailto:${company.email}`}
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  {company.email}
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-accent shrink-0" />
                <a
                  href={`tel:${company.phone}`}
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  {company.phone}
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="relative border-t border-white/10">
        <div className="container-custom py-5 flex flex-col md:flex-row items-center justify-between gap-3">
          <p className="text-slate-500 text-sm">
            © {currentYear} {company.name}. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <Link
              to="/privacy"
              className="text-slate-500 hover:text-white text-sm transition-colors"
            >
              Privacy Policy
            </Link>
            <Link
              to="/terms"
              className="text-slate-500 hover:text-white text-sm transition-colors"
            >
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
