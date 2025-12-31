"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, ArrowRight, Terminal } from "lucide-react";
import { motion } from "framer-motion";

export default function AdminLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (res.ok) {
        router.push("/admin");
      } else {
        const data = await res.json();
        setError(data.message || "Access Denied");
        setIsLoading(false);
      }
    } catch (err) {
      setError("Connection Error");
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center bg-[#050505] text-white relative overflow-hidden px-6">
      
      {/* Background Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
      
      <div className="w-full max-w-100 relative z-10">
        
        <div className="mb-8 text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-white text-black mb-6 shadow-[0_0_20px_rgba(255,255,255,0.2)]">
            <Terminal size={24} strokeWidth={2.5} />
          </div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">Admin_Console</h1>
          <p className="text-zinc-500 text-sm font-mono">Authenticate to continue...</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="group">
            <label className="text-xs font-mono text-zinc-500 mb-1.5 block group-focus-within:text-white transition-colors">USERNAME</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-[#0a0a0a] border border-white/10 rounded-lg px-4 py-3 text-sm text-white focus:border-white/30 focus:bg-[#0f0f0f] focus:outline-none transition-all placeholder:text-zinc-700 font-mono"
              placeholder="user@system"
            />
          </div>
          
          <div className="group">
            <label className="text-xs font-mono text-zinc-500 mb-1.5 block group-focus-within:text-white transition-colors">PASSWORD</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-[#0a0a0a] border border-white/10 rounded-lg px-4 py-3 text-sm text-white focus:border-white/30 focus:bg-[#0f0f0f] focus:outline-none transition-all placeholder:text-zinc-700 font-mono"
              placeholder="••••••••"
            />
          </div>

          {error && (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-xs text-red-400 font-mono bg-red-500/5 border border-red-500/20 p-3 rounded text-center">
              ⚠ {error}
            </motion.div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-white text-black font-bold h-12 rounded-lg mt-2 hover:bg-zinc-200 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isLoading ? <Loader2 className="animate-spin" size={18} /> : <>ENTER SYSTEM <ArrowRight size={18} /></>}
          </button>
        </form>

        <div className="mt-12 flex justify-center gap-4 text-[10px] text-zinc-600 font-mono uppercase tracking-widest">
           <span>Secure</span>
           <span>•</span>
           <span>Encrypted</span>
        </div>
      </div>
    </div>
  );
}