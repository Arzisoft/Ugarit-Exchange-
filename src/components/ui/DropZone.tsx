"use client";

import { useState, useRef, useCallback, type DragEvent } from "react";
import { Upload, X } from "lucide-react";

interface DropZoneProps {
  onFile: (file: File) => void;
  accept?: string;
  label?: string;
  preview?: string;
}

export default function DropZone({
  onFile,
  accept,
  label = "Drag & drop a file here, or click to select",
  preview: externalPreview,
}: DropZoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [localPreview, setLocalPreview] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const preview = externalPreview || localPreview;

  const handleFile = useCallback(
    (file: File) => {
      onFile(file);
      setFileName(file.name);

      // Generate preview for images
      if (file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onload = (e) => {
          setLocalPreview(e.target?.result as string);
        };
        reader.readAsDataURL(file);
      } else {
        setLocalPreview(null);
      }
    },
    [onFile],
  );

  const handleDragOver = useCallback((e: DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [handleFile],
  );

  const handleClick = () => inputRef.current?.click();

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    setLocalPreview(null);
    setFileName(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <div
      onClick={handleClick}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`relative flex flex-col items-center justify-center gap-3 rounded-[var(--radius-card)] border-2 border-dashed p-8 text-center transition-colors cursor-pointer ${
        isDragging
          ? "border-gold-500 bg-gold-500/5"
          : "border-surface-border bg-surface-card hover:border-white/20 hover:bg-surface-hover"
      }`}
    >
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
        }}
        className="hidden"
      />

      {preview ? (
        <div className="relative">
          <img
            src={preview}
            alt="Preview"
            className="h-24 w-24 rounded-lg object-cover"
          />
          <button
            type="button"
            onClick={handleClear}
            className="absolute -right-2 -top-2 rounded-full bg-danger p-0.5 text-white shadow-lg hover:bg-danger/80"
          >
            <X size={14} />
          </button>
        </div>
      ) : (
        <div className="rounded-full bg-surface-hover p-3">
          <Upload size={24} className="text-white/40" />
        </div>
      )}

      <div>
        <p className="text-sm text-white/60">
          {fileName || label}
        </p>
        {accept && !fileName && (
          <p className="mt-1 text-xs text-white/30">
            Accepted: {accept}
          </p>
        )}
      </div>
    </div>
  );
}
