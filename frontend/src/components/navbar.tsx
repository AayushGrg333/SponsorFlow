/* eslint-disable @typescript-eslint/no-explicit-any */
// eslint-disable-next-line react-hooks/exhaustive-deps
// eslint-disable-next-line @next/next/no-img-element
"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Menu, X, Zap } from "lucide-react"

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-white/70 dark:bg-black/70 shadow-md" role="navigation">
  <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
    <div className="flex h-20 items-center justify-between">
      {/* Logo */}
      <Link href="/" className="flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg">
          <img src="/sponsorflow_logo.png" alt="SponsorFlow Logo"  className="h-8 w-8" />
        </div>
        <span className="text-xl font-bold text-foreground">SponsorFlow</span>
      </Link>

      {/* Desktop Nav */}
      <div className="hidden md:flex items-center gap-8">
        {["Features", "How It Works", "Testimonials"].map((item) => (
          <Link
            key={item}
            href={`#${item.toLowerCase().replace(/\s/g, "-")}`}
            className="text-sm text-muted-foreground transition-colors hover:text-foreground hover:underline"
          >
            {item}
          </Link>
        ))}
      </div>

      {/* Desktop Buttons */}
      <div className="hidden md:flex items-center gap-3">
        <Button variant="ghost" asChild>
          <Link href="/login">Log In</Link>
        </Button>
        <Button asChild>
          <Link href="/signup">Get Started</Link>
        </Button>
      </div>

      {/* Mobile Menu Toggle */}
      <button
        className="md:hidden p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        aria-label="Toggle menu"
      >
        {isMenuOpen ? <X className="h-6 w-6 text-foreground" /> : <Menu className="h-6 w-6 text-foreground" />}
      </button>
    </div>

    {/* Mobile Menu */}
    <div
      className={`md:hidden transition-max-height duration-300 ease-in-out overflow-hidden ${
        isMenuOpen ? "max-h-[500px]" : "max-h-0"
      }`}
    >
      <div className="flex flex-col gap-4 py-4 border-t border-border">
        {["Features", "How It Works", "Pricing", "Testimonials"].map((item) => (
          <Link
            key={item}
            href={`#${item.toLowerCase().replace(/\s/g, "-")}`}
            className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            onClick={() => setIsMenuOpen(false)}
          >
            {item}
          </Link>
        ))}
        <div className="flex flex-col gap-2 pt-4">
          <Button variant="ghost" asChild className="w-full">
            <Link href="/login">Log In</Link>
          </Button>
          <Button asChild className="w-full">
            <Link href="/signup">Get Started</Link>
          </Button>
        </div>
      </div>
    </div>
  </div>
</nav>

  )
}
