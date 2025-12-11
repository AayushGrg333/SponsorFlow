"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"
import { Zap, Mail, Lock, Eye, EyeOff, Users, Building2, Loader2, User, Building, Check } from "lucide-react"
import { influencerAPI, companyAPI, authAPI } from "@/lib/api"

export default function SignupPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<"influencer" | "company">("influencer")
  const [acceptTerms, setAcceptTerms] = useState(false)
  const [slug, setSlug] = useState<string>("")

  const [influencerData, setInfluencerData] = useState({
    username: "",
    email: "",
    password: "",
  })

  const [companyData, setCompanyData] = useState({
    companyName: "",
    email: "",
    password: "",
  })

  useEffect(() => {
    const type = searchParams.get("type")
    if (type === "company") {
      setActiveTab("company")
    } else if (type === "influencer") {
      setActiveTab("influencer")
    }
  }, [searchParams])

  const handleInfluencerSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!acceptTerms) return
    setIsLoading(true)
    setError(null)

    const { data, error: apiError } = await influencerAPI.signup(influencerData)
    if (apiError) {
      setError(apiError)
      setIsLoading(false)
      return
    }

    router.push(`/signup/verify/influencer/${influencerData.username}`)
  }

  const handleCompanySubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!acceptTerms) return
    setIsLoading(true)
    setError(null)

    const { data, error: apiError, } = await companyAPI.signup(companyData)
    setSlug(data?.slug || "")
    if (apiError) {
      setError(apiError)
      setIsLoading(false)
      return
    }

    router.push(`/signup/verify/company/${slug}`)
  }

  const handleGoogleSignup = () => {
    setIsLoading(true)
    window.location.href = authAPI.getGoogleAuthUrl(activeTab)
  }

  const benefits = [
    "Access to thousands of brands/influencers",
    "AI-powered matchmaking (coming soon)",
    "Secure messaging & payments",
    "Campaign analytics & tracking",
  ]

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

        <div className="space-y-8">
          <div className="space-y-6">
            <h1 className="text-4xl font-bold text-foreground text-balance">
              Join the{" "}
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">#1 platform</span>{" "}
              for brand-influencer collaborations
            </h1>
            <p className="max-w-md text-lg text-muted-foreground">
              Create your free account and start connecting with the perfect partners for your growth.
            </p>
          </div>

          <div className="space-y-4">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex items-center gap-3">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/20">
                  <Check className="h-4 w-4 text-primary" />
                </div>
                <span className="text-muted-foreground">{benefit}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div>
            <p className="text-sm font-medium text-foreground">Join 10,000+ users</p>
            <p className="text-sm text-muted-foreground">who trust SponsorFlow</p>
          </div>
        </div>
      </div>

      {/* Right Side - Signup Form */}
      <div className="flex w-full flex-col justify-center px-4 py-12 lg:w-1/2 lg:px-12">
        <Link href="/" className="mb-8 flex items-center gap-2 lg:hidden">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg ">
          <img src="/sponsorflow_logo.png" alt="SponsorFlow Logo"  className="h-8 w-8" />

          </div>
          <span className="text-xl font-bold text-foreground">SponsorFlow</span>
        </Link>

        <div className="mx-auto w-full max-w-md">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-foreground sm:text-3xl">Create your account</h2>
            <p className="mt-2 text-muted-foreground">
              Already have an account?{" "}
              <Link href="/login" className="font-medium text-primary hover:underline">
                Log in
              </Link>
            </p>
          </div>

          {error && <div className="mb-4 rounded-lg bg-destructive/10 p-3 text-sm text-destructive">{error}</div>}

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

            {/* Influencer Signup Form */}
            <TabsContent value="influencer" className="mt-6">
              <Button
                variant="outline"
                className="mb-6 w-full gap-2 border-border bg-secondary hover:bg-secondary/80"
                onClick={handleGoogleSignup}
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
                Sign up with Google
              </Button>

              <div className="relative mb-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">Or continue with email</span>
                </div>
              </div>

              <form onSubmit={handleInfluencerSubmit} className="space-y-4">
                <div className="grid grid-cols-1 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="username">Username</Label>
                    <div className="relative"
                    >
                    <Input
                      id="username"
                      placeholder="@johndoe"
                      value={influencerData.username}
                      onChange={(e) => setInfluencerData({ ...influencerData, username: e.target.value })}
                      required
                    />
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="influencer-email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="influencer-email"
                      type="email"
                      placeholder="you@example.com"
                      className="pl-10"
                      value={influencerData.email}
                      onChange={(e) => setInfluencerData({ ...influencerData, email: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="influencer-password">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="influencer-password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Min. 8 characters"
                      className="pl-10 pr-10"
                      value={influencerData.password}
                      onChange={(e) => setInfluencerData({ ...influencerData, password: e.target.value })}
                      required
                      minLength={8}
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

                <div className="flex items-start gap-2">
                  <Checkbox
                    id="terms-influencer"
                    checked={acceptTerms}
                    onCheckedChange={(checked) => setAcceptTerms(checked as boolean)}
                  />
                  <label htmlFor="terms-influencer" className="text-sm text-muted-foreground">
                    I agree to the{" "}
                    <Link href="#" className="text-primary hover:underline">
                      Terms of Service
                    </Link>{" "}
                    and{" "}
                    <Link href="#" className="text-primary hover:underline">
                      Privacy Policy
                    </Link>
                  </label>
                </div>

                <Button type="submit" className="w-full" disabled={isLoading || !acceptTerms}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating account...
                    </>
                  ) : (
                    "Create Influencer Account"
                  )}
                </Button>
              </form>
            </TabsContent>

            {/* Company Signup Form */}
            <TabsContent value="company" className="mt-6">
              <Button
                variant="outline"
                className="mb-6 w-full gap-2 border-border bg-secondary hover:bg-secondary/80"
                onClick={handleGoogleSignup}
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
                Sign up with Google
              </Button>

              <div className="relative mb-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">Or continue with email</span>
                </div>
              </div>

              <form onSubmit={handleCompanySubmit} className="space-y-4">
                <div className="grid grid-cols-1 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="companyName">Company Name</Label>
                    <div className="relative">
                      <Building className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        id="companyName"
                        placeholder="Company private limited"
                        className="pl-10"
                        value={companyData.companyName}
                        onChange={(e) => setCompanyData({ ...companyData, companyName: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="company-email">Business Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="company-email"
                      type="email"
                      placeholder="you@company.com"
                      className="pl-10"
                      value={companyData.email}
                      onChange={(e) => setCompanyData({ ...companyData, email: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="company-password">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="company-password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Min. 8 characters"
                      className="pl-10 pr-10"
                      value={companyData.password}
                      onChange={(e) => setCompanyData({ ...companyData, password: e.target.value })}
                      required
                      minLength={8}
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

                <div className="flex items-start gap-2">
                  <Checkbox
                    id="terms-company"
                    checked={acceptTerms}
                    onCheckedChange={(checked) => setAcceptTerms(checked as boolean)}
                  />
                  <label htmlFor="terms-company" className="text-sm text-muted-foreground">
                    I agree to the{" "}
                      Terms of Service
                    and{" "}
                      Privacy Policy
                  </label>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-accent hover:bg-accent/90 text-accent-foreground"
                  disabled={isLoading || !acceptTerms}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating account...
                    </>
                  ) : (
                    "Create Company Account"
                  )}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
