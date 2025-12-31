"use client";

import { useState, useEffect } from "react";
import {
  Plus,
  Trash2,
  Pencil,
  ExternalLink,
  Smartphone,
  Mail,
  Globe,
  Github,
  Linkedin,
  Twitter,
  Instagram,
  MessageCircle,
  Hash,
  AtSign,
  Link as LinkIcon,
  Save,
  X,
  Loader2,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import Toast from "@/components/ui/Toast";
import ConfirmModal from "@/components/ui/ConfirmModal";

interface Contact {
  _id: string;
  platform: string;
  value: string;
  link: string;
  isActive: boolean;
}

const getPlatformConfig = (platform: string) => {
  const p = platform.toLowerCase();
  switch (p) {
    case "email":
      return {
        icon: <Mail size={18} />,
        color: "text-red-400",
        bg: "bg-red-500/10",
        border: "border-red-500/20",
        hoverBorder: "hover:border-red-500/50",
        hoverShadow: "hover:shadow-[0_0_20px_rgba(248,113,113,0.2)]", // Red Glow
      };
    case "phone":
      return {
        icon: <Smartphone size={18} />,
        color: "text-emerald-400",
        bg: "bg-emerald-500/10",
        border: "border-emerald-500/20",
        hoverBorder: "hover:border-emerald-500/50",
        hoverShadow: "hover:shadow-[0_0_20px_rgba(52,211,153,0.2)]", // Emerald Glow
      };
    case "linkedin":
      return {
        icon: <Linkedin size={18} />,
        color: "text-blue-400",
        bg: "bg-blue-500/10",
        border: "border-blue-500/20",
        hoverBorder: "hover:border-blue-500/50",
        hoverShadow: "hover:shadow-[0_0_20px_rgba(96,165,250,0.2)]", // Blue Glow
      };
    case "github":
      return {
        icon: <Github size={18} />,
        color: "text-zinc-200",
        bg: "bg-zinc-500/10",
        border: "border-zinc-500/20",
        hoverBorder: "hover:border-zinc-500/50",
        hoverShadow: "hover:shadow-[0_0_20px_rgba(212,212,216,0.15)]", // Zinc/White Glow
      };
    case "twitter":
      return {
        icon: <Twitter size={18} />,
        color: "text-sky-400",
        bg: "bg-sky-500/10",
        border: "border-sky-500/20",
        hoverBorder: "hover:border-sky-500/50",
        hoverShadow: "hover:shadow-[0_0_20px_rgba(56,189,248,0.2)]", // Sky Glow
      };
    case "instagram":
      return {
        icon: <Instagram size={18} />,
        color: "text-pink-400",
        bg: "bg-pink-500/10",
        border: "border-pink-500/20",
        hoverBorder: "hover:border-pink-500/50",
        hoverShadow: "hover:shadow-[0_0_20px_rgba(244,114,182,0.2)]", // Pink Glow
      };
    case "whatsapp":
      return {
        icon: <MessageCircle size={18} />,
        color: "text-green-500",
        bg: "bg-green-500/10",
        border: "border-green-500/20",
        hoverBorder: "hover:border-green-500/50",
        hoverShadow: "hover:shadow-[0_0_20px_rgba(34,197,94,0.2)]", // Green Glow
      };
    default:
      return {
        icon: <Globe size={18} />,
        color: "text-indigo-400",
        bg: "bg-indigo-500/10",
        border: "border-indigo-500/20",
        hoverBorder: "hover:border-indigo-500/50",
        hoverShadow: "hover:shadow-[0_0_20px_rgba(129,140,248,0.2)]", // Indigo Glow
      };
  }
};

export default function AdminContact() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    platform: "Email",
    value: "",
    link: "",
  });
  const [editingId, setEditingId] = useState<string | null>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);

  // State for Toast
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  // State for Confirmation Modal
  const [deleteId, setDeleteId] = useState<string | null>(null);

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      const res = await fetch("/api/contact");
      const data = await res.json();
      setContacts(data);
    } catch (error) {
      console.error("Failed to load contacts");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    let finalLink = formData.link;
    if (formData.platform === "Email" && !finalLink.startsWith("mailto:")) {
      finalLink = `mailto:${finalLink}`;
    }

    const method = editingId ? "PUT" : "POST";
    const url = editingId ? `/api/contact/${editingId}` : "/api/contact";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, link: finalLink }),
      });

      if (res.ok) {
        setFormData({ platform: "Email", value: "", link: "" });
        setEditingId(null);
        fetchContacts();
        setToast({
          type: "success",
          message: editingId
            ? "Connection updated successfully"
            : "New connection established",
        });
      } else {
        throw new Error("API Error");
      }
    } catch (err) {
      setToast({
        type: "error",
        message: "Operation failed. Check system logs.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (contact: Contact) => {
    setEditingId(contact._id);
    setFormData({
      platform: contact.platform,
      value: contact.value,
      link: contact.link,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const confirmDelete = async () => {
    if (!deleteId) return;

    try {
      await fetch(`/api/contact/${deleteId}`, { method: "DELETE" });
      setContacts(contacts.filter((c) => c._id !== deleteId));
      setToast({ type: "success", message: "Connection terminated." });
    } catch (err) {
      setToast({ type: "error", message: "Failed to delete connection." });
    } finally {
      setDeleteId(null);
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setFormData({ platform: "Email", value: "", link: "" });
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 relative">
      {/*  Header */}
      <div className="border-b border-white/5 pb-6">
        <h1 className="text-3xl font-medium text-white tracking-tight flex items-center gap-3">
          <AtSign className="text-emerald-500" size={28} />
          Contact Hub
        </h1>
        <p className="text-zinc-400 mt-2 text-sm max-w-lg">
          Centralize your digital presence. Manage where and how people can
          reach you.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/*  STICKY FORM PANEL */}
        <div className="lg:col-span-1">
          <div className="bg-[#0e0e10] p-6 rounded-xl border border-white/10 sticky top-8 shadow-xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                {editingId ? (
                  <Pencil size={16} className="text-yellow-500" />
                ) : (
                  <Plus size={16} className="text-blue-500" />
                )}
                {editingId ? "Edit Method" : "Add Connection"}
              </h2>
              {editingId && (
                <button
                  onClick={handleCancel}
                  className="text-zinc-500 hover:text-white transition-colors"
                >
                  <X size={16} />
                </button>
              )}
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">
                  Platform
                </label>
                <div className="relative">
                  <select
                    className="w-full bg-[#121214] border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white focus:border-white/30 focus:outline-none appearance-none"
                    value={formData.platform}
                    onChange={(e) =>
                      setFormData({ ...formData, platform: e.target.value })
                    }
                  >
                    <option>Email</option>
                    <option>Phone</option>
                    <option>LinkedIn</option>
                    <option>GitHub</option>
                    <option>Twitter</option>
                    <option>Instagram</option>
                    <option>WhatsApp</option>
                    <option>Website</option>
                    <option>Other</option>
                  </select>
                  <div className="absolute right-3 top-3 pointer-events-none text-zinc-500">
                    <Hash size={14} />
                  </div>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">
                  Display Text
                </label>
                <div className="relative group">
                  <AtSign
                    size={14}
                    className="absolute left-3 top-3.5 text-zinc-600 group-focus-within:text-white transition-colors"
                  />
                  <input
                    placeholder="e.g. hello@adnan.dev"
                    className="w-full bg-[#121214] border border-white/10 rounded-lg pl-9 pr-3 py-3 text-sm text-white focus:border-white/30 focus:outline-none placeholder:text-zinc-700"
                    value={formData.value}
                    onChange={(e) =>
                      setFormData({ ...formData, value: e.target.value })
                    }
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">
                  URL / Action
                </label>
                <div className="relative group">
                  <LinkIcon
                    size={14}
                    className="absolute left-3 top-3.5 text-zinc-600 group-focus-within:text-white transition-colors"
                  />
                  <input
                    placeholder="https://... or mailto:..."
                    className="w-full bg-[#121214] border border-white/10 rounded-lg pl-9 pr-3 py-3 text-sm text-white focus:border-white/30 focus:outline-none placeholder:text-zinc-700"
                    value={formData.link}
                    onChange={(e) =>
                      setFormData({ ...formData, link: e.target.value })
                    }
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full cursor-pointer font-bold py-3 rounded-lg transition-colors flex items-center justify-center gap-2 ${
                  editingId
                    ? "bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20 border border-yellow-500/20"
                    : "bg-white text-black hover:bg-zinc-200"
                } ${isSubmitting ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    <span>{editingId ? "Updating..." : "Processing..."}</span>
                  </>
                ) : (
                  <>
                    {editingId ? <Save size={16} /> : <Plus size={16} />}
                    {editingId ? "Update Connection" : "Add Connection"}
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/*  LIST PANEL */}
        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4 auto-rows-min">
          {loading ? (
            [1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="h-24 rounded-xl bg-[#0e0e10] animate-pulse border border-white/5"
              />
            ))
          ) : (
            <AnimatePresence>
              {contacts.map((contact) => {
                const style = getPlatformConfig(contact.platform);
                return (
                  <motion.div
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    key={contact._id}
                    className={`group bg-[#0e0e10] p-4 rounded-xl border border-white/5 transition-all duration-300 flex justify-between items-center hover:-translate-y-1 ${style.hoverBorder} ${style.hoverShadow}`}
                  >
                    <div className="flex items-center gap-4 overflow-hidden">
                      <div
                        className={`p-3 rounded-lg ${style.bg} ${style.color} border ${style.border}`}
                      >
                        {style.icon}
                      </div>
                      <div className="min-w-0">
                        <h3 className="font-bold text-white text-sm tracking-tight">
                          {contact.platform}
                        </h3>
                        <p className="text-zinc-500 text-xs truncate font-mono mt-0.5 max-w-37.5 sm:max-w-50">
                          {contact.value}
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-2 pl-4 border-l border-white/5 ml-4">
                      <a
                        href={contact.link}
                        target="_blank"
                        className="p-2 text-zinc-500 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                        title="Test Link"
                      >
                        <ExternalLink size={16} />
                      </a>
                      <button
                        onClick={() => handleEdit(contact)}
                        className="p-2 cursor-pointer text-zinc-500 hover:text-yellow-400 hover:bg-yellow-400/10 rounded-lg transition-colors"
                        title="Edit"
                      >
                        <Pencil size={16} />
                      </button>
                      <button
                        onClick={() => setDeleteId(contact._id)}
                        className="p-2 cursor-pointer text-zinc-500 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
                        title="Delete"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          )}
        </div>
      </div>

      <Toast
        message={toast?.message || null}
        type={toast?.type || "success"}
        onClose={() => setToast(null)}
      />

      <ConfirmModal
        isOpen={!!deleteId}
        title="Terminate Connection?"
        message="This action will permanently delete this contact method from your portfolio database."
        confirmText="Confirm Delete"
        onConfirm={confirmDelete}
        onCancel={() => setDeleteId(null)}
        isDanger={true}
      />
    </div>
  );
}
