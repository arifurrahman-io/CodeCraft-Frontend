import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import {
  Mail,
  Phone,
  MapPin,
  Send,
  Clock,
  MessageSquare,
  CheckCircle2,
} from "lucide-react";

import {
  FaFacebookF,
  FaLinkedinIn,
  FaGithub,
  FaWhatsapp,
} from "react-icons/fa";

import Button from "@/components/common/Button";
import Input from "@/components/common/Input";
import TextArea from "@/components/common/TextArea";
import { COMPANY } from "@/utils/constants";
import { sendMessage } from "@/services/contactService";
import { getSettings } from "@/services/settingsService";

const defaultCompany = {
  ...COMPANY,
  name: COMPANY?.name || "CodeCraft.BD",
  email: COMPANY?.email || "hello@codecraftbd.com",
  phone: COMPANY?.phone || "+8801XXXXXXXXX",
  address: COMPANY?.address || "Dhaka, Bangladesh",
  facebook: COMPANY?.facebook || "",
  linkedin: COMPANY?.linkedin || "",
  github: COMPANY?.github || "",
  whatsapp: COMPANY?.whatsapp || "",
};

const initialForm = {
  name: "",
  email: "",
  phone: "",
  company: "",
  projectType: "",
  budgetRange: "",
  message: "",
};

const projectTypes = [
  "Website Development",
  "Mobile App Development",
  "SaaS Platform",
  "E-commerce Solution",
  "Custom Software",
  "UI/UX Design",
  "Other",
];

const budgetRanges = [
  "Below ৳20,000",
  "৳20,000 - ৳50,000",
  "৳50,000 - ৳1,00,000",
  "৳1,00,000 - ৳3,00,000",
  "৳3,00,000+",
  "Not sure yet",
];

const ContactPage = () => {
  const [formData, setFormData] = useState(initialForm);
  const [company, setCompany] = useState(defaultCompany);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [loadingSettings, setLoadingSettings] = useState(true);

  useEffect(() => {
    let mounted = true;

    const loadSettings = async () => {
      try {
        const response = await getSettings();
        const companyData =
          response?.data?.company ||
          response?.data?.data?.company ||
          response?.data?.settings?.company;

        if (mounted && companyData) {
          setCompany((prev) => ({
            ...prev,
            ...companyData,
          }));
        }
      } finally {
        if (mounted) setLoadingSettings(false);
      }
    };

    loadSettings();

    return () => {
      mounted = false;
    };
  }, []);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.name.trim() ||
      !formData.email.trim() ||
      !formData.message.trim()
    ) {
      toast.error("Please fill name, email and message");
      return;
    }

    setIsSubmitting(true);

    try {
      await sendMessage({
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        company: formData.company.trim(),
        projectType: formData.projectType.trim(),
        budgetRange: formData.budgetRange.trim(),
        message: formData.message.trim(),
      });

      setIsSubmitted(true);
      setFormData(initialForm);
      toast.success("Message sent successfully");
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to send message",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactInfo = useMemo(
    () => [
      {
        icon: Mail,
        title: "Email",
        value: company.email,
        description: "Send us an email anytime",
      },
      {
        icon: Phone,
        title: "Phone",
        value: company.phone,
        description: "Talk with our team",
      },
      {
        icon: MapPin,
        title: "Office",
        value: company.address,
        description: "Visit our office location",
      },
      {
        icon: Clock,
        title: "Hours",
        value: "9:00 AM - 6:00 PM",
        description: "Sunday - Thursday",
      },
    ],
    [company],
  );

  const socialLinks = [
    { icon: FaFacebookF, href: company.facebook, label: "Facebook" },
    { icon: FaLinkedinIn, href: company.linkedin, label: "LinkedIn" },
    { icon: FaGithub, href: company.github, label: "GitHub" },
    {
      icon: FaWhatsapp,
      href: company.whatsapp
        ? `https://wa.me/${company.whatsapp.replace(/\D/g, "")}`
        : "",
      label: "WhatsApp",
    },
  ].filter((item) => item.href);

  return (
    <div className="min-h-screen">
      <section className="pt-32 pb-16 bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-3xl mx-auto"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-slate-100 mb-6">
              Get in <span className="text-cyan-500">Touch</span>
            </h1>

            <p className="text-lg text-slate-400 leading-8">
              Have a project idea? Need a website, app, or custom software?
              Let&apos;s discuss how we can help.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-16 bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {contactInfo.map((info, index) => (
              <motion.div
                key={info.title}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.08 }}
                className="glass rounded-xl p-6 border border-slate-700/50"
              >
                <div className="w-12 h-12 rounded-xl bg-cyan-500/15 flex items-center justify-center mb-4">
                  <info.icon className="w-6 h-6 text-cyan-500" />
                </div>

                <h3 className="text-lg font-semibold text-slate-100 mb-1">
                  {info.title}
                </h3>

                <p className="text-cyan-400 mb-1 break-words">
                  {loadingSettings ? "Loading..." : info.value}
                </p>

                <p className="text-sm text-slate-500">{info.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 md:py-20 bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-10">
            <motion.div
              initial={{ opacity: 0, x: -18 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="glass rounded-2xl p-8 border border-slate-700/50"
            >
              <h2 className="text-2xl font-bold text-slate-100 mb-6">
                Send us a Message
              </h2>

              {isSubmitted ? (
                <div className="text-center py-10">
                  <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-4">
                    <CheckCircle2 className="w-8 h-8 text-green-500" />
                  </div>

                  <h3 className="text-xl font-semibold text-slate-100 mb-2">
                    Message Sent Successfully
                  </h3>

                  <p className="text-slate-400 mb-6">
                    Thank you for contacting us. We’ll respond shortly.
                  </p>

                  <Button
                    variant="outline"
                    onClick={() => setIsSubmitted(false)}
                  >
                    Send Another Message
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <Input
                      label="Your Name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="John Doe"
                      required
                    />

                    <Input
                      label="Email Address"
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="john@example.com"
                      required
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <Input
                      label="Phone Number"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+8801XXXXXXXXX"
                    />

                    <Input
                      label="Company"
                      name="company"
                      value={formData.company}
                      onChange={handleChange}
                      placeholder="Your company name"
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">
                        Project Type
                      </label>
                      <select
                        name="projectType"
                        value={formData.projectType}
                        onChange={handleChange}
                        className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-slate-100 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                      >
                        <option value="">Select project type</option>
                        {projectTypes.map((type) => (
                          <option key={type} value={type}>
                            {type}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">
                        Budget Range
                      </label>
                      <select
                        name="budgetRange"
                        value={formData.budgetRange}
                        onChange={handleChange}
                        className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-slate-100 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                      >
                        <option value="">Select budget range</option>
                        {budgetRanges.map((range) => (
                          <option key={range} value={range}>
                            {range}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <TextArea
                    label="Message"
                    name="message"
                    rows={6}
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Tell us about your project..."
                    required
                  />

                  <Button
                    type="submit"
                    icon={Send}
                    size="lg"
                    className="w-full"
                    isLoading={isSubmitting}
                  >
                    Send Message
                  </Button>
                </form>
              )}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 18 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <div className="glass rounded-2xl p-8 border border-slate-700/50 h-80 flex items-center justify-center">
                <div className="text-center">
                  <MapPin className="w-12 h-12 text-cyan-500 mx-auto mb-4" />
                  <p className="text-slate-300 font-medium mb-1">
                    {company.name}
                  </p>
                  <p className="text-slate-500">{company.address}</p>
                </div>
              </div>

              <div className="glass rounded-2xl p-8 border border-slate-700/50">
                <h3 className="text-lg font-semibold text-slate-100 mb-4">
                  Follow Us
                </h3>

                <p className="text-slate-400 mb-6">
                  Stay connected for updates, new projects, and insights.
                </p>

                <div className="flex gap-3">
                  {socialLinks.map((item) => (
                    <a
                      key={item.label}
                      href={item.href}
                      target="_blank"
                      rel="noreferrer"
                      className="w-11 h-11 rounded-xl bg-slate-800 flex items-center justify-center text-slate-400 hover:text-cyan-400 hover:bg-slate-700 transition-all"
                      aria-label={item.label}
                    >
                      <item.icon />
                    </a>
                  ))}
                </div>
              </div>

              <div className="glass rounded-2xl p-8 border border-slate-700/50">
                <h3 className="text-lg font-semibold text-slate-100 mb-4">
                  Quick Questions?
                </h3>

                <div className="space-y-4">
                  {[
                    "What is your project delivery timeline?",
                    "Do you provide support after launch?",
                    "Can you build custom web apps?",
                  ].map((question, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <MessageSquare className="w-5 h-5 text-cyan-500 mt-0.5" />
                      <span className="text-slate-400">{question}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactPage;
