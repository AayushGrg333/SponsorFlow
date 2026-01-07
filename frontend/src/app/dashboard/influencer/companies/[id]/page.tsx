"use client"

import { useState, useEffect, use } from "react"
import { Sidebar } from "@/components/dashboard/sidebar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Loader2, MapPin, Calendar, Building2, Package, Globe, Instagram, Linkedin, Twitter, Youtube, Facebook, MessageSquare, Briefcase } from "lucide-react"
import Link from "next/link"
import { companyAPI, campaignsAPI } from "@/lib/api"
import { authStorage } from "@/lib/authHelper"

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

// ✅ FIX 1: Update params type to be a Promise
export default function CompanyPublicProfile({ params }: { params: Promise<{ id: string }> }) {
  // ✅ FIX 1: Unwrap the params promise
  const { id } = use(params)
  
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
  }, [id]) // ✅ Use id instead of params.id

  const loadProfile = async () => {
    try {
      setLoading(true)
      // ✅ FIX 3: Add better error handling for 404
      const response = await companyAPI.getPublicProfile(id)
      
      console.log('Profile response:', response) // Debug log
      
      if (response.data && !response.error) {
        setProfile(response.data as CompanyProfile)
      } else {
        setError(response.error || "Profile not found")
      }
    } catch (error: any) {
      console.error('Error loading profile:', error)
      // ✅ Handle 404 specifically
      if (error.response?.status === 404) {
        setError("Company profile not found")
      } else {
        setError("Failed to load profile")
      }
    } finally {
      setLoading(false)
    }
  }

  const loadCampaigns = async () => {
    try {
      const response = await campaignsAPI.getByCompany(id)
      
      // ✅ FIX 2: Add debug log and safe array handling
      console.log('Campaigns response:', response)
      
      if (response.data && !response.error) {
        // ✅ FIX 2: Handle different response structures
        let campaignsData: any[] = []
        
        if (Array.isArray(response.data)) {
          campaignsData = response.data
        } else if (response.data.campaigns && Array.isArray(response.data.campaigns)) {
          campaignsData = response.data.campaigns
        } else if (response.data.data && Array.isArray(response.data.data)) {
          campaignsData = response.data.data
        } else {
          console.warn('Unexpected campaigns response structure:', response.data)
          campaignsData = []
        }
        
        // ✅ Now safely filter the array
        const activeCampaigns = campaignsData.filter((c: any) => c.status === 'active')
        setCampaigns(activeCampaigns)
      } else {
        setCampaigns([])
      }
    } catch (error) {
      console.error('Error loading campaigns:', error)
      setCampaigns([]) // ✅ Set empty array on error
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

  if (error || !profile) {
    return (
      <div className="min-h-screen bg-background">
        <Sidebar userType={user?.role || "influencer"} />
        <main className="lg:pl-64">
          <div className="flex items-center justify-center min-h-screen">
            <div className="text-center">
              <h3 className="text-lg font-medium text-foreground">
                {error || "Profile not found"}
              </h3>
              <p className="text-sm text-muted-foreground mt-2">
                The company profile you're looking for doesn't exist or has been removed.
              </p>
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