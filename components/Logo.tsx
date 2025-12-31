import React from "react";

export default function Logo({ className = "" }: { className?: string }) {
  return (
    <svg
      width="160"
      height="40"
      viewBox="0 0 160 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="ADNAN.OS Logo"
    >
      {/* The Icon Part */}
      <rect
        x="2"
        y="2"
        width="36"
        height="36"
        rx="8"
        fill="#09090b"
        stroke="#27272a"
        strokeWidth="1"
      />
      <path d="M20 10L10 32H15L17.5 26H22.5L25 32H30L20 10Z" fill="#f4f4f5" />
      <path d="M18.5 23L20 18L21.5 23H18.5Z" fill="#09090b" />

      {/* The Text Part (Monospaced look) */}
      <text
        x="48"
        y="26"
        fill="#f4f4f5"
        fontFamily="monospace"
        fontWeight="bold"
        fontSize="18"
        letterSpacing="0.5"
      >
        ADNAN.OS
      </text>

      {/* The Blinking Cursor Effect */}
      <rect x="142" y="13" width="8" height="16" fill="#f4f4f5">
        <animate
          attributeName="opacity"
          values="1;0;1"
          dur="1s"
          repeatCount="indefinite"
          calcMode="discrete"
        />
      </rect>
    </svg>
  );
}
