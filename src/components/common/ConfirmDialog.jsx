import { useEffect } from "react";
import { AlertTriangle, X } from "lucide-react";
import Button from "@/components/common/Button";

const ConfirmDialog = ({
  isOpen,
  onClose,
  onConfirm,
  title = "Confirm Action",
  message = "Are you sure you want to proceed?",
  confirmText = "Confirm",
  cancelText = "Cancel",
  variant = "danger",
  isLoading = false,
}) => {
  useEffect(() => {
    if (!isOpen) return undefined;

    document.body.style.overflow = "hidden";
    const onKeyDown = (e) => {
      if (e.key === "Escape" && !isLoading) onClose();
    };
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [isOpen, isLoading, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[70] overflow-y-auto">
      <div
        className="fixed inset-0 bg-ink/50 backdrop-blur-sm"
        onClick={() => {
          if (!isLoading) onClose();
        }}
        aria-hidden="true"
      />

      <div className="flex min-h-full items-center justify-center p-4">
        <div
          role="alertdialog"
          aria-modal="true"
          aria-labelledby="confirm-dialog-title"
          aria-describedby="confirm-dialog-message"
          className="relative w-full max-w-md overflow-hidden rounded-2xl border border-border bg-surface shadow-lift animate-scale-in"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="absolute top-4 right-4 rounded-lg p-1.5 text-ink-muted transition-colors hover:bg-ink/5 hover:text-ink disabled:opacity-50"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>

          <div className="p-6 sm:p-7">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-red-50 ring-1 ring-red-100">
                <AlertTriangle className="h-6 w-6 text-red-600" strokeWidth={1.75} />
              </div>
              <div className="min-w-0 pr-6">
                <h3
                  id="confirm-dialog-title"
                  className="font-display text-lg font-semibold tracking-tight text-ink"
                >
                  {title}
                </h3>
                <p
                  id="confirm-dialog-message"
                  className="mt-1.5 text-sm leading-relaxed text-ink-muted"
                >
                  {message}
                </p>
              </div>
            </div>

            <div className="mt-7 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end sm:gap-3">
              <Button
                type="button"
                variant="ghost"
                onClick={onClose}
                disabled={isLoading}
                className="sm:min-w-[5.5rem]"
              >
                {cancelText}
              </Button>
              <Button
                type="button"
                variant={variant}
                onClick={onConfirm}
                isLoading={isLoading}
                className="sm:min-w-[5.5rem]"
              >
                {confirmText}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;
