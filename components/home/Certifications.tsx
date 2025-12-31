"use client";
import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import { Award, Calendar, ExternalLink } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

export default function Certifications({ certs }: { certs: any[] }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Horizontal Scroll animation (Only for Desktop/Laptop)
  useGSAP(
    () => {
      const el = scrollRef.current;
      // Only animate if element exists and screen is wide enough (md breakpoint approx)
      if (el && window.innerWidth >= 768) {
        gsap.to(el, {
          x: "-20%", // Subtle drift
          ease: "none",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: 1,
          },
        });
      }
    },
    { scope: containerRef }
  );

  return (
    <section
      ref={containerRef}
      className="py-24 overflow-hidden border-t border-white/5 bg-[#09090b] relative"
    >
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] pointer-events-none" />

      {/* Header */}
      <div className="px-4 md:px-12 max-w-7xl mx-auto mb-12 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-yellow-500/10 rounded-lg text-yellow-500 border border-yellow-500/20">
            <Award size={20} />
          </div>
          <div>
            <h3 className="font-mono text-sm text-yellow-500 uppercase tracking-widest mb-1">
              Verified_Credentials
            </h3>
            <h2 className="text-3xl font-bold text-white">Certifications</h2>
          </div>
        </div>

        <div className="hidden md:block text-right">
          <div className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider">
            Total Obtained
          </div>
          <div className="text-2xl font-bold text-zinc-300">
            {certs.length < 10 ? `0${certs.length}` : certs.length}
          </div>
        </div>
      </div>

      {/* LAYOUT SWITCH: 
         - Mobile: Vertical Grid (flex-col) 
         - Desktop: Horizontal Row (flex-row) with GSAP scroll 
      */}
      <div
        ref={scrollRef}
        className="flex flex-col md:flex-row gap-6 px-4 md:px-12 w-full md:w-max"
      >
        {certs.map((cert) => (
          <a
            key={cert._id}
            href={cert.certificateLink}
            target="_blank"
            className="group relative w-full md:w-100 bg-[#0e0e10] border border-white/10 rounded-2xl overflow-hidden hover:border-yellow-500/40 transition-all duration-500 hover:shadow-xl hover:shadow-yellow-900/10 shrink-0"
          >
            {/* Image Overlay */}
            <div className="relative h-56 w-full overflow-hidden">
              <Image
                src={cert.imageUrl}
                alt={cert.name}
                fill
                className="object-cover opacity-70 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700 grayscale group-hover:grayscale-0"
              />
              <div className="absolute inset-0 bg-linear-to-t from-[#0e0e10] via-[#0e0e10]/20 to-transparent" />

              {/* Issuer Badge */}
              <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md border border-white/10 text-zinc-300 group-hover:text-yellow-400 group-hover:border-yellow-500/30 text-[10px] px-3 py-1.5 rounded-full font-bold uppercase tracking-wide transition-colors">
                {cert.issuer}
              </div>
            </div>

            {/* Content */}
            <div className="p-6 relative z-10 -mt-12">
              <div className="bg-[#0e0e10]/90 backdrop-blur border border-white/5 p-5 rounded-xl shadow-2xl">
                <h4 className="text-lg md:text-xl font-bold text-white mb-3 leading-tight group-hover:text-yellow-400 transition-colors">
                  {cert.name}
                </h4>

                <div className="flex items-center gap-4 mb-4 border-b border-white/5 pb-4">
                  <div className="flex items-center gap-2 text-zinc-500 text-xs font-mono uppercase">
                    <Calendar size={12} />
                    {new Date(cert.issueDate).toLocaleDateString(undefined, {
                      year: "numeric",
                      month: "short",
                    })}
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-zinc-400 text-xs line-clamp-1 max-w-[70%]">
                    Credential ID: {cert._id.substring(0, 8)}...
                  </span>
                  <span className="flex items-center gap-1 text-[10px] font-bold text-white bg-white/10 px-2 py-1 rounded hover:bg-yellow-500 hover:text-black transition-colors">
                    VIEW <ExternalLink size={10} />
                  </span>
                </div>
              </div>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}
