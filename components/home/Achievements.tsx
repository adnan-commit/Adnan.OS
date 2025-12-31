"use client";
import Image from "next/image";
import { Trophy, ExternalLink, Calendar, Award } from "lucide-react";
import { motion, Variants } from "framer-motion";

export default function Achievements({
  achievements,
}: {
  achievements: any[];
}) {
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const cardVariants: Variants = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    show: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
      },
    },
  };

  return (
    <section className="py-16 md:py-24 px-4 md:px-12 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-12 border-t border-white/5 relative">
      <div className="absolute inset-0 opacity-[0.02] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] pointer-events-none" />

      {/* Sticky Header */}
      <div className="col-span-1 lg:sticky lg:top-24 h-fit z-10 mb-8 lg:mb-0 pointer-events-none">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-2 mb-3 md:mb-4">
            <Trophy className="text-purple-500" size={18} />
            <h3 className="font-mono text-xs md:text-sm text-purple-500 uppercase tracking-widest">
              /System/Logs/Milestones
            </h3>
          </div>

          <h2 className="text-3xl md:text-5xl font-bold text-white mb-4 md:mb-6 leading-tight">
            Execution <br />
            <span className="text-transparent bg-clip-text bg-linear-to-r from-purple-400 to-indigo-500">
              History
            </span>
          </h2>

          <p className="text-zinc-400 text-xs md:text-sm leading-relaxed max-w-md lg:max-w-xs font-mono">
            {">"} A chronological record of significant events, hackathon
            victories, and community contributions retrieved from the archives.
          </p>
        </motion.div>
      </div>

      {/* Card Grid */}
      <motion.div
        className="col-span-1 lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 z-20"
        variants={containerVariants}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-50px" }}
      >
        {/* Fallback */}
        {(!achievements || achievements.length === 0) && (
          <div className="col-span-2 py-10 text-center border border-dashed border-white/10 rounded-xl">
            <p className="text-zinc-500 font-mono text-sm">
              Waiting for database response...
            </p>
          </div>
        )}

        {achievements &&
          achievements.map((item) => {
            const imageSrc =
              item.imageUrl || item.image || "/placeholder-achievement.jpg";

            return (
              <motion.div
                key={item._id}
                variants={cardVariants}
                whileHover={{ y: -5, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="achievement-card group relative h-70 md:h-80 rounded-2xl overflow-hidden bg-[#0e0e10] border border-white/10 hover:border-purple-500/50 hover:shadow-[0_0_20px_rgba(168,85,247,0.1)] transition-colors duration-500 cursor-default md:cursor-pointer"
              >
                {/* Background Image */}
                <div className="absolute inset-0 z-0">
                  <Image
                    src={imageSrc}
                    alt={item.title}
                    fill
                    // MOBILE: Opacity 60%, No Grayscale, No Scale
                    // DESKTOP: Opacity 40%, Grayscale -> Hover: Opacity 60%, Color, Scale
                    className="object-cover transition-all duration-700
                      opacity-60 grayscale-0 
                      md:opacity-40 md:grayscale 
                      md:group-hover:opacity-60 md:group-hover:grayscale-0 md:group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-[#09090b] via-[#09090b]/60 to-transparent" />

                  {/* Holographic Shine (Hidden on Mobile, Visible on Desktop Hover) */}
                  <div className="absolute inset-0 bg-linear-to-tr from-purple-500/0 via-purple-500/10 to-transparent transition-opacity duration-500 opacity-0 md:group-hover:opacity-100" />
                </div>

                {/* Content */}
                <div className="relative z-10 h-full flex flex-col justify-between p-5 md:p-6 pointer-events-none">
                  {/* Top Row: Date & Icon */}
                  <div className="flex justify-between items-start">
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/50 backdrop-blur-md border border-white/10 group-hover:border-purple-500/30 text-[10px] md:text-xs font-mono text-zinc-300 transition-colors">
                      <Calendar size={10} className="text-purple-400" />
                      {new Date(item.date).toLocaleDateString(undefined, {
                        year: "numeric",
                        month: "short",
                      })}
                    </div>
                    <Award
                      className="text-zinc-600 group-hover:text-purple-400 transition-colors duration-500"
                      size={20}
                    />
                  </div>

                  {/* Bottom Row: Title & Details */}
                  <div>
                    <h3 className="text-lg md:text-xl font-bold mb-2 leading-tight text-white group-hover:text-purple-100 transition-colors line-clamp-2">
                      {item.title}
                    </h3>

                    {/* Details: Always Open on Mobile, Slide-up on Desktop Hover */}
                    <div
                      className="grid transition-[grid-template-rows] duration-500 ease-in-out 
                        grid-rows-[1fr] 
                        md:grid-rows-[0fr] md:group-hover:grid-rows-[1fr]"
                    >
                      <div
                        className="overflow-hidden transition-opacity duration-700 delay-100 
                          opacity-100 
                          md:opacity-0 md:group-hover:opacity-100"
                      >
                        <div className="pt-3 md:pt-4 mt-2 md:mt-4 border-t border-white/10 flex items-center justify-between pointer-events-auto">
                          <div className="text-[10px] md:text-xs font-mono text-zinc-400 uppercase tracking-wider">
                            ORG:{" "}
                            <span className="text-zinc-200">
                              {item.organization}
                            </span>
                          </div>

                          {item.proofLink && (
                            <a
                              href={item.proofLink}
                              target="_blank"
                              className="flex items-center gap-1 text-[10px] md:text-xs font-bold text-purple-400 hover:text-purple-300 transition-colors"
                            >
                              VERIFY <ExternalLink size={12} />
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
      </motion.div>
    </section>
  );
}
