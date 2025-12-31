"use client";

import { useState, useEffect } from "react";
import CustomCursor from "@/components/ui/CustomCursor";
import SystemBoot from "@/components/home/SystemBoot";
import Hero from "@/components/home/Hero";
import ProjectSystem from "@/components/home/ProjectSystem";
import SystemStats from "@/components/home/SystemStats";
import DsaStats from "@/components/home/DsaStats";
import Certifications from "@/components/home/Certifications";
import Achievements from "@/components/home/Achievements";
import TechStack from "@/components/home/TechStack";
import ExperienceSystem from "@/components/home/ExperienceSystem";
import Dock from "@/components/home/Dock";
import SystemHeader from "@/components/home/SystemHeader";
import Shutdown from "@/components/home/Shutdown";
import BlogSystem from "@/components/home/BlogSystem";

function Loader() {
  return (
    <div className="h-screen w-full bg-[#09090b] flex items-center justify-center text-white font-mono animate-pulse">
      CONNECTING...
    </div>
  );
}

//  HELPER: Convert Drive Link to Clean Preview Link
const getCleanResumeLink = (resume: any) => {
  if (!resume) return "";

  // 1. If Drive Link exists, convert to "Preview" mode (Best for PDF)
  if (resume.driveLink && resume.driveLink.includes("drive.google.com")) {
    const match = resume.driveLink.match(/\/d\/(.+?)\//);
    if (match && match[1]) {
      return `https://drive.google.com/file/d/${match[1]}/preview`;
    }
    return resume.driveLink; // Fallback to original if regex fails
  }

  // 2. Fallback to Cloudinary (fileUrl)
  // Attempt to fix Cloudinary PDF issue by using 'raw' resource type if 'image' fails
  if (resume.fileUrl) {
    if (
      resume.fileUrl.endsWith(".pdf") &&
      resume.fileUrl.includes("/image/upload/")
    ) {
      // Try forcing raw if image fails (Optional try, but Drive is safer)
      // return resume.fileUrl.replace("/image/upload/", "/raw/upload/");
    }
    return resume.fileUrl;
  }

  return "";
};

export default function Home() {
  const [booted, setBooted] = useState(false);
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/portfolio-data");
        const json = await res.json();
        setData(json);
      } catch (error) {
        console.error("System Error: Failed to fetch data");
      }
    }
    load();
  }, []);

  if (!booted) return <SystemBoot onComplete={() => setBooted(true)} />;
  if (!data) return <Loader />;

  //  USE THE HELPER FUNCTION HERE
  const resumeUrl = getCleanResumeLink(data.resume);

  return (
    <main className="bg-[#09090b] min-h-screen text-zinc-100 font-sans selection:bg-purple-500/30 overflow-x-hidden">
      <CustomCursor />
      <SystemHeader />

      <Dock resumeUrl={resumeUrl} />

      <div
        className="fixed inset-0 z-0 opacity-[0.04] pointer-events-none mix-blend-overlay"
        style={{
          backgroundImage:
            'url("https://grainy-gradients.vercel.app/noise.svg")',
        }}
      />

      <div id="home">
        {" "}
        <Hero heroImage={data.heroImage} />{" "}
      </div>
      <div id="about">
        <TechStack skills={data.skills} />
        <SystemStats skills={data.skills} />
      </div>
      <DsaStats stats={data.dsa || []} />
      <div id="experience">
        <ExperienceSystem
          experience={data.experience}
          education={data.education}
        />
      </div>
      <div id="projects">
        {" "}
        <ProjectSystem projects={data.projects} />{" "}
      </div>
      <div id="blogs">
        {" "}
        <BlogSystem blogs={data.blogs || []} />{" "}
      </div>
      <div id="achievements">
        {" "}
        <Achievements achievements={data.achievements} />{" "}
      </div>
      <Certifications certs={data.certificates} />

      <div id="contact">
        <Shutdown contacts={data.contacts} />
      </div>
    </main>
  );
}
