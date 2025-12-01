import type { ReactNode } from "react";
import type { Metadata } from "next";
import { Inter, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import "./globals.css";

// ------------------------------
// Fonts
// ------------------------------
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

// ------------------------------
// Metadata
// ------------------------------
export const metadata: Metadata = {
  title: "SponsorFlow - Connect Brands & Influencers",
  description:
    "The ultimate platform connecting brands and influencers for seamless sponsorship and collaboration opportunities. Find your perfect match and accelerate growth.",
  keywords: [
    "influencer marketing",
    "brand sponsorship",
    "collaboration",
    "creator economy",
  ],
};

// ------------------------------
// Root Layout Component
// ------------------------------
interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <body
        className={`${inter.variable} ${geistMono.variable} font-sans antialiased min-h-screen`}
      >
        {children}
        <Analytics />
      </body>
    </html>
  );
}
