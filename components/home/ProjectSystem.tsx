"use client";
import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import Image from "next/image";
import { ExternalLink, Github, Folder } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

export default function ProjectSystem({ projects }: { projects: any[] }) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);

  //  Dynamic Scroll Calculation
  useGSAP(
    () => {
      const totalWidth = sectionRef.current?.scrollWidth || 0;
      const viewportWidth = window.innerWidth;
      const xScroll = -(totalWidth - viewportWidth);

      const pin = gsap.fromTo(
        sectionRef.current,
        { translateX: 0 },
        {
          translateX: xScroll,
          ease: "none",
          duration: 1,
          scrollTrigger: {
            trigger: triggerRef.current,
            start: "top top",
            end: () => `+=${totalWidth}`,
            scrub: 1,
            pin: true,
          },
        }
      );

      return () => {
        pin.kill();
      };
    },
    { scope: triggerRef, dependencies: [projects] }
  );

  return (
    <section ref={triggerRef} className="overflow-hidden bg-[#09090b] relative">
      {/* Background Noise */}
      <div className="absolute inset-0 opacity-[0.03] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] pointer-events-none" />

      {/* Main Horizontal Scroll Container */}
      <div
        ref={sectionRef}
        className="h-screen flex items-center px-4 md:px-20 gap-8 md:gap-20 w-max"
      >
        {/* Intro Card */}
        <div className="w-[85vw] md:w-[30vw] shrink-0 flex flex-col justify-center pl-2 md:pl-0">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-emerald-400 text-[10px] font-mono tracking-widest uppercase mb-6 w-fit">
            <Folder size={12} />
            <span>/root/projects</span>
          </div>
          <h2 className="text-4xl md:text-6xl font-black text-white mb-6 leading-tight">
            Selected <br />
            <span className="text-transparent bg-clip-text bg-linear-to-r from-indigo-500 to-purple-500">
              Works.
            </span>
          </h2>
          <p className="text-zinc-400 text-sm md:text-base max-w-md leading-relaxed">
            A curated directory of full-stack applications, system
            architectures, and open-source experiments engineered for
            performance and scalability.
          </p>

          <div className="mt-8 flex items-center gap-2 text-xs font-mono text-zinc-600">
            <span>SCROLL TO BROWSE</span>
            <div className="w-12 h-px bg-zinc-700" />
          </div>
        </div>

        {/* Project Cards Loop */}
        {projects.map((project, index) => (
          <div
            key={project._id}
            className="relative w-[85vw] md:w-[45vw] lg:w-[40vw] h-[65vh] md:h-[65vh] shrink-0 bg-[#0e0e10] border border-white/10 rounded-2xl overflow-hidden group hover:border-indigo-500/30 transition-all duration-500 hover:shadow-2xl hover:shadow-indigo-500/10"
          >
            {/* Image Layer */}
            <div className="absolute inset-0 bg-zinc-900">
              <Image
                src={project.imageUrl}
                alt={project.title}
                fill
                className="object-cover opacity-60 md:opacity-80 md:group-hover:opacity-40 md:group-hover:scale-105 transition-all duration-700 grayscale group-hover:grayscale-0"
              />
              <div className="absolute inset-0 bg-linear-to-t from-[#0e0e10] via-[#0e0e10]/60 to-transparent" />
            </div>

            {/* Content Layer */}
            <div className="absolute bottom-0 left-0 w-full p-6 md:p-10 flex flex-col justify-end h-full z-20">
              {/* Tech Stack Tags - Visible on Mobile, Hover on Desktop */}
              <div
                className="flex flex-wrap items-center gap-2 mb-4 
                              translate-y-0 opacity-100 
                              md:translate-y-4 md:opacity-0 md:group-hover:translate-y-0 md:group-hover:opacity-100 
                              transition-all duration-500 delay-100"
              >
                {project.techStack.slice(0, 4).map((t: string) => (
                  <span
                    key={t}
                    className="px-2.5 py-1 bg-white/5 backdrop-blur-md rounded border border-white/10 text-[10px] text-zinc-300 font-mono uppercase tracking-wider"
                  >
                    {t}
                  </span>
                ))}
                {project.techStack.length > 4 && (
                  <span className="text-[10px] text-zinc-500 font-mono">
                    +{project.techStack.length - 4}
                  </span>
                )}
              </div>

              {/* Title & Desc */}
              <h3 className="text-3xl md:text-4xl font-bold text-white mb-3 group-hover:text-indigo-400 transition-colors">
                {project.title}
              </h3>
              <p className="text-zinc-400 text-xs md:text-sm line-clamp-2 max-w-lg mb-6 group-hover:text-zinc-300 transition-colors">
                {project.description}
              </p>

              {/* Links - Visible on Mobile, Hover on Desktop */}
              <div
                className="flex gap-6 border-t border-white/10 pt-6 
                              translate-y-0 opacity-100 
                              md:translate-y-4 md:opacity-0 md:group-hover:translate-y-0 md:group-hover:opacity-100 
                              transition-all duration-500 delay-200"
              >
                {project.liveLink && (
                  <a
                    href={project.liveLink}
                    target="_blank"
                    className="flex items-center gap-2 text-xs font-bold text-white hover:text-indigo-400 transition-colors uppercase tracking-wider z-30"
                  >
                    LIVE DEMO <ExternalLink size={14} />
                  </a>
                )}
                {project.repoLink && (
                  <a
                    href={project.repoLink}
                    target="_blank"
                    className="flex items-center gap-2 text-xs font-bold text-zinc-400 hover:text-white transition-colors uppercase tracking-wider z-30"
                  >
                    SOURCE CODE <Github size={14} />
                  </a>
                )}
              </div>
            </div>

            {/* Large ID Number */}
            <div className="absolute top-6 right-8 font-black text-6xl md:text-8xl text-white/5 group-hover:text-white/6 transition-colors pointer-events-none select-none z-10">
              {index + 1 < 10 ? `0${index + 1}` : index + 1}
            </div>
          </div>
        ))}

        {/* End Spacer */}
        <div className="w-[10vw] shrink-0" />
      </div>
    </section>
  );
}
