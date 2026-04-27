import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Mail,
  Phone,
  MapPin,
  ArrowRight,
  MessageCircle,
  Send,
  Briefcase,
  GitBranch,
  Globe,
} from "lucide-react";
import { COMPANY, NAV_LINKS, SOCIAL_LINKS } from "@/utils/constants";
import { getSettings } from "@/services/settingsService";

const socialIcons = {
  Facebook: MessageCircle,
  Twitter: Send,
  Linkedin: Briefcase,
  Github: GitBranch,
};

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const [settings, setSettings] = useState({
    company: COMPANY,
    social: {
      facebook: COMPANY.facebook,
      twitter: COMPANY.twitter,
      linkedin: COMPANY.linkedin,
      github: COMPANY.github,
    },
  });

  useEffect(() => {
    getSettings().then((response) => {
      if (response.data) setSettings(response.data);
    });
  }, []);

  const company = settings.company || COMPANY;
  const socialLinks = SOCIAL_LINKS.map((social) => ({
    ...social,
    url: settings.social?.[social.name.toLowerCase()] || social.url,
  }));

  return (
    <footer className="bg-slate-900 border-t border-slate-800">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Company Info */}
          <div className="lg:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-6">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
                <span className="text-white font-bold text-lg">C</span>
              </div>
              <span className="text-xl font-bold text-slate-100">
                {company.name}
              </span>
            </Link>
            <p className="text-slate-400 mb-6">{company.description}</p>
            <div className="flex items-center gap-4">
              {socialLinks.map((social) => (
                (() => {
                  const SocialIcon = socialIcons[social.icon] || Globe;

                  return (
                    <a
                      key={social.name}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center text-slate-400 hover:text-cyan-500 hover:bg-slate-700 transition-colors"
                      aria-label={social.name}
                    >
                      <SocialIcon className="w-5 h-5" />
                    </a>
                  );
                })()
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold text-slate-100 mb-6">
              Quick Links
            </h4>
            <ul className="space-y-3">
              {NAV_LINKS.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-slate-400 hover:text-cyan-500 transition-colors flex items-center gap-2 group"
                  >
                    <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-lg font-semibold text-slate-100 mb-6">
              Services
            </h4>
            <ul className="space-y-3">
              <li>
                <Link
                  to="/services"
                  className="text-slate-400 hover:text-cyan-500 transition-colors"
                >
                  Web Development
                </Link>
              </li>
              <li>
                <Link
                  to="/services"
                  className="text-slate-400 hover:text-cyan-500 transition-colors"
                >
                  Mobile Apps
                </Link>
              </li>
              <li>
                <Link
                  to="/services"
                  className="text-slate-400 hover:text-cyan-500 transition-colors"
                >
                  UI/UX Design
                </Link>
              </li>
              <li>
                <Link
                  to="/services"
                  className="text-slate-400 hover:text-cyan-500 transition-colors"
                >
                  SaaS Development
                </Link>
              </li>
              <li>
                <Link
                  to="/services"
                  className="text-slate-400 hover:text-cyan-500 transition-colors"
                >
                  E-commerce
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold text-slate-100 mb-6">
              Contact Us
            </h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-cyan-500 mt-0.5" />
                <span className="text-slate-400">{company.address}</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-cyan-500" />
                <a
                  href={`mailto:${company.email}`}
                  className="text-slate-400 hover:text-cyan-500 transition-colors"
                >
                  {company.email}
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-cyan-500" />
                <a
                  href={`tel:${company.phone}`}
                  className="text-slate-400 hover:text-cyan-500 transition-colors"
                >
                  {company.phone}
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-slate-500 text-sm">
              © {currentYear} {company.name}. All rights reserved.
            </p>
            <div className="flex items-center gap-6">
              <Link
                to="/privacy"
                className="text-slate-500 hover:text-cyan-500 text-sm transition-colors"
              >
                Privacy Policy
              </Link>
              <Link
                to="/terms"
                className="text-slate-500 hover:text-cyan-500 text-sm transition-colors"
              >
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
