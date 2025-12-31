"use client";

import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle } from "lucide-react";

interface ConfirmModalProps {
  isOpen: boolean;
  title?: string;
  message?: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmText?: string;
  cancelText?: string;
  isDanger?: boolean; // If true, uses red styles. If false, uses blue/neutral.
}

export default function ConfirmModal({
  isOpen,
  title = "Are you sure?",
  message = "This action cannot be undone.",
  onConfirm,
  onCancel,
  confirmText = "Confirm",
  cancelText = "Cancel",
  isDanger = true,
}: ConfirmModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className={`bg-[#09090b] w-full max-w-sm rounded-2xl border shadow-[0_0_50px_rgba(0,0,0,0.5)] overflow-hidden ${
              isDanger ? "border-red-500/20" : "border-white/10"
            }`}
          >
            <div className="p-6 text-center">
              <div
                className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 border ${
                  isDanger
                    ? "bg-red-500/10 border-red-500/20 text-red-500"
                    : "bg-blue-500/10 border-blue-500/20 text-blue-500"
                }`}
              >
                <AlertTriangle size={32} />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">{title}</h3>
              <p className="text-sm text-zinc-400 mb-6">{message}</p>
              <div className="flex gap-3">
                <button
                  onClick={onCancel}
                  className="flex-1 py-3 rounded-lg bg-white/5 hover:bg-white/10 text-white text-sm font-medium transition-colors"
                >
                  {cancelText}
                </button>
                <button
                  onClick={onConfirm}
                  className={`flex-1 py-3 rounded-lg text-white text-sm font-bold transition-colors shadow-lg ${
                    isDanger
                      ? "bg-red-500 hover:bg-red-600 shadow-red-500/20"
                      : "bg-blue-600 hover:bg-blue-700 shadow-blue-500/20"
                  }`}
                >
                  {confirmText}
                </button>
              </div>
            </div>
            {isDanger && (
              <div className="h-1 w-full bg-linear-to-r from-red-900 via-red-600 to-red-900"></div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
