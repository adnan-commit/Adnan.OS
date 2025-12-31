"use client";
import { useState, useRef } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  Layers,
  Layout,
  Server,
  Database,
  Settings,
  Terminal,
} from "lucide-react";

// Categories for the OS Tabs
const CATEGORIES = [
  { id: "all", label: "ALL_MODULES", icon: Layers },
  { id: "frontend", label: "UI_LAYER", icon: Layout },
  { id: "backend", label: "KERNEL", icon: Server },
  { id: "database", label: "MEMORY", icon: Database },
  { id: "tools", label: "UTILS", icon: Settings },
];

export default function TechStack({ skills = [] }: { skills: any[] }) {
  const [activeTab, setActiveTab] = useState("all");
  const containerRef = useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  // 1. Filter Logic
  const filteredSkills = skills.filter((skill) => {
    if (activeTab === "all") return true;
    const cat = skill.category?.toLowerCase() || "";
    if (activeTab === "frontend")
      return cat.includes("front") || cat.includes("web");
    if (activeTab === "backend") return cat.includes("back");
    if (activeTab === "database")
      return cat.includes("data") || cat.includes("db");
    if (activeTab === "tools")
      return cat.includes("tool") || cat.includes("devops");
    return false;
  });

  // 2. Spotlight Effect Logic
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      setMousePosition({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    }
  };

  return (
    <section className="py-20 md:py-32 bg-[#09090b] relative overflow-hidden min-h-screen flex flex-col items-center">
      {/* Background Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-size[30px_30px] md:bg-size[40px_40px] pointer-events-none" />

      {/* HEADER */}
      <div className="relative z-10 text-center mb-10 md:mb-16 px-4">
        {/* Terminal Command Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 md:px-4 md:py-1.5 rounded-full bg-black/40 border border-white/10 text-zinc-400 text-[10px] font-mono tracking-widest uppercase mb-4 md:mb-6 shadow-inner">
          <Terminal size={12} className="text-emerald-500 animate-pulse" />
          <span className="text-zinc-500 hidden sm:inline">
            root@adnan:~/modules#
          </span>
          <span className="text-white">list --installed</span>
        </div>

        {/* Clear Title */}
        <h2 className="text-3xl sm:text-4xl md:text-6xl font-black text-white tracking-tighter mb-4">
          SYSTEM{" "}
          <span className="text-transparent bg-clip-text bg-linear-to-r from-indigo-500 to-purple-500">
            STACK
          </span>
        </h2>

        {/* Functional Description */}
        <p className="text-zinc-500 font-mono text-xs md:text-sm max-w-lg mx-auto leading-relaxed px-2">
          <span className="text-indigo-400">Status:</span> All dependencies
          loaded.
          <br className="hidden md:block" /> The languages, frameworks, and
          tools powering my development environment.
        </p>
      </div>

      {/* FILTER TABS  */}
      <div className="flex flex-wrap justify-center gap-2 md:gap-3 mb-10 md:mb-12 relative z-10 px-4">
        {CATEGORIES.map((cat) => {
          const Icon = cat.icon;
          const isActive = activeTab === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setActiveTab(cat.id)}
              className={`relative px-3 py-1.5 md:px-4 md:py-2 rounded-lg border text-[10px] md:text-xs font-bold font-mono tracking-wider transition-all duration-300 flex items-center gap-2 uppercase ${
                isActive
                  ? "bg-white text-black border-white shadow-[0_0_20px_rgba(255,255,255,0.3)]"
                  : "bg-black/40 text-zinc-500 border-white/10 hover:text-white hover:border-white/30"
              }`}
            >
              <Icon size={12} className="hidden sm:block" />
              {cat.label}
            </button>
          );
        })}
      </div>

      {/* THE HOLOGRAPHIC GRID */}
      <div
        ref={containerRef}
        onMouseMove={handleMouseMove}
        className="relative max-w-6xl w-full px-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-4 group"
      >
        {/* Spotlight Overlay (Global) */}
        <div
          className="pointer-events-none absolute -inset-px opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-0"
          style={{
            background: `radial-gradient(600px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(99, 102, 241, 0.10), transparent 40%)`,
          }}
        />

        <AnimatePresence mode="popLayout">
          {filteredSkills.map((skill) => (
            <SkillCard
              key={skill._id}
              skill={skill}
              mouseX={mousePosition.x}
              mouseY={mousePosition.y}
            />
          ))}
        </AnimatePresence>
      </div>
    </section>
  );
}

// INDIVIDUAL CARD COMPONENT
function SkillCard({
  skill,
  mouseX,
  mouseY,
}: {
  skill: any;
  mouseX: number;
  mouseY: number;
}) {
  const cardRef = useRef<HTMLDivElement>(null);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.2 }}
      ref={cardRef}
      className="relative h-28 md:h-32 bg-[#0e0e10]/80 border border-white/5 rounded-xl overflow-hidden flex flex-col items-center justify-center gap-2 md:gap-3 p-3 md:p-4 hover:border-white/20 transition-colors group/card backdrop-blur-sm"
    >
      {/* Inner "Spotlight" for Border */}
      <div
        className="absolute inset-0 opacity-0 group-hover/card:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{
          background: `radial-gradient(400px circle at ${
            mouseX - (cardRef.current?.offsetLeft || 0)
          }px ${
            mouseY - (cardRef.current?.offsetTop || 0)
          }px, rgba(255, 255, 255, 0.05), transparent 40%)`,
        }}
      />

      {/* Icon */}
      {/* UPDATE: grayscale-0 on mobile (colorful), grayscale on desktop until hover */}
      <div className="relative w-8 h-8 md:w-10 md:h-10 grayscale-0 md:grayscale md:group-hover/card:grayscale-0 transition-all duration-300 z-10">
        <Image
          src={skill.badge}
          alt={skill.name}
          fill
          className="object-contain drop-shadow-[0_0_10px_rgba(255,255,255,0.2)]"
        />
      </div>

      {/* Text Info */}
      <div className="text-center z-10">
        <h4 className="text-zinc-200 md:text-zinc-400 font-bold text-[10px] md:text-xs group-hover/card:text-white transition-colors uppercase tracking-wide truncate max-w-30">
          {skill.name}
        </h4>

        {/* UPDATE: opacity-100 on mobile, opacity-0 on desktop until hover */}
        <div className="flex items-center justify-center gap-2 mt-2 opacity-100 md:opacity-0 group-hover/card:opacity-100 transition-opacity duration-300">
          <div className="px-1.5 py-0.5 rounded bg-emerald-500/20 border border-emerald-500/30 text-[8px] font-mono text-emerald-400">
            INSTALLED
          </div>
        </div>
      </div>

      {/* Tech Decoration (Corner Lines) */}
      <div className="absolute top-2 left-2 w-1.5 h-1.5 border-t border-l border-white/10 group-hover/card:border-indigo-500/50 transition-colors" />
      <div className="absolute bottom-2 right-2 w-1.5 h-1.5 border-b border-r border-white/10 group-hover/card:border-indigo-500/50 transition-colors" />
    </motion.div>
  );
}
