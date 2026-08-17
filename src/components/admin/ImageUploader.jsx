import { useState, useRef } from "react";
import { X, Image as ImageIcon } from "lucide-react";
import { toast } from "sonner";
import { uploadFile } from "@/services/uploadService";

const ImageUploader = ({
  label = "Upload Image",
  value,
  onChange,
  error,
  multiple = false,
  accept = "image/*",
  maxSize = 5, // MB
}) => {
  const fileInputRef = useRef(null);
  const [preview, setPreview] = useState(value || null);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const currentPreview = value || preview;

  const handleFileSelect = async (files) => {
    const fileArray = Array.from(files);

    for (const file of fileArray) {
      if (file.size > maxSize * 1024 * 1024) {
        toast.error(`File size must be less than ${maxSize}MB`);
        continue;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        setPreview(e.target.result);
      };
      reader.readAsDataURL(file);

      try {
        setIsUploading(true);
        const response = await uploadFile(file);

        if (!response.data?.url) {
          throw new Error("Upload did not return a file URL");
        }

        setPreview(response.data.url);
        onChange?.(response.data.url);
        toast.success("Image uploaded");
      } catch (uploadError) {
        setPreview(value || null);
        toast.error(uploadError.message || "Failed to upload image");
      } finally {
        setIsUploading(false);
      }
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileSelect(files);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleRemove = () => {
    setPreview(null);
    onChange?.(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-ink mb-2">
          {label}
        </label>
      )}

      <div
        className={`
          relative border-2 border-dashed rounded-xl transition-all duration-200 bg-surface
          ${isDragging ? "border-accent bg-accent-soft" : ""}
          ${error ? "border-red-500" : "border-border-strong"}
          ${currentPreview ? "border-solid border-border" : ""}
        `}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        {currentPreview ? (
          <div className="relative p-4">
            <div className="relative aspect-video max-h-64 rounded-lg overflow-hidden bg-canvas">
              <img
                src={currentPreview}
                alt="Preview"
                className="w-full h-full object-contain"
              />
              {isUploading && (
                <div className="absolute inset-0 bg-surface/80 flex items-center justify-center">
                  <div className="w-8 h-8 rounded-full border-2 border-accent border-t-transparent animate-spin" />
                </div>
              )}
            </div>
            <button
              type="button"
              onClick={handleRemove}
              disabled={isUploading}
              className="absolute top-6 right-6 p-1.5 rounded-lg bg-surface border border-border text-ink-muted hover:text-red-600 hover:bg-red-50 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div
            className="p-8 flex flex-col items-center justify-center cursor-pointer"
            onClick={() => fileInputRef.current?.click()}
          >
            <div className="w-16 h-16 rounded-full bg-accent-soft flex items-center justify-center mb-4">
              <ImageIcon className="w-8 h-8 text-accent" />
            </div>
            <p className="text-ink-muted mb-2">
              Drag and drop or <span className="text-accent font-medium">browse</span>
            </p>
            <p className="text-sm text-ink-subtle">PNG, JPG up to {maxSize}MB</p>
          </div>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={(e) => handleFileSelect(e.target.files)}
          disabled={isUploading}
          className="hidden"
        />
      </div>

      {error && <p className="mt-1.5 text-sm text-red-600">{error}</p>}
    </div>
  );
};

export default ImageUploader;
