import { FaWhatsapp } from "react-icons/fa";
import AIAssistantWidget from "@/components/website/AIAssistantWidget";

const WHATSAPP_NUMBER = "8801886886000";
const WHATSAPP_MESSAGE =
  "Hello CodeCraft.BD, I would like to discuss a project.";

const ContactDock = () => {
  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
    WHATSAPP_MESSAGE,
  )}`;

  return (
    <div className="fixed bottom-5 right-4 z-[60] flex flex-col items-end gap-3 sm:bottom-6 sm:right-6">
      <AIAssistantWidget />
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#25D366] text-white shadow-soft transition hover:bg-[#1ebe5d] hover:shadow-lift focus:outline-none focus-visible:ring-2 focus-visible:ring-[#25D366]/50 focus-visible:ring-offset-2 focus-visible:ring-offset-canvas sm:h-14 sm:w-14"
        aria-label="Contact on WhatsApp"
        title="Contact on WhatsApp"
      >
        <FaWhatsapp className="h-7 w-7" aria-hidden="true" />
      </a>
    </div>
  );
};

export default ContactDock;
