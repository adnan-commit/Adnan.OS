"use client";
import Link from "next/link";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { AlertTriangle, Terminal, RefreshCcw } from "lucide-react";

export default function NotFound() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // 1. Glitch Animation for 404 Text
    const glitchTimeline = gsap.timeline({ repeat: -1, repeatDelay: 2 });

    glitchTimeline
      .to(".glitch-text", { skewX: 70, ease: "power4.inOut", duration: 0.1 })
      .to(".glitch-text", { skewX: 0, ease: "power4.inOut", duration: 0.1 })
      .to(".glitch-text", { opacity: 0, duration: 0.1 })
      .to(".glitch-text", { opacity: 1, duration: 0.1 })
      .to(".glitch-text", { x: -10, duration: 0.1 })
      .to(".glitch-text", { x: 0, duration: 0.1 });

    // 2. Scanline movement
    gsap.to(".scanline", {
      top: "100%",
      duration: 5,
      ease: "linear",
      repeat: -1,
    });
  }, []);

  return (
    <main
      ref={containerRef}
      className="h-screen w-full bg-[#050505] relative flex flex-col items-center justify-center overflow-hidden font-mono text-zinc-400 selection:bg-red-500/30"
    >
      {/* BACKGROUND FX  */}
      <div className="absolute inset-0 opacity-[0.05] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] pointer-events-none" />

      {/* 2. Red Ambient Glow (Error State) */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-200 h-200 bg-red-500/10 blur-[150px] rounded-full pointer-events-none animate-pulse" />

      {/* 3. Scanline Overlay */}
      <div className="scanline absolute top-0 left-0 w-full h-0.5 bg-white/5 pointer-events-none z-10" />

      {/* CONTENT */}
      <div className="relative z-20 flex flex-col items-center text-center p-6">
        {/* Warning Icon */}
        <div className="mb-8 p-4 bg-red-500/10 rounded-full border border-red-500/20 animate-pulse">
          <AlertTriangle className="text-red-500 w-12 h-12" />
        </div>

        {/* Glitchy 404 */}
        <div className="relative mb-6">
          <h1 className="glitch-text text-9xl md:text-[12rem] font-black text-white leading-none tracking-tighter opacity-90">
            404
          </h1>
          <div className="absolute top-0 left-0 w-full h-full text-red-500 opacity-30 blur-[2px] animate-pulse">
            404
          </div>
        </div>

        {/* Error Message */}
        <div className="space-y-2 mb-10 max-w-md">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/10 rounded text-xs text-red-400 uppercase tracking-widest mb-2">
            <Terminal size={12} />
            <span>Fatal_System_Error</span>
          </div>
          <h2 className="text-2xl font-bold text-white">Signal Lost in Void</h2>
          <p className="text-sm text-zinc-500 leading-relaxed">
            The requested coordinates do not exist within the current system
            architecture. The file may have been corrupted or deleted.
          </p>
        </div>

        {/* Terminal Trace Log (Decorative) */}
        <div className="w-full max-w-sm bg-black/50 border border-white/10 rounded-lg p-4 mb-10 text-left overflow-hidden">
          <div className="flex gap-1.5 mb-3 border-b border-white/5 pb-2">
            <div className="w-2.5 h-2.5 rounded-full bg-red-500/50" />
            <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/50" />
            <div className="w-2.5 h-2.5 rounded-full bg-green-500/50" />
          </div>
          <div className="space-y-1 text-[10px] text-zinc-600 font-mono">
            <p>{">"} initiating_recovery_protocol...</p>
            <p>
              {">"} scanning_sector_7...{" "}
              <span className="text-red-500">FAILED</span>
            </p>
            <p>
              {">"} pinging_endpoint...{" "}
              <span className="text-red-500">TIMEOUT</span>
            </p>
            <p>{">"} error_code: 0x0000404</p>
            <p className="animate-pulse">_</p>
          </div>
        </div>

        {/* Action Button */}
        <Link href="/">
          <button className="group cursor-pointer relative px-8 py-3 bg-white text-black font-bold rounded-xl flex items-center gap-2 hover:scale-105 transition-transform hover:shadow-[0_0_20px_rgba(255,255,255,0.4)]">
            <RefreshCcw
              size={16}
              className="group-hover:rotate-180 transition-transform duration-500"
            />
            <span>SYSTEM REBOOT</span>
          </button>
        </Link>

        <div className="mt-6 text-[10px] text-zinc-700 uppercase tracking-widest">
          Adnan.OS v2.0 // Safe Mode
        </div>
      </div>
    </main>
  );
}
