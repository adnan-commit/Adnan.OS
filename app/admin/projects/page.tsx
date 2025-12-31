"use client";

import { useState, useEffect } from "react";
import {
  Plus,
  Trash2,
  Github,
  ExternalLink,
  Pencil,
  X,
  FolderGit2,
  Loader2,
  Upload,
  Save,
  Globe,
  LayoutGrid,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

//  IMPORT CUSTOM COMPONENTS
import Toast from "@/components/ui/Toast";
import ConfirmModal from "@/components/ui/ConfirmModal";

interface Project {
  _id: string;
  title: string;
  description: string;
  techStack: string[];
  repoLink?: string;
  liveLink?: string;
  imageUrl: string;
}

export default function AdminProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"all" | "live">("all");

  const [editingId, setEditingId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    techStack: "",
    repoLink: "",
    liveLink: "",
    imageUrl: "",
  });

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const res = await fetch("/api/projects");
      const data = await res.json();
      setProjects(data);
    } catch (error: any) {
      console.error("Failed to fetch projects", error.message);
      setToast({ type: "error", message: "Failed to load projects." });
    } finally {
      setLoading(false);
    }
  };

  //  Filter Logic
  const liveProjects = projects.filter(
    (p) => p.liveLink && p.liveLink.trim() !== ""
  );
  const displayedProjects = activeTab === "all" ? projects : liveProjects;

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return;

    setUploading(true);
    const file = e.target.files[0];
    const data = new FormData();
    data.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: data,
      });

      const json = await res.json();
      if (json.url) {
        setFormData({ ...formData, imageUrl: json.url });
        setToast({ type: "success", message: "Cover image uploaded" });
      }
    } catch (err: any) {
      setToast({ type: "error", message: "Image upload failed" });
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const techStackArray = formData.techStack.split(",").map((t) => t.trim());
    const payload = { ...formData, techStack: techStackArray };

    try {
      let res;
      if (editingId) {
        res = await fetch(`/api/projects/${editingId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      } else {
        res = await fetch("/api/projects", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }

      if (res.ok) {
        handleCancelEdit();
        fetchProjects();
        setToast({
          type: "success",
          message: editingId
            ? "Project updated successfully"
            : "Project launched successfully",
        });
      } else {
        throw new Error("Operation failed");
      }
    } catch (err: any) {
      setToast({
        type: "error",
        message: err.message || "Something went wrong",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const confirmDelete = async () => {
    if (!deleteId) return;

    try {
      const res = await fetch(`/api/projects/${deleteId}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setProjects(projects.filter((p) => p._id !== deleteId));
        setToast({ type: "success", message: "Project deleted successfully" });
      } else {
        throw new Error("Failed to delete");
      }
    } catch (err) {
      setToast({ type: "error", message: "Failed to delete project" });
    } finally {
      setDeleteId(null);
    }
  };

  const handleEditClick = (project: Project) => {
    setEditingId(project._id);
    setFormData({
      title: project.title,
      description: project.description,
      techStack: project.techStack.join(", "),
      repoLink: project.repoLink || "",
      liveLink: project.liveLink || "",
      imageUrl: project.imageUrl,
    });
    setIsFormOpen(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setIsFormOpen(false);
    setFormData({
      title: "",
      description: "",
      techStack: "",
      repoLink: "",
      liveLink: "",
      imageUrl: "",
    });
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 relative">
      {/*  Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-white/5 pb-6">
        <div>
          <h1 className="text-3xl font-medium text-white tracking-tight flex items-center gap-3">
            <FolderGit2 className="text-purple-500" size={28} />
            Project Lab
          </h1>
          <p className="text-zinc-400 mt-2 text-sm max-w-lg">
            Showcase your best work. High-quality visuals and live demos attract
            the best opportunities.
          </p>
        </div>

        {!isFormOpen && (
          <button
            onClick={() => setIsFormOpen(true)}
            className="flex cursor-pointer items-center gap-2 bg-white text-black px-5 py-2.5 rounded-lg text-sm font-bold hover:bg-zinc-200 transition-colors shadow-[0_0_20px_rgba(255,255,255,0.15)]"
          >
            <Plus size={18} /> New Project
          </button>
        )}
      </div>

      {/*  Slide-Down Form Panel */}
      <AnimatePresence>
        {isFormOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="bg-[#0e0e10] border border-white/10 rounded-xl p-6 md:p-8 mb-8 relative">
              {/* Form Header */}
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-lg font-bold text-white uppercase tracking-wider flex items-center gap-2">
                    {editingId ? (
                      <Pencil size={18} className="text-yellow-500" />
                    ) : (
                      <Plus size={18} className="text-blue-500" />
                    )}
                    {editingId ? "Edit Configuration" : "Initialize Project"}
                  </h2>
                  <p className="text-xs text-zinc-500 mt-1">
                    Fill in the technical details below.
                  </p>
                </div>
                <button
                  onClick={handleCancelEdit}
                  className="text-zinc-500 cursor-pointer hover:text-white transition-colors p-2 hover:bg-white/5 rounded-full"
                >
                  <X size={20} />
                </button>
              </div>

              <form
                onSubmit={handleSubmit}
                className="grid grid-cols-1 md:grid-cols-2 gap-6"
              >
                {/* Left Column: Details */}
                <div className="space-y-5">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">
                      Project Title
                    </label>
                    <input
                      placeholder="e.g. AI SaaS Platform"
                      className="w-full bg-[#121214] border border-white/10 rounded-lg px-4 py-3 text-sm text-white focus:border-white/30 focus:outline-none placeholder:text-zinc-700"
                      value={formData.title}
                      onChange={(e) =>
                        setFormData({ ...formData, title: e.target.value })
                      }
                      required
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">
                      Tech Stack
                    </label>
                    <input
                      placeholder="React, Node.js, TypeScript (comma separated)"
                      className="w-full bg-[#121214] border border-white/10 rounded-lg px-4 py-3 text-sm text-white focus:border-white/30 focus:outline-none placeholder:text-zinc-700"
                      value={formData.techStack}
                      onChange={(e) =>
                        setFormData({ ...formData, techStack: e.target.value })
                      }
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">
                        Repository
                      </label>
                      <div className="relative group">
                        <Github
                          size={14}
                          className="absolute left-3 top-3.5 text-zinc-600 group-focus-within:text-white transition-colors"
                        />
                        <input
                          placeholder="github.com/..."
                          className="w-full bg-[#121214] border border-white/10 rounded-lg pl-9 pr-3 py-3 text-sm text-white focus:border-white/30 focus:outline-none placeholder:text-zinc-700"
                          value={formData.repoLink}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              repoLink: e.target.value,
                            })
                          }
                        />
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">
                        Live Demo
                      </label>
                      <div className="relative group">
                        <ExternalLink
                          size={14}
                          className="absolute left-3 top-3.5 text-zinc-600 group-focus-within:text-white transition-colors"
                        />
                        <input
                          placeholder="https://..."
                          className="w-full bg-[#121214] border border-white/10 rounded-lg pl-9 pr-3 py-3 text-sm text-white focus:border-white/30 focus:outline-none placeholder:text-zinc-700"
                          value={formData.liveLink}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              liveLink: e.target.value,
                            })
                          }
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">
                      Description
                    </label>
                    <textarea
                      placeholder="Detailed explanation of the architecture and features..."
                      className="w-full bg-[#121214] border border-white/10 rounded-lg px-4 py-3 text-sm text-white focus:border-white/30 focus:outline-none placeholder:text-zinc-700 resize-none h-32"
                      value={formData.description}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          description: e.target.value,
                        })
                      }
                      required
                    />
                  </div>
                </div>

                {/* Right Column: Image */}
                <div className="space-y-5">
                  <div className="space-y-1.5 h-full flex flex-col">
                    <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">
                      Cover Image
                    </label>

                    <div className="flex-1 relative group bg-[#121214] border-2 border-dashed border-white/10 rounded-xl overflow-hidden hover:border-white/20 hover:bg-white/5 transition-all">
                      <input
                        type="file"
                        accept="image/*"
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
                        onChange={handleImageUpload}
                      />

                      {formData.imageUrl ? (
                        <Image
                          src={formData.imageUrl}
                          alt="Preview"
                          fill
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                        />
                      ) : (
                        <div className="absolute inset-0 flex flex-col items-center justify-center text-zinc-500 group-hover:text-zinc-300">
                          {uploading ? (
                            <Loader2 className="animate-spin mb-2" />
                          ) : (
                            <Upload className="mb-2" />
                          )}
                          <span className="text-xs font-medium uppercase tracking-wide">
                            {uploading ? "Uploading..." : "Upload Cover"}
                          </span>
                          <span className="text-[10px] opacity-50 mt-1">
                            1920x1080 Recomended
                          </span>
                        </div>
                      )}

                      {/* Overlay when image exists */}
                      {formData.imageUrl && !uploading && (
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                          <span className="text-xs font-bold text-white uppercase tracking-wider border border-white px-3 py-1 rounded-full">
                            Change Image
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Footer Actions */}
                <div className="md:col-span-2 pt-4 border-t border-white/5 flex gap-4">
                  <button
                    type="button"
                    onClick={handleCancelEdit}
                    className="px-6 cursor-pointer py-3 rounded-lg text-sm font-bold text-zinc-400 hover:text-white hover:bg-white/5 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={uploading || isSubmitting}
                    className={`flex-1 cursor-pointer bg-white text-black font-bold py-3 rounded-lg hover:bg-zinc-200 transition-colors flex items-center justify-center gap-2 ${
                      isSubmitting ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 size={18} className="animate-spin" />
                        <span>
                          {editingId ? "Updating..." : "Launching..."}
                        </span>
                      </>
                    ) : (
                      <>
                        <Save size={18} />
                        <span>
                          {editingId ? "Update Project" : "Launch Project"}
                        </span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/*  TABS */}
      <div className="flex items-center gap-6 border-b border-white/5 px-2">
        <button
          onClick={() => setActiveTab("all")}
          className={`flex cursor-pointer items-center gap-2 pb-3 text-sm font-medium transition-all relative ${
            activeTab === "all"
              ? "text-white"
              : "text-zinc-500 hover:text-zinc-300"
          }`}
        >
          <LayoutGrid size={16} />
          All Projects
          <span className="ml-1 text-[10px] bg-white/10 px-1.5 py-0.5 rounded-full">
            {projects.length}
          </span>
          {activeTab === "all" && (
            <motion.div
              layoutId="activeTab"
              className="absolute bottom-0 left-0 w-full h-0.5 bg-purple-500"
            />
          )}
        </button>

        <button
          onClick={() => setActiveTab("live")}
          className={`flex cursor-pointer items-center gap-2 pb-3 text-sm font-medium transition-all relative ${
            activeTab === "live"
              ? "text-white"
              : "text-zinc-500 hover:text-zinc-300"
          }`}
        >
          <Globe size={16} />
          Live Deployments
          <span className="ml-1 text-[10px] bg-white/10 px-1.5 py-0.5 rounded-full">
            {liveProjects.length}
          </span>
          {activeTab === "live" && (
            <motion.div
              layoutId="activeTab"
              className="absolute bottom-0 left-0 w-full h-0.5 bg-emerald-500"
            />
          )}
        </button>
      </div>

      {/*  Project Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          [1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-100 rounded-xl bg-[#0e0e10] animate-pulse border border-white/5"
            />
          ))
        ) : displayedProjects.length > 0 ? (
          <AnimatePresence mode="popLayout">
            {displayedProjects.map((project) => (
              <motion.div
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                key={project._id}
                className="group bg-[#0e0e10] border border-white/5 rounded-xl overflow-hidden hover:border-white/20 transition-all duration-300 flex flex-col"
              >
                {/* Image Area */}
                <div className="h-48 bg-[#121214] relative overflow-hidden">
                  <Image
                    src={project.imageUrl}
                    alt={project.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-80 group-hover:opacity-100"
                  />

                  {/* Overlay Actions */}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
                    <button
                      onClick={() => handleEditClick(project)}
                      className="p-3 cursor-pointer bg-white text-black rounded-full hover:bg-zinc-200 transition-transform hover:scale-110"
                      title="Edit Details"
                    >
                      <Pencil size={18} />
                    </button>
                    <button
                      onClick={() => setDeleteId(project._id)} // 🗑️ Trigger Modal
                      className="p-3 cursor-pointer bg-red-500 text-white rounded-full hover:bg-red-600 transition-transform hover:scale-110"
                      title="Delete Project"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>

                  {/* Live Badge */}
                  {project.liveLink && (
                    <a
                      href={project.liveLink}
                      target="_blank"
                      className="absolute top-3 right-3 bg-black/50 backdrop-blur-md border border-white/10 text-white text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded flex items-center gap-1 hover:bg-black/70 transition-colors"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>{" "}
                      Live
                    </a>
                  )}
                </div>

                {/* Content Area */}
                <div className="p-6 flex-1 flex flex-col">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-bold text-white leading-tight">
                      {project.title}
                    </h3>
                    {project.repoLink && (
                      <a
                        href={project.repoLink}
                        target="_blank"
                        className="text-zinc-500 hover:text-white transition-colors"
                      >
                        <Github size={18} />
                      </a>
                    )}
                  </div>

                  <p className="text-zinc-400 text-sm line-clamp-3 mb-4 flex-1 leading-relaxed">
                    {project.description}
                  </p>

                  {/* Tech Stack Pills */}
                  <div className="flex flex-wrap gap-2 mt-auto pt-4 border-t border-white/5">
                    {project.techStack.map((tech, i) => (
                      <span
                        key={i}
                        className="text-[10px] font-mono text-zinc-300 bg-white/5 px-2 py-1 rounded border border-white/5"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        ) : (
          <div className="col-span-full h-40 flex items-center justify-center text-zinc-500 text-sm italic">
            No projects found in this view.
          </div>
        )}
      </div>

      <Toast
        message={toast?.message || null}
        type={toast?.type || "success"}
        onClose={() => setToast(null)}
      />

      <ConfirmModal
        isOpen={!!deleteId}
        title="Delete Project?"
        message="This action is irreversible. The project will be removed from your portfolio."
        confirmText="Delete"
        onConfirm={confirmDelete}
        onCancel={() => setDeleteId(null)}
        isDanger={true}
      />
    </div>
  );
}
