import { useEffect } from "react";

const SITE_NAME = "CodeCraft.BD";
const DEFAULT_DESCRIPTION =
  "CodeCraft.BD builds premium web applications, mobile apps, SaaS products, e-commerce platforms, and UI/UX experiences for growing businesses.";
const DEFAULT_IMAGE =
  "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&auto=format&fit=crop&q=80";

const getSiteUrl = () => {
  const configuredUrl = import.meta.env.VITE_SITE_URL;
  if (configuredUrl) return configuredUrl.replace(/\/$/, "");
  if (typeof window !== "undefined") return window.location.origin;
  return "https://codecraft.bd";
};

const absoluteUrl = (value) => {
  if (!value) return "";
  if (/^(https?:|data:|blob:)/i.test(value)) return value;

  const path = value.startsWith("/") ? value : `/${value}`;
  return `${getSiteUrl()}${path}`;
};

const setMeta = (selector, attributes) => {
  let element = document.head.querySelector(selector);

  if (!element) {
    element = document.createElement("meta");
    document.head.appendChild(element);
  }

  Object.entries(attributes).forEach(([name, value]) => {
    if (value) element.setAttribute(name, value);
  });
};

const setLink = (rel, href) => {
  if (!href) return;

  let element = document.head.querySelector(`link[rel="${rel}"]`);

  if (!element) {
    element = document.createElement("link");
    element.setAttribute("rel", rel);
    document.head.appendChild(element);
  }

  element.setAttribute("href", href);
};

const setJsonLd = (id, data) => {
  const existing = document.getElementById(id);
  if (existing) existing.remove();
  if (!data) return;

  const script = document.createElement("script");
  script.type = "application/ld+json";
  script.id = id;
  script.textContent = JSON.stringify(data);
  document.head.appendChild(script);
};

const SEO = ({
  title = SITE_NAME,
  description = DEFAULT_DESCRIPTION,
  keywords = "",
  image = DEFAULT_IMAGE,
  path = "",
  type = "website",
  noIndex = false,
  structuredData,
}) => {
  useEffect(() => {
    const siteUrl = getSiteUrl();
    const canonicalUrl = absoluteUrl(path || window.location.pathname);
    const imageUrl = absoluteUrl(image || DEFAULT_IMAGE);
    const fullTitle = title.includes(SITE_NAME)
      ? title
      : `${title} | ${SITE_NAME}`;

    document.title = fullTitle;

    setMeta('meta[name="description"]', {
      name: "description",
      content: description,
    });
    setMeta('meta[name="keywords"]', { name: "keywords", content: keywords });
    setMeta('meta[name="robots"]', {
      name: "robots",
      content: noIndex ? "noindex,nofollow" : "index,follow",
    });

    setMeta('meta[property="og:site_name"]', {
      property: "og:site_name",
      content: SITE_NAME,
    });
    setMeta('meta[property="og:type"]', { property: "og:type", content: type });
    setMeta('meta[property="og:title"]', {
      property: "og:title",
      content: fullTitle,
    });
    setMeta('meta[property="og:description"]', {
      property: "og:description",
      content: description,
    });
    setMeta('meta[property="og:url"]', {
      property: "og:url",
      content: canonicalUrl,
    });
    setMeta('meta[property="og:image"]', {
      property: "og:image",
      content: imageUrl,
    });
    setMeta('meta[property="og:image:secure_url"]', {
      property: "og:image:secure_url",
      content: imageUrl,
    });
    setMeta('meta[property="og:image:width"]', {
      property: "og:image:width",
      content: "1200",
    });
    setMeta('meta[property="og:image:height"]', {
      property: "og:image:height",
      content: "630",
    });
    setMeta('meta[property="og:image:alt"]', {
      property: "og:image:alt",
      content: fullTitle,
    });

    setMeta('meta[name="twitter:card"]', {
      name: "twitter:card",
      content: "summary_large_image",
    });
    setMeta('meta[name="twitter:title"]', {
      name: "twitter:title",
      content: fullTitle,
    });
    setMeta('meta[name="twitter:description"]', {
      name: "twitter:description",
      content: description,
    });
    setMeta('meta[name="twitter:image"]', {
      name: "twitter:image",
      content: imageUrl,
    });

    setLink("canonical", canonicalUrl);
    setJsonLd("codecraft-page-schema", structuredData);
    setJsonLd("codecraft-organization-schema", {
      "@context": "https://schema.org",
      "@type": "Organization",
      name: SITE_NAME,
      url: siteUrl,
      logo: `${siteUrl}/favicon.svg`,
      sameAs: [
        "https://facebook.com/codecraftbd",
        "https://linkedin.com/company/codecraftbd",
        "https://github.com/codecraftbd",
      ],
    });
  }, [description, image, keywords, noIndex, path, structuredData, title, type]);

  return null;
};

export default SEO;
