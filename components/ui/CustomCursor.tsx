"use client";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const followerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const xTo = gsap.quickTo(cursorRef.current, "x", {
      duration: 0.1,
      ease: "power3",
    });
    const yTo = gsap.quickTo(cursorRef.current, "y", {
      duration: 0.1,
      ease: "power3",
    });
    const xToFollower = gsap.quickTo(followerRef.current, "x", {
      duration: 0.3,
      ease: "power3",
    });
    const yToFollower = gsap.quickTo(followerRef.current, "y", {
      duration: 0.3,
      ease: "power3",
    });

    window.addEventListener("mousemove", (e) => {
      xTo(e.clientX);
      yTo(e.clientY);
      xToFollower(e.clientX);
      yToFollower(e.clientY);
    });

    // Hover Effects
    const targets = document.querySelectorAll("a, button, .hover-trigger");
    targets.forEach((el) => {
      el.addEventListener("mouseenter", () => {
        gsap.to(followerRef.current, {
          scale: 3,
          opacity: 0.5,
          backgroundColor: "#fff",
          mixBlendMode: "difference",
        });
      });
      el.addEventListener("mouseleave", () => {
        gsap.to(followerRef.current, {
          scale: 1,
          opacity: 1,
          backgroundColor: "transparent",
          mixBlendMode: "normal",
        });
      });
    });

    return () => window.removeEventListener("mousemove", () => {});
  });

  return (
    <>
      <div
        ref={cursorRef}
        className="fixed top-0 left-0 w-2 h-2 bg-white rounded-full pointer-events-none z-9999 mix-blend-difference hidden md:block"
      />
      <div
        ref={followerRef}
        className="fixed top-0 left-0 w-8 h-8 border border-white/50 rounded-full pointer-events-none z-9998 -translate-x-1/2 -translate-y-1/2 hidden md:block transition-colors"
      />
    </>
  );
}
