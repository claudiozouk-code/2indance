import React, { useState, useEffect } from "react";
import { Upload, Image as ImageIcon, Check, Loader2, FolderOpen, X } from "lucide-react";

interface MediaPickerProps {
  value: string;
  onChange: (url: string) => void;
  label: string;
  idPrefix: string;
}

export default function MediaPicker({ value, onChange, label, idPrefix }: MediaPickerProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [showLibrary, setShowLibrary] = useState(false);
  const [libraryImages, setLibraryImages] = useState<any[]>([]);
  const [isLoadingLibrary, setIsLoadingLibrary] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  // Fetch server uploaded files list
  const fetchLibrary = async () => {
    setIsLoadingLibrary(true);
    try {
      const res = await fetch("/api/uploaded-media");
      const data = await res.json();
      setLibraryImages(data || []);
    } catch (err) {
      console.error("Error loading uploaded media:", err);
    } finally {
      setIsLoadingLibrary(false);
    }
  };

  useEffect(() => {
    if (showLibrary) {
      fetchLibrary();
    }
  }, [showLibrary]);

  // Handle Base64 Upload
  const handleUploadFile = async (file: File) => {
    if (!file) return;
    setIsUploading(true);

    try {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = async () => {
        const base64Data = reader.result as string;
        try {
          const res = await fetch("/api/upload", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              image: base64Data,
              filename: file.name,
            }),
          });
          const result = await res.json();
          if (result.success && result.url) {
            onChange(result.url);
          } else {
            alert("Upload failed: " + (result.error || "Unknown error"));
          }
        } catch (postErr: any) {
          alert("Error sending file to server: " + postErr.message);
        } finally {
          setIsUploading(false);
        }
      };
      reader.onerror = () => {
        alert("Failed to read local file.");
        setIsUploading(false);
      };
    } catch (err: any) {
      alert("Error processing file: " + err.message);
      setIsUploading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleUploadFile(e.target.files[0]);
    }
  };

  // Drag & Drop
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleUploadFile(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="block text-xs font-semibold uppercase tracking-wider text-[#fff6da]/80">
          {label}
        </label>
        {value && (
          <button
            type="button"
            onClick={() => onChange("")}
            className="text-[10px] text-red-400 hover:text-red-300 uppercase tracking-wider font-mono cursor-pointer"
          >
            Clear / Use Default
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        {/* Thumbnail Preview Box */}
        <div className="md:col-span-4 bg-[#3b3f3a]/40 border border-white/10 rounded-xl p-3 flex flex-col items-center justify-center min-h-[120px] relative overflow-hidden group">
          {value ? (
            <>
              <img
                src={value}
                alt="Selected preview"
                className="max-h-[110px] max-w-full object-contain rounded-lg drop-shadow-md group-hover:scale-102 transition-transform duration-300"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all duration-200">
                <span className="text-[10px] font-mono text-white/90 bg-white/15 px-2 py-1 rounded-md max-w-[90%] truncate">
                  {value}
                </span>
              </div>
            </>
          ) : (
            <div className="text-center text-white/45 space-y-1 p-2">
              <ImageIcon className="w-6 h-6 mx-auto opacity-60" />
              <p className="text-[10px] font-semibold uppercase tracking-wider">Default Asset Active</p>
            </div>
          )}
        </div>

        {/* Upload & Library Action Zone */}
        <div className="md:col-span-8 flex flex-col justify-between space-y-3">
          {/* Drag & Drop Area */}
          <div
            onDragEnter={handleDrag}
            onDragOver={handleDrag}
            onDragLeave={handleDrag}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-xl p-4 text-center transition-all flex flex-col items-center justify-center cursor-pointer min-h-[85px] relative ${
              dragActive
                ? "border-[#f6c86b] bg-[#f6c86b]/5"
                : "border-white/15 hover:border-white/25 bg-[#3b3f3a]/20"
            }`}
            onClick={() => document.getElementById(`${idPrefix}-file-input`)?.click()}
          >
            <input
              id={`${idPrefix}-file-input`}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />

            {isUploading ? (
              <div className="flex flex-col items-center space-y-2 text-[#f6c86b]">
                <Loader2 className="w-5 h-5 animate-spin" />
                <span className="text-[10px] font-mono uppercase tracking-widest">Uploading Photo...</span>
              </div>
            ) : (
              <div className="space-y-1">
                <Upload className="w-4 h-4 mx-auto text-[#f6c86b]" />
                <p className="text-[10px] text-white/80 font-medium">
                  Drag & Drop or <span className="text-[#f6c86b] underline">Browse</span>
                </p>
                <p className="text-[9px] text-[#fff6da]/50 font-mono">JPG, PNG, WEBP, SVG</p>
              </div>
            )}
          </div>

          {/* Media Library Trigger */}
          <button
            type="button"
            onClick={() => setShowLibrary(true)}
            className="w-full flex items-center justify-center space-x-2 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-[#ffe6a6] hover:text-white text-[11px] font-montserrat font-semibold uppercase tracking-wider transition-all cursor-pointer"
          >
            <FolderOpen className="w-3.5 h-3.5 text-[#f6c86b]" />
            <span>Open Media Library</span>
          </button>
        </div>
      </div>

      {/* Media Library Dialog Modal */}
      {showLibrary && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm animate-fade-in">
          <div className="bg-[#2b2f2d] border border-white/10 rounded-3xl w-full max-w-3xl overflow-hidden shadow-2xl flex flex-col max-h-[85vh]">
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-white/5 bg-[#1c2e24]">
              <div className="flex items-center space-x-2.5">
                <FolderOpen className="w-5 h-5 text-[#f6c86b]" />
                <div>
                  <h3 className="font-display text-sm font-bold text-white uppercase tracking-wider">
                    2inDance Media Library
                  </h3>
                  <p className="text-[10px] text-[#fff6da]/60">Select from previously uploaded photos on the Hostinger server</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowLibrary(false)}
                className="p-1.5 hover:bg-white/5 rounded-lg text-white/70 hover:text-white transition-all cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Grid Gallery */}
            <div className="flex-grow p-6 overflow-y-auto bg-black/20 min-h-[300px]">
              {isLoadingLibrary ? (
                <div className="h-[250px] flex flex-col items-center justify-center space-y-2 text-[#f6c86b]">
                  <Loader2 className="w-6 h-6 animate-spin" />
                  <span className="text-[10px] font-mono uppercase tracking-widest">Reading Server Files...</span>
                </div>
              ) : libraryImages.length === 0 ? (
                <div className="h-[250px] flex flex-col items-center justify-center text-center text-white/45 space-y-2">
                  <ImageIcon className="w-8 h-8 opacity-50" />
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider">Library is Empty</p>
                    <p className="text-[10px] font-mono opacity-80 mt-1">Upload files on the left to see them listed here.</p>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {libraryImages.map((img) => {
                    const isSelected = value === img.url;
                    return (
                      <div
                        key={img.name}
                        onClick={() => {
                          onChange(img.url);
                          setShowLibrary(false);
                        }}
                        className={`group relative aspect-square rounded-2xl overflow-hidden bg-[#3b3f3a]/40 border cursor-pointer transition-all duration-300 hover:scale-[1.02] ${
                          isSelected
                            ? "border-[#f6c86b] ring-2 ring-[#f6c86b]"
                            : "border-white/5 hover:border-white/20"
                        }`}
                      >
                        <img
                          src={img.url}
                          alt={img.name}
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                        {/* Checkmark overlay for currently active selection */}
                        {isSelected && (
                          <div className="absolute inset-0 bg-[#3b3f3a]/60 flex items-center justify-center">
                            <div className="p-2 bg-[#f6c86b] text-[#3b3f3a] rounded-full shadow-md animate-scale-up">
                              <Check className="w-4 h-4 stroke-[3px]" />
                            </div>
                          </div>
                        )}
                        {/* Hover filename tooltip overlay */}
                        <div className="absolute inset-x-0 bottom-0 bg-black/75 p-2 translate-y-full group-hover:translate-y-0 transition-all duration-200 text-center">
                          <p className="text-[9px] text-white font-mono truncate">{img.name}</p>
                          <p className="text-[8px] text-[#f6c86b]/80 font-mono mt-0.5">
                            {(img.size / 1024).toFixed(0)} KB
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Footer actions */}
            <div className="p-4 border-t border-white/5 bg-[#1c2e24] flex justify-end">
              <button
                type="button"
                onClick={() => setShowLibrary(false)}
                className="px-5 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white font-montserrat text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer"
              >
                Close Library
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
