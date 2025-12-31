import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";

import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

//  VIEWPORT CONFIGURATION (Separate export in Next.js 14+)
export const viewport: Viewport = {
  themeColor: "#050505",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

// 2. METADATA CONFIGURATION
export const metadata: Metadata = {
  metadataBase: new URL("https://adnanos.vercel.app/"), 

  title: {
    default: "Adnan Qureshi | Software Developer & Full Stack Developer",
    template: "%s | Adnan.OS",
  },

  description:
    "Access the digital workspace of Adnan Qureshi. A high-performance portfolio showcasing expertise in MERN Stack, Next.js, System Architecture, and Competitive Programming.",

  applicationName: "Adnan.OS",
  authors: [{ name: "Adnan Qureshi", url: "https://adnanos.vercel.app/" }],
  keywords: [
    "Adnan Qureshi",
    "Full Stack Developer",
    "MERN Stack",
    "Next.js Developer",
    "System Architecture",
    "Software Development",
    "Web Developer",
    "Software Engineer",
    "React Developer",
    "Portfolio",
    "AdnanOS",
    "",
  ],

  // Open Graph (For LinkedIn, Facebook, WhatsApp previews)
  openGraph: {
    title: "Adnan.OS // System Online",
    description:
      "Architecting scalable digital ecosystems. Explore the projects and execution history of Adnan Qureshi.",
    url: "https://adnanos.vercel.app/",
    siteName: "Adnan Qureshi Portfolio",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Adnan.OS Digital Interface",
      },
    ],
  },

  // Twitter Card (For X/Twitter)
  twitter: {
    card: "summary_large_image",
    title: "Adnan.OS // System Architect",
    description:
      "Full Stack Developer specializing in robust backend protocols and high-performance frontends.",
    creator: "@1nadanparinda",
    images: ["/og-image.png"],
  },

  // Icons (Favicon)
  icons: {
    icon: "/icon.svg",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },

  // Robot Crawling (SEO)
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} bg-[#050505] text-zinc-300 antialiased selection:bg-indigo-500/30 selection:text-indigo-200`}
      >
        {children}
      </body>
    </html>
  );
}
