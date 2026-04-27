import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import {
  Mail,
  Phone,
  MapPin,
  Send,
  Clock,
  MessageSquare,
  CheckCircle,
} from "lucide-react";
import Button from "@/components/common/Button";
import Input from "@/components/common/Input";
import TextArea from "@/components/common/TextArea";
import { COMPANY } from "@/utils/constants";
import { sendMessage } from "@/services/contactService";
import { getSettings } from "@/services/settingsService";

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [company, setCompany] = useState(COMPANY);

  useEffect(() => {
    getSettings().then((response) => {
      if (response.data?.company) setCompany(response.data.company);
    });
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await sendMessage(formData);
      setIsSubmitted(true);
      setFormData({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
      });
    } catch (error) {
      toast.error(error.message || "Failed to send message");
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactInfo = [
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
      description: "Mon-Fri from 9am to 6pm",
    },
    {
      icon: MapPin,
      title: "Office",
      value: company.address,
      description: "Come visit us",
    },
    {
      icon: Clock,
      title: "Hours",
      value: "9:00 AM - 6:00 PM",
      description: "Sunday - Thursday",
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="pt-32 pb-16 bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-3xl mx-auto"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-slate-100 mb-6">
              Get in <span className="text-cyan-500">Touch</span>
            </h1>
            <p className="text-lg text-slate-400">
              Have a project in mind? Let's discuss how we can help bring your
              vision to life.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Info */}
      <section className="py-16 bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {contactInfo.map((info, index) => (
              <motion.div
                key={info.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="glass rounded-xl p-6 border border-slate-700/50"
              >
                <div className="w-12 h-12 rounded-xl bg-cyan-500/20 flex items-center justify-center mb-4">
                  <info.icon className="w-6 h-6 text-cyan-500" />
                </div>
                <h3 className="text-lg font-semibold text-slate-100 mb-1">
                  {info.title}
                </h3>
                <p className="text-cyan-500 mb-1">{info.value}</p>
                <p className="text-sm text-slate-500">{info.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section className="py-16 md:py-20 bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Form */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="glass rounded-2xl p-8 border border-slate-700/50"
            >
              <h2 className="text-2xl font-bold text-slate-100 mb-6">
                Send us a Message
              </h2>

              {isSubmitted ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-8 h-8 text-green-500" />
                  </div>
                  <h3 className="text-xl font-semibold text-slate-100 mb-2">
                    Message Sent!
                  </h3>
                  <p className="text-slate-400 mb-6">
                    Thank you for reaching out. We'll get back to you within 24
                    hours.
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
                      name="email"
                      type="email"
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
                      type="tel"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+880 1234 567890"
                    />
                    <Input
                      label="Subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      placeholder="Project Inquiry"
                      required
                    />
                  </div>

                  <TextArea
                    label="Message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Tell us about your project..."
                    rows={6}
                    required
                  />

                  <Button
                    type="submit"
                    size="lg"
                    icon={Send}
                    isLoading={isSubmitting}
                    className="w-full"
                  >
                    Send Message
                  </Button>
                </form>
              )}
            </motion.div>

            {/* Map / Info */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              {/* Map Placeholder */}
              <div className="glass rounded-2xl p-8 border border-slate-700/50 h-80 flex items-center justify-center">
                <div className="text-center">
                  <MapPin className="w-12 h-12 text-cyan-500 mx-auto mb-4" />
                  <p className="text-slate-400">Map integration available</p>
                  <p className="text-sm text-slate-500">{company.address}</p>
                </div>
              </div>

              {/* Social Links */}
              <div className="glass rounded-2xl p-8 border border-slate-700/50">
                <h3 className="text-lg font-semibold text-slate-100 mb-4">
                  Follow Us
                </h3>
                <p className="text-slate-400 mb-6">
                  Stay connected with us on social media for the latest updates
                  and news.
                </p>
                <div className="flex gap-4">
                  {["Facebook", "Twitter", "LinkedIn", "GitHub"].map(
                    (social) => (
                      <a
                        key={social}
                        href="#"
                        className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center text-slate-400 hover:text-cyan-500 hover:bg-slate-700 transition-colors"
                      >
                        {social[0]}
                      </a>
                    ),
                  )}
                </div>
              </div>

              {/* FAQ */}
              <div className="glass rounded-2xl p-8 border border-slate-700/50">
                <h3 className="text-lg font-semibold text-slate-100 mb-4">
                  Quick Questions?
                </h3>
                <div className="space-y-4">
                  {[
                    "What is your typical project timeline?",
                    "Do you offer post-launch support?",
                    "What is your payment structure?",
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
