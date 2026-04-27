import { useEffect, useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  CheckCircle2,
  DollarSign,
  Layers,
  Share2,
  Copy,
} from "lucide-react";
import {
  FaFacebookF,
  FaLinkedinIn,
  FaXTwitter,
  FaWhatsapp,
} from "react-icons/fa6";
import { toast } from "sonner";

import Button from "@/components/common/Button";
import SectionHeader from "@/components/common/SectionHeader";
import { getServiceBySlug } from "@/services/serviceService";

const iconMap = {
  Globe: "🌐",
  Smartphone: "📱",
  Palette: "🎨",
  Cloud: "☁️",
  ShoppingCart: "🛒",
  Code: "💻",
};

const fallbackImage =
  "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=1200&auto=format&fit=crop&q=80";

const getServiceFromResponse = (response) =>
  response?.data?.service ||
  response?.data?.data ||
  response?.data ||
  response?.service ||
  response ||
  null;

const ensureArray = (value) => {
  if (Array.isArray(value)) return value;
  if (!value) return [];

  return String(value)
    .split(/\n|,/)
    .map((item) => item.trim())
    .filter(Boolean);
};

const normalizeService = (service) => {
  if (!service) return null;

  return {
    ...service,
    title: service.title || "Untitled Service",
    slug: service.slug || "",
    shortDescription: service.shortDescription || "",
    description: service.description || "",
    icon: service.icon || "Globe",
    image: service.image || fallbackImage,
    features: ensureArray(service.features),
    technologies: ensureArray(service.technologies),
    priceRange: service.priceRange || "Negotiable",
    order: Number(service.order || 0),
    seoTitle: service.seoTitle || service.title || "Service",
    seoDescription: service.seoDescription || service.shortDescription || "",
    isActive:
      typeof service.isActive === "boolean"
        ? service.isActive
        : service.status === "inactive"
          ? false
          : true,
  };
};

const openShareWindow = (url) => {
  window.open(url, "_blank", "noopener,noreferrer,width=720,height=620");
};

const ServiceDetailsPage = () => {
  const { slug } = useParams();

  const [service, setService] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const normalizedService = useMemo(() => normalizeService(service), [service]);

  const shareData = useMemo(() => {
    if (!normalizedService) return null;

    const pageUrl =
      typeof window !== "undefined"
        ? window.location.href
        : `/services/${normalizedService.slug}`;

    const title = normalizedService.seoTitle || normalizedService.title;
    const text =
      normalizedService.seoDescription ||
      normalizedService.shortDescription ||
      normalizedService.title;

    return {
      pageUrl,
      encodedUrl: encodeURIComponent(pageUrl),
      title,
      encodedTitle: encodeURIComponent(title),
      text,
      encodedText: encodeURIComponent(text),
    };
  }, [normalizedService]);

  useEffect(() => {
    let isMounted = true;

    const fetchService = async () => {
      try {
        setIsLoading(true);

        const response = await getServiceBySlug(slug);
        const serviceData = getServiceFromResponse(response);

        if (isMounted) {
          setService(serviceData);
        }
      } catch (error) {
        if (isMounted) {
          setService(null);
          toast.error(
            error?.response?.data?.message || "Failed to load service",
          );
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    if (slug) fetchService();

    return () => {
      isMounted = false;
    };
  }, [slug]);

  const handleNativeShare = async () => {
    if (!shareData) return;

    try {
      if (navigator.share) {
        await navigator.share({
          title: shareData.title,
          text: shareData.text,
          url: shareData.pageUrl,
        });
      } else {
        await navigator.clipboard.writeText(shareData.pageUrl);
        toast.success("Service link copied");
      }
    } catch (error) {
      if (error?.name !== "AbortError") {
        toast.error("Unable to share this service");
      }
    }
  };

  const handleCopyLink = async () => {
    if (!shareData) return;

    try {
      await navigator.clipboard.writeText(shareData.pageUrl);
      toast.success("Service link copied");
    } catch {
      toast.error("Failed to copy link");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <p className="text-slate-400">Loading service...</p>
      </div>
    );
  }

  if (!normalizedService || !normalizedService.isActive) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-slate-100 mb-4">
            Service Not Found
          </h1>
          <p className="text-slate-400 mb-6">
            The service may be unavailable or inactive.
          </p>
          <Link to="/services">
            <Button variant="outline">Back to Services</Button>
          </Link>
        </div>
      </div>
    );
  }

  const serviceIcon = iconMap[normalizedService.icon] || iconMap.Globe;

  return (
    <div className="min-h-screen">
      <section className="pt-32 pb-16 bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            to="/services"
            className="inline-flex items-center gap-2 text-slate-400 hover:text-cyan-500 mb-8 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Services
          </Link>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/20 mb-6">
                <span className="text-2xl">{serviceIcon}</span>
                <span className="text-cyan-400">Service</span>
              </div>

              <h1 className="text-4xl md:text-5xl font-bold text-slate-100 mb-6">
                {normalizedService.title}
              </h1>

              <p className="text-lg text-slate-400 mb-8">
                {normalizedService.shortDescription}
              </p>

              <div className="grid sm:grid-cols-2 gap-6 mb-8">
                <div className="glass rounded-xl p-4 border border-slate-700/50 text-center">
                  <DollarSign className="w-6 h-6 text-cyan-500 mx-auto mb-2" />
                  <p className="text-sm text-slate-400">Starting from</p>
                  <p className="text-lg font-semibold text-slate-100">
                    {normalizedService.priceRange}
                  </p>
                </div>

                <div className="glass rounded-xl p-4 border border-slate-700/50 text-center">
                  <Layers className="w-6 h-6 text-cyan-500 mx-auto mb-2" />
                  <p className="text-sm text-slate-400">Features</p>
                  <p className="text-lg font-semibold text-slate-100">
                    {normalizedService.features.length} Included
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <Link to="/contact">
                  <Button size="lg">Get a Quote</Button>
                </Link>

                <Button
                  type="button"
                  variant="outline"
                  size="lg"
                  icon={Share2}
                  onClick={handleNativeShare}
                >
                  Share
                </Button>
              </div>

              {shareData && (
                <div className="mt-6">
                  <p className="text-sm text-slate-500 mb-3">
                    Share this service
                  </p>

                  <div className="flex flex-wrap gap-3">
                    <button
                      type="button"
                      onClick={() =>
                        openShareWindow(
                          `https://www.facebook.com/sharer/sharer.php?u=${shareData.encodedUrl}`,
                        )
                      }
                      className="inline-flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-800/70 px-4 py-2 text-sm text-slate-300 hover:border-cyan-500/60 hover:text-cyan-400 transition-colors"
                    >
                      <FaFacebookF className="w-4 h-4" />
                      Facebook
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        openShareWindow(
                          `https://www.linkedin.com/sharing/share-offsite/?url=${shareData.encodedUrl}`,
                        )
                      }
                      className="inline-flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-800/70 px-4 py-2 text-sm text-slate-300 hover:border-cyan-500/60 hover:text-cyan-400 transition-colors"
                    >
                      <FaLinkedinIn className="w-4 h-4" />
                      LinkedIn
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        openShareWindow(
                          `https://twitter.com/intent/tweet?url=${shareData.encodedUrl}&text=${shareData.encodedText}`,
                        )
                      }
                      className="inline-flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-800/70 px-4 py-2 text-sm text-slate-300 hover:border-cyan-500/60 hover:text-cyan-400 transition-colors"
                    >
                      <FaXTwitter className="w-4 h-4" />
                      Twitter
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        openShareWindow(
                          `https://wa.me/?text=${shareData.encodedText}%20${shareData.encodedUrl}`,
                        )
                      }
                      className="inline-flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-800/70 px-4 py-2 text-sm text-slate-300 hover:border-cyan-500/60 hover:text-cyan-400 transition-colors"
                    >
                      <FaWhatsapp className="w-4 h-4" />
                      WhatsApp
                    </button>

                    <button
                      type="button"
                      onClick={handleCopyLink}
                      className="inline-flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-800/70 px-4 py-2 text-sm text-slate-300 hover:border-cyan-500/60 hover:text-cyan-400 transition-colors"
                    >
                      <Copy className="w-4 h-4" />
                      Copy Link
                    </button>
                  </div>
                </div>
              )}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="glass rounded-2xl overflow-hidden border border-slate-700/50"
            >
              <img
                src={normalizedService.image}
                alt={normalizedService.title}
                className="w-full h-80 object-cover"
                onError={(e) => {
                  e.currentTarget.src = fallbackImage;
                }}
              />
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-20 bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <SectionHeader title="Service Overview" className="mb-8" />
            <div className="prose prose-invert max-w-none">
              <p className="text-lg text-slate-400 leading-relaxed whitespace-pre-line">
                {normalizedService.description}
              </p>
            </div>
          </div>
        </div>
      </section>

      {normalizedService.features.length > 0 && (
        <section className="py-16 md:py-20 bg-slate-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionHeader
              subtitle="What's Included"
              title="Key Features"
              className="mb-12"
            />

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {normalizedService.features.map((feature, index) => (
                <motion.div
                  key={`${feature}-${index}`}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.08 }}
                  className="glass rounded-xl p-6 border border-slate-700/50"
                >
                  <CheckCircle2 className="w-6 h-6 text-cyan-500 mb-4" />
                  <h3 className="text-lg font-semibold text-slate-100 mb-2">
                    {feature}
                  </h3>
                  <p className="text-sm text-slate-400">
                    Professional implementation of {feature.toLowerCase()} for
                    your project.
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {normalizedService.technologies.length > 0 && (
        <section className="py-16 md:py-20 bg-slate-950">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionHeader
              subtitle="Technology Stack"
              title="Technologies We Use"
              className="mb-10"
            />

            <div className="flex flex-wrap gap-3">
              {normalizedService.technologies.map((technology, index) => (
                <span
                  key={`${technology}-${index}`}
                  className="rounded-full border border-cyan-500/20 bg-cyan-500/10 px-4 py-2 text-sm text-cyan-300"
                >
                  {technology}
                </span>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="py-16 md:py-20 bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="glass rounded-2xl p-8 md:p-12 border border-slate-700/50 text-center">
            <h2 className="text-3xl font-bold text-slate-100 mb-4">
              Ready to Get Started?
            </h2>
            <p className="text-lg text-slate-400 mb-8 max-w-2xl mx-auto">
              Contact us today to discuss your project and get a custom quote
              tailored to your needs.
            </p>
            <Link to="/contact">
              <Button size="lg">Start Your Project</Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ServiceDetailsPage;
