"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import {
  LogOut,
  LayoutDashboard,
  FolderGit2,
  FileText,
  Cpu,
  Award,
  Trophy,
  FileUser,
  LineChart,
  Settings,
  Menu,
  X,
  Contact,
  Image as Imagecon,
  Briefcase, // 1. Added Briefcase Icon
  GraduationCap, // 2. Added GraduationCap Icon
} from "lucide-react";
import clsx from "clsx";
import Logo from "@/components/Logo";
import Image from "next/image";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  // 1. Fetch Profile Image on Mount
  useEffect(() => {
    const fetchProfileImage = async () => {
      try {
        const res = await fetch("/api/photos");
        if (res.ok) {
          const data = await res.json();
          const profile = data.find(
            (p: any) =>
              p.name.toLowerCase() === "profile image" ||
              p.name.toLowerCase() === "profile"
          );
          if (profile) setAvatarUrl(profile.imageUrl);
        }
      } catch (error) {
        console.error("Failed to load profile image", error);
      }
    };

    fetchProfileImage();
  }, []);

  if (pathname === "/admin/login") return <>{children}</>;

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      localStorage.removeItem("admin_token");
      router.refresh();
      router.push("/admin/login");
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  return (
    <div className="flex h-screen w-full bg-[#09090b] text-zinc-100 font-sans selection:bg-white/20 overflow-hidden relative">
      {/*  GLOBAL NOISE TEXTURE */}
      <div
        className="pointer-events-none fixed inset-0 z-50 opacity-[0.03] mix-blend-overlay"
        style={{
          backgroundImage:
            'url("https://grainy-gradients.vercel.app/noise.svg")',
        }}
      ></div>

      {/*  MOBILE OVERLAY */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/80 backdrop-blur-sm md:hidden animate-in fade-in duration-200"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/*  SIDEBAR */}
      <aside
        className={clsx(
          "fixed inset-y-0 left-0 z-50 w-70 bg-[#09090b] border-r border-white/5 flex flex-col transition-transform duration-300 ease-in-out md:relative md:translate-x-0 shadow-2xl md:shadow-none",
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Header */}
        <div className="p-6 pb-8 flex items-center justify-between">
          <div className="px-2">
            <Logo />
          </div>

          <button
            onClick={() => setIsMobileMenuOpen(false)}
            className="md:hidden text-zinc-400 hover:text-white"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto px-4 space-y-8 custom-scrollbar">
          <NavSection title="Analytics">
            <NavItem
              href="/admin"
              icon={LayoutDashboard}
              label="Overview"
              active={pathname === "/admin"}
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <NavItem
              href="/admin/dsa"
              icon={LineChart}
              label="Performance"
              active={pathname === "/admin/dsa"}
              onClick={() => setIsMobileMenuOpen(false)}
            />
          </NavSection>

          <NavSection title="Collections">
            <NavItem
              href="/admin/projects"
              icon={FolderGit2}
              label="Projects"
              active={pathname.startsWith("/admin/projects")}
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <NavItem
              href="/admin/blogs"
              icon={FileText}
              label="Writing"
              active={pathname.startsWith("/admin/blogs")}
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <NavItem
              href="/admin/skills"
              icon={Cpu}
              label="Stack"
              active={pathname === "/admin/skills"}
              onClick={() => setIsMobileMenuOpen(false)}
            />
          </NavSection>

          <NavSection title="Credentials">
            <NavItem
              href="/admin/experience"
              icon={Briefcase}
              label="Experience"
              active={pathname === "/admin/experience"}
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <NavItem
              href="/admin/education"
              icon={GraduationCap}
              label="Education"
              active={pathname === "/admin/education"}
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <NavItem
              href="/admin/certificates"
              icon={Award}
              label="Certificates"
              active={pathname === "/admin/certificates"}
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <NavItem
              href="/admin/achievements"
              icon={Trophy}
              label="Awards"
              active={pathname === "/admin/achievements"}
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <NavItem
              href="/admin/resume"
              icon={FileUser}
              label="Resume"
              active={pathname === "/admin/resume"}
              onClick={() => setIsMobileMenuOpen(false)}
            />
          </NavSection>

          {/* New Personal Section */}
          <NavSection title="Personal">
            <NavItem
              href="/admin/contact"
              icon={Contact}
              label="Contact Info"
              active={pathname === "/admin/contact"}
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <NavItem
              href="/admin/photos"
              icon={Imagecon}
              label="Photos"
              active={pathname === "/admin/photos"}
              onClick={() => setIsMobileMenuOpen(false)}
            />
          </NavSection>
        </div>

        {/* User Profile */}
        <div className="p-4 border-t border-white/5">
          <div className="rounded-xl bg-zinc-900/50 border border-white/5 p-3 flex items-center justify-between group cursor-pointer hover:bg-zinc-900 transition-colors">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-full border border-white/10 overflow-hidden relative bg-linear-to-tr from-zinc-700 to-zinc-600">
                {avatarUrl ? (
                  <Image
                    src={avatarUrl}
                    alt="Profile"
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="h-full w-full object-cover"
                  />
                ) : null}
              </div>
              <div className="text-xs">
                <p className="text-white font-medium">Adnan Qureshi</p>
                <p className="text-zinc-500">Pro Account</p>
              </div>
            </div>
            <Settings
              size={14}
              className="text-zinc-500 group-hover:text-white transition-colors"
            />
          </div>

          <button
            onClick={handleLogout}
            className="mt-3 w-full flex items-center justify-center gap-2 text-xs text-zinc-600 hover:text-red-400 py-2 transition-colors cursor-pointer"
          >
            <LogOut size={12} /> Sign Out
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT WRAPPER */}
      <main className="flex-1 bg-[#000000] relative flex flex-col overflow-hidden w-full">
        {/* Subtle Top Gradient */}
        <div className="absolute top-0 left-0 w-full h-px bg-linear-to-r from-transparent via-white/10 to-transparent"></div>

        {/*  MOBILE HEADER BAR */}
        <div className="md:hidden flex items-center justify-between p-4 border-b border-white/5 bg-[#09090b]">
          <div className="flex items-center">
            <Logo />
          </div>

          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="p-2 text-zinc-400 hover:text-white hover:bg-white/5 rounded-lg"
          >
            <Menu size={24} />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8 lg:p-12 scroll-smooth">
          <div className="max-w-350 mx-auto pb-20 md:pb-0">{children}</div>
        </div>
      </main>
    </div>
  );
}

// Helpers
function NavSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <h3 className="px-3 text-[10px] font-bold text-zinc-600 uppercase tracking-widest">
        {title}
      </h3>
      <div className="space-y-0.5">{children}</div>
    </div>
  );
}

function NavItem({
  href,
  icon: Icon,
  label,
  active,
  onClick,
}: {
  href: string;
  icon: any;
  label: string;
  active: boolean;
  onClick?: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={clsx(
        "flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 group text-sm relative",
        active
          ? "text-white bg-white/5"
          : "text-zinc-400 hover:text-zinc-200 hover:bg-white/2"
      )}
    >
      <Icon
        size={16}
        className={
          active ? "text-white" : "text-zinc-500 group-hover:text-zinc-300"
        }
      />
      <span className="font-medium">{label}</span>
      {active && (
        <div className="absolute right-3 w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_8px_white]"></div>
      )}
    </Link>
  );
}
