"use client";

import { ChangeEvent, useRef, useState, useLayoutEffect } from "react";
import { ImageIcon, Link2, X, Upload } from "lucide-react";
import { url } from "inspector/promises";

type ImageUploadProps = {
  imageUrl: string;
  onImageUrlChange: (value: string) => void;
  onFileChange: (file: File | null) => void;
  disabled?: boolean;
};

export default function ImageUpload({
  imageUrl,
  onImageUrlChange,
  onFileChange,
  disabled = false,
}: ImageUploadProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"url" | "file">("url");
  const fileInputRef = useRef<HTMLInputElement>(null);


  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    setSelectedFile(file);
    onFileChange(file);
    if (file) {
      onImageUrlChange("");
    }
  };

  const clearFile = () => {
    setSelectedFile(null);
    onFileChange(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const clearUrl = () => onImageUrlChange("");

  const previewSrc = activeTab === "file" ? filePreview : imageUrl || null;
  const hasContent = activeTab === "url" ? !!imageUrl : !!selectedFile;

  return (
    <div className="rounded-xl border border-zinc-200 bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900/50">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-zinc-200 px-3 sm:px-4 py-2 sm:py-3 dark:border-zinc-700">
        <div className="flex items-center gap-2">
          <ImageIcon size={14} className="text-zinc-400" />
          <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">
            Image (optional)
          </span>
        </div>
        {hasContent && (
          <span className="flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-semibold text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400">
            ✓ Image selected
          </span>
        )}
      </div>

      {/* Tabs */}
      <div className="flex border-b border-zinc-200 dark:border-zinc-700">
        {(["url", "file"] as const).map((tab) => (
          <button
            key={tab}
            type="button"
            disabled={disabled}
            onClick={() => setActiveTab(tab)}
            className={`flex flex-1 items-center justify-center gap-1.5 px-3 sm:px-4 py-2.5 sm:py-2 text-xs font-medium transition-colors min-h-10 ${
              activeTab === tab
                ? "border-b-2 border-blue-500 text-blue-600 dark:text-blue-400"
                : "text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-300"
            }`}
          >
            {tab === "url" ? <Link2 size={14} className="sm:size-[12px]" /> : <Upload size={14} className="sm:size-[12px]" />}
            {tab === "url" ? "URL" : "Upload"}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="p-3 sm:p-4 space-y-2 sm:space-y-3">
        {activeTab === "url" ? (
          <div className="relative">
            <input
              type="url"
              value={imageUrl}
              disabled={disabled}
              onChange={(e) => onImageUrlChange(e.target.value)}
              placeholder="https://example.com/image.jpg"
              className="w-full rounded-lg border border-zinc-200 bg-white py-2.5 pl-3 pr-10 text-sm text-zinc-700 outline-none placeholder:text-zinc-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-200 dark:placeholder:text-zinc-600"
            />
            {imageUrl && (
              <button
                type="button"
                onClick={clearUrl}
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-2 text-zinc-400 hover:text-zinc-600 hover:bg-zinc-100 min-h-8 min-w-8 dark:hover:bg-zinc-800"
              >
                <X size={16} />
              </button>
            )}
          </div>
        ) : (
          <div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              disabled={disabled}
              onChange={handleFileChange}
              className="hidden"
              id="image-file-input"
            />
            {selectedFile ? (
              <div className="flex items-center gap-3 rounded-lg border border-zinc-200 bg-white p-2.5 sm:p-2 dark:border-zinc-700 dark:bg-zinc-900">
                <div className="text-xs text-zinc-600 dark:text-zinc-300 flex-1 truncate">
                  <p className="font-medium truncate">{selectedFile.name}</p>
                  <p className="text-xs sm:text-[10px] text-zinc-400">
                    {(selectedFile.size / 1024).toFixed(0)} KB
                  </p>
                </div>
                <button
                  type="button"
                  onClick={clearFile}
                  className="text-zinc-400 hover:text-red-500 rounded p-2 hover:bg-red-50 min-h-8 min-w-8 dark:hover:bg-red-950 flex-shrink-0"
                >
                  <X size={16} className="sm:size-[16px]" />
                </button>
              </div>
            ) : (
              <label
                htmlFor="image-file-input"
                className="flex cursor-pointer flex-col items-center gap-2 rounded-lg border-2 border-dashed border-zinc-300 p-4 sm:p-5 min-h-24 justify-center text-center hover:border-blue-400 hover:bg-blue-50/30 transition-colors active:bg-blue-100/20 dark:border-zinc-700 dark:hover:border-blue-600"
              >
                <Upload size={24} className="text-zinc-400 sm:size-[20px]" />
                <span className="text-xs sm:text-[13px] text-zinc-500">
                  Click to upload image
                </span>
                <span className="text-[10px] sm:text-xs text-zinc-400">
                  PNG, JPG, WebP up to 5MB
                </span>
              </label>
            )}
          </div>
        )}

        {/* Preview */}
        {previewSrc && (
          <div className="mt-2 sm:mt-3 overflow-hidden rounded-lg border border-zinc-200 dark:border-zinc-700">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={previewSrc}
              alt="Preview"
              className="max-h-32 sm:max-h-40 w-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = "none";
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
}
