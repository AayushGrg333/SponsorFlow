"use client"

import { useState } from "react"
import { Sidebar } from "@/components/dashboard/sidebar"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Search,
  Users,
  Instagram,
  Youtube,
  Twitter,
  Heart,
  MessageSquare,
  ExternalLink,
  SlidersHorizontal,
} from "lucide-react"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"

const influencers = [
  {
    id: 1,
    name: "Alex Johnson",
    username: "@alexjtech",
    avatar: "/placeholder.svg?key=qg8p9",
    category: "Technology",
    followers: "520K",
    engagement: "4.8%",
    platforms: ["instagram", "youtube", "twitter"],
    bio: "Tech reviewer and gadget enthusiast. Making complex tech simple for everyone.",
    tags: ["Tech", "Reviews", "Gaming"],
    location: "San Francisco, CA",
    rate: "$1,500 - $3,000",
    match: 96,
  },
  {
    id: 2,
    name: "Sarah Chen",
    username: "@sarahlifestyle",
    avatar: "/placeholder.svg?key=e38f9",
    category: "Lifestyle",
    followers: "380K",
    engagement: "5.2%",
    platforms: ["instagram", "youtube"],
    bio: "Lifestyle and wellness creator. Sharing my journey to a balanced, beautiful life.",
    tags: ["Lifestyle", "Wellness", "Fashion"],
    location: "Los Angeles, CA",
    rate: "$1,200 - $2,500",
    match: 92,
  },
  {
    id: 3,
    name: "Mike Rodriguez",
    username: "@mikegaming",
    avatar: "/placeholder.svg?key=liqf3",
    category: "Gaming",
    followers: "1.2M",
    engagement: "3.9%",
    platforms: ["youtube", "twitter"],
    bio: "Pro gamer and streamer. Bringing you the best gaming content daily.",
    tags: ["Gaming", "Streaming", "Esports"],
    location: "Austin, TX",
    rate: "$3,000 - $6,000",
    match: 88,
  },
  {
    id: 4,
    name: "Emma Wilson",
    username: "@emmabeauty",
    avatar: "/placeholder.svg?key=6oq89",
    category: "Beauty",
    followers: "890K",
    engagement: "4.5%",
    platforms: ["instagram", "youtube", "twitter"],
    bio: "Beauty guru and skincare expert. Honest reviews and tutorials for all skin types.",
    tags: ["Beauty", "Skincare", "Makeup"],
    location: "New York, NY",
    rate: "$2,000 - $4,000",
    match: 85,
  },
  {
    id: 5,
    name: "David Kim",
    username: "@davidfitness",
    avatar: "/placeholder.svg?key=8x7dz",
    category: "Fitness",
    followers: "650K",
    engagement: "5.8%",
    platforms: ["instagram", "youtube"],
    bio: "Certified trainer and nutrition coach. Helping you achieve your fitness goals.",
    tags: ["Fitness", "Health", "Nutrition"],
    location: "Miami, FL",
    rate: "$1,800 - $3,500",
    match: 82,
  },
  {
    id: 6,
    name: "Lisa Park",
    username: "@lisatravels",
    avatar: "/placeholder.svg?key=2ks9d",
    category: "Travel",
    followers: "450K",
    engagement: "4.2%",
    platforms: ["instagram", "youtube", "twitter"],
    bio: "Full-time traveler and content creator. Exploring the world one destination at a time.",
    tags: ["Travel", "Adventure", "Photography"],
    location: "Seattle, WA",
    rate: "$1,500 - $3,000",
    match: 78,
  },
]

const categories = ["All", "Technology", "Lifestyle", "Gaming", "Beauty", "Fitness", "Travel", "Food", "Fashion"]
const platforms = ["All", "Instagram", "YouTube", "Twitter"]

const platformIcons = {
  instagram: Instagram,
  youtube: Youtube,
  twitter: Twitter,
}

export default function DiscoverInfluencers() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [selectedPlatform, setSelectedPlatform] = useState("All")
  const [minFollowers, setMinFollowers] = useState([0])
  const [savedInfluencers, setSavedInfluencers] = useState<number[]>([])

  const toggleSave = (id: number) => {
    setSavedInfluencers((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]))
  }

  const filteredInfluencers = influencers.filter((influencer) => {
    const matchesSearch =
      influencer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      influencer.bio.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === "All" || influencer.category === selectedCategory
    const matchesPlatform = selectedPlatform === "All" || influencer.platforms.includes(selectedPlatform.toLowerCase())
    return matchesSearch && matchesCategory && matchesPlatform
  })

  const FiltersContent = () => (
    <div className="space-y-6">
      <div>
        <label className="mb-2 block text-sm font-medium text-foreground">Category</label>
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {categories.map((category) => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-foreground">Platform</label>
        <Select value={selectedPlatform} onValueChange={setSelectedPlatform}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {platforms.map((platform) => (
              <SelectItem key={platform} value={platform}>
                {platform}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-foreground">Minimum Followers: {minFollowers[0]}K+</label>
        <Slider value={minFollowers} onValueChange={setMinFollowers} max={1000} step={50} className="mt-3" />
      </div>

      <Button
        variant="outline"
        className="w-full bg-transparent"
        onClick={() => {
          setSelectedCategory("All")
          setSelectedPlatform("All")
          setMinFollowers([0])
        }}
      >
        Reset Filters
      </Button>
    </div>
  )

  return (
    <div className="min-h-screen bg-background">
      <Sidebar userType="company" />

      <main className="lg:pl-64">
        <div className="px-4 py-8 pt-24 lg:px-8 lg:pt-8">
          <DashboardHeader title="Find Influencers" subtitle="Discover the perfect creators for your campaigns" />

          {/* Filters */}
          <div className="mb-8 flex flex-col gap-4 sm:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search influencers..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Desktop Filters */}
            <div className="hidden gap-3 md:flex">
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={selectedPlatform} onValueChange={setSelectedPlatform}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Platform" />
                </SelectTrigger>
                <SelectContent>
                  {platforms.map((platform) => (
                    <SelectItem key={platform} value={platform}>
                      {platform}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Mobile Filters */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" className="md:hidden bg-transparent">
                  <SlidersHorizontal className="mr-2 h-4 w-4" />
                  Filters
                </Button>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>Filters</SheetTitle>
                </SheetHeader>
                <div className="mt-6">
                  <FiltersContent />
                </div>
              </SheetContent>
            </Sheet>
          </div>

          {/* Results Count */}
          <div className="mb-4">
            <p className="text-sm text-muted-foreground">Showing {filteredInfluencers.length} influencers</p>
          </div>

          {/* Influencers Grid */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            {filteredInfluencers.map((influencer) => (
              <div
                key={influencer.id}
                className="glass-card group overflow-hidden rounded-xl transition-all duration-300 hover:scale-[1.02]"
              >
                {/* Header */}
                <div className="relative border-b border-border p-4">
                  <div className="flex items-start gap-4">
                    <img
                      src={influencer.avatar || "/placeholder.svg"}
                      alt={influencer.name}
                      className="h-16 w-16 rounded-full object-cover ring-2 ring-border"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-foreground truncate">{influencer.name}</h3>
                        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-accent/10 text-xs font-bold text-accent">
                          {influencer.match}%
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground">{influencer.username}</p>
                      <p className="text-xs text-muted-foreground">{influencer.location}</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className={savedInfluencers.includes(influencer.id) ? "text-red-500" : "text-muted-foreground"}
                      onClick={() => toggleSave(influencer.id)}
                    >
                      <Heart className={`h-5 w-5 ${savedInfluencers.includes(influencer.id) ? "fill-current" : ""}`} />
                    </Button>
                  </div>
                </div>

                {/* Content */}
                <div className="p-4">
                  <p className="mb-4 text-sm text-muted-foreground line-clamp-2">{influencer.bio}</p>

                  {/* Stats */}
                  <div className="mb-4 grid grid-cols-3 gap-2 text-center">
                    <div className="rounded-lg bg-secondary p-2">
                      <p className="text-lg font-bold text-foreground">{influencer.followers}</p>
                      <p className="text-xs text-muted-foreground">Followers</p>
                    </div>
                    <div className="rounded-lg bg-secondary p-2">
                      <p className="text-lg font-bold text-foreground">{influencer.engagement}</p>
                      <p className="text-xs text-muted-foreground">Engagement</p>
                    </div>
                    <div className="rounded-lg bg-secondary p-2">
                      <p className="text-sm font-bold text-foreground">{influencer.rate.split(" - ")[0]}</p>
                      <p className="text-xs text-muted-foreground">Starting</p>
                    </div>
                  </div>

                  {/* Platforms */}
                  <div className="mb-4 flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">Platforms:</span>
                    <div className="flex gap-2">
                      {influencer.platforms.map((platform) => {
                        const Icon = platformIcons[platform as keyof typeof platformIcons]
                        return (
                          <div key={platform} className="rounded-full bg-secondary p-1.5">
                            <Icon className="h-4 w-4 text-muted-foreground" />
                          </div>
                        )
                      })}
                    </div>
                  </div>

                  {/* Tags */}
                  <div className="mb-4 flex flex-wrap gap-2">
                    {influencer.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <Button className="flex-1" size="sm">
                      View Profile
                    </Button>
                    <Button variant="outline" size="sm">
                      <MessageSquare className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredInfluencers.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <Users className="mb-4 h-12 w-12 text-muted-foreground" />
              <h3 className="text-lg font-medium text-foreground">No influencers found</h3>
              <p className="mt-1 text-muted-foreground">Try adjusting your search or filters</p>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
