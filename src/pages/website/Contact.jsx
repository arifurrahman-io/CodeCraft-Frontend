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
  FaTwitter,
} from "react-icons/fa";

import Button from "@/components/common/Button";
import Input from "@/components/common/Input";
import TextArea from "@/components/common/TextArea";
import PageHero from "@/components/website/PageHero";
import { COMPANY } from "@/utils/constants";
import { sendMessage } from "@/services/contactService";
import { getSettings } from "@/services/settingsService";

const defaultCompany = {
  ...COMPANY,
  name: COMPANY?.name || "CodeCraft.BD",
  email: COMPANY?.email || "hello.codecraftbd@gmail.com",
  phone: COMPANY?.phone || "+8801XXXXXXXXX",
  address: COMPANY?.address || "Dhaka, Bangladesh",
};

const defaultSocial = {
  facebook: "",
  twitter: "",
  linkedin: "",
  github: "",
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

const selectClass =
  "w-full px-4 py-2.5 bg-surface border border-border rounded-lg text-ink focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-colors";

const ContactPage = () => {
  const [formData, setFormData] = useState(initialForm);
  const [company, setCompany] = useState(defaultCompany);
  const [social, setSocial] = useState(defaultSocial);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [loadingSettings, setLoadingSettings] = useState(true);

  useEffect(() => {
    let mounted = true;

    const loadSettings = async () => {
      try {
        const response = await getSettings();
        const settingsData =
          response?.data?.settings || response?.data?.data?.settings || response?.data;
        const companyData = settingsData?.company;
        const socialData = settingsData?.social;

        if (mounted && companyData) {
          setCompany((prev) => ({
            ...prev,
            ...companyData,
          }));
        }

        if (mounted && socialData) {
          setSocial((prev) => ({
            ...prev,
            ...socialData,
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

  const socialLinks = useMemo(
    () =>
      [
        { icon: FaFacebookF, href: social.facebook, label: "Facebook" },
        { icon: FaTwitter, href: social.twitter, label: "Twitter" },
        { icon: FaLinkedinIn, href: social.linkedin, label: "LinkedIn" },
        { icon: FaGithub, href: social.github, label: "GitHub" },
      ].filter((item) => item.href),
    [social],
  );

  return (
    <div>
      <PageHero
        subtitle="Contact"
        title="Get in touch"
        description="Have a project idea? Need a website, app, or custom software? Let's discuss how we can help."
      />

      <section className="pb-16 md:pb-20">
        <div className="container-custom">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {contactInfo.map((info, index) => (
              <motion.div
                key={info.title}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.06 }}
                className="border-t border-border pt-5"
              >
                <info.icon className="w-5 h-5 text-accent mb-3" />
                <h3 className="text-sm font-semibold text-ink mb-1">
                  {info.title}
                </h3>
                <p className="text-accent break-words mb-1">
                  {loadingSettings ? "Loading..." : info.value}
                </p>
                <p className="text-sm text-ink-subtle">{info.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding bg-surface border-y border-border">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="card p-6 md:p-8"
            >
              <h2 className="text-2xl font-bold text-ink tracking-tight mb-6">
                Send us a message
              </h2>

              {isSubmitted ? (
                <div className="text-center py-10">
                  <div className="w-14 h-14 rounded-xl bg-accent-soft flex items-center justify-center mx-auto mb-4">
                    <CheckCircle2 className="w-7 h-7 text-accent" />
                  </div>
                  <h3 className="text-xl font-semibold text-ink mb-2">
                    Message sent successfully
                  </h3>
                  <p className="text-ink-muted mb-6">
                    Thank you for contacting us. We&apos;ll respond shortly.
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
                      <label className="block text-sm font-medium text-ink mb-2">
                        Project Type
                      </label>
                      <select
                        name="projectType"
                        value={formData.projectType}
                        onChange={handleChange}
                        className={selectClass}
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
                      <label className="block text-sm font-medium text-ink mb-2">
                        Budget Range
                      </label>
                      <select
                        name="budgetRange"
                        value={formData.budgetRange}
                        onChange={handleChange}
                        className={selectClass}
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
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="space-y-10"
            >
              <div className="border-t border-border pt-6">
                <MapPin className="w-6 h-6 text-accent mb-4" />
                <p className="font-medium text-ink mb-1">{company.name}</p>
                <p className="text-ink-muted">{company.address}</p>
              </div>

              {socialLinks.length > 0 && (
                <div className="border-t border-border pt-6">
                  <h3 className="text-lg font-semibold text-ink mb-2">
                    Follow us
                  </h3>
                  <p className="text-ink-muted mb-5">
                    Stay connected for updates, new projects, and insights.
                  </p>
                  <div className="flex gap-2">
                    {socialLinks.map((item) => (
                      <a
                        key={item.label}
                        href={item.href}
                        target="_blank"
                        rel="noreferrer"
                        className="w-10 h-10 rounded-lg border border-border bg-surface flex items-center justify-center text-ink-muted hover:text-accent hover:border-accent/40 transition-colors"
                        aria-label={item.label}
                      >
                        <item.icon />
                      </a>
                    ))}
                  </div>
                </div>
              )}

              <div className="border-t border-border pt-6">
                <h3 className="text-lg font-semibold text-ink mb-4">
                  Quick questions?
                </h3>
                <div className="space-y-4">
                  {[
                    "What is your project delivery timeline?",
                    "Do you provide support after launch?",
                    "Can you build custom web apps?",
                  ].map((question) => (
                    <div key={question} className="flex items-start gap-3">
                      <MessageSquare className="w-5 h-5 text-accent mt-0.5 shrink-0" />
                      <span className="text-ink-muted">{question}</span>
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
