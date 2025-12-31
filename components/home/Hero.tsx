"use client";
import { useRef, useEffect, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import Image from "next/image";
import {
  Terminal,
  Database,
  Code,
  Cpu,
  Command,
  Wifi,
  ShieldCheck,
  Activity,
  Volume2,
  VolumeX,
} from "lucide-react";
import Typed from "typed.js";

export default function Hero({ heroImage }: { heroImage: string }) {
  const container = useRef(null);
  const typedRef = useRef(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // AUDIO STATE
  const [isMuted, setIsMuted] = useState(false);

  // Initialize & Attempt Autoplay
  useEffect(() => {
    audioRef.current = new Audio("/audio/startup.mp3");
    audioRef.current.loop = true;
    audioRef.current.volume = 0.4;

    const playPromise = audioRef.current.play();

    if (playPromise !== undefined) {
      playPromise.catch((error) => {
        console.log("Autoplay prevented:", error);
        setIsMuted(true);
      });
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    const enableAudio = () => {
      if (!audioRef.current) return;

      audioRef.current
        .play()
        .then(() => setIsMuted(false))
        .catch(() => {});

      window.removeEventListener("click", enableAudio);
    };

    window.addEventListener("click", enableAudio);
    return () => window.removeEventListener("click", enableAudio);
  }, []);

  // Handle User Toggle
  const toggleAudio = () => {
    if (!audioRef.current) return;

    if (isMuted) {
      audioRef.current.play();
      setIsMuted(false);
    } else {
      audioRef.current.pause();
      setIsMuted(true);
    }
  };

  useGSAP(
    () => {
      const tl = gsap.timeline({ defaults: { ease: "power4.out" } });
      tl.fromTo(
        ".hero-core",
        { scale: 0, rotation: -180, opacity: 0 },
        {
          scale: 1,
          rotation: 0,
          opacity: 1,
          duration: 1.5,
          ease: "elastic.out(1, 0.5)",
        }
      );
      tl.fromTo(
        ".core-ring",
        { scale: 0, opacity: 0 },
        { scale: 1, opacity: 1, stagger: 0.1, duration: 1.2 },
        "-=1.2"
      );
      tl.fromTo(
        ".sys-module",
        { scale: 0, x: 0, y: 0, opacity: 0 },
        {
          scale: 1,
          opacity: 1,
          stagger: 0.1,
          duration: 1.2,
          ease: "back.out(1.7)",
        },
        "-=1"
      );
      tl.fromTo(
        ".hero-text",
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, stagger: 0.1, duration: 0.8 },
        "-=0.8"
      );
      tl.fromTo(
        ".hud-widget",
        { y: -20, opacity: 0 },
        { y: 0, opacity: 1, stagger: 0.1, duration: 1 },
        "-=1"
      );

      const handleMouseMove = (e: MouseEvent) => {
        const { clientX, clientY } = e;
        const x = (clientX / window.innerWidth - 0.5) * 40;
        const y = (clientY / window.innerHeight - 0.5) * 40;
        gsap.to(".hero-core", { x: x * 0.5, y: y * 0.5, duration: 1 });
        gsap.to(".sys-module", { x: -x, y: -y, duration: 1.5 });
        gsap.to(".bg-grid", { x: -x * 0.5, y: -y * 0.5, duration: 2 });
      };
      window.addEventListener("mousemove", handleMouseMove);
      return () => window.removeEventListener("mousemove", handleMouseMove);
    },
    { scope: container }
  );

  useEffect(() => {
    const typed = new Typed(typedRef.current, {
      strings: [
        "Full Stack Developer.",
        "MERN Stack Specialist.",
        "Java & DSA Enthusiast.",
        "System Architect.",
      ],
      typeSpeed: 40,
      backSpeed: 30,
      backDelay: 2000,
      loop: true,
      showCursor: true,
      cursorChar: "▋",
    });
    return () => typed.destroy();
  }, []);

  const handleTextMouseMove = (e: React.MouseEvent<HTMLHeadingElement>) => {
    if (!titleRef.current) return;
    const rect = titleRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    titleRef.current.style.setProperty("--x", `${x}px`);
    titleRef.current.style.setProperty("--y", `${y}px`);
  };

  return (
    <section
      ref={container}
      className="h-screen w-full relative flex flex-col justify-center items-center overflow-hidden bg-[#09090b]"
    >
      {/* AUDIO TOGGLE */}
      <button
        onClick={toggleAudio}
        className="absolute bottom-6 md:bottom-10 right-6 md:right-12 z-50 flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/40 backdrop-blur-md border border-white/10 hover:bg-white/10 hover:border-emerald-500/50 transition-all duration-300 group shadow-lg"
      >
        {isMuted ? (
          <>
            <VolumeX
              size={14}
              className="text-zinc-500 group-hover:text-red-400"
            />
            <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest group-hover:text-zinc-300">
              Muted
            </span>
          </>
        ) : (
          <>
            <Volume2 size={14} className="text-emerald-500 animate-pulse" />
            <span className="text-[9px] font-mono text-emerald-500 uppercase tracking-widest">
              System_Audio
            </span>
            <div className="flex items-end gap-0.5 h-3">
              <div className="w-0.5 bg-emerald-500 animate-bounce h-2" />
              <div className="w-0.5 bg-emerald-500 animate-[bounce_1.2s_infinite] h-3" />
              <div className="w-0.5 bg-emerald-500 animate-[bounce_0.8s_infinite] h-1.5" />
            </div>
          </>
        )}
      </button>

      {/* Background */}
      <div className="bg-grid absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-size[30px_30px] md:bg-size[40px_40px] pointer-events-none transform scale-110" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-75 h-75 md:w-200 md:h-200 bg-indigo-500/10 blur-[100px] md:blur-[150px] rounded-full pointer-events-none" />

      {/* HUD Widgets */}
      <div className="absolute top-20 md:top-24 left-4 md:left-12 flex flex-col gap-2 z-30 opacity-70 md:opacity-100 scale-90 md:scale-100 origin-top-left">
        <div className="hud-widget flex items-center gap-3 text-[10px] md:text-xs font-mono text-zinc-500">
          <Activity size={12} className="text-emerald-500" />
          <span>SYS_UPTIME: 99.9%</span>
        </div>
        <div className="hud-widget flex items-center gap-3 text-[10px] md:text-xs font-mono text-zinc-500">
          <Cpu size={12} className="text-indigo-500" />
          <span>CPU_LOAD: OPTIMAL</span>
        </div>
      </div>

      <div className="absolute top-20 md:top-24 right-4 md:right-12 text-right z-30 scale-90 md:scale-100 origin-top-right">
        <div className="hud-widget inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[9px] md:text-[10px] font-mono tracking-widest uppercase text-zinc-400">
          <span>ADNAN.OS</span>
          <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
        </div>
      </div>

      {/* Centerpiece */}
      <div className="z-20 flex flex-col items-center justify-center relative mb-8 md:mb-12 mt-4">
        {/* Rings */}
        <div className="core-ring absolute w-72.5 h-72.5 md:w-125 md:h-125 rounded-full border border-white/5 animate-[spin_20s_linear_infinite]" />
        <div className="core-ring absolute w-57.5 h-57.5 md:w-95 md:h-95 rounded-full border border-dashed border-white/10 opacity-30 animate-[spin_15s_linear_infinite_reverse]" />

        {/* Modules */}
        <div className="sys-module mod-tl absolute -top-12 -left-10 md:top-0 md:-left-48">
          <div className="flex items-center gap-2 md:gap-3 px-3 py-1.5 md:px-4 md:py-2 bg-[#09090b]/80 backdrop-blur-md border border-white/10 rounded-xl shadow-xl hover:border-indigo-500/50 transition-colors group cursor-default">
            <div className="p-1.5 bg-indigo-500/20 rounded-lg text-indigo-400 group-hover:scale-110 transition-transform">
              <Database size={14} className="md:w-4 md:h-4" />
            </div>
            <div className="hidden md:block">
              <div className="text-[10px] font-bold text-zinc-300">Backend</div>
              <div className="text-[8px] font-mono text-zinc-600">
                NODE / MONGODB
              </div>
            </div>
          </div>
        </div>
        <div className="sys-module mod-tr absolute -top-12 -right-10 md:top-0 md:-right-48">
          <div className="flex items-center gap-2 md:gap-3 px-3 py-1.5 md:px-4 md:py-2 bg-[#09090b]/80 backdrop-blur-md border border-white/10 rounded-xl shadow-xl hover:border-emerald-500/50 transition-colors group cursor-default">
            <div className="hidden md:block text-right">
              <div className="text-[10px] font-bold text-zinc-300">
                Frontend
              </div>
              <div className="text-[8px] font-mono text-zinc-600">
                REACT / NEXT
              </div>
            </div>
            <div className="p-1.5 bg-emerald-500/20 rounded-lg text-emerald-400 group-hover:scale-110 transition-transform">
              <Code size={14} className="md:w-4 md:h-4" />
            </div>
          </div>
        </div>
        <div className="sys-module mod-bl absolute -bottom-4 -left-12 md:-bottom-10 md:-left-40">
          <div className="flex items-center gap-2 md:gap-3 px-3 py-1.5 md:px-4 md:py-2 bg-[#09090b]/80 backdrop-blur-md border border-white/10 rounded-xl shadow-xl hover:border-sky-500/50 transition-colors group cursor-default">
            <div className="p-1.5 bg-sky-500/20 rounded-lg text-sky-400 group-hover:scale-110 transition-transform">
              <Wifi size={14} className="md:w-4 md:h-4" />
            </div>
            <div className="hidden md:block">
              <div className="text-[10px] font-bold text-zinc-300">Network</div>
              <div className="text-[8px] font-mono text-zinc-600">
                REST / GRAPHQL
              </div>
            </div>
          </div>
        </div>
        <div className="sys-module mod-br absolute -bottom-4 -right-12 md:-bottom-10 md:-right-40">
          <div className="flex items-center gap-2 md:gap-3 px-3 py-1.5 md:px-4 md:py-2 bg-[#09090b]/80 backdrop-blur-md border border-white/10 rounded-xl shadow-xl hover:border-red-500/50 transition-colors group cursor-default">
            <div className="hidden md:block text-right">
              <div className="text-[10px] font-bold text-zinc-300">
                Security
              </div>
              <div className="text-[8px] font-mono text-zinc-600">
                JWT / OAUTH
              </div>
            </div>
            <div className="p-1.5 bg-red-500/20 rounded-lg text-red-400 group-hover:scale-110 transition-transform">
              <ShieldCheck size={14} className="md:w-4 md:h-4" />
            </div>
          </div>
        </div>

        {/* Profile Core */}
        <div className="hero-core relative w-40 h-40 md:w-60 md:h-60 z-20 group">
          <div className="absolute inset-0 bg-indigo-500/20 rounded-full blur-2xl group-hover:bg-indigo-500/30 transition-all duration-500" />
          <div className="absolute -inset-3 rounded-full border border-white/5" />
          <div className="absolute -inset-6 rounded-full border border-white/5 opacity-40" />
          <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-indigo-500/50 border-r-indigo-500/50 rotate-45 group-hover:rotate-25 transition-transform duration-1000 ease-in-out" />
          <div className="relative w-full h-full rounded-full overflow-hidden border-4 border-[#09090b] shadow-2xl">
            {heroImage ? (
              <Image
                src={heroImage}
                alt="System User"
                fill
                className="object-cover scale-105 group-hover:scale-110 transition-transform duration-700"
                priority
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-zinc-900 text-zinc-600 font-mono">
                NO_DATA
              </div>
            )}
            {/* HOLOGRAPHIC SCAN LINE */}
            <div className="absolute top-0 left-0 w-full h-full bg-linear-to-b from-transparent via-emerald-500/10 to-transparent animate-scan pointer-events-none" />
            <div className="absolute top-0 left-0 w-full h-0.5 bg-emerald-400/50 shadow-[0_0_15px_rgba(52,211,153,0.8)] animate-scan-line pointer-events-none" />
          </div>
          <div className="absolute bottom-2 right-4 px-2 py-0.5 bg-black/80 backdrop-blur rounded text-[8px] md:text-[9px] font-mono text-emerald-400 border border-emerald-500/30 shadow-lg">
            ONLINE
          </div>
        </div>
      </div>

      {/* Text Interface */}
      <div className="text-center space-y-4 md:space-y-6 relative z-30 px-4 w-full max-w-4xl">
        <div className="hero-text inline-flex items-center justify-center gap-2 text-zinc-500 font-mono text-[10px] md:text-sm mb-2 bg-white/5 px-3 py-1 md:px-4 md:py-1.5 rounded-lg border border-white/5 mx-auto">
          <Terminal size={12} className="text-emerald-500 md:w-3.5 md:h-3.5" />
          <span>root@adnan.os:~#</span>
          <span className="text-zinc-300">init_portfolio.sh</span>
        </div>

        {/* --- DUAL MODE TITLE --- */}
        <div className="relative group cursor-default">
          {/* 1. MOBILE ONLY: Static, Bright Text (No Mask) */}
          <h1 className="hero-text text-4xl sm:text-6xl font-black text-white tracking-tighter md:hidden">
            Adnan{" "}
            <span className="text-transparent bg-clip-text bg-linear-to-r from-zinc-200 to-zinc-400">
              Qureshi
            </span>
          </h1>

          {/* 2. LAPTOP/DESKTOP ONLY: Torch/Spotlight Effect */}
          <div className="hidden md:block">
            <h1 className="hero-text text-6xl md:text-8xl font-black text-zinc-800 tracking-tighter">
              Adnan Qureshi
            </h1>
            <h1
              ref={titleRef}
              onMouseMove={handleTextMouseMove}
              className="hero-text text-6xl md:text-8xl font-black tracking-tighter absolute top-0 left-0 w-full text-white pointer-events-auto"
              style={{
                maskImage:
                  "radial-gradient(circle 100px at var(--x, 50%) var(--y, 50%), black 20%, transparent 100%)",
                WebkitMaskImage:
                  "radial-gradient(circle 100px at var(--x, 50%) var(--y, 50%), black 20%, transparent 100%)",
              }}
            >
              Adnan{" "}
              <span className="text-transparent bg-clip-text bg-linear-to-r from-zinc-200 to-zinc-400">
                Qureshi
              </span>
            </h1>
          </div>
        </div>

        <div className="hero-text h-6 md:h-8 flex justify-center items-center">
          <span className="text-base sm:text-xl md:text-2xl text-indigo-400 font-mono font-bold tracking-tight">
            <span ref={typedRef}></span>
          </span>
        </div>

        <p className="hero-text text-zinc-400 max-w-xs sm:max-w-lg mx-auto text-xs md:text-sm leading-relaxed pt-2 px-2">
          Architecting scalable digital ecosystems with robust backend protocols
          and high-performance frontend interfaces.
        </p>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-6 md:bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 md:gap-3 opacity-40 animate-pulse z-20">
        <span className="text-[8px] md:text-[9px] font-mono uppercase tracking-widest text-zinc-500">
          System Ready
        </span>
        <Command size={14} className="text-zinc-500 md:w-4 md:h-4" />
      </div>

      <style jsx global>{`
        @keyframes scanLine {
          0% {
            top: -10%;
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          90% {
            opacity: 1;
          }
          100% {
            top: 110%;
            opacity: 0;
          }
        }
        .animate-scan-line {
          animation: scanLine 4s cubic-bezier(0.4, 0, 0.2, 1) infinite;
        }
        .animate-scan {
          animation: scanLine 4s cubic-bezier(0.4, 0, 0.2, 1) infinite;
        }
      `}</style>
    </section>
  );
}
