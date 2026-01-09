"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Sidebar } from "@/components/dashboard/sidebar"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Search,
  Users,
  Instagram,
  Youtube,
  Twitter,
  Facebook,
  Heart,
  MessageSquare,
  ExternalLink,
  SlidersHorizontal,
} from "lucide-react"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { influencerAPI } from "@/lib/api"
import { authStorage } from "@/lib/authHelper"
import { startConversation } from "@/lib/conversationHelper"
import Link from "next/link"

interface Influencer {
  _id: string
  username: string
  displayName: string
  realName: {
    givenName: string
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

interface InfluencerResponse {
  success: boolean
  total: number
  currentPage: number
  totalPages: number
  influencers: Influencer[]
}

const categories = ["All", "Technology", "Lifestyle", "Gaming", "Beauty", "Fitness", "Travel", "Food", "Fashion"]

const platformIcons = {
  instagram: Instagram,
  youtube: Youtube,
  twitter: Twitter,
  facebook: Facebook,
}

export default function DiscoverInfluencers() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [savedInfluencers, setSavedInfluencers] = useState<string[]>([])
  const [influencers, setInfluencers] = useState<Influencer[]>([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  useEffect(() => {
    const storedUser = authStorage.getUser()
    setUser(storedUser)
    loadInfluencers()
  }, [currentPage, selectedCategory, searchQuery])

  const loadInfluencers = async () => {
    try {
      setLoading(true)
      const filters: any = {
        page: currentPage,
        limit: 9,
      }

      if (searchQuery) {
        filters.search = searchQuery
      }

      if (selectedCategory !== "All") {
        filters.contentType = selectedCategory
      }

      const response = await influencerAPI.listInfluencers(filters)
      console.log('Influencers response:', response)

      if (response.data && !response.error) {
        const data = response.data as InfluencerResponse
        setInfluencers(data.influencers)
        setTotalPages(data.totalPages)
      } else {
        console.error('Error fetching influencers:', response.error)
        setInfluencers([])
      }
    } catch (error) {
      console.error('Error loading influencers:', error)
      setInfluencers([])
    } finally {
      setLoading(false)
    }
  }

  const handleMessageInfluencer = (influencerId: string) => {
    if (!user) return
    startConversation(user.id, user.role, influencerId, "influencer", router)
  }

  const toggleSave = (id: string) => {
    setSavedInfluencers((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]))
  }

  const getCategories = (influencer: Influencer) => {
 return influencer.contentType?.map(ct => ct.content).slice(0, 3) || []
  }

  const getTotalFollowers = (influencer: Influencer) => {
    if (!influencer.platforms || influencer.platforms.length === 0) return '0'
  
  const total = influencer.platforms.reduce((sum, p) => sum + p.count, 0)
  if (total >= 1000000) return `${(total / 1000000).toFixed(1)}M`
  if (total >= 1000) return `${(total / 1000).toFixed(0)}K`
  return total.toString()
  }

  const getPlatformIcon = (platform: string) => {
    const Icon = platformIcons[platform.toLowerCase() as keyof typeof platformIcons]
    return Icon || Users
  }

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

      <Button
        variant="outline"
        className="w-full bg-transparent"
        onClick={() => {
          setSelectedCategory("All")
          setSearchQuery("")
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
          {!loading && (
            <div className="mb-4">
              <p className="text-sm text-muted-foreground">Showing {influencers.length} influencers</p>
            </div>
          )}

          {/* Loading State */}
          {loading && (
            <div className="flex items-center justify-center py-16">
              <div className="text-muted-foreground">Loading influencers...</div>
            </div>
          )}

          {/* Influencers Grid */}
          {!loading && influencers.length > 0 && (
            <>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
                {influencers.map((influencer) => (
                  <div
                    key={influencer._id}
                    className="glass-card group overflow-hidden rounded-xl transition-all duration-300 hover:scale-[1.02]"
                  >
                    {/* Header */}
                    <div className="relative border-b border-border p-4">
                      <div className="flex items-start gap-4">
                        <img
                          src={influencer.profileImage || "/placeholder.svg"}
                          alt={influencer.displayName}
                          className="h-16 w-16 rounded-full object-cover ring-2 ring-border"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold text-foreground truncate">{influencer.displayName}</h3>
                          </div>
                          <p className="text-sm text-muted-foreground">@{influencer.username}</p>
                          <p className="text-xs text-muted-foreground">{influencer.experienceYears} years exp</p>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className={savedInfluencers.includes(influencer._id) ? "text-red-500" : "text-muted-foreground"}
                          onClick={() => toggleSave(influencer._id)}
                        >
                          <Heart className={`h-5 w-5 ${savedInfluencers.includes(influencer._id) ? "fill-current" : ""}`} />
                        </Button>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-4">
                      <p className="mb-4 text-sm text-muted-foreground line-clamp-2">
                        {influencer.bio || "No bio available"}
                      </p>

                      {/* Stats */}
                      <div className="mb-4 grid grid-cols-2 gap-2 text-center">
                        <div className="rounded-lg bg-secondary p-2">
                          <p className="text-lg font-bold text-foreground">{getTotalFollowers(influencer)}</p>
                          <p className="text-xs text-muted-foreground">Followers</p>
                        </div>
                        <div className="rounded-lg bg-secondary p-2">
                          <p className="text-lg font-bold text-foreground">{influencer.platforms.length}</p>
                          <p className="text-xs text-muted-foreground">Platforms</p>
                        </div>
                      </div>

                      {/* Platforms */}
                      {influencer.platforms.length > 0 && (
                        <div className="mb-4 flex items-center gap-2">
                          <span className="text-xs text-muted-foreground">Platforms:</span>
                          <div className="flex gap-2">
                            {influencer.platforms.map((platform) => {
                              const Icon = getPlatformIcon(platform.platform)
                              return (
                                <div key={platform.platform} className="rounded-full bg-secondary p-1.5">
                                  <Icon className="h-4 w-4 text-muted-foreground" />
                                </div>
                              )
                            })}
                          </div>
                        </div>
                      )}

                      {/* Tags */}
                      <div className="mb-4 flex flex-wrap gap-2">
                        {getCategories(influencer).map((category) => (
                          <Badge key={category} variant="secondary" className="text-xs">
                            {category}
                          </Badge>
                        ))}
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2">
                        <Button className="flex-1" size="sm" asChild>
                          <Link href={`/dashboard/company/influencers/${influencer._id}`}>
                            View Profile
                          </Link>
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleMessageInfluencer(influencer._id)}
                        >
                          <MessageSquare className="h-4 w-4" />
                        </Button>
                        {influencer.socialMediaProfileLinks.length > 0 && (
                          <Button variant="outline" size="sm" asChild>
                            <a
                              href={influencer.socialMediaProfileLinks[0].link}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <ExternalLink className="h-4 w-4" />
                            </a>
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-8 flex items-center justify-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                  >
                    Previous
                  </Button>
                  <span className="text-sm text-muted-foreground">
                    Page {currentPage} of {totalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                    disabled={currentPage === totalPages}
                  >
                    Next
                  </Button>
                </div>
              )}
            </>
          )}

          {/* Empty State */}
          {!loading && influencers.length === 0 && (
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