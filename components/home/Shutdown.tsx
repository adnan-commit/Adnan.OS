"use client";
import { useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  Mail,
  Github,
  Linkedin,
  Twitter,
  Copy,
  Check,
  ArrowUpRight,
  Instagram,
  MessageCircle,
  Globe,
  Terminal,
  Cpu,
  Send,
  Phone,
  Power,
} from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const getPlatformStyle = (platform: string) => {
  const p = platform ? platform.toLowerCase() : "";
  if (p.includes("linkedin"))
    return {
      color: "text-blue-500",
      border: "hover:border-blue-500/50",
      bg: "hover:bg-blue-500/10",
      icon: <Linkedin size={24} />,
    };
  if (p.includes("github"))
    return {
      color: "text-white",
      border: "hover:border-white/50",
      bg: "hover:bg-white/10",
      icon: <Github size={24} />,
    };
  if (p.includes("instagram"))
    return {
      color: "text-pink-500",
      border: "hover:border-pink-500/50",
      bg: "hover:bg-pink-500/10",
      icon: <Instagram size={24} />,
    };
  if (p.includes("twitter") || p.includes("x"))
    return {
      color: "text-sky-500",
      border: "hover:border-sky-500/50",
      bg: "hover:bg-sky-500/10",
      icon: <Twitter size={24} />,
    };
  if (p.includes("whatsapp"))
    return {
      color: "text-green-500",
      border: "hover:border-green-500/50",
      bg: "hover:bg-green-500/10",
      icon: <MessageCircle size={24} />,
    };
  if (p.includes("phone"))
    return {
      color: "text-emerald-500",
      border: "hover:border-emerald-500/50",
      bg: "hover:bg-emerald-500/10",
      icon: <Phone size={24} />,
    };
  return {
    color: "text-indigo-500",
    border: "hover:border-indigo-500/50",
    bg: "hover:bg-indigo-500/10",
    icon: <Globe size={24} />,
  };
};

export default function Contact({ contacts = [] }: { contacts: any[] }) {
  const container = useRef(null);
  const [copied, setCopied] = useState(false);

  const emailContact = contacts?.find(
    (c) =>
      c.platform.toLowerCase().includes("email") ||
      c.platform.toLowerCase().includes("gmail")
  );
  const emailAddress = emailContact
    ? emailContact.link.replace("mailto:", "")
    : "hello@aadiqureshi89@gmail.com"; // Default fallback

  const linkedIn = contacts?.find((c) =>
    c.platform.toLowerCase().includes("linkedin")
  );
  const github = contacts?.find((c) =>
    c.platform.toLowerCase().includes("github")
  );

  const otherSocials =
    contacts?.filter(
      (c) =>
        !["linkedin", "github", "email", "gmail"].some((k) =>
          c.platform.toLowerCase().includes(k)
        )
    ) || [];

  const handleCopy = () => {
    navigator.clipboard.writeText(emailAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  useGSAP(
    () => {
      // Refresh ScrollTrigger to ensure accurate start positions
      ScrollTrigger.refresh();

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: container.current,
          start: "top 75%",
        },
      });

      tl.from(".shutdown-header", {
        y: 30,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out",
      });

      tl.from(
        ".bento-item",
        {
          y: 50,
          opacity: 0,
          scale: 0.95,
          stagger: 0.1,
          duration: 0.6,
          ease: "back.out(1.5)",
          clearProps: "all",
        },
        "-=0.4"
      );
    },
    //  CRITICAL FIX: Ensure animation runs when 'contacts' data loads
    { scope: container, dependencies: [contacts] }
  );

  return (
    <section
      ref={container}
      className="relative py-24 px-4 md:px-8 bg-[#050505] border-t border-white/5 overflow-hidden"
    >
      {/* Background Noise Texture */}
      <div className="absolute inset-0 opacity-[0.03] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] pointer-events-none" />

      {/* Background Glow */}
      <div className="absolute bottom-0 right-0 w-125 h-125 bg-indigo-600/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto w-full relative z-10">
        {/*  HEADER */}
        <div className="shutdown-header flex flex-col md:flex-row justify-between items-end mb-16 border-b border-white/5 pb-8">
          <div>
            <div className="flex items-center gap-2 text-emerald-500 mb-3 font-mono text-[10px] uppercase tracking-widest">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              Secure_Uplink_Established
            </div>
            <h2 className="text-4xl md:text-6xl font-black text-white tracking-tighter">
              INITIALIZE{" "}
              <span className="text-transparent bg-clip-text bg-linear-to-r from-indigo-500 to-purple-500">
                CONNECTION
              </span>
            </h2>
          </div>
          <div className="hidden md:block text-right">
            <Cpu
              className="text-zinc-700 ml-auto mb-2 animate-pulse"
              size={24}
            />
            <p className="font-mono text-[10px] text-zinc-600">
              ENCRYPTION: AES-256
              <br />
              STATUS: LISTENING
            </p>
          </div>
        </div>

        {/*  BENTO GRID LAYOUT */}
        <div className="grid grid-cols-1 md:grid-cols-4 md:grid-rows-2 gap-4 h-auto">
          {/* EMAIL COMMAND (Large Square)  */}
          <div className="bento-item col-span-1 md:col-span-2 md:row-span-2 relative bg-[#0e0e10] border border-white/10 rounded-3xl p-8 flex flex-col justify-between overflow-hidden group hover:border-white/20 transition-all duration-500 min-h-100">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,var(--tw-gradient-stops))] from-indigo-500/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            <div>
              <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center mb-6 border border-white/5 text-white group-hover:scale-110 group-hover:bg-indigo-500 group-hover:border-indigo-400 transition-all duration-300 shadow-xl">
                <Mail size={28} />
              </div>
              <h3 className="text-3xl font-bold text-white mb-3">
                Project Inquiry
              </h3>
              <p className="text-zinc-400 text-sm leading-relaxed max-w-sm">
                Have a vision? Let&apos;s engineer it. I am currently available
                for freelance work and full-time opportunities.
              </p>
            </div>

            <div className="space-y-3 relative z-10 mt-8">
              <div className="flex items-center gap-2 p-1 bg-black/40 border border-white/10 rounded-xl pl-4 pr-1">
                <span className="font-mono text-zinc-300 text-xs md:text-sm truncate flex-1">
                  {emailAddress}
                </span>
                <button
                  onClick={handleCopy}
                  className="p-2.5 bg-white/5 hover:bg-white/10 rounded-lg text-zinc-400 hover:text-white transition-colors"
                  title="Copy Address"
                >
                  {copied ? (
                    <Check size={16} className="text-emerald-500" />
                  ) : (
                    <Copy size={16} />
                  )}
                </button>
              </div>
              <a
                href={`mailto:${emailAddress}`}
                className="flex items-center justify-center gap-2 w-full bg-white text-black font-bold py-4 rounded-xl hover:bg-indigo-500 hover:text-white transition-all duration-300 group/btn shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_25px_rgba(99,102,241,0.4)]"
              >
                <Send
                  size={18}
                  className="group-hover/btn:-translate-y-1 group-hover/btn:translate-x-1 transition-transform"
                />
                <span>Send Transmission</span>
              </a>
            </div>
          </div>

          {/* SLOT 2 & 3: PRIMARY SOCIALS  */}
          <div className="col-span-1 md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* LinkedIn */}
            <a
              href={linkedIn?.link || "#"}
              target="_blank"
              className={`bento-item bg-[#0e0e10] border border-white/10 rounded-3xl p-6 flex flex-col justify-between group transition-all duration-300 ${
                getPlatformStyle("linkedin").border
              } ${getPlatformStyle("linkedin").bg}`}
            >
              <div className="flex justify-between items-start">
                <div
                  className={`p-3 rounded-xl bg-white/5 ${
                    getPlatformStyle("linkedin").color
                  }`}
                >
                  <Linkedin size={24} />
                </div>
                <ArrowUpRight className="text-zinc-600 group-hover:text-white transition-colors" />
              </div>
              <div className="mt-8">
                <h4 className="text-white font-bold text-lg">LinkedIn</h4>
                <p className="text-zinc-500 text-xs">Professional Network</p>
              </div>
            </a>

            {/* GitHub */}
            <a
              href={github?.link || "#"}
              target="_blank"
              className={`bento-item bg-[#0e0e10] border border-white/10 rounded-3xl p-6 flex flex-col justify-between group transition-all duration-300 ${
                getPlatformStyle("github").border
              } ${getPlatformStyle("github").bg}`}
            >
              <div className="flex justify-between items-start">
                <div
                  className={`p-3 rounded-xl bg-white/5 ${
                    getPlatformStyle("github").color
                  }`}
                >
                  <Github size={24} />
                </div>
                <ArrowUpRight className="text-zinc-600 group-hover:text-white transition-colors" />
              </div>
              <div className="mt-8">
                <h4 className="text-white font-bold text-lg">GitHub</h4>
                <p className="text-zinc-500 text-xs">Code Repository</p>
              </div>
            </a>
          </div>

          {/* SLOT 4: DYNAMIC SOCIAL STACK  */}
          <div className="col-span-1 md:col-span-2 grid grid-cols-3 gap-4">
            {otherSocials.slice(0, 3).map((contact, i) => {
              const style = getPlatformStyle(contact.platform);
              return (
                <a
                  key={contact._id || i}
                  href={contact.link}
                  target="_blank"
                  className={`bento-item bg-[#0e0e10] border border-white/10 rounded-3xl flex flex-col items-center justify-center gap-3 group transition-all duration-300 ${style.border} ${style.bg} min-h-35`}
                >
                  <div
                    className={`${style.color} opacity-70 group-hover:opacity-100 group-hover:scale-110 transition-all`}
                  >
                    {style.icon}
                  </div>
                  <span className="text-[10px] font-bold text-zinc-500 uppercase group-hover:text-white tracking-wider">
                    {contact.platform}
                  </span>
                </a>
              );
            })}

            {/* Placeholder: If no extra socials, show Resume */}
            {otherSocials.length < 3 && (
              <a
                href="/resume.pdf"
                target="_blank"
                className="bento-item bg-[#0e0e10] border border-white/10 rounded-3xl flex flex-col items-center justify-center gap-3 group hover:border-orange-500/50 hover:bg-orange-500/10 transition-all duration-300 min-h-35"
              >
                <Terminal
                  size={24}
                  className="text-orange-500 opacity-70 group-hover:opacity-100 group-hover:scale-110 transition-transform"
                />
                <span className="text-[10px] font-bold text-zinc-500 uppercase group-hover:text-white tracking-wider">
                  RESUME
                </span>
              </a>
            )}
          </div>
        </div>

        {/*  FOOTER */}
        <div className="mt-16 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center text-[10px] font-mono text-zinc-600 uppercase tracking-widest">
          <div className="flex items-center gap-2 mb-2 md:mb-0">
            <Power size={12} className="text-red-500" />
            <span>SYSTEM SHUTDOWN PENDING...</span>
          </div>
          <p className="hover:text-zinc-400 transition-colors">
            © 2025 ADNAN QURESHI // DESIGNED IN INDORE, INDIA
          </p>
        </div>
      </div>
    </section>
  );
}
