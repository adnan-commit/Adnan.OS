import { verifyAuth } from "@/lib/auth";
import { redirect } from "next/navigation";
import connectToDatabase from "@/lib/db";
import Project from "@/models/Project";
import Blog from "@/models/Blog";
import Skill from "@/models/Skill";
import Certificate from "@/models/Certificate";
import Achievement from "@/models/Achievement";
import Resume from "@/models/Resume";
import ProfileImage from "@/models/ProfileImage";
import {
  FolderGit2,
  FileText,
  Award,
  Cpu,
  Trophy,
  FileUser,
  ArrowUpRight,
  Activity,
  Plus,
  Image as ImageIcon,
  Sparkles,
  Scan,
  LucideIcon, 
} from "lucide-react";
import React from "react";
import DashboardHeader from "@/components/admin/DashboardHeader";
import Link from "next/link";
import Image from "next/image";

interface DashboardCard {
  label: string;
  count: number;
  icon: LucideIcon;
  span: string;
  gradient: string;
}

export default async function AdminDashboard() {
  const auth = await verifyAuth();
  if (!auth) redirect("/admin/login");

  await connectToDatabase();

  const [
    projectCount,
    blogCount,
    skillCount,
    certCount,
    achievementCount,
    resumeCount,
    latestPhoto,
  ] = await Promise.all([
    Project.countDocuments(),
    Blog.countDocuments(),
    Skill.countDocuments(),
    Certificate.countDocuments(),
    Achievement.countDocuments(),
    Resume.countDocuments(),
    ProfileImage.findOne().sort({ _id: -1 }).lean(),
  ]);

  const cards: DashboardCard[] = [
    {
      label: "Active Projects",
      count: projectCount,
      icon: FolderGit2,
      span: "col-span-1 md:col-span-2",
      gradient: "from-blue-500/20 to-transparent",
    },
    {
      label: "Blog Posts",
      count: blogCount,
      icon: FileText,
      span: "col-span-1 md:col-span-1",
      gradient: "from-purple-500/20 to-transparent",
    },
    {
      label: "Tech Stack",
      count: skillCount,
      icon: Cpu, 
      span: "col-span-1",
      gradient: "from-emerald-500/20 to-transparent",
    },
    {
      label: "Certifications",
      count: certCount,
      icon: Award,
      span: "col-span-1",
      gradient: "from-orange-500/20 to-transparent",
    },
    {
      label: "Achievements",
      count: achievementCount,
      icon: Trophy, 
      span: "col-span-1 md:col-span-2",
      gradient: "from-yellow-500/20 to-transparent",
    },
    {
      label: "Resume Files",
      count: resumeCount,
      icon: FileUser, 
      span: "col-span-1",
      gradient: "from-pink-500/20 to-transparent",
    },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-700">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-white/5 pb-6">
        <DashboardHeader />
        <div className="flex gap-3 w-full md:w-auto">
          <Link
            href="/admin/projects"
            className="flex-1 md:flex-none justify-center px-4 cursor-pointer py-2 bg-white text-black text-sm font-medium rounded-lg hover:bg-zinc-200 transition-colors shadow-[0_0_20px_rgba(255,255,255,0.1)] flex items-center gap-2"
          >
            <Plus size={16} /> Quick Add
          </Link>
        </div>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((card, i) => (
          <div
            key={i}
            className={`group relative overflow-hidden rounded-xl bg-[#0e0e10] border border-white/5 p-6 transition-all hover:border-white/10 ${card.span}`}
          >
            {/* Gradient Background */}
            <div
              className={`absolute inset-0 bg-linear-to-br ${card.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
            />

            <div className="relative z-10 flex flex-col h-full justify-between">
              <div className="flex justify-between items-start">
                <div className="p-2 rounded-lg bg-white/5 text-zinc-400 group-hover:text-white group-hover:bg-white/10 transition-colors">
                  <card.icon size={20} />
                </div>
                {/* Decorative Sparkline */}
                <div className="opacity-30 group-hover:opacity-60 transition-opacity">
                  <svg
                    width="60"
                    height="30"
                    viewBox="0 0 60 30"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M1 25L10 15L20 20L30 10L40 18L59 1"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              </div>

              <div className="mt-8">
                <h3 className="text-3xl md:text-4xl font-mono font-medium text-white tracking-tighter">
                  {card.count}
                </h3>
                <div className="flex items-center justify-between mt-1">
                  <p className="text-sm text-zinc-500 font-medium group-hover:text-zinc-400">
                    {card.label}
                  </p>
                  <ArrowUpRight
                    size={14}
                    className="text-zinc-700 group-hover:text-white transition-colors"
                  />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Section: Balanced 2-Column Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-stretch">
        <div className="group relative overflow-hidden rounded-xl bg-[#0e0e10] border border-white/5 h-full min-h-80 flex items-end">
          {latestPhoto ? (
            <>
              {/* Full Background Image */}
              <Image
                src={latestPhoto.imageUrl}
                alt={latestPhoto.name}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />

              <div className="absolute inset-0 bg-linear-to-t from-[#09090b] via-[#09090b]/70 to-transparent" />

              {/* Text Content */}
              <div className="relative z-10 p-6 w-full">
                <div className="flex items-center gap-2 text-cyan-400 mb-2">
                  <Sparkles size={16} />
                  <span className="text-xs font-bold uppercase tracking-widest">
                    Latest Asset
                  </span>
                </div>
                <h3 className="text-xl md:text-2xl font-bold text-white mb-2 truncate">
                  {latestPhoto.name}
                </h3>
                <div className="flex items-center gap-2 text-xs text-zinc-400 font-mono bg-black/50 p-2 rounded-lg backdrop-blur-md w-fit">
                  <Scan size={12} /> ID: {latestPhoto.name}
                </div>
              </div>
            </>
          ) : (
            // Fallback
            <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center text-zinc-500">
              <div className="p-4 rounded-full bg-white/5 mb-4">
                <ImageIcon size={32} className="opacity-50" />
              </div>
              <p className="text-sm font-medium text-zinc-400">Gallery Empty</p>
              <p className="text-xs mt-1">
                Upload photos to see them highlighted here.
              </p>
            </div>
          )}
        </div>

        {/* System Health Card */}
        <div className="rounded-xl bg-linear-to-b from-zinc-900 to-black border border-white/5 p-8 flex flex-col justify-center items-center text-center h-full min-h-80">
          <div className="relative mb-6">
            <div className="absolute inset-0 bg-emerald-500/20 blur-xl rounded-full animate-pulse"></div>
            <div className="w-16 h-16 rounded-full bg-white/5 border border-white/5 flex items-center justify-center relative z-10">
              <Activity size={32} className="text-emerald-500" />
            </div>
          </div>
          <h3 className="text-white font-medium text-lg">
            System Status: Nominal
          </h3>
          <p className="text-sm text-zinc-500 mt-3 px-4 leading-relaxed max-w-xs">
            Database and API latency is below{" "}
            <span className="text-emerald-400 font-mono">50ms</span>. All
            services operational.
          </p>
          <div className="mt-8 w-48 bg-white/5 h-1.5 rounded-full overflow-hidden">
            <div className="h-full bg-emerald-500 w-full animate-[shimmer_2s_infinite]"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
