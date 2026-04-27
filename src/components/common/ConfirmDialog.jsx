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
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative w-full max-w-md bg-slate-800 border border-slate-700 rounded-xl shadow-2xl animate-scale-in">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-full bg-red-500/20 flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-red-500" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-100">
                  {title}
                </h3>
                <p className="text-sm text-slate-400">{message}</p>
              </div>
            </div>

            <div className="flex gap-3 justify-end mt-6">
              <Button variant="ghost" onClick={onClose} disabled={isLoading}>
                {cancelText}
              </Button>
              <Button
                variant={variant}
                onClick={onConfirm}
                isLoading={isLoading}
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
