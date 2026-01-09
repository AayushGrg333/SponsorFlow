/* eslint-disable @typescript-eslint/no-explicit-any */
// eslint-disable-next-line react-hooks/exhaustive-deps
// eslint-disable-next-line @next/next/no-img-element
"use client"

import { useState, useEffect } from "react"
import { Sidebar } from "@/components/dashboard/sidebar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Loader2, MapPin, Calendar, Building2, Package, Globe, Instagram, Linkedin, Twitter, Youtube, Facebook, MessageSquare } from "lucide-react"
import Link from "next/link"
import { companyAPI, campaignsAPI } from "@/lib/api"
import { authStorage } from "@/lib/authHelper"
import { useParams } from "next/navigation"

const platformIcons = {
  website: Globe,
  instagram: Instagram,
  linkedin: Linkedin,
  twitter: Twitter,
  youtube: Youtube,
  facebook: Facebook,
}

interface CompanyProfile {
  _id: string
  companyName: string
  email: string
  addressType: string
  address?: string
  contactNumber: string
  description?: string
  profileImage?: string
  contentType: { content: string }[]
  products: string[]
  establishedYear: number
  socialLinks: { platform: string; link: string }[]
}

export default function CompanyPublicProfile() {
const params = useParams<{ id: string }>()
  const [profile, setProfile] = useState<CompanyProfile | null>(null)
  const [campaigns, setCampaigns] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    const storedUser = authStorage.getUser()
    setUser(storedUser)
    loadProfile()
    loadCampaigns()
  }, [params.id])

  const loadProfile = async () => {
    try {
      setLoading(true)
      const response = await companyAPI.getPublicProfile(params.id)
      const data = (response.data as { data: CompanyProfile }).data
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

  const loadCampaigns = async () => {
    try {
      const response = await campaignsAPI.getByCompany(params.id)
      const data = (response.data as { data: any[] }).data
      if (data && !response.error) {
        setCampaigns(data.filter((c: any) => c.status === 'active'))
      }
    } catch (error) {
      console.error('Error loading campaigns:', error)
    }
  }

  const getPlatformIcon = (platform: string) => {
    return platformIcons[platform.toLowerCase() as keyof typeof platformIcons] || Globe
  }

  const getLocation = () => {
    if (!profile) return ""
    if (profile.addressType === "Online") return "Online Business"
    return profile.address || "Location not specified"
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Sidebar userType={user?.role || "influencer"} />
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
        <Sidebar userType={user?.role || "influencer"} />
        <main className="lg:pl-64">
          <div className="flex items-center justify-center min-h-screen">
            <div className="text-center">
              <h3 className="text-lg font-medium text-foreground">Profile not found</h3>
              <Button className="mt-4" asChild>
                <Link href="/dashboard/influencer/discover">Back to Discovery</Link>
              </Button>
            </div>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Sidebar userType={user?.role || "influencer"} />

      <main className="lg:pl-64">
        <div className="px-4 py-8 pt-24 lg:px-8 lg:pt-8">
          <Button variant="ghost" size="sm" asChild className="mb-4">
            <Link href="/dashboard/influencer/discover">
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
                    alt={profile.companyName}
                    className="h-32 w-32 rounded-xl object-cover ring-4 ring-primary/20"
                  />
                </div>
              </div>

              <div className="text-center">
                <h2 className="text-xl font-bold text-foreground">{profile.companyName}</h2>
                <div className="mt-2 flex items-center justify-center gap-1 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  {getLocation()}
                </div>
              </div>

              {/* Stats */}
              <div className="mt-6 grid grid-cols-2 gap-4 text-center">
                <div className="rounded-lg bg-secondary p-3">
                  <p className="text-xl font-bold text-foreground">{profile.establishedYear}</p>
                  <p className="text-xs text-muted-foreground">Established</p>
                </div>
                <div className="rounded-lg bg-secondary p-3">
                  <p className="text-xl font-bold text-foreground">{campaigns.length}</p>
                  <p className="text-xs text-muted-foreground">Active Campaigns</p>
                </div>
              </div>

              {/* Action Buttons */}
              {user?.role === "influencer" && (
                <div className="mt-6 space-y-2">
                  <Button className="w-full">
                    <MessageSquare className="mr-2 h-4 w-4" />
                    Contact
                  </Button>
                </div>
              )}

              {/* Categories */}
              {profile.contentType.length > 0 && (
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
              )}
            </div>

            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* About */}
              <div className="glass-card rounded-xl p-6">
                <h3 className="text-lg font-semibold text-foreground mb-4">About</h3>
                <p className="text-muted-foreground whitespace-pre-wrap">
                  {profile.description || "No description available"}
                </p>

                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                      <Calendar className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Established</p>
                      <p className="font-medium text-foreground">{profile.establishedYear}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10">
                      <Building2 className="h-5 w-5 text-accent" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Type</p>
                      <p className="font-medium text-foreground capitalize">{profile.addressType}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Products */}
              {profile.products.length > 0 && (
                <div className="glass-card rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-foreground mb-4">Products & Services</h3>
                  <div className="flex flex-wrap gap-2">
                    {profile.products.map((product, index) => (
                      <Badge key={index} variant="outline" className="capitalize">
                        <Package className="mr-1 h-3 w-3" />
                        {product}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Active Campaigns */}
              {campaigns.length > 0 && (
                <div className="glass-card rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-foreground mb-4">Active Campaigns</h3>
                  <div className="space-y-3">
                    {campaigns.slice(0, 3).map((campaign) => (
                      <Link
                        key={campaign._id}
                        href={`/dashboard/influencer/campaigns/${campaign._id}`}
                        className="flex items-center justify-between p-3 rounded-lg border border-border bg-secondary/30 hover:bg-secondary/50 transition-colors"
                      >
                        <div>
                          <h4 className="font-medium text-foreground">{campaign.title}</h4>
                          <p className="text-xs text-muted-foreground mt-1">
                            {new Date(campaign.startDate).toLocaleDateString()} - {new Date(campaign.endDate).toLocaleDateString()}
                          </p>
                        </div>
                        <Badge variant="secondary" className="capitalize">
                          {campaign.status}
                        </Badge>
                      </Link>
                    ))}
                  </div>
                  {campaigns.length > 3 && (
                    <Button variant="ghost" size="sm" className="w-full mt-3">
                      View All Campaigns ({campaigns.length})
                    </Button>
                  )}
                </div>
              )}

              {/* Social Links */}
              {profile.socialLinks.length > 0 && (
                <div className="glass-card rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-foreground mb-4">Connect</h3>
                  <div className="space-y-3">
                    {profile.socialLinks.map((link) => {
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
                          <span className="truncate capitalize">{link.platform}</span>
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