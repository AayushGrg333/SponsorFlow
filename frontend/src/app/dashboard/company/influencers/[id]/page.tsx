"use client"

import { useState, useEffect } from "react"
import { Sidebar } from "@/components/dashboard/sidebar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Loader2, Users, Calendar, Instagram, Youtube, Twitter, Facebook, Globe, MessageSquare } from "lucide-react"
import Link from "next/link"
import { influencerAPI } from "@/lib/api"
import { authStorage } from "@/lib/authHelper"
import { useParams } from "next/navigation"

const platformIcons = {
  instagram: Instagram,
  youtube: Youtube,
  twitter: Twitter,
  facebook: Facebook,
  website: Globe,
}

interface InfluencerProfile {
  _id: string
  username: string
  displayName: string
  bio?: string
  profileImage?: string
  contentType: { content: string }[]
  socialMediaProfileLinks: { platform: string; link: string }[]
  platforms: { platform: string; count: number }[]
  experienceYears: number
}

export default function InfluencerPublicProfile() {
     const params = useParams<{ id: string }>()
  const [profile, setProfile] = useState<InfluencerProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    const storedUser = authStorage.getUser()
    setUser(storedUser)
    loadProfile()
  }, [params.id])

  const loadProfile = async () => {
    try {
      setLoading(true)
      const response = await influencerAPI.getPublicProfile(params.id)
      const data = (response.data as { data: InfluencerProfile }).data
      if (data && !response.error) {
        setProfile(data)
      } else {
        setError(response.error || "Profile not found")
      }
    } catch (error) {
      console.error('Error loading profile:', error)
      setError("Failed to load profile")
    } finally {
      setLoading(false)
    }
  }

  const getTotalFollowers = () => {
    if (!profile) return "0"
    const total = profile.platforms.reduce((sum, p) => sum + p.count, 0)
    if (total >= 1000000) return `${(total / 1000000).toFixed(1)}M`
    if (total >= 1000) return `${(total / 1000).toFixed(0)}K`
    return total.toString()
  }

  const getPlatformIcon = (platform: string) => {
    return platformIcons[platform.toLowerCase() as keyof typeof platformIcons] || Globe
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Sidebar userType={user?.role || "company"} />
        <main className="lg:pl-64">
          <div className="flex items-center justify-center min-h-screen">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        </main>
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-background">
        <Sidebar userType={user?.role || "company"} />
        <main className="lg:pl-64">
          <div className="flex items-center justify-center min-h-screen">
            <div className="text-center">
              <h3 className="text-lg font-medium text-foreground">Profile not found</h3>
              <Button className="mt-4" asChild>
                <Link href="/dashboard/company/discover">Back to Discovery</Link>
              </Button>
            </div>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Sidebar userType={user?.role || "company"} />

      <main className="lg:pl-64">
        <div className="px-4 py-8 pt-24 lg:px-8 lg:pt-8">
          <Button variant="ghost" size="sm" asChild className="mb-4">
            <Link href="/dashboard/company/discover">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Link>
          </Button>

          <div className="grid gap-6 lg:grid-cols-3">
            {/* Profile Card */}
            <div className="glass-card rounded-xl p-6">
              <div className="relative mb-6">
                <div className="relative mx-auto w-fit">
                  <img
                    src={profile.profileImage || "/placeholder.svg"}
                    alt={profile.displayName}
                    className="h-32 w-32 rounded-full object-cover ring-4 ring-primary/20"
                  />
                </div>
              </div>

              <div className="text-center">
                <h2 className="text-xl font-bold text-foreground">{profile.displayName}</h2>
                <p className="text-muted-foreground">@{profile.username}</p>
                <div className="mt-2 flex items-center justify-center gap-1 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  {profile.experienceYears} years experience
                </div>
              </div>

              {/* Stats */}
              <div className="mt-6 grid grid-cols-2 gap-4 text-center">
                <div className="rounded-lg bg-secondary p-3">
                  <p className="text-xl font-bold text-foreground">{getTotalFollowers()}</p>
                  <p className="text-xs text-muted-foreground">Followers</p>
                </div>
                <div className="rounded-lg bg-secondary p-3">
                  <p className="text-xl font-bold text-foreground">{profile.platforms.length}</p>
                  <p className="text-xs text-muted-foreground">Platforms</p>
                </div>
              </div>

              {/* Action Buttons */}
              {user?.role === "company" && (
                <div className="mt-6 space-y-2">
                  <Button className="w-full">
                    <MessageSquare className="mr-2 h-4 w-4" />
                    Contact
                  </Button>
                </div>
              )}

              {/* Categories */}
              <div className="mt-6">
                <p className="mb-2 text-sm font-medium text-foreground">Categories</p>
                <div className="flex flex-wrap gap-2">
                  {profile.contentType.map((ct) => (
                    <Badge key={ct.content} variant="secondary">
                      {ct.content}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Bio */}
              {profile.bio && (
                <div className="glass-card rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-foreground mb-4">About</h3>
                  <p className="text-muted-foreground whitespace-pre-wrap">{profile.bio}</p>
                </div>
              )}

              {/* Platforms & Followers */}
              {profile.platforms.length > 0 && (
                <div className="glass-card rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-foreground mb-4">Platforms</h3>
                  <div className="grid gap-4 sm:grid-cols-2">
                    {profile.platforms.map((platform) => {
                      const Icon = getPlatformIcon(platform.platform)
                      const followers = platform.count >= 1000000 
                        ? `${(platform.count / 1000000).toFixed(1)}M`
                        : platform.count >= 1000
                        ? `${(platform.count / 1000).toFixed(0)}K`
                        : platform.count.toString()

                      return (
                        <div
                          key={platform.platform}
                          className="flex items-center gap-4 rounded-lg border border-border bg-secondary/30 p-4"
                        >
                          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                            <Icon className="h-6 w-6 text-primary" />
                          </div>
                          <div>
                            <p className="font-medium text-foreground capitalize">{platform.platform}</p>
                            <p className="text-sm text-muted-foreground">{followers} followers</p>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}

              {/* Social Links */}
              {profile.socialMediaProfileLinks.length > 0 && (
                <div className="glass-card rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-foreground mb-4">Social Links</h3>
                  <div className="space-y-3">
                    {profile.socialMediaProfileLinks.map((link) => {
                      const Icon = getPlatformIcon(link.platform)
                      return (
                        <a
                          key={link.platform}
                          href={link.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-3 text-sm text-muted-foreground hover:text-primary transition-colors"
                        >
                          <Icon className="h-5 w-5" />
                          <span className="truncate">{link.link}</span>
                        </a>
                      )
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}