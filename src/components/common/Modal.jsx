import { X } from "lucide-react";
import { useEffect } from "react";

const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  size = "md",
  showCloseButton = true,
}) => {
  const sizes = {
    sm: "max-w-md",
    md: "max-w-lg",
    lg: "max-w-2xl",
    xl: "max-w-4xl",
    full: "max-w-6xl",
  };

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      window.addEventListener("keydown", handleEscape);
    }
    return () => window.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      <div className="flex min-h-full items-center justify-center p-4">
        <div
          className={`
            relative w-full ${sizes[size]} 
            bg-slate-800 border border-slate-700 rounded-xl 
            shadow-2xl transform transition-all
            animate-scale-in
          `}
          onClick={(e) => e.stopPropagation()}
        >
          {title && (
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-700">
              <h3 className="text-lg font-semibold text-slate-100">{title}</h3>
              {showCloseButton && (
                <button
                  onClick={onClose}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-700 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>
          )}
          <div className="p-6">{children}</div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
