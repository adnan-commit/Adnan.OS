"use client";

import { useState, useEffect } from "react";
import {
  Plus,
  Trash2,
  Pencil,
  X,
  Save,
  Upload,
  Loader2,
  Cpu,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Toast from "@/components/ui/Toast";
import ConfirmModal from "@/components/ui/ConfirmModal";

interface Skill {
  _id: string;
  name: string;
  category: string;
  badge: string;
  experience: string;
}

// Helper: Category Color Mapping (Subtle Pills)
const getCategoryStyle = (cat: string) => {
  switch (cat) {
    case "Frontend":
      return "bg-blue-500/10 text-blue-400 border-blue-500/20";
    case "Backend":
      return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
    case "Database":
      return "bg-orange-500/10 text-orange-400 border-orange-500/20";
    case "DevOps":
      return "bg-purple-500/10 text-purple-400 border-purple-500/20";
    case "Language":
      return "bg-yellow-500/10 text-yellow-400 border-yellow-500/20";
    case "Tool":
      return "bg-zinc-500/10 text-zinc-400 border-zinc-500/20";
    default:
      return "bg-gray-500/10 text-gray-400 border-gray-500/20";
  }
};

export default function AdminSkills() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("All");

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSkill, setEditingSkill] = useState<Skill | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    category: "Frontend",
    badge: "",
    experience: "",
  });
  const [uploading, setUploading] = useState(false);

  //  Loading State
  const [isSubmitting, setIsSubmitting] = useState(false);

  //  Toast State
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  //  Delete State
  const [deleteId, setDeleteId] = useState<string | null>(null);

  useEffect(() => {
    fetchSkills();
  }, []);

  const fetchSkills = async () => {
    try {
      const res = await fetch("/api/skills");
      const data = await res.json();
      setSkills(data);
    } catch (error) {
      console.error("Failed to fetch skills");
      setToast({ type: "error", message: "Failed to load skills matrix." });
    } finally {
      setLoading(false);
    }
  };

  const openModal = (skill?: Skill) => {
    if (skill) {
      setEditingSkill(skill);
      setFormData({
        name: skill.name,
        category: skill.category,
        badge: skill.badge,
        experience: skill.experience,
      });
    } else {
      setEditingSkill(null);
      setFormData({
        name: "",
        category: "Frontend",
        badge: "",
        experience: "",
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
        setFormData({ ...formData, badge: json.url });
        setToast({ type: "success", message: "Icon uploaded successfully" });
      }
    } catch (err: any) {
      setToast({ type: "error", message: "Icon upload failed" });
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const method = editingSkill ? "PUT" : "POST";
    const url = editingSkill
      ? `/api/skills/${editingSkill._id}`
      : "/api/skills";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setIsModalOpen(false);
        fetchSkills();
        setToast({
          type: "success",
          message: editingSkill
            ? "Skill updated successfully"
            : "New skill added to matrix",
        });
      } else {
        throw new Error("Failed to save");
      }
    } catch (error) {
      setToast({ type: "error", message: "Operation failed. Check logs." });
    } finally {
      setIsSubmitting(false);
    }
  };

  const confirmDelete = async () => {
    if (!deleteId) return;

    try {
      await fetch(`/api/skills/${deleteId}`, { method: "DELETE" });
      setSkills(skills.filter((s) => s._id !== deleteId));
      setToast({ type: "success", message: "Skill removed from matrix" });
    } catch (error) {
      setToast({ type: "error", message: "Failed to delete skill" });
    } finally {
      setDeleteId(null);
    }
  };

  const filteredSkills =
    filter === "All" ? skills : skills.filter((s) => s.category === filter);
  const categories = [
    "All",
    "Language",
    "Frontend",
    "Backend",
    "Database",
    "DevOps",
    "Tool",
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500 relative">
      {/*  Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-white/5 pb-6">
        <div>
          <h1 className="text-3xl font-medium text-white tracking-tight flex items-center gap-3">
            <Cpu className="text-emerald-500" size={28} />
            Tech Stack
          </h1>
          <p className="text-zinc-400 mt-2 text-sm max-w-lg">
            Manage your technical arsenal. Categorize your skills to display
            them effectively on your portfolio.
          </p>
        </div>
        <button
          onClick={() => openModal()}
          className="flex cursor-pointer items-center gap-2 bg-white text-black px-5 py-2.5 rounded-lg text-sm font-bold hover:bg-zinc-200 transition-colors shadow-[0_0_20px_rgba(255,255,255,0.15)]"
        >
          <Plus size={18} /> Add Tech
        </button>
      </div>

      {/*  Filter Bar */}
      <div className="flex flex-wrap gap-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`px-4 cursor-pointer py-1.5 rounded-full text-xs font-medium transition-all border ${
              filter === cat
                ? "bg-white text-black border-white"
                : "bg-[#0e0e10] text-zinc-400 border-white/5 hover:border-white/20 hover:text-white"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/*  Skills Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="h-40 rounded-xl bg-[#0e0e10] animate-pulse border border-white/5"
            />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          <AnimatePresence>
            {filteredSkills.map((skill) => (
              <motion.div
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                key={skill._id}
                className="group relative bg-[#0e0e10] border border-transparent rounded-2xl p-5 transition-all duration-300 hover:-translate-y-1 hover:border-cyan-500 hover:shadow-[0_0_30px_rgba(6,182,212,0.25)]"
              >
                <div className="flex justify-between items-start">
                  <div className="relative w-12 h-12 flex items-center justify-start">
                    <div className="relative w-10 h-10 transition-transform duration-300 group-hover:scale-110 z-10">
                      <Image
                        src={skill.badge}
                        alt={skill.name}
                        fill
                        sizes="(max-width: 768px) 100vw, 50vw"
                        className="object-contain drop-shadow-lg"
                      />
                    </div>
                  </div>

                  {/* Actions (Top Right) */}
                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => openModal(skill)}
                      className="p-1.5 text-zinc-400 hover:text-white hover:bg-white/10 rounded transition-colors"
                    >
                      <Pencil size={14} />
                    </button>
                    <button
                      onClick={() => setDeleteId(skill._id)}
                      className="p-1.5 text-zinc-400 hover:text-red-400 hover:bg-red-400/10 rounded transition-colors"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>

                <div className="mt-4">
                  <h3 className="text-white font-bold text-lg tracking-tight group-hover:text-cyan-300 transition-colors">
                    {skill.name}
                  </h3>

                  {/* Chips Container */}
                  <div className="flex flex-wrap items-center gap-2 mt-3">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full border uppercase tracking-wider ${getCategoryStyle(
                        skill.category
                      )}`}
                    >
                      {skill.category}
                    </span>
                    <span className="text-[10px] text-zinc-500 font-mono border border-white/5 px-2 py-0.5 rounded-full bg-white/5">
                      {skill.experience}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/*  MODAL */}
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
                <h2 className="text-sm font-bold text-white uppercase tracking-wider">
                  {editingSkill ? "Edit Configuration" : "New Technology"}
                </h2>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="text-zinc-500 cursor-pointer hover:text-white"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="p-6 space-y-5">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">
                      Skill Name
                    </label>
                    <input
                      required
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      className="w-full bg-[#121214] border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:border-white/30 focus:outline-none"
                      placeholder="React.js"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">
                      Category
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) =>
                        setFormData({ ...formData, category: e.target.value })
                      }
                      className="w-full bg-[#121214] border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:border-white/30 focus:outline-none appearance-none"
                    >
                      {categories
                        .filter((c) => c !== "All")
                        .map((c) => (
                          <option key={c}>{c}</option>
                        ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">
                      Experience
                    </label>
                    <input
                      required
                      value={formData.experience}
                      onChange={(e) =>
                        setFormData({ ...formData, experience: e.target.value })
                      }
                      className="w-full bg-[#121214] border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:border-white/30 focus:outline-none"
                      placeholder="e.g. 2 Years"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">
                      Icon Upload
                    </label>
                    <label className="flex items-center justify-center gap-2 w-full bg-[#121214] border border-white/10 border-dashed rounded-lg px-3 py-2 text-sm text-zinc-400 hover:text-white hover:bg-white/5 cursor-pointer transition-colors h-9.5">
                      {uploading ? (
                        <Loader2 className="animate-spin" size={14} />
                      ) : (
                        <Upload size={14} />
                      )}
                      <span className="text-xs truncate">
                        {uploading ? "Uploading..." : "Select File"}
                      </span>
                      <input
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={handleImageUpload}
                      />
                    </label>
                  </div>
                </div>

                {/* Preview Badge */}
                {formData.badge && (
                  <div className="flex items-center gap-3 p-3 bg-white/5 rounded-lg border border-white/5">
                    <div className="relative w-10 h-10 shrink-0">
                      <Image
                        src={formData.badge}
                        alt="Preview"
                        fill
                        className="object-contain"
                      />
                    </div>

                    <div className="text-xs text-zinc-400">
                      <p className="text-white">Icon Uploaded</p>
                      <p>Ready to save</p>
                    </div>
                  </div>
                )}

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
                      Processing...
                    </>
                  ) : (
                    <>
                      <Save size={16} />
                      {editingSkill ? "Update System" : "Save to Matrix"}
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
        title="Delete Skill?"
        message="This action will remove this technology from your tech stack."
        confirmText="Delete"
        onConfirm={confirmDelete}
        onCancel={() => setDeleteId(null)}
        isDanger={true}
      />
    </div>
  );
}
