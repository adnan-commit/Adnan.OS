"use client";
import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import {
  Briefcase,
  GraduationCap,
  MapPin,
  Calendar,
  Terminal,
  AlertCircle,
} from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

export default function ExperienceSystem({
  experience = [],
  education = [],
}: {
  experience: any[];
  education: any[];
}) {
  const containerRef = useRef(null);

  useGSAP(
    () => {
      const ctx = gsap.context(() => {
        // Animate Header
        gsap.from(".exp-header", {
          scrollTrigger: { trigger: ".exp-header", start: "top 90%" },
          opacity: 0,
          y: 20,
          duration: 0.5,
        });

        // Animate Experience Cards
        if (experience.length > 0) {
          gsap.from(".process-card", {
            scrollTrigger: { trigger: ".process-list", start: "top 85%" },
            x: -30,
            opacity: 0,
            stagger: 0.1,
            duration: 0.5,
            ease: "power2.out",
            clearProps: "all", // Ensure visibility after animation
          });
        }

        // Animate Education Cards
        if (education.length > 0) {
          gsap.from(".module-card", {
            scrollTrigger: { trigger: ".module-list", start: "top 85%" },
            x: 30,
            opacity: 0,
            stagger: 0.1,
            duration: 0.5,
            ease: "power2.out",
            clearProps: "all", // Ensure visibility after animation
          });
        }
      }, containerRef);

      return () => ctx.revert();
    },
    { scope: containerRef, dependencies: [experience, education] }
  );

  return (
    <section
      ref={containerRef}
      className="py-32 px-4 md:px-12 max-w-350 mx-auto border-t border-white/5 bg-[#09090b]"
    >
      {/* Header */}
      <div className="exp-header mb-16 flex flex-col md:flex-row md:items-end justify-between gap-4 opacity-100">
        <div>
          <div className="flex items-center gap-2 text-emerald-500 mb-2 font-mono text-xs uppercase tracking-widest">
            <Terminal size={14} />
            <span>/Root/Kernel_History</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-white">
            System <span className="text-zinc-600">Logs</span>
          </h2>
        </div>
        <div className="font-mono text-xs text-zinc-500 text-right">
          UPTIME: 100%
          <br />
          LOG_LEVEL: VERBOSE
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
        {/* LEFT COLUMN: EXPERIENCE */}
        <div className="process-list">
          <h3 className="flex items-center gap-3 text-xl font-bold text-white mb-10 pb-4 border-b border-white/10">
            <Briefcase className="text-indigo-500" size={20} />
            <span className="uppercase tracking-wider">Active Processes</span>
          </h3>

          <div className="space-y-8 relative border-l border-white/5 ml-3 pl-8">
            {experience && experience.length > 0 ? (
              experience.map((job) => (
                <div key={job._id} className="process-card relative group">
                  {/* Timeline Dot */}
                  <div className="absolute -left-9.75 top-1.5 w-5 h-5 bg-[#09090b] border-2 border-indigo-500/50 rounded-full group-hover:border-indigo-500 group-hover:shadow-[0_0_10px_rgba(99,102,241,0.5)] transition-all duration-300" />

                  <div className="bg-[#0e0e10] border border-white/5 p-6 rounded-xl hover:border-indigo-500/30 transition-colors">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="text-lg font-bold text-white group-hover:text-indigo-400 transition-colors">
                        {job.role}
                      </h4>
                      <span className="px-2 py-1 rounded bg-indigo-500/10 text-indigo-400 text-[10px] font-mono border border-indigo-500/20">
                        PID:{" "}
                        {job._id ? job._id.slice(-4).toUpperCase() : "0000"}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-zinc-500 mb-4">
                      <span className="flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        {job.company}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar size={12} />
                        {job.duration}
                      </span>
                      {job.location && (
                        <span className="flex items-center gap-1">
                          <MapPin size={12} />
                          {job.location}
                        </span>
                      )}
                    </div>

                    <p className="text-zinc-400 text-sm leading-relaxed whitespace-pre-line border-t border-white/5 pt-4">
                      {job.description}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-zinc-500 font-mono text-sm italic flex items-center gap-2">
                <AlertCircle size={14} /> No active processes found.
              </div>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: EDUCATION */}
        <div className="module-list">
          <h3 className="flex items-center gap-3 text-xl font-bold text-white mb-10 pb-4 border-b border-white/10">
            <GraduationCap className="text-emerald-500" size={20} />
            <span className="uppercase tracking-wider">Memory Modules</span>
          </h3>

          <div className="space-y-6">
            {education && education.length > 0 ? (
              education.map((edu) => (
                <div
                  key={edu._id}
                  className="module-card group relative bg-[#0e0e10] border border-white/5 p-6 rounded-xl hover:border-emerald-500/30 transition-all hover:-translate-x-2"
                >
                  {/* Decorative Corner */}
                  <div className="absolute top-0 right-0 w-16 h-16 bg-linear-to-bl from-emerald-500/5 to-transparent rounded-tr-xl pointer-events-none" />

                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="text-lg font-bold text-white group-hover:text-emerald-400 transition-colors">
                        {edu.degree}
                      </h4>
                      <p className="text-zinc-400 text-sm">{edu.school}</p>
                    </div>
                    <span className="font-mono text-xs text-zinc-600 bg-white/5 px-2 py-1 rounded">
                      {edu.year}
                    </span>
                  </div>

                  {edu.grade && (
                    <div className="mt-3 inline-block px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold">
                      Grade: {edu.grade}
                    </div>
                  )}

                  {edu.description && (
                    <p className="mt-4 text-zinc-500 text-sm leading-relaxed">
                      {edu.description}
                    </p>
                  )}
                </div>
              ))
            ) : (
              <div className="text-zinc-500 font-mono text-sm italic flex items-center gap-2 p-4 border border-dashed border-white/10 rounded-xl">
                <AlertCircle size={14} /> No memory modules installed.
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
