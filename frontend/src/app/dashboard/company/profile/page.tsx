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
  Globe,
  MapPin,
  Users,
  Building2,
  Briefcase,
  DollarSign,
  Check,
  Loader2,
  Star,
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

const pastCampaigns = [
  {
    id: 1,
    title: "Summer Tech Launch",
    influencers: 12,
    budget: "$45,000",
    reach: "2.5M",
    engagement: "4.2%",
    date: "Nov 2024",
    rating: 5,
  },
  {
    id: 2,
    title: "Back to School Promo",
    influencers: 8,
    budget: "$28,000",
    reach: "1.8M",
    engagement: "3.8%",
    date: "Sep 2024",
    rating: 4,
  },
  {
    id: 3,
    title: "Product Review Series",
    influencers: 15,
    budget: "$52,000",
    reach: "3.2M",
    engagement: "4.5%",
    date: "Aug 2024",
    rating: 5,
  },
]

export default function CompanyProfilePage() {
  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [selectedCategories, setSelectedCategories] = useState(["Tech", "Gaming", "Lifestyle"])

  const [profile, setProfile] = useState({
    name: "TechGear Pro",
    description:
      "Leading tech accessories brand specializing in innovative gadgets and peripherals. We partner with authentic creators to showcase our products to tech-savvy audiences worldwide.",
    industry: "Technology",
    location: "San Francisco, CA",
    website: "techgearpro.com",
    size: "200-500",
    budget: "$50,000 - $100,000",
    targetAudience: "Tech enthusiasts, gamers, and professionals aged 18-45",
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
      <Sidebar userType="company" />

      <main className="lg:pl-64">
        <div className="px-4 py-8 pt-24 lg:px-8 lg:pt-8">
          <DashboardHeader title="Company Profile" subtitle="Manage your company's public profile" />

          <Tabs defaultValue="profile" className="space-y-6">
            <TabsList className="bg-secondary">
              <TabsTrigger value="profile">Profile</TabsTrigger>
              <TabsTrigger value="campaigns">Campaign History</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
            </TabsList>

            <TabsContent value="profile">
              <div className="grid gap-6 lg:grid-cols-3">
                {/* Profile Card */}
                <div className="glass-card rounded-xl p-6">
                  <div className="relative mb-6">
                    <div className="relative mx-auto w-fit">
                      <img
                        src="/placeholder.svg?key=7w5dn"
                        alt="Company Logo"
                        className="h-32 w-32 rounded-2xl object-cover ring-4 ring-accent/20"
                      />
                      <button className="absolute bottom-0 right-0 flex h-10 w-10 items-center justify-center rounded-full bg-accent text-accent-foreground hover:bg-accent/90">
                        <Camera className="h-5 w-5" />
                      </button>
                    </div>
                  </div>

                  <div className="text-center">
                    <h2 className="text-xl font-bold text-foreground">{profile.name}</h2>
                    <p className="text-muted-foreground">{profile.industry}</p>
                    <div className="mt-2 flex items-center justify-center gap-1 text-sm text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      {profile.location}
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="mt-6 grid grid-cols-3 gap-4 text-center">
                    <div className="rounded-lg bg-secondary p-3">
                      <p className="text-xl font-bold text-foreground">35</p>
                      <p className="text-xs text-muted-foreground">Campaigns</p>
                    </div>
                    <div className="rounded-lg bg-secondary p-3">
                      <p className="text-xl font-bold text-foreground">156</p>
                      <p className="text-xs text-muted-foreground">Partners</p>
                    </div>
                    <div className="rounded-lg bg-secondary p-3">
                      <p className="text-xl font-bold text-foreground">4.9</p>
                      <p className="text-xs text-muted-foreground">Rating</p>
                    </div>
                  </div>

                  {/* Info */}
                  <div className="mt-6 space-y-3">
                    <div className="flex items-center gap-3 text-sm">
                      <Globe className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground">{profile.website}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground">{profile.size} employees</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <DollarSign className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground">{profile.budget}/month</span>
                    </div>
                  </div>

                  {/* Categories */}
                  <div className="mt-6">
                    <p className="mb-2 text-sm font-medium text-foreground">Target Categories</p>
                    <div className="flex flex-wrap gap-2">
                      {selectedCategories.map((cat) => (
                        <Badge key={cat} className="bg-accent/10 text-accent">
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
                      <h3 className="text-lg font-semibold text-foreground">Company Information</h3>
                      <Button
                        variant={isEditing ? "outline" : "default"}
                        size="sm"
                        className={!isEditing ? "bg-accent hover:bg-accent/90 text-accent-foreground" : ""}
                        onClick={() => setIsEditing(!isEditing)}
                      >
                        <Edit2 className="mr-2 h-4 w-4" />
                        {isEditing ? "Cancel" : "Edit Profile"}
                      </Button>
                    </div>

                    <div className="space-y-4">
                      <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                          <Label>Company Name</Label>
                          <Input
                            value={profile.name}
                            onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                            disabled={!isEditing}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Industry</Label>
                          <Input
                            value={profile.industry}
                            onChange={(e) => setProfile({ ...profile, industry: e.target.value })}
                            disabled={!isEditing}
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label>Description</Label>
                        <Textarea
                          value={profile.description}
                          onChange={(e) => setProfile({ ...profile, description: e.target.value })}
                          disabled={!isEditing}
                          className="min-h-[100px]"
                        />
                      </div>

                      <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                          <Label>Location</Label>
                          <Input
                            value={profile.location}
                            onChange={(e) => setProfile({ ...profile, location: e.target.value })}
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

                      <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                          <Label>Company Size</Label>
                          <Input
                            value={profile.size}
                            onChange={(e) => setProfile({ ...profile, size: e.target.value })}
                            disabled={!isEditing}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Monthly Marketing Budget</Label>
                          <Input
                            value={profile.budget}
                            onChange={(e) => setProfile({ ...profile, budget: e.target.value })}
                            disabled={!isEditing}
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label>Target Audience</Label>
                        <Textarea
                          value={profile.targetAudience}
                          onChange={(e) => setProfile({ ...profile, targetAudience: e.target.value })}
                          disabled={!isEditing}
                        />
                      </div>

                      {isEditing && (
                        <Button
                          onClick={handleSave}
                          disabled={isLoading}
                          className="bg-accent hover:bg-accent/90 text-accent-foreground"
                        >
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
                    <h3 className="mb-4 text-lg font-semibold text-foreground">Target Categories</h3>
                    <p className="mb-4 text-sm text-muted-foreground">
                      Select categories that match your products/services
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {categories.map((category) => (
                        <Badge
                          key={category}
                          variant={selectedCategories.includes(category) ? "default" : "outline"}
                          className={`cursor-pointer transition-all ${
                            selectedCategories.includes(category)
                              ? "bg-accent text-accent-foreground"
                              : "hover:border-accent hover:text-accent"
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

            <TabsContent value="campaigns">
              <div className="glass-card rounded-xl p-6">
                <h3 className="mb-6 text-lg font-semibold text-foreground">Campaign History</h3>
                <div className="space-y-4">
                  {pastCampaigns.map((campaign) => (
                    <div key={campaign.id} className="rounded-lg border border-border bg-secondary/30 p-4">
                      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-medium text-foreground">{campaign.title}</h4>
                            <div className="flex items-center gap-1">
                              {Array.from({ length: campaign.rating }).map((_, i) => (
                                <Star key={i} className="h-3 w-3 fill-yellow-500 text-yellow-500" />
                              ))}
                            </div>
                          </div>
                          <p className="text-sm text-muted-foreground">{campaign.date}</p>
                        </div>
                        <div className="flex flex-wrap gap-6 text-sm">
                          <div className="text-center">
                            <p className="font-bold text-foreground">{campaign.influencers}</p>
                            <p className="text-xs text-muted-foreground">Influencers</p>
                          </div>
                          <div className="text-center">
                            <p className="font-bold text-foreground">{campaign.budget}</p>
                            <p className="text-xs text-muted-foreground">Budget</p>
                          </div>
                          <div className="text-center">
                            <p className="font-bold text-foreground">{campaign.reach}</p>
                            <p className="text-xs text-muted-foreground">Reach</p>
                          </div>
                          <div className="text-center">
                            <p className="font-bold text-foreground">{campaign.engagement}</p>
                            <p className="text-xs text-muted-foreground">Engagement</p>
                          </div>
                        </div>
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
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10">
                      <Briefcase className="h-5 w-5 text-accent" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-foreground">35</p>
                      <p className="text-sm text-muted-foreground">Total Campaigns</p>
                    </div>
                  </div>
                </div>
                <div className="glass-card rounded-xl p-6">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                      <Users className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-foreground">156</p>
                      <p className="text-sm text-muted-foreground">Influencer Partners</p>
                    </div>
                  </div>
                </div>
                <div className="glass-card rounded-xl p-6">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-chart-3/10">
                      <DollarSign className="h-5 w-5 text-chart-3" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-foreground">$458K</p>
                      <p className="text-sm text-muted-foreground">Total Spent</p>
                    </div>
                  </div>
                </div>
                <div className="glass-card rounded-xl p-6">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-500/10">
                      <Building2 className="h-5 w-5 text-green-500" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-foreground">285%</p>
                      <p className="text-sm text-muted-foreground">Avg. ROI</p>
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
