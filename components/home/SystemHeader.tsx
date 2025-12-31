"use client";
import { useState, useEffect } from "react";
import { Battery, BatteryCharging, Calendar, Globe, Zap } from "lucide-react";
import { motion } from "framer-motion";
import Image from "next/image";

export default function SystemHeader() {
  const [time, setTime] = useState("");
  const [date, setDate] = useState("");
  const [mounted, setMounted] = useState(false);

  // Real System Data States
  const [batteryLevel, setBatteryLevel] = useState<number | null>(null);
  const [isCharging, setIsCharging] = useState(false);
  const [location, setLocation] = useState("Unknown Region");
  const [connectionType, setConnectionType] = useState("Online");

  useEffect(() => {
    setMounted(true);

    //  Real-Time Clock & Date
    const updateTime = () => {
      const now = new Date();
      setTime(
        now.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        })
      );
      setDate(
        now.toLocaleDateString([], {
          weekday: "short",
          month: "short",
          day: "numeric",
        })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);

    //  Real Location (Timezone based to avoid permissions)
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    setLocation(tz.replace("_", " "));

    //  Real Battery Status (Web API)
    // @ts-ignore - Navigator.getBattery is experimental but works in Chrome/Edge
    if (typeof navigator.getBattery === "function") {
      // @ts-ignore
      navigator.getBattery().then((battery) => {
        const updateBattery = () => {
          setBatteryLevel(Math.round(battery.level * 100));
          setIsCharging(battery.charging);
        };
        updateBattery();
        battery.addEventListener("levelchange", updateBattery);
        battery.addEventListener("chargingchange", updateBattery);
      });
    } else {
      setBatteryLevel(100); // Fallback for unsupported browsers
    }

    // 4. Real Network Status
    // @ts-ignore
    if (navigator.connection) {
      // @ts-ignore
      setConnectionType(
        navigator.connection.effectiveType?.toUpperCase() || "WIFI"
      );
    }

    return () => clearInterval(interval);
  }, []);

  if (!mounted) return null;

  return (
    <motion.div
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 1.5, type: "spring", stiffness: 100, damping: 20 }}
      className="fixed top-6 left-0 w-full z-50 flex justify-center px-4 pointer-events-none"
    >
      <div className="pointer-events-auto flex items-center gap-6 md:gap-8 px-5 py-2.5 rounded-full bg-zinc-900/60 backdrop-blur-xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.3)] hover:border-indigo-500/30 transition-all duration-500 group relative overflow-hidden">
        {/* Subtle Gradient Glow Background */}
        <div className="absolute inset-0 bg-linear-to-r from-indigo-500/10 via-purple-500/10 to-emerald-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

        {/* LEFT: Identity */}
        <div className="flex items-center gap-3 relative z-10">
          <div className="relative w-8 h-8 flex items-center justify-center bg-linear-to-tr from-white/10 to-white/5 rounded-full border border-white/10 shadow-inner">
            <div className="w-5 h-5 relative group-hover:scale-110 transition-transform duration-300">
              <Image
                src="/icon.svg"
                alt="Logo"
                width={20}
                height={20}
                className="object-contain w-full h-full drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]"
              />
            </div>
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-white tracking-[0.2em] uppercase font-mono group-hover:text-indigo-300 transition-colors">
              Adnan.OS
            </span>
            <div className="flex items-center gap-1.5">
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
              </span>
              <span className="text-[8px] text-emerald-500 font-mono font-medium tracking-wide">
                ONLINE
              </span>
            </div>
          </div>
        </div>

        {/* CENTER: Real System Stats */}
        <div className="hidden md:flex items-center gap-6 px-6 border-x border-white/5 relative z-10">
          {/* Date */}
          <div className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors">
            <Calendar size={12} className="text-purple-400" />
            <span className="text-[10px] font-mono font-medium uppercase tracking-wider">
              {date}
            </span>
          </div>

          {/* Location */}
          <div className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors">
            <Globe size={12} className="text-blue-400" />
            <span className="text-[10px] font-mono font-medium uppercase tracking-wider truncate max-w-30">
              {location}
            </span>
          </div>

          {/* Network */}
          <div className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors">
            <Zap size={12} className="text-yellow-400" />
            <span className="text-[10px] font-mono font-medium uppercase tracking-wider">
              NET: {connectionType}
            </span>
          </div>
        </div>

        {/* RIGHT: Time & Battery */}
        <div className="flex items-center gap-4 relative z-10">
          <div className="flex items-center gap-2 text-zinc-300">
            <span className="font-mono text-xs font-bold tabular-nums tracking-wide">
              {time}
            </span>
          </div>

          <div className="h-4 w-px bg-white/10" />

          <div
            className={`flex items-center gap-2 ${
              isCharging ? "text-emerald-400" : "text-zinc-400"
            } transition-colors`}
          >
            <span className="text-[10px] font-mono font-bold">
              {batteryLevel}%
            </span>
            {isCharging ? <BatteryCharging size={14} /> : <Battery size={14} />}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
