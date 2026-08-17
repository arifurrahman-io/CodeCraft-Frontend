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
import SEO from "@/components/common/SEO";
import SectionHeader from "@/components/common/SectionHeader";
import Loader from "@/components/common/Loader";
import EmptyState from "@/components/common/EmptyState";
import CTASection from "@/components/website/CTASection";
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

const shareBtnClass =
  "inline-flex items-center gap-2 rounded-lg border border-border bg-surface px-4 py-2 text-sm text-ink-muted hover:border-accent/40 hover:text-accent transition-colors";

const ServiceDetailsPage = () => {
  const { slug } = useParams();

  const [service, setService] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

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
        setError("");

        const response = await getServiceBySlug(slug);
        const serviceData = getServiceFromResponse(response);

        if (isMounted) {
          setService(serviceData);
        }
      } catch (err) {
        if (isMounted) {
          const message =
            err?.response?.data?.message || "Failed to load service";
          setService(null);
          setError(message);
          toast.error(message);
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
    } catch (err) {
      if (err?.name !== "AbortError") {
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
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader text="Loading service..." className="py-20" />
      </div>
    );
  }

  if (error || !normalizedService || !normalizedService.isActive) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4">
        <EmptyState
          title="Service not found"
          description={
            error || "The service may be unavailable or inactive."
          }
          action={
            <Link to="/services">
              <Button variant="outline" icon={ArrowLeft}>
                Back to Services
              </Button>
            </Link>
          }
        />
      </div>
    );
  }

  const serviceIcon = iconMap[normalizedService.icon] || iconMap.Globe;
  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: normalizedService.title,
    description: normalizedService.seoDescription,
    image: normalizedService.image,
    provider: {
      "@type": "Organization",
      name: "CodeCraft.BD",
    },
    areaServed: "Worldwide",
    serviceType: normalizedService.title,
  };

  return (
    <div>
      <SEO
        title={normalizedService.seoTitle}
        description={normalizedService.seoDescription}
        keywords={[
          normalizedService.title,
          ...normalizedService.features,
          ...normalizedService.technologies,
        ].join(", ")}
        image={normalizedService.image}
        path={`/services/${normalizedService.slug}`}
        type="article"
        structuredData={serviceSchema}
      />

      <section className="pt-12 pb-10 md:pt-16 md:pb-14">
        <div className="container-custom">
          <Link
            to="/services"
            className="inline-flex items-center gap-2 text-ink-muted hover:text-accent mb-8 transition-colors text-sm font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Services
          </Link>

          <div className="grid lg:grid-cols-2 gap-12 items-start">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <p className="text-sm font-semibold text-accent mb-3 inline-flex items-center gap-2">
                <span>{serviceIcon}</span>
                Service
              </p>

              <h1 className="font-display text-4xl md:text-5xl font-bold text-ink tracking-tight mb-4">
                {normalizedService.title}
              </h1>

              <p className="text-lg text-ink-muted mb-8 leading-relaxed">
                {normalizedService.shortDescription}
              </p>

              <div className="grid sm:grid-cols-2 gap-6 mb-8">
                <div className="border-t border-border pt-4">
                  <DollarSign className="w-5 h-5 text-accent mb-2" />
                  <p className="text-sm text-ink-subtle">Starting from</p>
                  <p className="text-lg font-semibold text-ink">
                    {normalizedService.priceRange}
                  </p>
                </div>
                <div className="border-t border-border pt-4">
                  <Layers className="w-5 h-5 text-accent mb-2" />
                  <p className="text-sm text-ink-subtle">Features</p>
                  <p className="text-lg font-semibold text-ink">
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
                  <p className="text-sm text-ink-subtle mb-3">
                    Share this service
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        openShareWindow(
                          `https://www.facebook.com/sharer/sharer.php?u=${shareData.encodedUrl}`,
                        )
                      }
                      className={shareBtnClass}
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
                      className={shareBtnClass}
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
                      className={shareBtnClass}
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
                      className={shareBtnClass}
                    >
                      <FaWhatsapp className="w-4 h-4" />
                      WhatsApp
                    </button>
                    <button
                      type="button"
                      onClick={handleCopyLink}
                      className={shareBtnClass}
                    >
                      <Copy className="w-4 h-4" />
                      Copy Link
                    </button>
                  </div>
                </div>
              )}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.08 }}
              className="overflow-hidden rounded-xl border border-border bg-surface"
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

      <section className="section-padding bg-surface border-y border-border">
        <div className="container-custom">
          <div className="max-w-3xl">
            <SectionHeader
              alignment="left"
              title="Service overview"
              className="mb-8"
            />
            <p className="text-lg text-ink-muted leading-relaxed whitespace-pre-line">
              {normalizedService.description}
            </p>
          </div>
        </div>
      </section>

      {normalizedService.features.length > 0 && (
        <section className="section-padding">
          <div className="container-custom">
            <SectionHeader
              alignment="left"
              subtitle="What's Included"
              title="Key features"
              className="mb-12"
            />

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {normalizedService.features.map((feature, index) => (
                <motion.div
                  key={`${feature}-${index}`}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.06 }}
                  className="border-t border-border pt-5"
                >
                  <CheckCircle2 className="w-5 h-5 text-accent mb-3" />
                  <h3 className="text-lg font-semibold text-ink mb-2">
                    {feature}
                  </h3>
                  <p className="text-sm text-ink-muted leading-relaxed">
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
        <section className="section-padding bg-surface border-y border-border">
          <div className="container-custom">
            <SectionHeader
              alignment="left"
              subtitle="Technology Stack"
              title="Technologies we use"
              className="mb-10"
            />

            <div className="flex flex-wrap gap-2">
              {normalizedService.technologies.map((technology, index) => (
                <span
                  key={`${technology}-${index}`}
                  className="rounded-md bg-accent-soft px-3 py-1.5 text-sm font-medium text-accent"
                >
                  {technology}
                </span>
              ))}
            </div>
          </div>
        </section>
      )}

      <CTASection
        title="Ready to get started?"
        description="Contact us today to discuss your project and get a custom quote tailored to your needs."
        ctaText="Start your project"
      />
    </div>
  );
};

export default ServiceDetailsPage;
