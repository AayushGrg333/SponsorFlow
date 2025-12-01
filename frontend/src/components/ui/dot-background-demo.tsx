import { cn } from "@/lib/utils";
import React from "react";

interface GridBackgroundDemoProps {
  children: React.ReactNode;
}

export function GridBackgroundDemo({ children }: GridBackgroundDemoProps) {
  return (
    <div className="relative w-full bg-white dark:bg-black overflow-hidden">

      {/* Responsive padding */}
      <div className="px-4 sm:px-6 lg:px-8 py-16 sm:py-24">

        {/* Grid background */}
        <div
          className={cn(
            "absolute inset-0",
            "[background-size:32px_32px] sm:[background-size:40px_40px]",
            "[background-image:linear-gradient(to_right,#e4e4e7_1px,transparent_1px),linear-gradient(to_bottom,#e4e4e7_1px,transparent_1px)]",
            "dark:[background-image:linear-gradient(to_right,#262626_1px,transparent_1px),linear-gradient(to_bottom,#262626_1px,transparent_1px)]",
          )}
        />

        {/* Subtle radial fade */}
        <div className="pointer-events-none absolute inset-0 bg-white dark:bg-black [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]" />

        {/* Actual content (HeroSection) */}
        <div className="relative z-20 max-w-7xl mx-auto">
          {children}
        </div>

      </div>
    </div>
  );
}
