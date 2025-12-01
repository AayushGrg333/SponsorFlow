"use client"

import { useState } from "react"
import { Sidebar } from "@/components/dashboard/sidebar"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Filter, Building2, MapPin, DollarSign, Users, ExternalLink, Heart } from "lucide-react"

const brands = [
  {
    id: 1,
    name: "TechGear Pro",
    logo: "/placeholder.svg?key=nfpf9",
    category: "Technology",
    location: "San Francisco, CA",
    budget: "$5,000 - $15,000",
    followers: "2.5M",
    description: "Leading tech accessories brand looking for authentic tech reviewers and gaming influencers.",
    tags: ["Tech", "Gaming", "Reviews"],
    match: 95,
    activeCampaigns: 3,
  },
  {
    id: 2,
    name: "GlowUp Skincare",
    logo: "/placeholder.svg?key=pjq0y",
    category: "Beauty",
    location: "Los Angeles, CA",
    budget: "$2,000 - $8,000",
    followers: "1.8M",
    description: "Clean beauty brand seeking skincare and lifestyle creators for product launches.",
    tags: ["Skincare", "Beauty", "Lifestyle"],
    match: 88,
    activeCampaigns: 5,
  },
  {
    id: 3,
    name: "FitLife Nutrition",
    logo: "/placeholder.svg?key=bnnqg",
    category: "Health & Fitness",
    location: "Austin, TX",
    budget: "$3,000 - $10,000",
    followers: "3.2M",
    description: "Premium supplement brand partnering with fitness influencers for authentic testimonials.",
    tags: ["Fitness", "Health", "Nutrition"],
    match: 82,
    activeCampaigns: 2,
  },
  {
    id: 4,
    name: "WanderLust Travel",
    logo: "/placeholder.svg?key=lhytb",
    category: "Travel",
    location: "New York, NY",
    budget: "$4,000 - $12,000",
    followers: "5.1M",
    description: "Adventure travel company seeking content creators for destination campaigns.",
    tags: ["Travel", "Adventure", "Lifestyle"],
    match: 78,
    activeCampaigns: 4,
  },
  {
    id: 5,
    name: "StyleVault Fashion",
    logo: "/placeholder.svg?key=yvf4c",
    category: "Fashion",
    location: "Miami, FL",
    budget: "$1,500 - $6,000",
    followers: "890K",
    description: "Trendy fashion brand looking for style influencers for seasonal collections.",
    tags: ["Fashion", "Style", "Trends"],
    match: 75,
    activeCampaigns: 6,
  },
  {
    id: 6,
    name: "GameZone Studios",
    logo: "/placeholder.svg?key=0kk50",
    category: "Gaming",
    location: "Seattle, WA",
    budget: "$8,000 - $25,000",
    followers: "4.7M",
    description: "Gaming studio seeking streamers and gaming content creators for new game launches.",
    tags: ["Gaming", "Streaming", "Entertainment"],
    match: 92,
    activeCampaigns: 2,
  },
]

const categories = [
  "All",
  "Technology",
  "Beauty",
  "Health & Fitness",
  "Travel",
  "Fashion",
  "Gaming",
  "Food",
  "Lifestyle",
]

export default function DiscoverBrands() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [savedBrands, setSavedBrands] = useState<number[]>([])

  const toggleSave = (id: number) => {
    setSavedBrands((prev) => (prev.includes(id) ? prev.filter((b) => b !== id) : [...prev, id]))
  }

  const filteredBrands = brands.filter((brand) => {
    const matchesSearch =
      brand.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      brand.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === "All" || brand.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  return (
    <div className="min-h-screen bg-background">
      <Sidebar userType="influencer" />

      <main className="lg:pl-64">
        <div className="px-4 py-8 pt-24 lg:px-8 lg:pt-8">
          <DashboardHeader title="Discover Brands" subtitle="Find your perfect brand partnerships" />

          {/* Filters */}
          <div className="mb-8 flex flex-col gap-4 sm:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search brands..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full sm:w-48">
                <Filter className="mr-2 h-4 w-4" />
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
          </div>

          {/* Brands Grid */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            {filteredBrands.map((brand) => (
              <div
                key={brand.id}
                className="glass-card group overflow-hidden rounded-xl transition-all duration-300 hover:scale-[1.02]"
              >
                {/* Header */}
                <div className="relative border-b border-border p-4">
                  <div className="flex items-start gap-4">
                    <img
                      src={brand.logo || "/placeholder.svg"}
                      alt={brand.name}
                      className="h-14 w-14 rounded-xl object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-foreground truncate">{brand.name}</h3>
                        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                          {brand.match}%
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground">{brand.category}</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className={savedBrands.includes(brand.id) ? "text-red-500" : "text-muted-foreground"}
                      onClick={() => toggleSave(brand.id)}
                    >
                      <Heart className={`h-5 w-5 ${savedBrands.includes(brand.id) ? "fill-current" : ""}`} />
                    </Button>
                  </div>
                </div>

                {/* Content */}
                <div className="p-4">
                  <p className="mb-4 text-sm text-muted-foreground line-clamp-2">{brand.description}</p>

                  <div className="mb-4 flex flex-wrap gap-2">
                    {brand.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  <div className="mb-4 grid grid-cols-2 gap-3 text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      <span className="truncate">{brand.location}</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Users className="h-4 w-4" />
                      <span>{brand.followers} followers</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <DollarSign className="h-4 w-4" />
                      <span className="truncate">{brand.budget}</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Building2 className="h-4 w-4" />
                      <span>{brand.activeCampaigns} campaigns</span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button className="flex-1" size="sm">
                      View Profile
                    </Button>
                    <Button variant="outline" size="sm">
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredBrands.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <Building2 className="mb-4 h-12 w-12 text-muted-foreground" />
              <h3 className="text-lg font-medium text-foreground">No brands found</h3>
              <p className="mt-1 text-muted-foreground">Try adjusting your search or filters</p>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
