"use client";

import { useState, useEffect } from "react";
import {
  Plus,
  Trash2,
  Pencil,
  X,
  Briefcase,
  Calendar,
  MapPin,
  Save,
  Building2,
  Loader2,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

//  IMPORT CUSTOM COMPONENTS
import Toast from "@/components/ui/Toast";
import ConfirmModal from "@/components/ui/ConfirmModal";

interface ExperienceItem {
  _id: string;
  role: string;
  company: string;
  duration: string;
  location?: string;
  description?: string;
}

export default function AdminExperience() {
  const [experiences, setExperiences] = useState<ExperienceItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<ExperienceItem | null>(null);

  //  Loading State for Form Submission
  const [isSubmitting, setIsSubmitting] = useState(false);

  //  Toast State
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  //  Delete Confirmation State
  const [deleteId, setDeleteId] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    role: "",
    company: "",
    duration: "",
    location: "",
    description: "",
  });

  useEffect(() => {
    fetchExperience();
  }, []);

  const fetchExperience = async () => {
    try {
      const res = await fetch("/api/experience");
      const data = await res.json();
      setExperiences(data);
    } catch (error) {
      console.error("Failed to fetch experience");
      setToast({ type: "error", message: "Failed to load experience data." });
    } finally {
      setLoading(false);
    }
  };

  const openModal = (item?: ExperienceItem) => {
    if (item) {
      setEditingItem(item);
      setFormData({
        role: item.role,
        company: item.company,
        duration: item.duration,
        location: item.location || "",
        description: item.description || "",
      });
    } else {
      setEditingItem(null);
      setFormData({
        role: "",
        company: "",
        duration: "",
        location: "",
        description: "",
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true); //  Start loading

    const method = editingItem ? "PUT" : "POST";
    const url = editingItem
      ? `/api/experience/${editingItem._id}`
      : "/api/experience";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setIsModalOpen(false);
        fetchExperience();
        setToast({
          type: "success",
          message: editingItem
            ? "Role updated successfully"
            : "New role added successfully",
        });
      } else {
        throw new Error("Failed to save");
      }
    } catch (error) {
      setToast({
        type: "error",
        message: "Operation failed. Please try again.",
      });
    } finally {
      setIsSubmitting(false); //  Stop loading
    }
  };

  //  Actual Deletion Logic
  const confirmDelete = async () => {
    if (!deleteId) return;

    try {
      await fetch(`/api/experience/${deleteId}`, { method: "DELETE" });
      setExperiences(experiences.filter((e) => e._id !== deleteId));
      setToast({ type: "success", message: "Experience entry deleted" });
    } catch (error) {
      setToast({ type: "error", message: "Failed to delete entry" });
    } finally {
      setDeleteId(null);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 relative">
      {/*  Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-white/5 pb-6">
        <div>
          <h1 className="text-3xl font-medium text-white tracking-tight flex items-center gap-3">
            <Briefcase className="text-indigo-500" size={28} />
            Work Experience
          </h1>
          <p className="text-zinc-400 mt-2 text-sm max-w-lg">
            Showcase your professional journey, internships, and roles.
          </p>
        </div>
        <button
          onClick={() => openModal()}
          className="flex cursor-pointer items-center gap-2 bg-white text-black px-5 py-2.5 rounded-lg text-sm font-bold hover:bg-zinc-200 transition-colors shadow-[0_0_20px_rgba(255,255,255,0.15)]"
        >
          <Plus size={18} /> Add Role
        </button>
      </div>

      {/*  Content Grid */}
      <div className="grid grid-cols-1 gap-4">
        {loading ? (
          [1, 2].map((i) => (
            <div
              key={i}
              className="h-32 rounded-xl bg-[#0e0e10] animate-pulse border border-white/5"
            />
          ))
        ) : (
          <AnimatePresence>
            {experiences.map((item) => (
              <motion.div
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                key={item._id}
                className="group relative bg-[#0e0e10] border border-white/5 hover:border-indigo-500/30 rounded-xl p-6 transition-all hover:shadow-[0_0_30px_rgba(99,102,241,0.1)]"
              >
                <div className="flex flex-col md:flex-row gap-6 items-start">
                  {/* Icon Box */}
                  <div className="h-14 w-14 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center shrink-0">
                    <Building2 className="text-indigo-400" size={28} />
                  </div>

                  {/* Main Content */}
                  <div className="flex-1 w-full">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-xl font-bold text-white mb-1">
                          {item.role}
                        </h3>
                        <p className="text-indigo-400 font-medium text-sm flex items-center gap-2">
                          {item.company}
                        </p>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <div className="flex items-center gap-2 text-zinc-500 text-sm font-mono bg-white/5 px-3 py-1 rounded-md border border-white/5">
                          <Calendar size={14} />
                          {item.duration}
                        </div>
                        {item.location && (
                          <div className="flex items-center gap-1.5 text-zinc-500 text-xs">
                            <MapPin size={12} />
                            {item.location}
                          </div>
                        )}
                      </div>
                    </div>

                    {item.description && (
                      <p className="mt-4 text-zinc-400 text-sm leading-relaxed border-t border-white/5 pt-4 whitespace-pre-line">
                        {item.description}
                      </p>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="absolute top-6 right-6 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => openModal(item)}
                    className="p-2 text-zinc-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
                  >
                    <Pencil size={18} />
                  </button>
                  <button
                    onClick={() => setDeleteId(item._id)} // 🗑️ Trigger Modal
                    className="p-2 text-zinc-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors cursor-pointer"
                  >
                    <Trash2 size={18} />
                  </button>
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
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-[#09090b] w-full max-w-lg rounded-2xl border border-white/10 shadow-2xl overflow-hidden"
            >
              <div className="px-6 py-4 border-b border-white/10 flex justify-between items-center bg-[#0e0e10]">
                <h2 className="text-sm font-bold text-white uppercase tracking-wider">
                  {editingItem ? "Edit Role" : "Add Role"}
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
                    Role / Job Title
                  </label>
                  <input
                    required
                    value={formData.role}
                    onChange={(e) =>
                      setFormData({ ...formData, role: e.target.value })
                    }
                    className="w-full bg-[#121214] border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:border-white/30 focus:outline-none"
                    placeholder="e.g. Senior Software Engineer"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">
                    Company Name
                  </label>
                  <input
                    required
                    value={formData.company}
                    onChange={(e) =>
                      setFormData({ ...formData, company: e.target.value })
                    }
                    className="w-full bg-[#121214] border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:border-white/30 focus:outline-none"
                    placeholder="e.g. Tech Corp Inc."
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">
                      Duration
                    </label>
                    <input
                      required
                      value={formData.duration}
                      onChange={(e) =>
                        setFormData({ ...formData, duration: e.target.value })
                      }
                      className="w-full bg-[#121214] border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:border-white/30 focus:outline-none"
                      placeholder="Jan 2024 - Present"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">
                      Location (Optional)
                    </label>
                    <input
                      value={formData.location}
                      onChange={(e) =>
                        setFormData({ ...formData, location: e.target.value })
                      }
                      className="w-full bg-[#121214] border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:border-white/30 focus:outline-none"
                      placeholder="e.g. Remote"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">
                    Description (Optional)
                  </label>
                  <textarea
                    rows={4}
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    className="w-full bg-[#121214] border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:border-white/30 focus:outline-none resize-none"
                    placeholder="• Developed new features...&#10;• Optimized database queries..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full cursor-pointer bg-white text-black font-bold py-3 rounded-lg hover:bg-zinc-200 transition-colors flex items-center justify-center gap-2 ${
                    isSubmitting ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Save size={16} />
                      {editingItem ? "Update Role" : "Save Role"}
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
        title="Delete Role?"
        message="This will permanently remove this work experience from your portfolio."
        confirmText="Delete"
        onConfirm={confirmDelete}
        onCancel={() => setDeleteId(null)}
        isDanger={true}
      />
    </div>
  );
}
