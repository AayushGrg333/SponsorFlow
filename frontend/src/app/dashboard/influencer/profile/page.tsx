"use client"

import { useState } from "react"
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
  Globe,
  MapPin,
  Calendar,
  Users,
  Eye,
  TrendingUp,
  Briefcase,
  Star,
  Check,
  Loader2,
} from "lucide-react"

const categories = [
  "Tech",
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

const pastCollaborations = [
  {
    id: 1,
    company: "TechGear Pro",
    logo: "/placeholder.svg?key=80k1l",
    campaign: "Product Review Series",
    date: "Nov 2024",
    earnings: "$3,500",
    rating: 5,
  },
  {
    id: 2,
    company: "StyleCo Fashion",
    logo: "/placeholder.svg?key=x28dw",
    campaign: "Winter Collection",
    date: "Oct 2024",
    earnings: "$2,800",
    rating: 5,
  },
  {
    id: 3,
    company: "FitLife Supplements",
    logo: "/placeholder.svg?key=wvxz1",
    campaign: "Fitness Challenge",
    date: "Sep 2024",
    earnings: "$4,200",
    rating: 4,
  },
]

export default function InfluencerProfilePage() {
  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [selectedCategories, setSelectedCategories] = useState(["Tech", "Gaming", "Lifestyle"])

  const [profile, setProfile] = useState({
    name: "Alex Johnson",
    username: "@alexjtech",
    bio: "Tech reviewer and gadget enthusiast. Making complex tech simple for everyone. 5+ years of experience in creating engaging content for top brands.",
    location: "San Francisco, CA",
    instagram: "@alexjtech",
    youtube: "AlexJTech",
    twitter: "@alexjtech",
    website: "alexjtech.com",
  })

  const toggleCategory = (category: string) => {
    if (selectedCategories.includes(category)) {
      setSelectedCategories(selectedCategories.filter((c) => c !== category))
    } else if (selectedCategories.length < 5) {
      setSelectedCategories([...selectedCategories, category])
    }
  }

  const handleSave = async () => {
    setIsLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 1500))
    setIsLoading(false)
    setIsEditing(false)
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
              <TabsTrigger value="collaborations">Past Collaborations</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
            </TabsList>

            <TabsContent value="profile">
              <div className="grid gap-6 lg:grid-cols-3">
                {/* Profile Card */}
                <div className="glass-card rounded-xl p-6">
                  <div className="relative mb-6">
                    <div className="relative mx-auto w-fit">
                      <img
                        src="/placeholder.svg?key=nwmq5"
                        alt="Profile"
                        className="h-32 w-32 rounded-full object-cover ring-4 ring-primary/20"
                      />
                      <button className="absolute bottom-0 right-0 flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground hover:bg-primary/90">
                        <Camera className="h-5 w-5" />
                      </button>
                    </div>
                  </div>

                  <div className="text-center">
                    <h2 className="text-xl font-bold text-foreground">{profile.name}</h2>
                    <p className="text-muted-foreground">{profile.username}</p>
                    <div className="mt-2 flex items-center justify-center gap-1 text-sm text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      {profile.location}
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="mt-6 grid grid-cols-3 gap-4 text-center">
                    <div className="rounded-lg bg-secondary p-3">
                      <p className="text-xl font-bold text-foreground">520K</p>
                      <p className="text-xs text-muted-foreground">Followers</p>
                    </div>
                    <div className="rounded-lg bg-secondary p-3">
                      <p className="text-xl font-bold text-foreground">4.8%</p>
                      <p className="text-xs text-muted-foreground">Engagement</p>
                    </div>
                    <div className="rounded-lg bg-secondary p-3">
                      <p className="text-xl font-bold text-foreground">15</p>
                      <p className="text-xs text-muted-foreground">Collabs</p>
                    </div>
                  </div>

                  {/* Social Links */}
                  <div className="mt-6 space-y-3">
                    <div className="flex items-center gap-3 text-sm">
                      <Instagram className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground">{profile.instagram}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <Youtube className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground">{profile.youtube}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <Twitter className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground">{profile.twitter}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <Globe className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground">{profile.website}</span>
                    </div>
                  </div>

                  {/* Categories */}
                  <div className="mt-6">
                    <p className="mb-2 text-sm font-medium text-foreground">Categories</p>
                    <div className="flex flex-wrap gap-2">
                      {selectedCategories.map((cat) => (
                        <Badge key={cat} variant="secondary">
                          {cat}
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
                          <Label>Full Name</Label>
                          <Input
                            value={profile.name}
                            onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                            disabled={!isEditing}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Username</Label>
                          <Input
                            value={profile.username}
                            onChange={(e) => setProfile({ ...profile, username: e.target.value })}
                            disabled={!isEditing}
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label>Bio</Label>
                        <Textarea
                          value={profile.bio}
                          onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                          disabled={!isEditing}
                          className="min-h-[100px]"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Location</Label>
                        <Input
                          value={profile.location}
                          onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                          disabled={!isEditing}
                        />
                      </div>

                      <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                          <Label>Instagram</Label>
                          <Input
                            value={profile.instagram}
                            onChange={(e) => setProfile({ ...profile, instagram: e.target.value })}
                            disabled={!isEditing}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>YouTube</Label>
                          <Input
                            value={profile.youtube}
                            onChange={(e) => setProfile({ ...profile, youtube: e.target.value })}
                            disabled={!isEditing}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Twitter</Label>
                          <Input
                            value={profile.twitter}
                            onChange={(e) => setProfile({ ...profile, twitter: e.target.value })}
                            disabled={!isEditing}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Website</Label>
                          <Input
                            value={profile.website}
                            onChange={(e) => setProfile({ ...profile, website: e.target.value })}
                            disabled={!isEditing}
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
                          onClick={() => toggleCategory(category)}
                        >
                          {category}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="collaborations">
              <div className="glass-card rounded-xl p-6">
                <h3 className="mb-6 text-lg font-semibold text-foreground">Past Collaborations</h3>
                <div className="space-y-4">
                  {pastCollaborations.map((collab) => (
                    <div
                      key={collab.id}
                      className="flex items-center gap-4 rounded-lg border border-border bg-secondary/30 p-4"
                    >
                      <img
                        src={collab.logo || "/placeholder.svg"}
                        alt={collab.company}
                        className="h-14 w-14 rounded-xl object-cover"
                      />
                      <div className="flex-1">
                        <h4 className="font-medium text-foreground">{collab.campaign}</h4>
                        <p className="text-sm text-muted-foreground">{collab.company}</p>
                        <div className="mt-1 flex items-center gap-4 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {collab.date}
                          </span>
                          <span className="flex items-center gap-1">
                            <Star className="h-3 w-3 fill-yellow-500 text-yellow-500" />
                            {collab.rating}/5
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-foreground">{collab.earnings}</p>
                        <p className="text-xs text-muted-foreground">earned</p>
                      </div>
                    </div>
                  ))}
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
                      <p className="text-2xl font-bold text-foreground">1,284</p>
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
                      <p className="text-2xl font-bold text-foreground">520K</p>
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
                      <p className="text-2xl font-bold text-foreground">4.8%</p>
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
                      <p className="text-2xl font-bold text-foreground">15</p>
                      <p className="text-sm text-muted-foreground">Collaborations</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="glass-card mt-6 rounded-xl p-6">
                <h3 className="mb-4 text-lg font-semibold text-foreground">Performance Overview</h3>
                <div className="flex h-64 items-center justify-center rounded-lg border border-dashed border-border">
                  <p className="text-muted-foreground">Analytics chart coming soon</p>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  )
}
