"use client";
import { Cpu, Globe, Server } from "lucide-react";

export default function SystemStats({ skills }: { skills: any[] }) {
  //  Filter Frontend
  const frontend = skills.filter(
    (s) => s.category === "Frontend" || s.category === "Web Technologies"
  );

  //  Filter Backend + Database + Tools + DevOps
  //  check against an array of possible category names to catch everything
  const backendAndInfra = skills.filter((s) =>
    [
      "Backend",
      "Database",
      "Databases",
      "Tools",
      "DevOps",
      "Infrastructure",
      "Cloud",
    ].includes(s.category)
  );

  return (
    <section className="py-32 px-4 md:px-12 max-w-350 mx-auto">
      {/* Header */}
      <div className="mb-12 border-b border-white/10 pb-4 flex justify-between items-end">
        <h3 className="font-mono text-sm text-zinc-500 uppercase tracking-widest">
          /System_Configuration/Skills
        </h3>
        <div className="hidden md:flex gap-2 text-[10px] font-mono text-zinc-600">
          <span>MODULES: {skills.length}</span>
          <span>STATUS: ACTIVE</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 md:grid-rows-2 gap-6 h-auto md:h-[80vh]">
        {/* Main Card - Frontend Architecture */}
        <div className="col-span-1 md:col-span-2 row-span-1 bg-[#0e0e10] border border-white/5 rounded-3xl p-8 hover:border-indigo-500/30 transition-all duration-500 relative overflow-hidden group">
          {/* Background Glow */}
          <div className="absolute top-0 right-0 p-40 bg-indigo-500/5 blur-[100px] rounded-full group-hover:bg-indigo-500/10 transition-colors pointer-events-none" />

          <div className="relative z-10">
            <div className="flex justify-between items-start mb-6">
              <Globe className="text-indigo-500" size={32} />
              <span className="text-xs font-mono text-zinc-600 border border-white/10 px-2 py-1 rounded">
                UI_LAYER
              </span>
            </div>

            <h4 className="text-2xl font-bold text-white mb-6">
              Frontend Architecture
            </h4>

            <div className="flex flex-wrap gap-2">
              {frontend.map((s) => (
                <span
                  key={s._id}
                  className="px-3 py-1.5 rounded bg-white/5 border border-white/5 text-xs md:text-sm text-zinc-300 hover:text-white hover:bg-white/10 hover:border-white/20 transition-all cursor-default"
                >
                  {s.name}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Side Card - Backend, DB, Tools, DevOps */}
        <div className="col-span-1 md:col-span-1 row-span-2 bg-[#0e0e10] border border-white/5 rounded-3xl p-8 hover:border-emerald-500/30 transition-all duration-500 relative overflow-hidden group flex flex-col">
          {/* Background Glow */}
          <div className="absolute bottom-0 left-0 p-40 bg-emerald-500/5 blur-[100px] rounded-full group-hover:bg-emerald-500/10 transition-colors pointer-events-none" />

          <div className="relative z-10 flex-1 flex flex-col min-h-0">
            <div className="flex justify-between items-start mb-6">
              <Server className="text-emerald-500" size={32} />
              <span className="text-xs font-mono text-zinc-600 border border-white/10 px-2 py-1 rounded">
                CORE_SYSTEMS
              </span>
            </div>

            <h4 className="text-2xl font-bold text-white mb-6">
              Backend & <br />
              Infrastructure
            </h4>

            {/* Scrollable container in case there are many tools */}
            <div className="flex-1 overflow-y-auto pr-2 space-y-3 custom-scrollbar">
              {backendAndInfra.map((s) => (
                <div key={s._id} className="flex items-center gap-3 group/item">
                  <div className="w-1.5 h-1.5 bg-zinc-600 rounded-full group-hover/item:bg-emerald-400 group-hover/item:shadow-[0_0_8px_rgba(52,211,153,0.5)] transition-all" />
                  <span className="text-zinc-400 text-sm group-hover/item:text-white transition-colors">
                    {s.name}
                  </span>
                  <span className="ml-auto text-[10px] text-zinc-700 font-mono uppercase opacity-0 group-hover/item:opacity-100 transition-opacity">
                    {s.category === "Backend" ? "API" : "TOOL"}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Card - Philosophy/About */}
        <div className="col-span-1 md:col-span-2 row-span-1 bg-[#0e0e10] border border-white/5 rounded-3xl p-8 flex flex-col justify-center relative overflow-hidden group hover:border-white/20 transition-colors">
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-5" />
          <div className="relative z-10">
            <Cpu
              className="text-zinc-500 mb-6 group-hover:text-white transition-colors"
              size={32}
            />
            <p className="text-lg md:text-2xl font-medium text-zinc-400 leading-relaxed group-hover:text-zinc-200 transition-colors">
              &quot;I engineer performant web systems. My focus is on reducing
              latency, improving UX, and writing clean, maintainable code.&quot;
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
