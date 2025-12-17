"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Zap, Mail, Lock, Eye, EyeOff, Users, Building2, Loader2 } from "lucide-react"
import { authAPI, authHelpers } from "@/lib/api"
import { authStorage } from "@/lib/authHelper"

export default function LoginPage() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<"influencer" | "company">("influencer")
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault()
  setIsLoading(true)
  setError(null)

  const { data, error: apiError } = await authAPI.login(
    formData.email,
    formData.password,
    activeTab
  )

  setIsLoading(false)

  if (apiError || !data) {
    setError(apiError || "Something went wrong")
    return
  }

authHelpers.setTokens(data.accessToken)           // store token
authStorage.setUser(data.user)                    // store user
// Redirect based on profile completion
if (data.user.isProfileComplete) {
  router.push(
    data.user.role === "influencer"
      ? "/dashboard/influencer"
      : "/dashboard/company"
  );
} else {
  router.push(`/profile/setup/${data.user.role}`);
}

}
  const handleGoogleLogin = () => {
    setIsLoading(true)
    window.location.href = authAPI.getGoogleAuthUrl(activeTab)
  }

  return (
    <div className="relative flex min-h-screen">
      {/* Background Effects */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute left-1/4 top-1/4 h-[500px] w-[500px] rounded-full bg-primary/15 blur-[120px]" />
        <div className="absolute right-1/4 bottom-1/4 h-[400px] w-[400px] rounded-full bg-accent/10 blur-[100px]" />
      </div>

      {/* Left Side - Branding */}
      <div className="hidden w-1/2 flex-col justify-between bg-card/30 p-12 lg:flex">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg ">
          <img src="/sponsorflow_logo.png" alt="SponsorFlow Logo"  className="h-10 w-10" />

          </div>
          <span className="text-2xl font-bold text-foreground">SponsorFlow</span>
        </Link>

        <div className="space-y-6">
          <h1 className="text-4xl font-bold text-foreground text-balance">
            Welcome back to the future of{" "}
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              influencer marketing
            </span>
          </h1>
          <p className="max-w-md text-lg text-muted-foreground">
            Log in to access your dashboard, manage collaborations, and grow your partnerships.
          </p>
        </div>

        <div className="glass-card rounded-2xl p-6">
          <div className="flex items-center gap-4">
            <img src="/professional-avatar.png" alt="Testimonial" className="h-12 w-12 rounded-full object-cover" />
            <div>
              <p className="text-sm text-muted-foreground">
                &ldquo;SponsorFlow has revolutionized how we find and work with influencers.&rdquo;
              </p>
              <p className="mt-1 text-sm font-medium text-foreground">Alex Thompson, Brand Manager</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="flex w-full flex-col justify-center px-4 py-12 lg:w-1/2 lg:px-12">
        {/* Mobile Logo */}
        <Link href="/" className="mb-8 flex items-center gap-2 lg:hidden">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg ">
          <img src="/sponsorflow_logo.png" alt="SponsorFlow Logo"  className="h-10 w-10" />
          </div>
          <span className="text-xl font-bold text-foreground">SponsorFlow</span>
        </Link>

        <div className="mx-auto w-full max-w-md">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-foreground sm:text-3xl">Log in to your account</h2>
            <p className="mt-2 text-muted-foreground">
              Don&apos;t have an account?{" "}
              <Link href="/signup" className="font-medium text-primary hover:underline">
                Sign up
              </Link>
            </p>
          </div>

          {/* User Type Tabs */}
          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as typeof activeTab)} className="mb-6">
            <TabsList className="grid w-full grid-cols-2 bg-secondary">
              <TabsTrigger
                value="influencer"
                className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                <Users className="h-4 w-4" />
                Influencer
              </TabsTrigger>
              <TabsTrigger
                value="company"
                className="flex items-center gap-2 data-[state=active]:bg-accent data-[state=active]:text-accent-foreground"
              >
                <Building2 className="h-4 w-4" />
                Company
              </TabsTrigger>
            </TabsList>
          </Tabs>

          {error && <div className="mb-4 rounded-lg bg-destructive/10 p-3 text-sm text-destructive">{error}</div>}

          {/* Google Login */}
          <Button
            variant="outline"
            className="mb-6 w-full gap-2 border-border bg-secondary hover:bg-secondary/80"
            onClick={handleGoogleLogin}
            disabled={isLoading}
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="currentColor"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="currentColor"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="currentColor"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Continue with Google
          </Button>

          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">Or continue with email</span>
            </div>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  className="pl-10"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="pl-10 pr-10"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              className={`w-full ${activeTab === "company" ? "bg-accent hover:bg-accent/90 text-accent-foreground" : ""}`}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Logging in...
                </>
              ) : (
                `Log in as ${activeTab === "influencer" ? "Influencer" : "Company"}`
              )}
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}
