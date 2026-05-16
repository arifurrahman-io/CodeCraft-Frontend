import { Copy, Mail, Share2 } from "lucide-react";
import {
  FaFacebookF,
  FaLinkedinIn,
  FaWhatsapp,
  FaXTwitter,
} from "react-icons/fa6";
import { toast } from "sonner";

const openShareWindow = (url) => {
  window.open(url, "_blank", "noopener,noreferrer,width=720,height=620");
};

const ShareActions = ({
  title,
  text = "",
  url,
  className = "",
  label = "Share",
  compact = false,
}) => {
  const pageUrl =
    url || (typeof window !== "undefined" ? window.location.href : "");
  const encodedUrl = encodeURIComponent(pageUrl);
  const encodedTitle = encodeURIComponent(title || "");
  const encodedText = encodeURIComponent(text || title || "");

  const handleNativeShare = async () => {
    if (!pageUrl) return;

    try {
      if (navigator.share) {
        await navigator.share({ title, text, url: pageUrl });
      } else {
        await navigator.clipboard.writeText(pageUrl);
        toast.success("Link copied");
      }
    } catch (error) {
      if (error?.name !== "AbortError") {
        toast.error("Unable to share");
      }
    }
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(pageUrl);
      toast.success("Link copied");
    } catch {
      toast.error("Failed to copy link");
    }
  };

  const items = [
    {
      name: "Facebook",
      icon: FaFacebookF,
      action: () =>
        openShareWindow(
          `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
        ),
    },
    {
      name: "LinkedIn",
      icon: FaLinkedinIn,
      action: () =>
        openShareWindow(
          `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
        ),
    },
    {
      name: "X",
      icon: FaXTwitter,
      action: () =>
        openShareWindow(
          `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedText}`,
        ),
    },
    {
      name: "WhatsApp",
      icon: FaWhatsapp,
      action: () =>
        openShareWindow(`https://wa.me/?text=${encodedText}%20${encodedUrl}`),
    },
    {
      name: "Email",
      icon: Mail,
      action: () => {
        window.location.href = `mailto:?subject=${encodedTitle}&body=${encodedText}%0A%0A${encodedUrl}`;
      },
    },
  ];

  return (
    <div className={className}>
      {!compact && (
        <p className="mb-3 text-sm font-medium text-slate-400">{label}</p>
      )}
      <div className="flex flex-wrap gap-2 sm:gap-3">
        <button
          type="button"
          onClick={handleNativeShare}
          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border border-cyan-500/30 bg-cyan-500/10 px-3 py-2 text-sm font-medium text-cyan-200 transition-colors hover:border-cyan-400 hover:bg-cyan-500/15 sm:px-4"
          aria-label={label}
          title={label}
        >
          <Share2 className="h-4 w-4" />
          {!compact && <span>Share</span>}
        </button>

        {items.map((item) => {
          const Icon = item.icon;

          return (
            <button
              key={item.name}
              type="button"
              onClick={item.action}
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border border-slate-700 bg-slate-800/70 px-3 py-2 text-sm text-slate-300 transition-colors hover:border-cyan-500/60 hover:text-cyan-300 sm:px-4"
              aria-label={`Share on ${item.name}`}
              title={`Share on ${item.name}`}
            >
              <Icon className="h-4 w-4" />
              {!compact && <span>{item.name}</span>}
            </button>
          );
        })}

        <button
          type="button"
          onClick={handleCopyLink}
          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border border-slate-700 bg-slate-800/70 px-3 py-2 text-sm text-slate-300 transition-colors hover:border-cyan-500/60 hover:text-cyan-300 sm:px-4"
          aria-label="Copy link"
          title="Copy link"
        >
          <Copy className="h-4 w-4" />
          {!compact && <span>Copy Link</span>}
        </button>
      </div>
    </div>
  );
};

export default ShareActions;
