"use client";

import { useState, useEffect } from "react";
import {
  Plus,
  Trash2,
  Pencil,
  ExternalLink,
  Award,
  X,
  Calendar,
  Loader2,
  Upload,
  CheckCircle,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

import Toast from "@/components/ui/Toast";
import ConfirmModal from "@/components/ui/ConfirmModal";

interface Certificate {
  _id: string;
  name: string;
  issuer: string;
  issueDate: string;
  certificateLink?: string;
  imageUrl: string;
  description?: string;
}

export default function AdminCertificates() {
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCert, setEditingCert] = useState<Certificate | null>(null);
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
    name: "",
    issuer: "",
    issueDate: "",
    certificateLink: "",
    imageUrl: "",
    description: "",
  });

  useEffect(() => {
    fetchCertificates();
  }, []);

  const fetchCertificates = async () => {
    try {
      const res = await fetch("/api/certificates");
      const data = await res.json();
      setCertificates(data);
    } catch (error: any) {
      console.error("Failed to fetch certificates", error.message);
      setToast({ type: "error", message: "Failed to load certificates." });
    } finally {
      setLoading(false);
    }
  };

  const openModal = (cert?: Certificate) => {
    if (cert) {
      setEditingCert(cert);
      setFormData({
        name: cert.name,
        issuer: cert.issuer,
        issueDate: cert.issueDate,
        certificateLink: cert.certificateLink || "",
        imageUrl: cert.imageUrl,
        description: cert.description || "",
      });
    } else {
      setEditingCert(null);
      setFormData({
        name: "",
        issuer: "",
        issueDate: "",
        certificateLink: "",
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
    setIsSubmitting(true); 

    const method = editingCert ? "PUT" : "POST";
    const url = editingCert
      ? `/api/certificates/${editingCert._id}`
      : "/api/certificates";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setIsModalOpen(false);
        fetchCertificates();
        setToast({
          type: "success",
          message: editingCert
            ? "Certificate updated successfully"
            : "Certificate added successfully",
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
      await fetch(`/api/certificates/${deleteId}`, { method: "DELETE" });
      setCertificates(certificates.filter((c) => c._id !== deleteId));
      setToast({
        type: "success",
        message: "Certificate deleted successfully",
      });
    } catch (error) {
      setToast({ type: "error", message: "Failed to delete certificate" });
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
            <Award className="text-yellow-500" size={28} />
            Certifications
          </h1>
          <p className="text-zinc-400 mt-2 text-sm max-w-lg">
            Showcase your verified credentials and achievements from recognized
            institutions.
          </p>
        </div>
        <button
          onClick={() => openModal()}
          className="cursor-pointer flex items-center gap-2 bg-white text-black px-5 py-2.5 rounded-lg text-sm font-bold hover:bg-zinc-200 transition-colors shadow-[0_0_20px_rgba(255,255,255,0.15)]"
        >
          <Plus size={18} /> Add Award
        </button>
      </div>

      {/*  Certificates Grid */}
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
            {certificates.map((cert) => (
              <motion.div
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                key={cert._id}
                className="group relative bg-[#0e0e10] border border-white/5 rounded-xl overflow-hidden hover:border-white/10 transition-all duration-300 flex flex-col"
              >
                {/* Image / Preview */}
                <div className="h-48 bg-[#121214] relative overflow-hidden p-6 flex items-center justify-center">
                  {/* Background Blur Effect */}
                  <div
                    className="absolute inset-0 bg-cover bg-center blur-xl opacity-30 scale-110"
                    style={{ backgroundImage: `url(${cert.imageUrl})` }}
                  />

                  {/* Actual Image */}
                  <Image
                    src={cert.imageUrl}
                    alt={cert.name}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="relative z-10 max-h-full max-w-full object-contain shadow-2xl transition-transform duration-500 group-hover:scale-105"
                  />

                  {/* Hover Overlay Actions */}
                  <div className="absolute inset-0 z-20 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
                    <button
                      onClick={() => openModal(cert)}
                      className="p-2.5 cursor-pointer bg-white text-black rounded-full hover:bg-zinc-200 transition-transform hover:scale-110"
                    >
                      <Pencil size={18} />
                    </button>
                    <button
                      onClick={() => setDeleteId(cert._id)} // 🗑️ Trigger Modal
                      className="p-2.5 cursor-pointer bg-red-500 text-white rounded-full hover:bg-red-600 transition-transform hover:scale-110"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5 flex-1 flex flex-col bg-linear-to-b from-[#0e0e10] to-black">
                  <div className="flex justify-between items-start mb-3">
                    <span className="text-[10px] font-bold text-yellow-500 bg-yellow-500/10 px-2 py-1 rounded border border-yellow-500/20 uppercase tracking-wider">
                      {cert.issuer}
                    </span>
                    <div className="flex items-center gap-1.5 text-zinc-500 text-xs">
                      <Calendar size={12} />
                      <span>
                        {new Date(cert.issueDate).toLocaleDateString(
                          undefined,
                          { year: "numeric", month: "short" }
                        )}
                      </span>
                    </div>
                  </div>

                  <h3 className="font-bold text-white text-lg leading-snug mb-2">
                    {cert.name}
                  </h3>
                  <p className="text-zinc-500 text-sm line-clamp-2 leading-relaxed flex-1">
                    {cert.description}
                  </p>

                  {/* Footer Link */}
                  {cert.certificateLink && (
                    <div className="mt-5 pt-4 border-t border-white/5">
                      <a
                        href={cert.certificateLink}
                        target="_blank"
                        className="flex items-center gap-2 text-xs font-bold text-zinc-400 hover:text-white transition-colors group/link"
                      >
                        <ExternalLink
                          size={14}
                          className="group-hover/link:text-yellow-500 transition-colors"
                        />
                        Verify Credential
                      </a>
                    </div>
                  )}
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
              className="bg-[#09090b] w-full max-w-lg rounded-2xl border border-white/10 shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto custom-scrollbar"
            >
              {/* Modal Header */}
              <div className="px-6 py-4 border-b border-white/10 flex justify-between items-center bg-[#0e0e10]">
                <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  {editingCert ? (
                    <Pencil size={16} className="text-yellow-500" />
                  ) : (
                    <Award size={16} className="text-blue-500" />
                  )}
                  {editingCert ? "Edit Credential" : "Add Credential"}
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
                    Certificate Name
                  </label>
                  <input
                    required
                    placeholder="e.g. AWS Certified Solutions Architect"
                    className="w-full bg-[#121214] border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:border-white/30 focus:outline-none placeholder:text-zinc-700"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">
                      Issuing Org
                    </label>
                    <input
                      required
                      placeholder="e.g. Amazon"
                      className="w-full bg-[#121214] border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:border-white/30 focus:outline-none placeholder:text-zinc-700"
                      value={formData.issuer}
                      onChange={(e) =>
                        setFormData({ ...formData, issuer: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">
                      Date Issued
                    </label>
                    <input
                      type="date"
                      required
                      className="w-full bg-[#121214] border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:border-white/30 focus:outline-none scheme-dark"
                      value={formData.issueDate}
                      onChange={(e) =>
                        setFormData({ ...formData, issueDate: e.target.value })
                      }
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">
                    Credential URL
                  </label>
                  <div className="relative group">
                    <ExternalLink
                      size={14}
                      className="absolute left-3 top-2.5 text-zinc-600 group-focus-within:text-white transition-colors"
                    />
                    <input
                      placeholder="https://coursera.org/verify/..."
                      className="w-full bg-[#121214] border border-white/10 rounded-lg pl-9 pr-3 py-2 text-sm text-white focus:border-white/30 focus:outline-none placeholder:text-zinc-700"
                      value={formData.certificateLink}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          certificateLink: e.target.value,
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
                    placeholder="Brief details about what you learned..."
                    className="w-full bg-[#121214] border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:border-white/30 focus:outline-none placeholder:text-zinc-700 resize-none"
                    rows={3}
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                  />
                </div>

                {/* Image Upload Zone */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">
                    Certificate Image
                  </label>
                  <div className="relative group w-full h-32 bg-[#121214] border border-dashed border-white/10 rounded-xl overflow-hidden hover:border-white/20 hover:bg-white/5 transition-all">
                    <input
                      type="file"
                      accept="image/*"
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
                      onChange={handleImageUpload}
                    />

                    {formData.imageUrl ? (
                      <div className="w-full h-full relative">
                        <Image
                          src={formData.imageUrl}
                          alt="Preview"
                          fill
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          className="w-full h-full object-contain p-2"
                        />
                        <div className="absolute top-2 right-2 bg-black/50 p-1 rounded-full text-white">
                          <CheckCircle size={14} className="text-emerald-500" />
                        </div>
                      </div>
                    ) : (
                      <div className="absolute inset-0 flex flex-col items-center justify-center text-zinc-500 group-hover:text-zinc-300">
                        {uploading ? (
                          <Loader2 className="animate-spin mb-2" />
                        ) : (
                          <Upload className="mb-2" />
                        )}
                        <span className="text-xs font-medium uppercase tracking-wide">
                          {uploading ? "Uploading..." : "Click to Upload"}
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
                    <>{editingCert ? "Update Award" : "Save Award"}</>
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
        title="Delete Certificate?"
        message="This will permanently delete this certificate and all its data."
        confirmText="Delete"
        onConfirm={confirmDelete}
        onCancel={() => setDeleteId(null)}
        isDanger={true}
      />
    </div>
  );
}
