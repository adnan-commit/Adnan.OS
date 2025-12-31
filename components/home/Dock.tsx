"use client";
import { useRef, useState, useEffect } from "react";
import {
  MotionValue,
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  Variants,
} from "framer-motion";
import {
  Home,
  User,
  Briefcase,
  Code2,
  Trophy,
  Mail,
  FileText,
  Terminal,
  BookOpen,
} from "lucide-react";
import Link from "next/link";

export default function Dock({ resumeUrl }: { resumeUrl?: string }) {
  let mouseX = useMotionValue(Infinity);

  const apps = [
    { id: "home", icon: Home, label: "Home", href: "#home" },
    { id: "about", icon: User, label: "About", href: "#about" },
    { id: "projects", icon: Code2, label: "Projects", href: "#projects" },
    { id: "blogs", icon: BookOpen, label: "Blogs", href: "#blogs" },
    {
      id: "experience",
      icon: Briefcase,
      label: "Experience",
      href: "#experience",
    },
    {
      id: "achievements",
      icon: Trophy,
      label: "Awards",
      href: "#achievements",
    },
    {
      id: "resume",
      icon: FileText,
      label: "Resume",
      href: resumeUrl && resumeUrl.length > 5 ? resumeUrl : "/resume.pdf",
    },
    { id: "contact", icon: Mail, label: "Contact", href: "#contact" },
    { id: "terminal", icon: Terminal, label: "Admin", href: "/admin/login" },
  ];

  return (
    <>
      <style jsx global>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>

      <motion.div
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        transition={{ delay: 1.2, type: "spring", stiffness: 200, damping: 20 }}
        onMouseMove={(e) => mouseX.set(e.pageX)}
        onMouseLeave={() => mouseX.set(Infinity)}
        // Added 'pb-3' to mobile to give scrollbar/touch room
        className="fixed bottom-6 md:bottom-12 left-1/2 -translate-x-1/2 z-50 
                   flex h-16 items-end gap-3 
                   rounded-2xl border border-white/10 bg-black/60 
                   px-4 pb-3 backdrop-blur-xl
                   w-max max-w-[90vw] 
                   overflow-x-auto md:overflow-visible 
                   no-scrollbar shadow-2xl"
      >
        {apps.map((app) => (
          <AppIcon mouseX={mouseX} key={app.id} {...app} />
        ))}
      </motion.div>
    </>
  );
}

// Define Glow Variants
const glowVariants: Variants = {
  initial: {
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderColor: "rgba(255, 255, 255, 0.1)",
    boxShadow: "0 0 0px rgba(0,0,0,0)",
  },
  hover: {
    backgroundColor: "rgba(34, 211, 238, 0.15)",
    borderColor: "rgba(34, 211, 238, 0.6)",
    boxShadow:
      "0 0 25px rgba(34, 211, 238, 0.5), inset 0 0 10px rgba(34, 211, 238, 0.2)",
    transition: {
      duration: 0.2,
      ease: "easeInOut",
    },
  },
  tap: {
    scale: 0.95,
    boxShadow: "0 0 15px rgba(34, 211, 238, 0.8)",
  },
};

function AppIcon({
  mouseX,
  icon: Icon,
  href,
  label,
}: {
  mouseX: MotionValue;
  icon: any;
  href: string;
  label: string;
}) {
  let ref = useRef<HTMLDivElement>(null);
  const [isDesktop, setIsDesktop] = useState(false);

  // 1. Detect Screen Size on Mount
  useEffect(() => {
    const checkScreen = () => {
      // 768px is the standard md: breakpoint in Tailwind
      setIsDesktop(window.innerWidth >= 768);
    };
    checkScreen();
    window.addEventListener("resize", checkScreen);
    return () => window.removeEventListener("resize", checkScreen);
  }, []);

  let distance = useTransform(mouseX, (val) => {
    let bounds = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 };
    return val - bounds.x - bounds.width / 2;
  });

  let widthSync = useTransform(distance, [-150, 0, 150], [40, 90, 40]);
  let width = useSpring(widthSync, { mass: 0.1, stiffness: 150, damping: 12 });

  return (
    <Link
      href={href}
      target={label === "Resume" ? "_blank" : "_self"}
      className="shrink-0 relative z-10 hover:z-20"
    >
      <motion.div
        ref={ref}
        // 2. LOGIC: If Desktop -> Use dynamic spring width. If Mobile -> Use null (fallback to CSS class)
        style={isDesktop ? { width } : {}}
        variants={glowVariants}
        initial="initial"
        whileHover="hover"
        whileTap="tap"
        // 3. CSS: Added 'w-12' as fixed width for mobile. 'md:w-auto' lets Framer take over on desktop.
        className="aspect-square w-12 md:w-auto rounded-xl border flex items-center justify-center relative group cursor-pointer transition-colors will-change-transform"
      >
        <Icon className="text-zinc-400 w-6 h-6 md:w-full md:h-full md:p-2 transition-all duration-300 group-hover:text-cyan-400 group-hover:drop-shadow-[0_0_8px_rgba(34,211,238,0.8)]" />

        {/* Tooltip Label (Hidden on mobile via 'hidden md:block') */}
        <span className="hidden md:block absolute -top-12 left-1/2 -translate-x-1/2 bg-black/80 backdrop-blur-md border border-cyan-500/30 text-cyan-100 font-mono text-[10px] px-3 py-1.5 rounded-md opacity-0 -translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 whitespace-nowrap pointer-events-none z-50 shadow-[0_0_15px_rgba(34,211,238,0.3)]">
          {label}
        </span>

        {/* Active Indicator Dot */}
        <div className="absolute -bottom-1 md:-bottom-2 left-1/2 -translate-x-1/2 w-1 h-1 md:w-1.5 md:h-1.5 bg-cyan-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-[0_0_10px_rgba(34,211,238,1)]" />
      </motion.div>
    </Link>
  );
}
