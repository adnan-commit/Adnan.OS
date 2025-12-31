"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, XCircle } from "lucide-react";

type ToastType = "success" | "error";

interface ToastProps {
  message: string | null;
  type: ToastType;
  onClose: () => void;
}

export default function Toast({ message, type, onClose }: ToastProps) {
  useEffect(() => {
    if (message) {
      const timer = setTimeout(onClose, 3000); // Auto-close after 3s
      return () => clearTimeout(timer);
    }
  }, [message, onClose]);

  return (
    <AnimatePresence>
      {message && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.9 }}
          className={`fixed bottom-6 right-6 z-100 flex items-center gap-3 px-5 py-4 rounded-xl border shadow-2xl backdrop-blur-md ${
            type === "success"
              ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
              : "bg-red-500/10 border-red-500/20 text-red-400"
          }`}
        >
          {type === "success" ? (
            <CheckCircle2 size={20} />
          ) : (
            <XCircle size={20} />
          )}
          <div>
            <h4 className="text-sm font-bold">
              {type === "success" ? "System Success" : "System Error"}
            </h4>
            <p className="text-xs opacity-90">{message}</p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
