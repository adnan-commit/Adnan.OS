"use client";

import { useState, useEffect } from "react";
import {
  Plus,
  Trash2,
  Pencil,
  X,
  GraduationCap,
  Calendar,
  School,
  Save,
  BookOpen,
  Loader2,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import Toast from "@/components/ui/Toast";
import ConfirmModal from "@/components/ui/ConfirmModal";

interface EducationItem {
  _id: string;
  degree: string;
  school: string;
  year: string;
  grade?: string;
  description?: string;
}

export default function AdminEducation() {
  const [educations, setEducations] = useState<EducationItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<EducationItem | null>(null);

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
    degree: "",
    school: "",
    year: "",
    grade: "",
    description: "",
  });

  useEffect(() => {
    fetchEducation();
  }, []);

  const fetchEducation = async () => {
    try {
      const res = await fetch("/api/education");
      const data = await res.json();
      setEducations(data);
    } catch (error) {
      console.error("Failed to fetch education");
      setToast({ type: "error", message: "Failed to load education data." });
    } finally {
      setLoading(false);
    }
  };

  const openModal = (item?: EducationItem) => {
    if (item) {
      setEditingItem(item);
      setFormData({
        degree: item.degree,
        school: item.school,
        year: item.year,
        grade: item.grade || "",
        description: item.description || "",
      });
    } else {
      setEditingItem(null);
      setFormData({
        degree: "",
        school: "",
        year: "",
        grade: "",
        description: "",
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true); //start loading

    const method = editingItem ? "PUT" : "POST";
    const url = editingItem
      ? `/api/education/${editingItem._id}`
      : "/api/education";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setIsModalOpen(false);
        fetchEducation();
        setToast({
          type: "success",
          message: editingItem
            ? "Education entry updated"
            : "New degree added successfully",
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

  const confirmDelete = async () => {
    if (!deleteId) return;

    try {
      await fetch(`/api/education/${deleteId}`, { method: "DELETE" });
      setEducations(educations.filter((e) => e._id !== deleteId));
      setToast({ type: "success", message: "Entry deleted successfully" });
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
            <GraduationCap className="text-blue-500" size={28} />
            Education
          </h1>
          <p className="text-zinc-400 mt-2 text-sm max-w-lg">
            Manage your academic background, degrees, and qualifications.
          </p>
        </div>
        <button
          onClick={() => openModal()}
          className="flex cursor-pointer items-center gap-2 bg-white text-black px-5 py-2.5 rounded-lg text-sm font-bold hover:bg-zinc-200 transition-colors shadow-[0_0_20px_rgba(255,255,255,0.15)]"
        >
          <Plus size={18} /> Add Degree
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
            {educations.map((item) => (
              <motion.div
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                key={item._id}
                className="group relative bg-[#0e0e10] border border-white/5 hover:border-blue-500/30 rounded-xl p-6 transition-all hover:shadow-[0_0_30px_rgba(59,130,246,0.1)]"
              >
                <div className="flex flex-col md:flex-row gap-6 items-start">
                  {/* Icon Box */}
                  <div className="h-14 w-14 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center shrink-0">
                    <School className="text-blue-400" size={28} />
                  </div>

                  {/* Main Content */}
                  <div className="flex-1 w-full">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-xl font-bold text-white mb-1">
                          {item.degree}
                        </h3>
                        <p className="text-blue-400 font-medium text-sm flex items-center gap-2">
                          {item.school}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 text-zinc-500 text-sm font-mono bg-white/5 px-3 py-1 rounded-md border border-white/5">
                        <Calendar size={14} />
                        {item.year}
                      </div>
                    </div>

                    <div className="mt-4 flex flex-wrap gap-4 text-sm text-zinc-400">
                      {item.grade && (
                        <div className="flex items-center gap-2">
                          <BookOpen size={16} className="text-zinc-500" />
                          <span className="text-zinc-300">
                            Grade: {item.grade}
                          </span>
                        </div>
                      )}
                    </div>

                    {item.description && (
                      <p className="mt-4 text-zinc-500 text-sm leading-relaxed border-t border-white/5 pt-4">
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
                  {editingItem ? "Edit Education" : "Add Education"}
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
                    Degree / Course
                  </label>
                  <input
                    required
                    value={formData.degree}
                    onChange={(e) =>
                      setFormData({ ...formData, degree: e.target.value })
                    }
                    className="w-full bg-[#121214] border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:border-white/30 focus:outline-none"
                    placeholder="e.g. B.Tech Computer Science"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">
                    School / University
                  </label>
                  <input
                    required
                    value={formData.school}
                    onChange={(e) =>
                      setFormData({ ...formData, school: e.target.value })
                    }
                    className="w-full bg-[#121214] border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:border-white/30 focus:outline-none"
                    placeholder="e.g. Medicaps University"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">
                      Year Range
                    </label>
                    <input
                      required
                      value={formData.year}
                      onChange={(e) =>
                        setFormData({ ...formData, year: e.target.value })
                      }
                      className="w-full bg-[#121214] border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:border-white/30 focus:outline-none"
                      placeholder="e.g. 2021 - 2025"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">
                      Grade (Optional)
                    </label>
                    <input
                      value={formData.grade}
                      onChange={(e) =>
                        setFormData({ ...formData, grade: e.target.value })
                      }
                      className="w-full bg-[#121214] border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:border-white/30 focus:outline-none"
                      placeholder="e.g. 8.5 CGPA"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">
                    Description (Optional)
                  </label>
                  <textarea
                    rows={3}
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    className="w-full bg-[#121214] border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:border-white/30 focus:outline-none resize-none"
                    placeholder="Relevant coursework, minors, or achievements..."
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
                      {editingItem ? "Update Entry" : "Save Entry"}
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
        title="Delete Education Entry?"
        message="This will permanently remove this education record from your profile."
        confirmText="Delete"
        onConfirm={confirmDelete}
        onCancel={() => setDeleteId(null)}
        isDanger={true}
      />
    </div>
  );
}
