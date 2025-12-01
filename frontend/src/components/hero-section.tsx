"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Users, Building2,  } from "lucide-react"

export function HeroSection() {
  return (
    <section className="relative min-h-screen overflow-hidden ">
      {/* Background Effects */}
      <div className="absolute inset-0 -z-10">
        {/* Gradient Orbs */}
        <div className="absolute left-1/4 top-1/ h-[500px] w-[500px] rounded-full bg-primary/20 blur-[120px] animate-pulse-glow" />
        <div
          className="absolute right-1/4 bottom-1/4 h-[400px] w-[400px] rounded-full bg-accent/15 blur-[100px] animate-pulse-glow"
          style={{ animationDelay: "1.5s" }}
        />
        <div
          className="absolute left-1/2 top-1/2 h-[300px] w-[300px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-chart-3/10 blur-[80px] animate-pulse-glow"
          style={{ animationDelay: "3s" }}
        />

        {/* Grid Pattern */}
        <div
          className="absolute inset-0 opacity-[0.015]"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      <div className="mx-auto mt-15 max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center py-20">


          {/* Main Heading */}
          <h1 className="mb-6 max-w-4xl text-center text-4xl font-bold leading-tight tracking-tight text-foreground sm:text-5xl md:text-6xl lg:text-7xl animate-fade-in-up text-balance">
            Connect Brands &{" "}
            <span className="bg-gradient-to-r from-primary via-chart-3 to-accent bg-clip-text text-transparent animate-gradient">
              Influencers
            </span>{" "}
            Seamlessly
          </h1>

          {/* Subtitle */}
          <p
            className="mb-10 max-w-2xl text-center text-lg text-muted-foreground sm:text-xl animate-fade-in-up text-pretty"
            style={{ animationDelay: "0.2s" }}
          >
            The ultimate platform for sponsorship and collaboration. Find your perfect match, accelerate growth, and
            build lasting partnerships.
          </p>

          {/* CTA Buttons */}
          <div
            className="flex flex-col items-center gap-4 sm:flex-row animate-fade-in-up"
            style={{ animationDelay: "0.4s" }}
          >
            <Button size="lg" className="group h-12 px-8 text-base" asChild>
              <Link href="/signup">
                Get Started
                <ArrowRight className=" h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
            
          </div>

          {/* Stats */}
          <div
            className="mt-20 grid w-full max-w-3xl grid-cols-2 gap-8 sm:grid-cols-4 animate-fade-in-up"
            style={{ animationDelay: "0.6s" }}
          >
            <div className="text-center">
              <div className="text-3xl font-bold text-foreground sm:text-4xl">10K+</div>
              <div className="mt-1 text-sm text-muted-foreground">Influencers</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-foreground sm:text-4xl">2.5K+</div>
              <div className="mt-1 text-sm text-muted-foreground">Brands</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-foreground sm:text-4xl">50K+</div>
              <div className="mt-1 text-sm text-muted-foreground">Campaigns</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-foreground sm:text-4xl">$25M+</div>
              <div className="mt-1 text-sm text-muted-foreground">Paid Out</div>
            </div>
          </div>

          {/* Floating Cards */}
          <div className="relative mt-16 w-full max-w-5xl">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {/* Influencer Card */}
              <div className="glass-card group relative overflow-hidden rounded-2xl p-6 transition-all duration-300 hover:scale-[1.02] hover:border-primary/30 animate-float">
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/20">
                    <Users className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">For Influencers</h3>
                    <p className="text-sm text-muted-foreground">Content Creators</p>
                  </div>
                </div>
                <p className="mb-4 text-sm text-muted-foreground">
                  Showcase your reach, connect with brands that align with your niche, and monetize your influence
                  effectively.
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="rounded-full bg-primary/10 px-3 py-1 text-xs text-primary">Tech</span>
                  <span className="rounded-full bg-accent/10 px-3 py-1 text-xs text-accent">Gaming</span>
                  <span className="rounded-full bg-chart-3/10 px-3 py-1 text-xs text-chart-3">Lifestyle</span>
                </div>
              </div>

              {/* Company Card */}
              <div className="glass-card group relative overflow-hidden rounded-2xl p-6 transition-all duration-300 hover:scale-[1.02] hover:border-accent/30 animate-float-delayed">
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent/20">
                    <Building2 className="h-6 w-6 text-accent" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">For Companies</h3>
                    <p className="text-sm text-muted-foreground">Brands & Businesses</p>
                  </div>
                </div>
                <p className="mb-4 text-sm text-muted-foreground">
                  Find influencers tailored to your product type, launch campaigns, and track performance with ease.
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="rounded-full bg-accent/10 px-3 py-1 text-xs text-accent">Skincare</span>
                  <span className="rounded-full bg-primary/10 px-3 py-1 text-xs text-primary">Fashion</span>
                  <span className="rounded-full bg-chart-3/10 px-3 py-1 text-xs text-chart-3">Food</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
