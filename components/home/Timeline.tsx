"use client";

import { motion } from "framer-motion";

export default function Timeline({
  experience,
  education,
}: {
  experience: any[];
  education: any[];
}) {
  return (
    <section id="experience" className="py-32 px-4 md:px-8 max-w-4xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
        {/* Experience Column */}
        <div>
          <h3 className="text-2xl font-bold text-white mb-8 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-indigo-500" /> Experience
          </h3>
          <div className="space-y-12 border-l border-white/10 pl-8 ml-3 relative">
            {experience.map((item, i) => (
              <motion.div
                key={item._id}
                initial={{ x: -20, opacity: 0 }}
                whileInView={{ x: 0, opacity: 1 }}
                transition={{ delay: i * 0.1 }}
                className="relative"
              >
                <div className="absolute -left-9.25 top-1 w-4 h-4 rounded-full bg-[#09090b] border-2 border-indigo-500" />
                <span className="text-xs text-indigo-400 font-mono mb-1 block">
                  {item.duration}
                </span>
                <h4 className="text-lg font-bold text-white">{item.role}</h4>
                <p className="text-sm text-zinc-400 mb-2">{item.company}</p>
                <p className="text-sm text-zinc-500 leading-relaxed">
                  {item.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Education Column */}
        <div>
          <h3 className="text-2xl font-bold text-white mb-8 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500" /> Education
          </h3>
          <div className="space-y-12 border-l border-white/10 pl-8 ml-3 relative">
            {education.map((item, i) => (
              <motion.div
                key={item._id}
                initial={{ x: -20, opacity: 0 }}
                whileInView={{ x: 0, opacity: 1 }}
                transition={{ delay: i * 0.1 }}
                className="relative"
              >
                <div className="absolute -left-9.25 top-1 w-4 h-4 rounded-full bg-[#09090b] border-2 border-emerald-500" />
                <span className="text-xs text-emerald-400 font-mono mb-1 block">
                  {item.year}
                </span>
                <h4 className="text-lg font-bold text-white">{item.degree}</h4>
                <p className="text-sm text-zinc-400 mb-2">{item.school}</p>
                {item.grade && (
                  <span className="text-xs bg-white/5 px-2 py-1 rounded text-zinc-300">
                    Grade: {item.grade}
                  </span>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
