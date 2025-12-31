"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  CheckCircle,
  Copy,
  Image as ImageIcon,
  Loader2,
  Pencil,
  Plus,
  Scan,
  Trash2,
  Upload,
  X,
} from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";

//  IMPORT CUSTOM COMPONENTS
import Toast from "@/components/ui/Toast";
import ConfirmModal from "@/components/ui/ConfirmModal";

interface ProfileImage {
  _id: string;
  name: string;
  imageUrl: string;
}

export default function AdminPhotos() {
  const [photos, setPhotos] = useState<ProfileImage[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  //  Loading State for Form Submission
  const [isSubmitting, setIsSubmitting] = useState(false);

  //  Toast State
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  //  Delete Confirmation State
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const [formData, setFormData] = useState({ name: "", imageUrl: "" });

  useEffect(() => {
    fetchPhotos();
  }, []);

  const fetchPhotos = async () => {
    try {
      const res = await fetch("/api/photos");
      const data = await res.json();
      setPhotos(data);
    } catch (error: any) {
      console.error("Failed to fetch photos", error.message);
      setToast({ type: "error", message: "Failed to load gallery." });
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return;
    setUploading(true);
    const data = new FormData();
    data.append("file", e.target.files[0]);

    try {
      const res = await fetch("/api/upload", { method: "POST", body: data });
      const json = await res.json();
      if (json.url) {
        setFormData({ ...formData, imageUrl: json.url });
        setToast({ type: "success", message: "Image uploaded successfully" });
      }
    } catch (err: any) {
      setToast({ type: "error", message: "Image upload failed" });
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true); //  Start loading

    const method = editingId ? "PUT" : "POST";
    const url = editingId ? `/api/photos/${editingId}` : "/api/photos";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setIsModalOpen(false);
        fetchPhotos();
        setFormData({ name: "", imageUrl: "" });
        setEditingId(null);
        setToast({
          type: "success",
          message: editingId
            ? "Asset updated successfully"
            : "Asset added to library",
        });
      } else {
        const err = await res.json();
        throw new Error(err.message || "Failed to save");
      }
    } catch (err: any) {
      setToast({ type: "error", message: err.message || "Operation failed" });
    } finally {
      setIsSubmitting(false); //  Stop loading
    }
  };

  const openModal = (photo?: ProfileImage) => {
    if (photo) {
      setEditingId(photo._id);
      setFormData({ name: photo.name, imageUrl: photo.imageUrl });
    } else {
      setEditingId(null);
      setFormData({ name: "", imageUrl: "" });
    }
    setIsModalOpen(true);
  };

  //  Actual Deletion Logic
  const confirmDelete = async () => {
    if (!deleteId) return;

    try {
      await fetch(`/api/photos/${deleteId}`, { method: "DELETE" });
      setPhotos(photos.filter((p) => p._id !== deleteId));
      setToast({ type: "success", message: "Asset removed from library" });
    } catch (err) {
      setToast({ type: "error", message: "Failed to delete asset" });
    } finally {
      setDeleteId(null);
    }
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
    setToast({ type: "success", message: "Asset ID copied to clipboard" });
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 relative">
      {/*  Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-white/5 pb-6">
        <div>
          <h1 className="text-3xl font-medium text-white tracking-tight flex items-center gap-3">
            <ImageIcon className="text-cyan-500" size={28} />
            Asset Gallery
          </h1>
          <p className="text-zinc-400 mt-2 text-sm max-w-lg">
            Manage your profile avatars and hero images. Use the unique names to
            reference them in your code.
          </p>
        </div>
        <button
          onClick={() => openModal()}
          className="flex cursor-pointer items-center gap-2 bg-white text-black px-5 py-2.5 rounded-lg text-sm font-bold hover:bg-zinc-200 transition-colors shadow-[0_0_20px_rgba(255,255,255,0.15)]"
        >
          <Plus size={18} /> Upload Asset
        </button>
      </div>

      {/*  Gallery Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {loading ? (
          [1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="h-64 rounded-xl bg-[#0e0e10] animate-pulse border border-white/5"
            />
          ))
        ) : (
          <AnimatePresence>
            {photos.map((photo) => (
              <motion.div
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                key={photo._id}
                className="group relative bg-[#0e0e10] border border-white/5 rounded-xl overflow-hidden hover:border-cyan-500/30 transition-all duration-300 hover:shadow-[0_0_20px_rgba(6,182,212,0.1)] flex flex-col"
              >
                {/* Image Preview Area */}
                <div className="relative aspect-4/5 bg-[#121214] overflow-hidden">
                  <Image
                    src={photo.imageUrl}
                    alt={photo.name}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-90 group-hover:opacity-100"
                  />

                  {/* Hover Overlay Actions */}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-3 backdrop-blur-sm">
                    <button
                      onClick={() => openModal(photo)}
                      className="p-3 cursor-pointer bg-white text-black rounded-full hover:bg-zinc-200 transition-transform hover:scale-110 shadow-xl"
                      title="Edit Details"
                    >
                      <Pencil size={18} />
                    </button>
                    <button
                      onClick={() => setDeleteId(photo._id)} // 🗑️ Trigger Modal
                      className="p-3 cursor-pointer bg-red-500 text-white rounded-full hover:bg-red-600 transition-transform hover:scale-110 shadow-xl"
                      title="Delete Asset"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>

                {/* Footer Metadata */}
                <div className="p-3 bg-[#09090b] border-t border-white/5">
                  <div className="flex items-center justify-between gap-2 p-2 rounded-lg bg-white/5 border border-white/5 group-hover:border-cyan-500/20 transition-colors">
                    <div className="flex items-center gap-2 min-w-0">
                      <Scan size={14} className="text-cyan-500 shrink-0" />
                      <span className="text-xs font-mono text-zinc-300 truncate select-all">
                        {photo.name}
                      </span>
                    </div>
                    <button
                      onClick={() => copyToClipboard(photo.name, photo._id)}
                      className="text cursor-pointer-zinc-500 hover:text-white transition-colors"
                      title="Copy ID"
                    >
                      {copiedId === photo._id ? (
                        <CheckCircle size={14} className="text-emerald-500" />
                      ) : (
                        <Copy size={14} />
                      )}
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>

      {/*  Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="bg-[#09090b] w-full max-w-md rounded-2xl border border-white/10 shadow-2xl overflow-hidden"
            >
              {/* Modal Header */}
              <div className="px-6 py-4 border-b border-white/10 flex justify-between items-center bg-[#0e0e10]">
                <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  {editingId ? (
                    <Pencil size={16} className="text-cyan-500" />
                  ) : (
                    <Upload size={16} className="text-cyan-500" />
                  )}
                  {editingId ? "Update Asset" : "Upload Asset"}
                </h2>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="text cursor-pointer-zinc-500 hover:text-white transition-colors"
                >
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-5">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">
                    Asset ID (Name)
                  </label>
                  <div className="relative group">
                    <Scan
                      size={14}
                      className="absolute left-3 top-3.5 text-zinc-600 group-focus-within:text-white transition-colors"
                    />
                    <input
                      required
                      placeholder="e.g. hero-avatar-v1"
                      className="w-full bg-[#121214] border border-white/10 rounded-lg pl-9 pr-3 py-3 text-sm text-white focus:border-white/30 focus:outline-none placeholder:text-zinc-700 font-mono"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                    />
                  </div>
                  <p className="text-[10px] text-zinc-500 ml-1">
                    This key is used to fetch the image in your frontend.
                  </p>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">
                    File Upload
                  </label>
                  <div className="relative group w-full h-40 bg-[#121214] border-2 border-dashed border-white/10 rounded-xl overflow-hidden hover:border-cyan-500/30 hover:bg-cyan-500/5 transition-all cursor-pointer">
                    <input
                      type="file"
                      accept="image/*"
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
                      onChange={handleImageUpload}
                    />

                    {formData.imageUrl ? (
                      <div className="w-full h-full relative flex items-center justify-center bg-black/40">
                        <Image
                          src={formData.imageUrl}
                          alt="Preview"
                          fill
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          className="h-full w-full object-contain p-2"
                        />
                        {!uploading && (
                          <div className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity">
                            <span className="text-xs font-bold text-white uppercase tracking-wider border border-white px-3 py-1 rounded-full">
                              Replace
                            </span>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="absolute inset-0 flex flex-col items-center justify-center text-zinc-500 group-hover:text-cyan-400 transition-colors">
                        {uploading ? (
                          <Loader2 className="animate-spin mb-2" />
                        ) : (
                          <Upload className="mb-2" />
                        )}
                        <span className="text-xs font-medium uppercase tracking-wide">
                          {uploading ? "Processing..." : "Drag or Click"}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={uploading || !formData.imageUrl || isSubmitting}
                  className={`w-full cursor-pointer font-bold py-3 rounded-lg transition-colors flex items-center justify-center gap-2 mt-2 ${
                    isSubmitting
                      ? "bg-white/50 text-black cursor-not-allowed"
                      : "bg-white text-black hover:bg-zinc-200"
                  }`}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      <span>{editingId ? "Updating..." : "Saving..."}</span>
                    </>
                  ) : (
                    <span>
                      {editingId ? "Update Library" : "Save to Library"}
                    </span>
                  )}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <Toast
        message={toast?.message || null}
        type={toast?.type || "success"}
        onClose={() => setToast(null)}
      />

      <ConfirmModal
        isOpen={!!deleteId}
        title="Delete Asset?"
        message="This will permanently remove this image from your library. If this image is used on your site, those links will break."
        confirmText="Confirm Delete"
        onConfirm={confirmDelete}
        onCancel={() => setDeleteId(null)}
        isDanger={true}
      />
    </div>
  );
}
