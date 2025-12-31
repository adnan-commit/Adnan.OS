"use client";
import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { BarChart3, ExternalLink, AlertTriangle } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const getPlatformColor = (platform: string) => {
  const p = platform ? platform.toLowerCase() : "";
  if (p.includes("leetcode"))
    return "text-orange-500 border-orange-500/50 shadow-orange-500/20";
  if (p.includes("codechef"))
    return "text-yellow-500 border-yellow-500/50 shadow-yellow-500/20";
  if (p.includes("codeforces"))
    return "text-blue-500 border-blue-500/50 shadow-blue-500/20";
  if (p.includes("geeks"))
    return "text-green-500 border-green-500/50 shadow-green-500/20";
  return "text-zinc-500 border-zinc-500/50 shadow-zinc-500/20";
};

export default function DsaStats({ stats = [] }: { stats: any[] }) {
  const containerRef = useRef(null);


  useGSAP(
    () => {
      const ctx = gsap.context(() => {
        if (stats.length > 0) {
          // Animate Cards
          gsap.from(".dsa-card", {
            y: 50,
            opacity: 0,
            duration: 0.8,
            stagger: 0.1,
            ease: "power2.out",
            scrollTrigger: {
              trigger: containerRef.current,
              start: "top 85%",
            },
            clearProps: "all", 
          });

          // Animate Numbers
          stats.forEach((stat, i) => {
            const obj = { val: 0 };
            const target = stat.problemsSolved || 0;
            gsap.to(obj, {
              val: target,
              duration: 2,
              ease: "power2.out",
              scrollTrigger: { trigger: `#dsa-num-${i}`, start: "top 90%" },
              onUpdate: () => {
                const el = document.getElementById(`dsa-num-${i}`);
                if (el) el.innerText = Math.floor(obj.val).toString();
              },
            });
          });
        }
      }, containerRef);

      return () => ctx.revert();
    },
    { scope: containerRef, dependencies: [stats] }
  );

  return (
    <section
      ref={containerRef}
      className="py-20 px-4 md:px-12 max-w-350 mx-auto border-t border-white/5"
    >
      <div className="mb-12 flex items-end justify-between">
        <div>
          <h3 className="font-mono text-sm text-zinc-500 uppercase tracking-widest">
            /System/Performance_Metrics
          </h3>
          <h2 className="text-3xl font-bold text-white mt-2">
            Algorithmic <span className="text-zinc-600">Power</span>
          </h2>
        </div>
        <div className="hidden md:block font-mono text-xs text-zinc-600">
          STATUS: OPTIMIZED
          <br />
          LATENCY: LOW
        </div>
      </div>

      {stats && stats.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, i) => {
            const colorClass = getPlatformColor(stat.platform);
            // Safe extraction of classes
            const textColor = colorClass.split(" ")[0] || "text-white";
            const glowColor = colorClass.split(" ").pop() || "";
            const barColor = textColor.replace("text-", "bg-");

            return (
              <div
                key={stat._id}
                className={`dsa-card relative bg-[#0e0e10] border border-white/5 p-6 rounded-2xl group hover:border-white/20 transition-all duration-300`}
              >
                {/* Top Bar */}
                <div className="flex justify-between items-start mb-8">
                  <div className={`p-2 rounded bg-white/5 ${textColor}`}>
                    <BarChart3 size={20} />
                  </div>
                  <a
                    href={stat.profileLink}
                    target="_blank"
                    className="text-zinc-600 hover:text-white transition-colors cursor-pointer z-20"
                  >
                    <ExternalLink size={16} />
                  </a>
                </div>

                {/* Number Animation */}
                <div className="mb-2">
                  <span
                    id={`dsa-num-${i}`}
                    className={`text-5xl font-mono font-bold ${textColor}`}
                  >
                    0
                  </span>
                  <span className="text-sm text-zinc-500 ml-2 font-mono">
                    SOLVED
                  </span>
                </div>

                {/* Progress Bar Visual */}
                <div className="w-full h-1 bg-zinc-800 rounded-full overflow-hidden mb-4">
                  <div className={`h-full w-[70%] ${barColor} opacity-50`} />
                </div>

                <div className="flex justify-between items-end">
                  <span className="text-lg font-bold text-white">
                    {stat.platform || "Unknown"}
                  </span>
                  {stat.rating && (
                    <div className="text-right">
                      <p className="text-[10px] text-zinc-500 uppercase">
                        Rating
                      </p>
                      <p className="font-mono text-sm text-white">
                        {stat.rating}
                      </p>
                    </div>
                  )}
                </div>

                {/* Hover Glow */}
                <div
                  className={`absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none shadow-[inset_0_0_20px_rgba(0,0,0,0)] ${glowColor}`}
                />
              </div>
            );
          })}
        </div>
      ) : (
        // Fallback UI
        <div className="flex flex-col items-center justify-center p-12 border border-dashed border-white/10 rounded-2xl bg-[#0e0e10]">
          <AlertTriangle className="text-yellow-500 mb-4" size={32} />
          <h3 className="text-white font-mono text-lg">NO METRICS FOUND</h3>
          <p className="text-zinc-500 text-sm">
            System performance data is currently unavailable.
          </p>
        </div>
      )}
    </section>
  );
}
