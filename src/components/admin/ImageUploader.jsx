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
  const currentPreview = preview || value;

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
      } catch (error) {
        setPreview(value || null);
        toast.error(error.message || "Failed to upload image");
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
        <label className="block text-sm font-medium text-slate-300 mb-2">
          {label}
        </label>
      )}

      <div
        className={`
          relative border-2 border-dashed rounded-xl transition-all duration-200
          ${isDragging ? "border-cyan-500 bg-cyan-500/10" : ""}
          ${error ? "border-red-500" : "border-slate-700"}
          ${preview ? "border-solid" : ""}
        `}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        {currentPreview ? (
          <div className="relative p-4">
            <div className="relative aspect-video max-h-64 rounded-lg overflow-hidden">
              <img
                src={currentPreview}
                alt="Preview"
                className="w-full h-full object-contain"
              />
              {isUploading && (
                <div className="absolute inset-0 bg-slate-950/70 flex items-center justify-center">
                  <div className="w-8 h-8 rounded-full border-2 border-cyan-500 border-t-transparent animate-spin" />
                </div>
              )}
            </div>
            <button
              type="button"
              onClick={handleRemove}
              disabled={isUploading}
              className="absolute top-6 right-6 p-1.5 rounded-lg bg-slate-900/80 text-slate-400 hover:text-red-500 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div
            className="p-8 flex flex-col items-center justify-center cursor-pointer"
            onClick={() => fileInputRef.current?.click()}
          >
            <div className="w-16 h-16 rounded-full bg-slate-800 flex items-center justify-center mb-4">
              <ImageIcon className="w-8 h-8 text-slate-500" />
            </div>
            <p className="text-slate-400 mb-2">
              Drag and drop or <span className="text-cyan-500">browse</span>
            </p>
            <p className="text-sm text-slate-500">PNG, JPG up to {maxSize}MB</p>
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

      {error && <p className="mt-1.5 text-sm text-red-500">{error}</p>}
    </div>
  );
};

export default ImageUploader;
