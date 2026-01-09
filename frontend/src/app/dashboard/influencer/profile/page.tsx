/* eslint-disable @typescript-eslint/no-explicit-any */
// eslint-disable-next-line react-hooks/exhaustive-deps
// eslint-disable-next-line @next/next/no-img-element
"use client"

import { useState, useEffect } from "react"
import { Sidebar } from "@/components/dashboard/sidebar"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Edit2,
  Camera,
  Instagram,
  Youtube,
  Twitter,
  Facebook,
  Globe,
  Users,
  Eye,
  TrendingUp,
  Briefcase,
  Check,
  Loader2,
} from "lucide-react"
import { influencerAPI, applicationsAPI } from "@/lib/api"
import { authStorage } from "@/lib/authHelper"

const categories = [
  "Technology",
  "Gaming",
  "Lifestyle",
  "Fashion",
  "Beauty",
  "Skincare",
  "Food",
  "Travel",
  "Fitness",
  "Finance",
  "Education",
  "Entertainment",
]

const platformIcons = {
  instagram: Instagram,
  youtube: Youtube,
  twitter: Twitter,
  facebook: Facebook,
}

interface InfluencerProfile {
  _id: string
  username: string
  displayName: string
  realName: {
    givenName: string
    middleName?: string
    familyName: string
  }
  email: string
  bio?: string
  profileImage?: string
  contentType: { content: string }[]
  socialMediaProfileLinks: { platform: string; link: string }[]
  platforms: { platform: string; count: number }[]
  experienceYears: number
}

export default function InfluencerProfilePage() {
  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [loading, setLoading] = useState(true)
  const [profile, setProfile] = useState<InfluencerProfile | null>(null)
  const [user, setUser] = useState<any>(null)
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [applications, setApplications] = useState<any[]>([])

  // Edit form state
  const [formData, setFormData] = useState({
    displayName: "",
    bio: "",
    instagram: "",
    youtube: "",
    twitter: "",
    facebook: "",
    website: "",
  })

  useEffect(() => {
    const storedUser = authStorage.getUser()
    setUser(storedUser)
    if (storedUser) {
      loadProfile()
      loadApplications(storedUser.id)
    }
  }, [])

  const loadProfile = async () => {
    try {
      setLoading(true)
      const response = await influencerAPI.getPrivateProfile()
      console.log('Profile response:', response)

      if (response.data && !response.error) {
        const profileData = (response.data as { data: InfluencerProfile }).data;
        setProfile(profileData)
        setSelectedCategories(profileData.contentType.map(ct => ct.content))
        
        // Set form data
        const socialLinks = profileData.socialMediaProfileLinks
        setFormData({
          displayName: profileData.displayName,
          bio: profileData.bio || "",
          instagram: socialLinks.find(s => s.platform === 'instagram')?.link || "",
          youtube: socialLinks.find(s => s.platform === 'youtube')?.link || "",
          twitter: socialLinks.find(s => s.platform === 'twitter')?.link || "",
          facebook: socialLinks.find(s => s.platform === 'facebook')?.link || "",
          website: socialLinks.find(s => s.platform === 'website')?.link || "",
        })
      }
    } catch (error) {
      console.error('Error loading profile:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadApplications = async (userId: string) => {
    try {
      const response = await applicationsAPI.getByInfluencer(userId)
      if (response.data && !response.error) {
        setApplications((response.data as { data: any[] }).data)
      }
    } catch (error) {
      console.error('Error loading applications:', error)
    }
  }

  const toggleCategory = (category: string) => {
    if (selectedCategories.includes(category)) {
      setSelectedCategories(selectedCategories.filter((c) => c !== category))
    } else if (selectedCategories.length < 5) {
      setSelectedCategories([...selectedCategories, category])
    }
  }

  const handleSave = async () => {
    if (!profile || !user) return

    setIsLoading(true)
    try {
      const updateData = {
        displayName: formData.displayName,
        bio: formData.bio,
        contentType: selectedCategories.map(cat => ({ content: cat })),
        socialMediaProfileLinks: [
          formData.instagram && { platform: "instagram", link: formData.instagram },
          formData.youtube && { platform: "youtube", link: formData.youtube },
          formData.twitter && { platform: "twitter", link: formData.twitter },
          formData.facebook && { platform: "facebook", link: formData.facebook },
          formData.website && { platform: "website", link: formData.website },
        ].filter(Boolean),
      }

      const response = await influencerAPI.updateProfile(user.id, updateData)
      
      if (response.data && !response.error) {
        await loadProfile()
        setIsEditing(false)
      } else {
        console.error('Error updating profile:', response.error)
      }
    } catch (error) {
      console.error('Error saving profile:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const getTotalFollowers = () => {
    if (!profile) return "0"
    const total = profile.platforms.reduce((sum, p) => sum + p.count, 0)
    if (total >= 1000000) return `${(total / 1000000).toFixed(1)}M`
    if (total >= 1000) return `${(total / 1000).toFixed(0)}K`
    return total.toString()
  }

  // const getSocialLink = (platform: string) => {
  //   return profile?.socialMediaProfileLinks.find(s => s.platform === platform)?.link || ""
  // }

  const getPlatformIcon = (platform: string) => {
    return platformIcons[platform.toLowerCase() as keyof typeof platformIcons] || Globe
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Sidebar userType="influencer" />
        <main className="lg:pl-64">
          <div className="flex items-center justify-center min-h-screen">
            <div className="text-muted-foreground">Loading profile...</div>
          </div>
        </main>
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-background">
        <Sidebar userType="influencer" />
        <main className="lg:pl-64">
          <div className="flex items-center justify-center min-h-screen">
            <div className="text-muted-foreground">Profile not found</div>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Sidebar userType="influencer" />

      <main className="lg:pl-64">
        <div className="px-4 py-8 pt-24 lg:px-8 lg:pt-8">
          <DashboardHeader title="My Profile" subtitle="Manage your public profile and settings" />

          <Tabs defaultValue="profile" className="space-y-6">
            <TabsList className="bg-secondary">
              <TabsTrigger value="profile">Profile</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
            </TabsList>

            <TabsContent value="profile">
              <div className="grid gap-6 lg:grid-cols-3">
                {/* Profile Card */}
                <div className="glass-card rounded-xl p-6">
                  <div className="relative mb-6">
                    <div className="relative mx-auto w-fit">
                      <img
                        src={profile.profileImage || "/placeholder.svg"}
                        alt="Profile"
                        className="h-32 w-32 rounded-full object-cover ring-4 ring-primary/20"
                      />
                      <button className="absolute bottom-0 right-0 flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground hover:bg-primary/90">
                        <Camera className="h-5 w-5" />
                      </button>
                    </div>
                  </div>

                  <div className="text-center">
                    <h2 className="text-xl font-bold text-foreground">{profile.displayName}</h2>
                    <p className="text-muted-foreground">@{profile.username}</p>
                    <div className="mt-2 flex items-center justify-center gap-1 text-sm text-muted-foreground">
                      <Users className="h-4 w-4" />
                      {profile.experienceYears} years experience
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="mt-6 grid grid-cols-3 gap-4 text-center">
                    <div className="rounded-lg bg-secondary p-3">
                      <p className="text-xl font-bold text-foreground">{getTotalFollowers()}</p>
                      <p className="text-xs text-muted-foreground">Followers</p>
                    </div>
                    <div className="rounded-lg bg-secondary p-3">
                      <p className="text-xl font-bold text-foreground">{profile.platforms.length}</p>
                      <p className="text-xs text-muted-foreground">Platforms</p>
                    </div>
                    <div className="rounded-lg bg-secondary p-3">
                      <p className="text-xl font-bold text-foreground">{applications.length}</p>
                      <p className="text-xs text-muted-foreground">Apps</p>
                    </div>
                  </div>

                  {/* Social Links */}
                  <div className="mt-6 space-y-3">
                    {profile.socialMediaProfileLinks.map((link) => {
                      const Icon = getPlatformIcon(link.platform)
                      return (
                        <div key={link.platform} className="flex items-center gap-3 text-sm">
                          <Icon className="h-4 w-4 text-muted-foreground" />
                          <a 
                            href={link.link} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-muted-foreground hover:text-primary truncate"
                          >
                            {link.link}
                          </a>
                        </div>
                      )
                    })}
                  </div>

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

                {/* Edit Form */}
                <div className="lg:col-span-2 space-y-6">
                  <div className="glass-card rounded-xl p-6">
                    <div className="mb-6 flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-foreground">Profile Information</h3>
                      <Button
                        variant={isEditing ? "outline" : "default"}
                        size="sm"
                        onClick={() => setIsEditing(!isEditing)}
                      >
                        <Edit2 className="mr-2 h-4 w-4" />
                        {isEditing ? "Cancel" : "Edit Profile"}
                      </Button>
                    </div>

                    <div className="space-y-4">
                      <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                          <Label>Display Name</Label>
                          <Input
                            value={formData.displayName}
                            onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
                            disabled={!isEditing}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Username</Label>
                          <Input value={profile.username} disabled />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label>Bio</Label>
                        <Textarea
                          value={formData.bio}
                          onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                          disabled={!isEditing}
                          className="min-h-[100px]"
                        />
                      </div>

                      <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                          <Label>Instagram</Label>
                          <Input
                            value={formData.instagram}
                            onChange={(e) => setFormData({ ...formData, instagram: e.target.value })}
                            disabled={!isEditing}
                            placeholder="https://instagram.com/..."
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>YouTube</Label>
                          <Input
                            value={formData.youtube}
                            onChange={(e) => setFormData({ ...formData, youtube: e.target.value })}
                            disabled={!isEditing}
                            placeholder="https://youtube.com/..."
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Twitter</Label>
                          <Input
                            value={formData.twitter}
                            onChange={(e) => setFormData({ ...formData, twitter: e.target.value })}
                            disabled={!isEditing}
                            placeholder="https://twitter.com/..."
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Facebook</Label>
                          <Input
                            value={formData.facebook}
                            onChange={(e) => setFormData({ ...formData, facebook: e.target.value })}
                            disabled={!isEditing}
                            placeholder="https://facebook.com/..."
                          />
                        </div>
                      </div>

                      {isEditing && (
                        <Button onClick={handleSave} disabled={isLoading}>
                          {isLoading ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Saving...
                            </>
                          ) : (
                            <>
                              <Check className="mr-2 h-4 w-4" />
                              Save Changes
                            </>
                          )}
                        </Button>
                      )}
                    </div>
                  </div>

                  {/* Categories */}
                  {isEditing && (
                    <div className="glass-card rounded-xl p-6">
                      <h3 className="mb-4 text-lg font-semibold text-foreground">Categories</h3>
                      <p className="mb-4 text-sm text-muted-foreground">
                        Select up to 5 categories that best describe your content
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {categories.map((category) => (
                          <Badge
                            key={category}
                            variant={selectedCategories.includes(category) ? "default" : "outline"}
                            className={`cursor-pointer transition-all ${
                              selectedCategories.includes(category)
                                ? "bg-primary text-primary-foreground"
                                : "hover:border-primary hover:text-primary"
                            }`}
                            onClick={() => isEditing && toggleCategory(category)}
                          >
                            {category}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="analytics">
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                <div className="glass-card rounded-xl p-6">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                      <Eye className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-foreground">-</p>
                      <p className="text-sm text-muted-foreground">Profile Views</p>
                    </div>
                  </div>
                </div>
                <div className="glass-card rounded-xl p-6">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10">
                      <Users className="h-5 w-5 text-accent" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-foreground">{getTotalFollowers()}</p>
                      <p className="text-sm text-muted-foreground">Total Followers</p>
                    </div>
                  </div>
                </div>
                <div className="glass-card rounded-xl p-6">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-chart-3/10">
                      <TrendingUp className="h-5 w-5 text-chart-3" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-foreground">-</p>
                      <p className="text-sm text-muted-foreground">Engagement Rate</p>
                    </div>
                  </div>
                </div>
                <div className="glass-card rounded-xl p-6">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-500/10">
                      <Briefcase className="h-5 w-5 text-green-500" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-foreground">{applications.length}</p>
                      <p className="text-sm text-muted-foreground">Applications</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="glass-card mt-6 rounded-xl p-6">
                <h3 className="mb-4 text-lg font-semibold text-foreground">Performance Overview</h3>
                <div className="flex h-64 items-center justify-center rounded-lg border border-dashed border-border">
                  <p className="text-muted-foreground">Analytics coming soon</p>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  )
}