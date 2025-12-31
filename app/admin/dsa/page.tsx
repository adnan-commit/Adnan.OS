"use client";

import { useState, useEffect } from "react";
import {
  Plus,
  Trash2,
  ExternalLink,
  LineChart,
  Code2,
  Trophy,
  BarChart3,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface DsaStat {
  _id: string;
  platform: string;
  rating: string;
  problemsSolved: number;
  profileLink: string;
}


const getPlatformStyle = (platform: string) => {
  const p = platform.toLowerCase();
  if (p.includes("leetcode"))
    return {
      color: "text-orange-400",
      bg: "bg-orange-500/10",
      hoverBorder: "hover:border-orange-500/50",
      hoverShadow: "hover:shadow-[0_0_30px_rgba(249,115,22,0.2)]", // Orange Glow
      icon: <Code2 />,
    };
  if (p.includes("codechef"))
    return {
      color: "text-yellow-600",
      bg: "bg-yellow-600/10",
      hoverBorder: "hover:border-yellow-600/50",
      hoverShadow: "hover:shadow-[0_0_30px_rgba(202,138,4,0.2)]", // Yellow Glow
      icon: <Trophy />,
    };
  if (p.includes("codeforces"))
    return {
      color: "text-blue-400",
      bg: "bg-blue-500/10",
      hoverBorder: "hover:border-blue-500/50",
      hoverShadow: "hover:shadow-[0_0_30px_rgba(59,130,246,0.2)]", // Blue Glow
      icon: <BarChart3 />,
    };
  if (p.includes("geeks"))
    return {
      color: "text-green-500",
      bg: "bg-green-500/10",
      hoverBorder: "hover:border-green-500/50",
      hoverShadow: "hover:shadow-[0_0_30px_rgba(34,197,94,0.2)]", // Green Glow
      icon: <Code2 />,
    };
  return {
    color: "text-zinc-400",
    bg: "bg-zinc-800",
    hoverBorder: "hover:border-zinc-500/50",
    hoverShadow: "hover:shadow-[0_0_30px_rgba(113,113,122,0.2)]", // Zinc Glow
    icon: <LineChart />,
  };
};

export default function AdminDSA() {
  const [stats, setStats] = useState<DsaStat[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const [formData, setFormData] = useState({
    platform: "LeetCode",
    rating: "",
    problemsSolved: 0,
    profileLink: "",
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await fetch("/api/dsa");
      const data = await res.json();
      setStats(data);
    } catch (error: any) {
      console.error("Failed to load DSA stats", error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("/api/dsa", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });
    if (res.ok) {
      setFormData({
        platform: "LeetCode",
        rating: "",
        problemsSolved: 0,
        profileLink: "",
      });
      setIsFormOpen(false);
      fetchStats();
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Remove this stat card?")) return;
    await fetch(`/api/dsa/${id}`, { method: "DELETE" });
    setStats(stats.filter((s) => s._id !== id));
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/*  Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-white/5 pb-6">
        <div>
          <h1 className="text-3xl font-medium text-white tracking-tight flex items-center gap-3">
            <LineChart className="text-orange-500" size={28} />
            DSA Analytics
          </h1>
          <p className="text-zinc-400 mt-2 text-sm max-w-lg">
            Track your competitive programming progress across all major
            platforms.
          </p>
        </div>

        {!isFormOpen && (
          <button
            onClick={() => setIsFormOpen(true)}
            className="flex cursor-pointer items-center gap-2 bg-white text-black px-5 py-2.5 rounded-lg text-sm font-bold hover:bg-zinc-200 transition-colors shadow-[0_0_20px_rgba(255,255,255,0.15)]"
          >
            <Plus size={18} /> Add Platform
          </button>
        )}
      </div>

      {/*  Collapsible Form */}
      <AnimatePresence>
        {isFormOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="bg-[#0e0e10] border border-white/10 rounded-xl p-6 relative mb-8">
              <form
                onSubmit={handleSubmit}
                className="flex flex-wrap items-end gap-4"
              >
                <div className="flex-1 min-w-50 space-y-1.5">
                  <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">
                    Platform
                  </label>
                  <select
                    className="w-full bg-[#121214] border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white focus:border-white/30 focus:outline-none"
                    value={formData.platform}
                    onChange={(e) =>
                      setFormData({ ...formData, platform: e.target.value })
                    }
                  >
                    <option>LeetCode</option>
                    <option>CodeChef</option>
                    <option>GeeksForGeeks</option>
                    <option>CodeForces</option>
                    <option>HackerRank</option>
                  </select>
                </div>

                <div className="flex-1 min-w-30 space-y-1.5">
                  <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">
                    Solved
                  </label>
                  <input
                    type="number"
                    className="w-full bg-[#121214] border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white focus:border-white/30 focus:outline-none placeholder:text-zinc-700"
                    value={formData.problemsSolved}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        problemsSolved: parseInt(e.target.value),
                      })
                    }
                  />
                </div>

                <div className="flex-1 min-w-37.5 space-y-1.5">
                  <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">
                    Rating / Rank
                  </label>
                  <input
                    placeholder="e.g. 1650 (Max)"
                    className="w-full bg-[#121214] border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white focus:border-white/30 focus:outline-none placeholder:text-zinc-700"
                    value={formData.rating}
                    onChange={(e) =>
                      setFormData({ ...formData, rating: e.target.value })
                    }
                  />
                </div>

                <div className="flex-2 min-w-62.5 space-y-1.5">
                  <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">
                    Profile URL
                  </label>
                  <input
                    placeholder="https://..."
                    className="w-full bg-[#121214] border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white focus:border-white/30 focus:outline-none placeholder:text-zinc-700"
                    value={formData.profileLink}
                    onChange={(e) =>
                      setFormData({ ...formData, profileLink: e.target.value })
                    }
                  />
                </div>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setIsFormOpen(false)}
                    className="px-4 cursor-pointer py-2.5 rounded-lg text-zinc-400 hover:bg-white/5 hover:text-white transition-colors font-medium text-sm"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 cursor-pointer bg-white text-black rounded-lg font-bold text-sm hover:bg-zinc-200 transition-colors"
                  >
                    Save
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/*  Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {loading ? (
          [1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="h-64 rounded-xl bg-[#0e0e10] animate-pulse border border-white/5"
            />
          ))
        ) : (
          <AnimatePresence>
            {stats.map((stat) => {
              const style = getPlatformStyle(stat.platform);
              return (
                <motion.div
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  key={stat._id}
                  className={`relative group bg-[#0e0e10] border border-white/5 rounded-xl p-6 flex flex-col items-center justify-between min-h-70 transition-all duration-300 hover:-translate-y-1 ${style.hoverBorder} ${style.hoverShadow}`}
                >
                  <div className="relative z-10 w-full flex justify-between items-start">
                    <div className={`p-3 rounded-lg bg-white/5 ${style.color}`}>
                      {style.icon}
                    </div>
                    <button
                      onClick={() => handleDelete(stat._id)}
                      className="text-zinc-600 cursor-pointer hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>

                  <div className="relative z-10 text-center space-y-2 mt-4">
                    <h3 className="text-lg font-bold text-white">
                      {stat.platform}
                    </h3>

                    {/* Circular Progress (Static for now, but visual) */}
                    <div className="relative inline-flex items-center justify-center w-24 h-24">
                      <svg className="transform -rotate-90 w-24 h-24">
                        <circle
                          cx="48"
                          cy="48"
                          r="36"
                          stroke="currentColor"
                          strokeWidth="6"
                          fill="transparent"
                          className="text-zinc-800"
                        />
                        <circle
                          cx="48"
                          cy="48"
                          r="36"
                          stroke="currentColor"
                          strokeWidth="6"
                          fill="transparent"
                          strokeDasharray={226}
                          strokeDashoffset={50} 
                          className={`${style.color}`}
                        />
                      </svg>
                      <span
                        className={`absolute text-2xl font-black ${style.color}`}
                      >
                        {stat.problemsSolved}
                      </span>
                    </div>
                    <p className="text-xs text-zinc-500 font-medium uppercase tracking-wider">
                      Problems Solved
                    </p>
                  </div>

                  <div className="relative z-10 w-full mt-6 space-y-3">
                    {stat.rating && (
                      <div className="flex items-center justify-between text-xs px-3 py-2 bg-white/5 rounded-lg border border-white/5">
                        <span className="text-zinc-400">Rating</span>
                        <span className={`font-mono font-bold ${style.color}`}>
                          {stat.rating}
                        </span>
                      </div>
                    )}

                    <a
                      href={stat.profileLink}
                      target="_blank"
                      className="flex items-center justify-center gap-2 w-full py-2.5 rounded-lg bg-white/5 hover:bg-white/10 text-xs font-bold text-white transition-colors border border-white/5 group-hover:border-white/10"
                    >
                      View Profile <ExternalLink size={12} />
                    </a>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}
