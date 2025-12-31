"use client";

import { useState, useEffect } from "react";
import {
  Plus,
  Trash2,
  Pencil,
  ExternalLink,
  Trophy,
  X,
  Calendar,
  Loader2,
  Upload,
  Medal,
  Save,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

import Toast from "@/components/ui/Toast";
import ConfirmModal from "@/components/ui/ConfirmModal";

interface Achievement {
  _id: string;
  title: string;
  organization: string;
  date: string;
  proofLink?: string;
  imageUrl: string;
  description?: string;
}

export default function AdminAchievement() {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAchievement, setEditingAchievement] =
    useState<Achievement | null>(null);
  const [uploading, setUploading] = useState(false);

  //  Loading State for Form Submission
  const [isSubmitting, setIsSubmitting] = useState(false);

  //  Toast State
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  //  Delete Confirmation State
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: "",
    organization: "",
    date: "",
    proofLink: "",
    imageUrl: "",
    description: "",
  });

  useEffect(() => {
    fetchAchievements();
  }, []);

  const fetchAchievements = async () => {
    try {
      const res = await fetch("/api/achievements");
      const data = await res.json();
      setAchievements(data);
    } catch (error: any) {
      console.error("Failed to fetch achievements", error.message);
      setToast({ type: "error", message: "Failed to load milestones." });
    } finally {
      setLoading(false);
    }
  };

  const openModal = (achieve?: Achievement) => {
    if (achieve) {
      setEditingAchievement(achieve);
      setFormData({
        title: achieve.title,
        organization: achieve.organization,
        date: achieve.date,
        proofLink: achieve.proofLink || "",
        imageUrl: achieve.imageUrl,
        description: achieve.description || "",
      });
    } else {
      setEditingAchievement(null);
      setFormData({
        title: "",
        organization: "",
        date: "",
        proofLink: "",
        imageUrl: "",
        description: "",
      });
    }
    setIsModalOpen(true);
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
      setToast({ type: "error", message: "Upload failed" });
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true); //  Start loading

    const method = editingAchievement ? "PUT" : "POST";
    const url = editingAchievement
      ? `/api/achievements/${editingAchievement._id}`
      : "/api/achievements";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setIsModalOpen(false);
        fetchAchievements();
        setToast({
          type: "success",
          message: editingAchievement ? "Milestone updated" : "Milestone added",
        });
      } else {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to save");
      }
    } catch (error: any) {
      setToast({ type: "error", message: error.message });
    } finally {
      setIsSubmitting(false); //  Stop loading
    }
  };

  //   Deletion Logic
  const confirmDelete = async () => {
    if (!deleteId) return;

    try {
      await fetch(`/api/achievements/${deleteId}`, { method: "DELETE" });
      setAchievements(achievements.filter((c) => c._id !== deleteId));
      setToast({ type: "success", message: "Achievement removed" });
    } catch (error) {
      setToast({ type: "error", message: "Failed to delete" });
    } finally {
      setDeleteId(null);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 relative">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-white/5 pb-6">
        <div>
          <h1 className="text-3xl font-medium text-white tracking-tight flex items-center gap-3">
            <Trophy className="text-purple-500" size={28} />
            Achievements
          </h1>
          <p className="text-zinc-400 mt-2 text-sm max-w-lg">
            Highlight hackathon wins, honors, and special milestones in your
            career.
          </p>
        </div>
        <button
          onClick={() => openModal()}
          className="flex cursor-pointer items-center gap-2 bg-white text-black px-5 py-2.5 rounded-lg text-sm font-bold hover:bg-zinc-200 transition-colors shadow-[0_0_20px_rgba(255,255,255,0.15)]"
        >
          <Plus size={18} /> Add Milestone
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          [1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-87.5 rounded-xl bg-[#0e0e10] animate-pulse border border-white/5"
            />
          ))
        ) : (
          <AnimatePresence>
            {achievements.map((achieve) => (
              <motion.div
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                key={achieve._id}
                className="group relative bg-[#0e0e10] border border-white/5 rounded-xl overflow-hidden hover:border-purple-500/30 transition-all duration-300 flex flex-col hover:shadow-[0_0_30px_rgba(168,85,247,0.1)]"
              >
                {/* Image Area */}
                <div className="h-48 bg-[#121214] relative overflow-hidden p-6 flex items-center justify-center">
                  <div
                    className="absolute inset-0 bg-cover bg-center blur-2xl opacity-20 scale-125 saturate-200"
                    style={{ backgroundImage: `url(${achieve.imageUrl})` }}
                  />

                  <Image
                    src={achieve.imageUrl}
                    alt={achieve.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="relative h-auto w-auto z-10 object-contain shadow-lg drop-shadow-2xl transition-transform duration-500 group-hover:scale-110"
                  />

                  <div className="absolute inset-0 z-20 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
                    <button
                      onClick={() => openModal(achieve)}
                      className="p-2.5 cursor-pointer bg-white text-black rounded-full hover:bg-zinc-200 transition-transform hover:scale-110"
                    >
                      <Pencil size={18} />
                    </button>
                    <button
                      onClick={() => setDeleteId(achieve._id)} // 🗑️ Trigger Modal
                      className="p-2.5 cursor-pointer bg-red-500 text-white rounded-full hover:bg-red-600 transition-transform hover:scale-110"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>

                {/* Content Area */}
                <div className="p-5 flex-1 flex flex-col bg-linear-to-b from-[#0e0e10] to-black">
                  <div className="flex justify-between items-start mb-3">
                    <span className="text-[10px] font-bold text-purple-400 bg-purple-500/10 px-2 py-1 rounded border border-purple-500/20 uppercase tracking-wider flex items-center gap-1">
                      <Medal size={12} /> {achieve.organization}
                    </span>
                    <div className="flex items-center gap-1.5 text-zinc-500 text-xs font-mono">
                      <Calendar size={12} />
                      <span>{new Date(achieve.date).toLocaleDateString()}</span>
                    </div>
                  </div>

                  <h3 className="font-bold text-white text-lg leading-snug mb-2 group-hover:text-purple-300 transition-colors">
                    {achieve.title}
                  </h3>
                  <p className="text-zinc-500 text-sm line-clamp-3 leading-relaxed flex-1">
                    {achieve.description}
                  </p>

                  {achieve.proofLink && (
                    <div className="mt-5 pt-4 border-t border-white/5">
                      <a
                        href={achieve.proofLink}
                        target="_blank"
                        className="flex items-center gap-2 text-xs font-bold text-zinc-400 hover:text-white transition-colors group/link"
                      >
                        <ExternalLink
                          size={14}
                          className="group-hover/link:text-purple-500 transition-colors"
                        />
                        View Proof
                      </a>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>

      {/* Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="bg-[#09090b] w-full max-w-lg rounded-2xl border border-white/10 shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto custom-scrollbar"
            >
              <div className="px-6 py-4 border-b border-white/10 flex justify-between items-center bg-[#0e0e10]">
                <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  {editingAchievement ? (
                    <Pencil size={16} className="text-purple-500" />
                  ) : (
                    <Plus size={16} className="text-blue-500" />
                  )}
                  {editingAchievement ? "Edit Milestone" : "Add Milestone"}
                </h2>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="text-zinc-500 cursor-pointer hover:text-white"
                >
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-5">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">
                    Achievement Title
                  </label>
                  <input
                    required
                    placeholder="e.g. Hackathon Winner 2025"
                    className="w-full bg-[#121214] border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:border-white/30 focus:outline-none placeholder:text-zinc-700"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">
                      Issuer / Org
                    </label>
                    <input
                      required
                      placeholder="e.g. Google"
                      className="w-full bg-[#121214] border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:border-white/30 focus:outline-none placeholder:text-zinc-700"
                      value={formData.organization}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          organization: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">
                      Date
                    </label>
                    <input
                      type="date"
                      required
                      className="w-full cursor-pointer bg-[#121214] border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:border-white/30 focus:outline-none scheme-dark"
                      value={formData.date}
                      onChange={(e) =>
                        setFormData({ ...formData, date: e.target.value })
                      }
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">
                    Proof URL
                  </label>
                  <div className="relative group">
                    <ExternalLink
                      size={14}
                      className="absolute left-3 top-2.5 text-zinc-600 group-focus-within:text-white transition-colors"
                    />
                    <input
                      placeholder="https://..."
                      className="w-full bg-[#121214] border border-white/10 rounded-lg pl-9 pr-3 py-2 text-sm text-white focus:border-white/30 focus:outline-none placeholder:text-zinc-700"
                      value={formData.proofLink}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          proofLink: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">
                    Description
                  </label>
                  <textarea
                    placeholder="Details about the award..."
                    className="w-full bg-[#121214] border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:border-white/30 focus:outline-none placeholder:text-zinc-700 resize-none"
                    rows={3}
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                  />
                </div>

                {/* Upload Zone */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">
                    Cover Image
                  </label>
                  <div className="relative group w-full h-32 bg-[#121214] border border-dashed border-white/10 rounded-xl overflow-hidden hover:border-white/20 hover:bg-white/5 transition-all">
                    <input
                      type="file"
                      accept="image/*"
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
                      onChange={handleImageUpload}
                    />

                    {formData.imageUrl ? (
                      <div className="w-full h-full relative p-2">
                        <Image
                          src={formData.imageUrl}
                          alt="Preview"
                          fill
                          className="object-contain"
                        />
                      </div>
                    ) : (
                      <div className="absolute inset-0 flex flex-col items-center justify-center text-zinc-500 group-hover:text-zinc-300">
                        {uploading ? (
                          <Loader2 className="animate-spin mb-2" />
                        ) : (
                          <Upload className="mb-2" />
                        )}
                        <span className="text-xs font-medium uppercase tracking-wide">
                          {uploading ? "Uploading..." : "Upload Image"}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={uploading || isSubmitting}
                  className={`w-full cursor-pointer font-bold py-3 rounded-lg transition-colors flex items-center justify-center gap-2 ${
                    isSubmitting
                      ? "bg-white/50 text-black cursor-not-allowed"
                      : "bg-white text-black hover:bg-zinc-200"
                  } disabled:opacity-50`}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      {editingAchievement ? (
                        "Update Milestone"
                      ) : (
                        <span className="flex items-center gap-2">
                          <Save size={16} /> Save Milestone
                        </span>
                      )}
                    </>
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
        title="Delete Milestone?"
        message="This action will permanently remove this achievement from your timeline."
        confirmText="Delete"
        onConfirm={confirmDelete}
        onCancel={() => setDeleteId(null)}
        isDanger={true}
      />
    </div>
  );
}
