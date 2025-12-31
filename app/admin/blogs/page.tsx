"use client";

import { useState, useEffect } from "react";
import {
  Plus,
  Pencil,
  Trash2,
  X,
  FileText,
  Image as ImageIcon,
  Loader2,
  Search,
} from "lucide-react";
import RichTextEditor from "@/components/admin/RichTextEditor";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Toast from "@/components/ui/Toast";
import ConfirmModal from "@/components/ui/ConfirmModal";

interface Blog {
  _id: string;
  title: string;
  content: string;
  category: string;
  imageUrl: string;
  slug: string;
  createdAt?: string;
}

export default function AdminBlogs() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBlog, setEditingBlog] = useState<Blog | null>(null);

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
    content: "",
    category: "Tech",
    imageUrl: "",
  });
  const [uploading, setUploading] = useState(false);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      const res = await fetch("/api/blogs");
      const data = await res.json();
      setBlogs(data);
    } catch (error) {
      console.error("Failed to fetch blogs", error);
      setToast({ type: "error", message: "Failed to load articles." });
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
        setToast({ type: "success", message: "Cover image uploaded" });
      }
    } catch (err) {
      setToast({ type: "error", message: "Image upload failed" });
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true); //  Start loading

    const url = editingBlog ? `/api/blogs/${editingBlog._id}` : "/api/blogs";
    const method = editingBlog ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setIsModalOpen(false);
        fetchBlogs();
        setToast({
          type: "success",
          message: editingBlog ? "Article updated" : "Article published",
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

  const openModal = (blog?: Blog) => {
    if (blog) {
      setEditingBlog(blog);
      setFormData({
        title: blog.title,
        content: blog.content,
        category: blog.category,
        imageUrl: blog.imageUrl,
      });
    } else {
      setEditingBlog(null);
      setFormData({ title: "", content: "", category: "Tech", imageUrl: "" });
    }
    setIsModalOpen(true);
  };

  //  Actual Deletion Logic
  const confirmDelete = async () => {
    if (!deleteId) return;

    try {
      await fetch(`/api/blogs/${deleteId}`, { method: "DELETE" });
      setBlogs(blogs.filter((b) => b._id !== deleteId));
      setToast({ type: "success", message: "Article deleted successfully" });
    } catch (error) {
      setToast({ type: "error", message: "Failed to delete article" });
    } finally {
      setDeleteId(null);
    }
  };

  // Filter blogs
  const filteredBlogs = blogs.filter((b) =>
    b.title.toLowerCase().includes(search.toLowerCase())
  );

  // Check if title, content, and image are filled
  const isFormValid =
    formData.title.trim() !== "" &&
    formData.content.trim() !== "" &&
    formData.imageUrl !== "";

  return (
    <div className="space-y-8 animate-in fade-in duration-500 relative">
      {/*  Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-white/5 pb-6">
        <div>
          <h1 className="text-3xl font-medium text-white tracking-tight flex items-center gap-3">
            <FileText className="text-pink-500" size={28} />
            Content Engine
          </h1>
          <p className="text-zinc-400 mt-2 text-sm max-w-lg">
            Draft, edit, and publish articles. Share your knowledge with the
            world.
          </p>
        </div>
        <button
          onClick={() => openModal()}
          className="flex cursor-pointer items-center gap-2 bg-white text-black px-5 py-2.5 rounded-lg text-sm font-bold hover:bg-zinc-200 transition-colors shadow-[0_0_20px_rgba(255,255,255,0.15)]"
        >
          <Plus size={18} /> Compose
        </button>
      </div>

      {/*  Search Bar */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-3 text-zinc-600" size={16} />
        <input
          placeholder="Search articles..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-[#0e0e10] border border-white/10 rounded-lg pl-10 pr-4 py-2.5 text-sm text-white focus:border-white/20 focus:outline-none placeholder:text-zinc-700"
        />
      </div>

      {/*  Blog List */}
      <div className="grid grid-cols-1 gap-4">
        {loading ? (
          [1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-32 rounded-xl bg-[#0e0e10] animate-pulse border border-white/5"
            />
          ))
        ) : (
          <AnimatePresence>
            {filteredBlogs.map((blog) => (
              <motion.div
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                key={blog._id}
                className="group relative bg-[#0e0e10] border border-white/5 hover:border-white/10 rounded-xl p-4 flex gap-6 items-center transition-all duration-200"
              >
                {/* Cover Image Thumbnail */}
                <div className="h-20 w-32 shrink-0 bg-[#121214] rounded-lg overflow-hidden relative">
                  {blog.imageUrl ? (
                    <Image
                      src={blog.imageUrl}
                      alt={blog.title}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="w-auto h-auto object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                    />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center text-zinc-700">
                      <ImageIcon size={20} />
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 border border-white/5 px-1.5 py-0.5 rounded bg-white/5">
                      {blog.category}
                    </span>
                    <span className="text-[10px] text-zinc-600">
                      {new Date().toLocaleDateString()}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-white truncate group-hover:text-blue-400 transition-colors">
                    {blog.title}
                  </h3>
                  <p className="text-zinc-500 text-sm truncate mt-0.5 font-mono">
                    /{blog.slug || "no-slug"}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => openModal(blog)}
                    className="p-2 text-zinc-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors cursor-pointer"
                  >
                    <Pencil size={18} />
                  </button>
                  <button
                    onClick={() => setDeleteId(blog._id)} // 🗑️ Trigger Modal
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

      {/*  Full Screen Editor Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-0 md:p-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              className="bg-[#09090b] w-full max-w-5xl h-full md:h-[90vh] md:rounded-2xl border border-white/10 shadow-2xl flex flex-col overflow-hidden"
            >
              {/* Toolbar Header */}
              <div className="px-6 py-4 border-b border-white/10 flex justify-between items-center bg-[#0e0e10]">
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="text-zinc-500 cursor-pointer hover:text-white transition-colors"
                  >
                    <X size={24} />
                  </button>
                  <span className="text-sm font-bold text-zinc-400">
                    {editingBlog ? "Editing Post" : "Drafting New Post"}
                  </span>
                </div>
                <button
                  onClick={handleSubmit}
                  disabled={!isFormValid || isSubmitting} // 🔒 Disable logic
                  className={`px-6 py-2 rounded-lg text-sm font-bold transition-colors flex items-center gap-2 ${
                    isFormValid && !isSubmitting
                      ? "bg-white text-black hover:bg-zinc-200 cursor-pointer"
                      : "bg-zinc-800 text-zinc-500 cursor-not-allowed"
                  }`}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      Publishing...
                    </>
                  ) : (
                    "Publish"
                  )}
                </button>
              </div>

              {/* Scrollable Content Area */}
              <div className="flex-1 overflow-y-auto custom-scrollbar">
                <div className="max-w-3xl mx-auto py-10 px-6 space-y-8">
                  {/* Cover Image Uploader */}
                  <div className="group relative w-full h-48 md:h-64 bg-[#121214] border-2 border-dashed border-white/10 rounded-xl overflow-hidden hover:border-white/20 transition-all">
                    <input
                      type="file"
                      onChange={handleImageUpload}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
                    />
                    {formData.imageUrl ? (
                      <>
                        <Image
                          src={formData.imageUrl}
                          alt="cover Image"
                          fill
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          className="w-auto h-auto object-cover opacity-60 group-hover:opacity-100 transition-opacity"
                        />
                        <div className="absolute bottom-4 right-4 bg-black/60 px-3 py-1 rounded-full text-xs text-white font-medium backdrop-blur-md">
                          Change Cover
                        </div>
                      </>
                    ) : (
                      <div className="absolute inset-0 flex flex-col items-center justify-center text-zinc-500 group-hover:text-zinc-300">
                        {uploading ? (
                          <Loader2 className="animate-spin mb-2" />
                        ) : (
                          <ImageIcon className="mb-2" size={32} />
                        )}
                        <span className="text-sm font-medium">
                          Add Cover Image
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Title Input */}
                  <input
                    placeholder="Article Title"
                    className="w-full bg-transparent text-4xl md:text-5xl font-bold text-white placeholder:text-zinc-700 focus:outline-none"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                  />

                  {/* Category Select */}
                  <div className="flex items-center gap-4">
                    <span className="text-zinc-500 text-sm font-mono">
                      Category:
                    </span>
                    <select
                      className="bg-[#121214] border cursor-pointer border-white/10 rounded-lg px-3 py-1.5 text-sm text-white focus:border-white/30 focus:outline-none"
                      value={formData.category}
                      onChange={(e) =>
                        setFormData({ ...formData, category: e.target.value })
                      }
                    >
                      <option>Tech</option>
                      <option>Tutorial</option>
                      <option>Life</option>
                      <option>Design</option>
                    </select>
                  </div>

                  {/* The Editor */}
                  <div className="prose prose-invert max-w-none">
                    <RichTextEditor
                      value={formData.content}
                      onChange={(content) =>
                        setFormData({ ...formData, content })
                      }
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/*  REUSABLE TOAST */}
      <Toast
        message={toast?.message || null}
        type={toast?.type || "success"}
        onClose={() => setToast(null)}
      />

      {/*  REUSABLE CONFIRMATION MODAL */}
      <ConfirmModal
        isOpen={!!deleteId}
        title="Delete Article?"
        message="This action is irreversible. The article will be permanently removed."
        confirmText="Delete"
        onConfirm={confirmDelete}
        onCancel={() => setDeleteId(null)}
        isDanger={true}
      />
    </div>
  );
}
