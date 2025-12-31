"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function SystemBoot({ onComplete }: { onComplete: () => void }) {
  const [lines, setLines] = useState<string[]>([]);
  const bootSequence = [
    "INITIALIZING KERNEL...",
    "LOADING MEMORY MODULES...",
    "MOUNTING FILE SYSTEM...",
    "CONNECTING TO DATABASE...",
    "ADNAN.OS v2.0 READY.",
  ];

  useEffect(() => {
    let delay = 0;
    bootSequence.forEach((line, index) => {
      delay += Math.random() * 300 + 200;
      setTimeout(() => {
        setLines((prev) => [...prev, line]);
        if (index === bootSequence.length - 1) {
          setTimeout(onComplete, 800);
        }
      }, delay);
    });
  }, []);

  return (
    <div className="fixed inset-0 bg-[#09090b] z-100 flex items-end p-10 font-mono text-xs md:text-sm text-green-500/80">
      <div>
        {lines.map((line, i) => (
          <div key={i} className="mb-1">
            <span className="opacity-50 mr-2">
              [{new Date().toLocaleTimeString()}]
            </span>
            {line}
          </div>
        ))}
        <span className="animate-pulse">_</span>
      </div>
    </div>
  );
}
