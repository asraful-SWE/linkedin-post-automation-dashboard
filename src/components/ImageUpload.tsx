"use client";

import { ChangeEvent } from "react";

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
  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null;
    onFileChange(file);
  };

  return (
    <div className="space-y-2 rounded-xl border border-zinc-200 bg-zinc-50 p-3 dark:border-zinc-800 dark:bg-zinc-900/60">
      <p className="text-xs font-semibold text-zinc-600 dark:text-zinc-300">Add Image (optional)</p>
      <input
        type="url"
        value={imageUrl}
        disabled={disabled}
        onChange={(e) => onImageUrlChange(e.target.value)}
        placeholder="https://example.com/image.jpg"
        className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-700 outline-none ring-blue-300 placeholder:text-zinc-400 focus:ring dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-200"
      />
      <input
        type="file"
        accept="image/*"
        disabled={disabled}
        onChange={handleFileChange}
        className="block w-full text-xs text-zinc-500 file:mr-3 file:rounded-md file:border-0 file:bg-zinc-200 file:px-2.5 file:py-1.5 file:text-xs file:font-medium file:text-zinc-700 hover:file:bg-zinc-300 dark:text-zinc-300 dark:file:bg-zinc-800 dark:file:text-zinc-200 dark:hover:file:bg-zinc-700"
      />
    </div>
  );
}
