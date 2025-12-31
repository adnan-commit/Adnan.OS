"use client";
import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, BookOpen, Calendar, Hash } from "lucide-react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function BlogSystem({ blogs }: { blogs: any[] }) {
  const container = useRef(null);

  useGSAP(
    () => {
      if (blogs && blogs.length > 0) {
        gsap.from(".blog-card", {
          y: 50,
          opacity: 0,
          stagger: 0.1,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: container.current,
            start: "top 70%",
          },
        });
      }
    },
    { scope: container, dependencies: [blogs] }
  );

  return (
    <section
      ref={container}
      className="py-24 bg-[#09090b] relative overflow-hidden"
    >
      {/* Background Noise */}
      <div className="absolute inset-0 opacity-[0.03] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] pointer-events-none" />

      {/* Header */}
      <div className="max-w-7xl mx-auto px-4 md:px-12 mb-16 relative z-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-orange-400 text-[10px] font-mono tracking-widest uppercase mb-4">
          <BookOpen size={12} />
          <span>System_Logs</span>
        </div>
        <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight">
          Dev <span className="text-zinc-600">Chronicles</span>
        </h2>
      </div>

      {/* Grid */}
      {!blogs || blogs.length === 0 ? (
        <div className="text-center py-20">
          <h3 className="text-zinc-500 font-mono">NO LOGS FOUND</h3>
        </div>
      ) : (
        <div className="max-w-7xl mx-auto px-4 md:px-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {blogs.map((blog) => {
            // Use imageUrl from DB, or a fallback if missing
            const imageSrc =
              blog.imageUrl || blog.coverImage || "/placeholder-blog.jpg";

            // Create a plain text excerpt from HTML content if excerpt is missing
            const fallbackExcerpt = blog.content
              ? blog.content.replace(/<[^>]+>/g, "").substring(0, 100) + "..."
              : "No preview available.";
            const summary = blog.excerpt || fallbackExcerpt;

            return (
              <Link
                key={blog._id}
                href={blog.slug ? `/blog/${blog.slug}` : `/blog/${blog._id}`}
                className="blog-card group relative h-100 bg-[#0e0e10] border border-white/10 rounded-2xl overflow-hidden hover:border-orange-500/50 transition-colors duration-500 flex flex-col"
              >
                {/* Image Half */}
                <div className="relative h-[50%] w-full overflow-hidden bg-zinc-900">
                  <Image
                    src={imageSrc}
                    alt={blog.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110 opacity-80 group-hover:opacity-100"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-[#0e0e10] via-transparent to-transparent" />

                  {/* Date Badge */}
                  <div className="absolute top-4 right-4 bg-black/60 backdrop-blur border border-white/10 px-2 py-1 rounded-md text-[10px] font-mono text-zinc-300 flex items-center gap-1.5">
                    <Calendar size={10} className="text-orange-500" />
                    {new Date(blog.createdAt).toLocaleDateString()}
                  </div>
                </div>

                {/* Content Half */}
                <div className="relative h-[50%] p-6 flex flex-col justify-between z-10 bg-[#0e0e10]">
                  <div>
                    {/* Tags or Category */}
                    <div className="flex gap-2 mb-3">
                      {blog.tags && blog.tags.length > 0 ? (
                        blog.tags.slice(0, 2).map((tag: string) => (
                          <span
                            key={tag}
                            className="flex items-center gap-1 text-[10px] text-zinc-500 font-mono uppercase border border-white/5 px-1.5 py-0.5 rounded"
                          >
                            <Hash size={8} /> {tag}
                          </span>
                        ))
                      ) : (
                        // Fallback if no tags: Show Category
                        <span className="flex items-center gap-1 text-[10px] text-zinc-500 font-mono uppercase border border-white/5 px-1.5 py-0.5 rounded">
                          <Hash size={8} /> {blog.category || "General"}
                        </span>
                      )}
                    </div>

                    <h3 className="text-lg font-bold text-white mb-2 leading-tight group-hover:text-orange-400 transition-colors line-clamp-2">
                      {blog.title}
                    </h3>

                    <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed">
                      {summary}
                    </p>
                  </div>

                  {/* Read More Link */}
                  <div className="flex items-center gap-2 text-[10px] font-bold text-white uppercase tracking-wider mt-auto pt-4 border-t border-white/5">
                    READ ENTRY
                    <ArrowUpRight
                      size={12}
                      className="text-orange-500 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform"
                    />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </section>
  );
}
