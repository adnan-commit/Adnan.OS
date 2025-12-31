import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Calendar, Clock, Terminal } from "lucide-react";
import connectToDatabase from "@/lib/db";
import Blog from "@/models/Blog";

async function getBlogPost(slug: string) {
  try {
    await connectToDatabase();

    let blog = await Blog.findOne({ slug: slug }).lean();

    if (!blog) {
      // Fallback: If slug implies it's an ID
      try {
        blog = await Blog.findById(slug).lean();
      } catch (e) {
        return null;
      }
    }

    return blog ? JSON.parse(JSON.stringify(blog)) : null;
  } catch (error) {
    return null;
  }
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  //  UPDATE: Await the params before accessing slug
  const { slug } = await params;
  const blog = await getBlogPost(slug);

  // If no blog found, trigger the 404 page
  if (!blog) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-[#050505] text-zinc-300 font-sans selection:bg-indigo-500/30">
      {/* Background Ambience */}
      <div className="fixed inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] pointer-events-none" />
      <div className="fixed top-0 left-0 w-full h-125 bg-linear-to-b from-indigo-900/10 to-transparent pointer-events-none" />

      {/* NAVIGATION BAR */}
      <nav className="sticky top-0 z-50 border-b border-white/5 bg-[#050505]/80 backdrop-blur-md">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link
            href="/#blogs"
            className="group flex items-center gap-2 text-xs font-mono text-zinc-500 hover:text-white transition-colors"
          >
            <ArrowLeft
              size={14}
              className="group-hover:-translate-x-1 transition-transform"
            />
            <span>cd ..</span>
          </Link>
          <div className="flex items-center gap-2 px-3 py-1 rounded bg-white/5 border border-white/10 text-[10px] font-mono uppercase text-zinc-400">
            <Terminal size={10} />
            <span>Reading_Mode: Active</span>
          </div>
        </div>
      </nav>

      {/* MAIN CONTENT */}
      <article className="max-w-3xl mx-auto px-4 py-12 md:py-20 relative z-10">
        {/* Header Section */}
        <header className="mb-12 text-center md:text-left">
          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-6 justify-center md:justify-start">
            {blog.tags?.map((tag: string) => (
              <span
                key={tag}
                className="px-2 py-1 rounded border border-indigo-500/20 bg-indigo-500/5 text-indigo-400 text-[10px] font-mono uppercase tracking-wider"
              >
                #{tag}
              </span>
            ))}
          </div>

          {/* Title */}
          <h1 className="text-3xl md:text-5xl font-black text-white mb-6 leading-tight tracking-tight">
            {blog.title}
          </h1>

          {/* Meta Data */}
          <div className="flex flex-wrap items-center gap-6 text-sm text-zinc-500 font-mono justify-center md:justify-start">
            <div className="flex items-center gap-2">
              <Calendar size={14} />
              <span>
                {new Date(blog.createdAt).toLocaleDateString(undefined, {
                  dateStyle: "long",
                })}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Clock size={14} />
              {/* Safe check for content length */}
              <span>
                {blog.content
                  ? Math.ceil(blog.content.split(" ").length / 200)
                  : 1}{" "}
                min read
              </span>
            </div>
          </div>
        </header>

        {/* Featured Image */}
        <div className="relative w-full aspect-video rounded-2xl overflow-hidden border border-white/10 mb-12 shadow-2xl">
          <Image
            src={blog.imageUrl || blog.coverImage || "/placeholder.jpg"}
            alt={blog.title}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-linear-to-t from-[#050505] via-transparent to-transparent opacity-60" />
        </div>

        {/* HTML Content */}
        <div
          className="prose prose-invert prose-zinc max-w-none 
                       prose-headings:font-bold prose-headings:tracking-tight prose-headings:text-white
                       prose-p:text-zinc-400 prose-p:leading-relaxed
                       prose-a:text-indigo-400 prose-a:no-underline hover:prose-a:underline
                       prose-pre:bg-[#0e0e10] prose-pre:border prose-pre:border-white/10
                       prose-img:rounded-xl prose-img:border prose-img:border-white/10"
          dangerouslySetInnerHTML={{ __html: blog.content || "" }}
        />

        {/* Footer */}
        <div className="mt-20 pt-10 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-left">
            <p className="text-white font-bold text-lg">Adnan Qureshi</p>
            <p className="text-zinc-500 text-sm">
              System Architect & Full Stack Dev
            </p>
          </div>

          <div className="w-full md:w-auto bg-black border border-white/10 rounded-lg p-3 font-mono text-xs text-zinc-500">
            <p>{`> end_of_file`}</p>
            <p>
              {`> status: `}
              <span className="text-emerald-500">read_complete</span>
            </p>
          </div>
        </div>
      </article>
    </main>
  );
}
