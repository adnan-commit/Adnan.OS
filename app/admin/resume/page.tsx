"use client";

import { useState, useEffect } from "react";
import {
  Plus,
  Trash2,
  FileText,
  CheckCircle,
  X,
  Loader2,
  Upload,
  Cloud,
  FileBadge,
  History,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

//  IMPORT CUSTOM COMPONENTS
import Toast from "@/components/ui/Toast";
import ConfirmModal from "@/components/ui/ConfirmModal";

interface Resume {
  _id: string;
  name: string;
  fileUrl: string;
  driveLink?: string;
  isActive: boolean;
  createdAt?: string;
}

export default function AdminResume() {
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    fileUrl: "",
    driveLink: "",
    isActive: false,
  });
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

  useEffect(() => {
    fetchResumes();
  }, []);

  const fetchResumes = async () => {
    try {
      const res = await fetch("/api/resume");
      const data = await res.json();
      setResumes(data);
    } catch (error) {
      console.error("Failed to fetch resumes");
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return;
    setUploading(true);
    const data = new FormData();
    data.append("file", e.target.files[0]);

    try {
      const res = await fetch("/api/upload", { method: "POST", body: data });
      const json = await res.json();
      if (json.url) {
        setFormData({ ...formData, fileUrl: json.url });
        setToast({ type: "success", message: "File uploaded successfully" });
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

    try {
      const res = await fetch("/api/resume", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setIsModalOpen(false);
        setFormData({ name: "", fileUrl: "", driveLink: "", isActive: false });
        fetchResumes();
        setToast({
          type: "success",
          message: "Resume version committed successfully",
        });
      } else {
        throw new Error("Failed to save");
      }
    } catch (err) {
      setToast({ type: "error", message: "Failed to save version" });
    } finally {
      setIsSubmitting(false); //  Stop loading
    }
  };

  const toggleActive = async (resume: Resume) => {
    if (resume.isActive) return;

    // Optimistic Update
    const newResumes = resumes.map((r) => ({
      ...r,
      isActive: r._id === resume._id,
    }));
    setResumes(newResumes);

    try {
      await fetch(`/api/resume/${resume._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...resume, isActive: true }),
      });
      fetchResumes();
      setToast({ type: "success", message: "Production resume updated" });
    } catch (err) {
      setToast({ type: "error", message: "Failed to update status" });
      fetchResumes(); // Revert
    }
  };

  //  Actual Deletion Logic
  const confirmDelete = async () => {
    if (!deleteId) return;

    try {
      await fetch(`/api/resume/${deleteId}`, { method: "DELETE" });
      setResumes(resumes.filter((r) => r._id !== deleteId));
      setToast({ type: "success", message: "Resume version deleted" });
    } catch (err) {
      setToast({ type: "error", message: "Failed to delete version" });
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
            <FileBadge className="text-blue-500" size={28} />
            Resume Control
          </h1>
          <p className="text-zinc-400 mt-2 text-sm max-w-lg">
            Manage version control for your CV. Ensure the correct version is
            deployed to production.
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex cursor-pointer items-center gap-2 bg-white text-black px-5 py-2.5 rounded-lg text-sm font-bold hover:bg-zinc-200 transition-colors shadow-[0_0_20px_rgba(255,255,255,0.15)]"
        >
          <Plus size={18} /> Upload Version
        </button>
      </div>

      {/*  Resumes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          [1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-48 rounded-xl bg-[#0e0e10] animate-pulse border border-white/5"
            />
          ))
        ) : (
          <AnimatePresence>
            {resumes.map((resume) => (
              <motion.div
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                key={resume._id}
                className={`group relative overflow-hidden rounded-xl border p-6 transition-all duration-300 ${
                  resume.isActive
                    ? "bg-blue-900/10 border-blue-500/50 shadow-[0_0_30px_rgba(59,130,246,0.1)]"
                    : "bg-[#0e0e10] border-white/5 hover:border-white/10"
                }`}
              >
                {/* Spotlight Effect */}
                <div
                  className={`absolute inset-0 bg-linear-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${
                    resume.isActive
                      ? "from-blue-500/20 to-transparent"
                      : "from-zinc-500/10 to-transparent"
                  }`}
                />

                {/* Status Indicator */}
                <div className="relative z-10 flex justify-between items-start mb-6">
                  <div
                    className={`p-3 rounded-lg ${
                      resume.isActive
                        ? "bg-blue-500/20 text-blue-400"
                        : "bg-zinc-800 text-zinc-500"
                    }`}
                  >
                    <FileText size={24} />
                  </div>
                  {resume.isActive ? (
                    <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 shadow-[0_0_10px_rgba(59,130,246,0.2)]">
                      <div className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
                      <span className="text-[10px] font-bold text-blue-400 uppercase tracking-wider">
                        Production
                      </span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/5">
                      <History size={12} className="text-zinc-500" />
                      <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">
                        Archived
                      </span>
                    </div>
                  )}
                </div>

                {/* Details */}
                <div className="relative z-10 space-y-1 mb-6">
                  <h3 className="text-white font-bold text-lg">
                    {resume.name}
                  </h3>
                  <p className="text-zinc-500 text-xs font-mono">
                    ID: {resume._id.slice(-6).toUpperCase()} • PDF
                  </p>
                </div>

                {/* Links Row */}
                <div className="relative z-10 grid grid-cols-2 gap-2 mb-4">
                  <a
                    href={resume.fileUrl}
                    target="_blank"
                    className="flex items-center justify-center gap-2 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-xs font-medium text-zinc-300 transition-colors border border-white/5"
                  >
                    <FileText size={14} /> Local File
                  </a>
                  {resume.driveLink ? (
                    <a
                      href={resume.driveLink}
                      target="_blank"
                      className="flex items-center justify-center gap-2 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-xs font-medium text-zinc-300 transition-colors border border-white/5"
                    >
                      <Cloud size={14} /> Drive
                    </a>
                  ) : (
                    <div className="flex items-center justify-center gap-2 py-2 rounded-lg bg-white/5 opacity-50 text-xs font-medium text-zinc-500 border border-white/5 cursor-not-allowed">
                      <Cloud size={14} /> No Link
                    </div>
                  )}
                </div>

                {/* Actions Footer */}
                <div className="relative z-10 pt-4 border-t border-white/5 flex gap-3">
                  {!resume.isActive && (
                    <button
                      onClick={() => toggleActive(resume)}
                      className="flex-1 cursor-pointer py-2 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-wider border border-emerald-500/20 transition-all hover:shadow-[0_0_15px_rgba(16,185,129,0.2)]"
                    >
                      Deploy to Live
                    </button>
                  )}
                  <button
                    onClick={() => setDeleteId(resume._id)} // 🗑️ Trigger Modal
                    className={`py-2 px-3 cursor-pointer rounded-lg text-xs font-bold uppercase tracking-wider border transition-colors ${
                      resume.isActive
                        ? "bg-red-500/5 text-red-400/50 border-red-500/10 cursor-not-allowed" // Harder to delete active resume
                        : "bg-red-500/10 text-red-400 border-red-500/20 hover:bg-red-500/20 hover:text-red-300"
                    }`}
                    disabled={resume.isActive}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>

      {/*  Technical Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-[#09090b] w-full max-w-md rounded-2xl border border-white/10 shadow-2xl overflow-hidden"
            >
              {/* Header */}
              <div className="px-6 py-4 border-b border-white/10 flex justify-between items-center bg-[#0e0e10]">
                <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <Upload size={16} className="text-blue-500" /> Upload Version
                </h2>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="text-zinc-500 cursor-pointer hover:text-white"
                >
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-5">
                {/* Name Input */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">
                    Version Name
                  </label>
                  <input
                    required
                    placeholder="e.g. Frontend_Engineer_2025_v2"
                    className="w-full bg-[#121214] border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:border-white/30 focus:outline-none placeholder:text-zinc-700 font-mono"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                  />
                </div>

                {/* Upload Zone */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">
                    File Data
                  </label>
                  <div className="relative group">
                    <input
                      type="file"
                      accept=".pdf"
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                      onChange={handleFileUpload}
                    />
                    <div className="flex flex-col items-center justify-center gap-2 p-6 rounded-lg border border-dashed border-white/20 bg-[#121214] group-hover:border-blue-500/50 group-hover:bg-blue-500/5 transition-all">
                      {formData.fileUrl ? (
                        <div className="flex items-center gap-2 text-emerald-400">
                          <CheckCircle size={20} />
                          <span className="text-sm font-bold">
                            Upload Complete
                          </span>
                        </div>
                      ) : (
                        <>
                          {uploading ? (
                            <Loader2
                              size={24}
                              className="animate-spin text-blue-500"
                            />
                          ) : (
                            <FileText
                              size={24}
                              className="text-zinc-500 group-hover:text-blue-400"
                            />
                          )}
                          <span className="text-xs text-zinc-400 group-hover:text-zinc-200 font-medium">
                            {uploading
                              ? "Uploading bits..."
                              : "Drag PDF or Click to Browse"}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">
                    Cloud Backup (Drive Link)
                  </label>
                  <input
                    placeholder="https://drive.google.com/..."
                    className="w-full bg-[#121214] border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:border-white/30 focus:outline-none placeholder:text-zinc-700 font-mono"
                    value={formData.driveLink}
                    onChange={(e) =>
                      setFormData({ ...formData, driveLink: e.target.value })
                    }
                  />
                </div>

                <label className="flex items-center gap-3 p-3 rounded-lg border border-white/5 bg-[#121214] cursor-pointer hover:border-white/10">
                  <div
                    className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${
                      formData.isActive
                        ? "bg-blue-500 border-blue-500"
                        : "border-zinc-600"
                    }`}
                  >
                    {formData.isActive && (
                      <CheckCircle size={12} className="text-white" />
                    )}
                  </div>
                  <input
                    type="checkbox"
                    className="hidden"
                    checked={formData.isActive}
                    onChange={(e) =>
                      setFormData({ ...formData, isActive: e.target.checked })
                    }
                  />
                  <div>
                    <p className="text-sm font-medium text-white">
                      Deploy Immediately
                    </p>
                    <p className="text-[10px] text-zinc-500">
                      This will replace the current live resume.
                    </p>
                  </div>
                </label>

                <button
                  type="submit"
                  disabled={uploading || !formData.fileUrl || isSubmitting}
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
                      {uploading ? (
                        <Loader2 size={16} className="animate-spin" />
                      ) : (
                        <Upload size={16} />
                      )}
                      Commit Version
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
        title="Delete Version?"
        message="This will permanently delete this resume version from your archive. If it is currently live, your site will have no resume."
        confirmText="Delete Permanently"
        onConfirm={confirmDelete}
        onCancel={() => setDeleteId(null)}
        isDanger={true}
      />
    </div>
  );
}
