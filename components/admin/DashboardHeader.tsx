"use client";

import { useState, useEffect } from "react";
import { Sun, Moon, Sunrise, Sunset, Calendar, Clock } from "lucide-react";

export default function DashboardHeader() {
  const [mounted, setMounted] = useState(false);
  const [date, setDate] = useState<Date | null>(null);

  useEffect(() => {
    setMounted(true);
    setDate(new Date());
    const timer = setInterval(() => setDate(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  if (!mounted || !date) {
    return (
      <div className="animate-pulse space-y-2">
        <div className="h-8 w-48 bg-white/5 rounded"></div>
        <div className="flex gap-2">
          <div className="h-6 w-24 bg-white/5 rounded"></div>
          <div className="h-6 w-32 bg-white/5 rounded"></div>
        </div>
      </div>
    );
  }

  const hour = date.getHours();
  let greeting = "Good Evening";
  let Icon = Moon;
  let gradient = "from-indigo-400 to-purple-400";

  if (hour >= 5 && hour < 12) {
    greeting = "Good Morning";
    Icon = Sunrise;
    gradient = "from-orange-400 to-amber-400";
  } else if (hour >= 12 && hour < 17) {
    greeting = "Good Afternoon";
    Icon = Sun;
    gradient = "from-blue-400 to-cyan-400";
  } else if (hour >= 17 && hour < 21) {
    greeting = "Good Evening";
    Icon = Sunset;
    gradient = "from-purple-400 to-pink-400";
  } else {
    greeting = "Good Night";
    Icon = Moon;
    gradient = "from-indigo-400 to-slate-400";
  }

  // Date Formatter
  const formattedDate = date.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  // Time Formatter
  const formattedTime = date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  return (
    <div>
      {/* Greeting Section */}
      <h1 className="text-2xl md:text-3xl font-medium text-white tracking-tight flex items-center gap-3">
        {greeting},{" "}
        <span
          className={`font-bold text-transparent bg-clip-text bg-linear-to-r ${gradient}`}
        >
          Adnan
        </span>
        <Icon size={24} className={`text-zinc-500 hidden md:block`} />
      </h1>

      {/* System Status Bar */}
      <div className="flex flex-wrap items-center gap-2 mt-3">
        {/* Time Pill */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-[#121214] border border-white/5 text-zinc-400 text-xs md:text-sm font-mono shadow-sm">
          <Clock size={14} className="text-blue-500" />
          <span>{formattedTime}</span>
        </div>

        {/* Date Pill */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-[#121214] border border-white/5 text-zinc-400 text-xs md:text-sm font-mono shadow-sm">
          <Calendar size={14} className="text-purple-500" />
          <span>{formattedDate}</span>
        </div>

        {/* Live Indicator (Hidden on very small screens to save space) */}
        <div className="hidden sm:flex items-center gap-2 px-3 text-zinc-500 text-xs font-medium">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          System Active
        </div>
      </div>
    </div>
  );
}
