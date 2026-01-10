/* eslint-disable @typescript-eslint/no-explicit-any */
// eslint-disable-next-line react-hooks/exhaustive-deps
// eslint-disable-next-line @next/next/no-img-element
"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Sidebar } from "@/components/dashboard/sidebar"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Filter, Building2, MapPin, ExternalLink, Heart, Calendar, MessageSquare } from "lucide-react"
import { companyAPI } from "@/lib/api"
import { authStorage } from "@/lib/authHelper"
import { startConversation } from "@/lib/conversationHelper"
import Link from "next/link"

interface Company {
  _id: string
  companyName: string
  email: string
  addressType: string
  address?: string
  contactNumber: string
  contentType: { content: string }[]
  profileImage?: string
  products: string[]
  establishedYear: number
  description?: string
  socialLinks: { platform: string; link: string }[]
  slug: string
}

interface CompanyResponse {
  success: boolean
  total: number
  currentPage: number
  totalPages: number
  companies: Company[]
}

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

export default function DiscoverCompanies() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [savedCompanies, setSavedCompanies] = useState<string[]>([])
  const [companies, setCompanies] = useState<Company[]>([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  useEffect(() => {
    const storedUser = authStorage.getUser()
    setUser(storedUser)
    loadCompanies()
  }, [currentPage, selectedCategory, searchQuery])

  const loadCompanies = async () => {
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

      const response = await companyAPI.listCompanies(filters)
      console.log('Companies response:', response)

      if (response.data && !response.error) {
        const data = response.data as CompanyResponse
        setCompanies(data.companies)
        setTotalPages(data.totalPages)
      } else {
        console.error('Error fetching companies:', response.error)
        setCompanies([])
      }
    } catch (error) {
      console.error('Error loading companies:', error)
      setCompanies([])
    } finally {
      setLoading(false)
    }
  }

  const handleMessageCompany = (companyId: string) => {
    if (!user) return
    startConversation(user.id, user.role, companyId, "company", router)
  }

  const toggleSave = (id: string) => {
    setSavedCompanies((prev) => (prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]))
  }

  const getLocation = (company: Company) => {
    if (company.addressType === "Online") {
      return "Online Business"
    }
    return company.address || "Location not specified"
  }

  const getCategories = (company: Company) => {
    return company.contentType.map(ct => ct.content).slice(0, 3)
  }

  return (
    <div className="min-h-screen bg-background">
      <Sidebar userType="influencer" />

      <main className="lg:pl-64">
        <div className="px-4 py-8 pt-24 lg:px-8 lg:pt-8">
          <DashboardHeader title="Discover Companies" subtitle="Find your perfect brand partnerships" />

          {/* Filters */}
          <div className="mb-8 flex flex-col gap-4 sm:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search companies..."
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

          {/* Loading State */}
          {loading && (
            <div className="flex items-center justify-center py-16">
              <div className="text-muted-foreground">Loading companies...</div>
            </div>
          )}

          {/* Companies Grid */}
          {!loading && companies.length > 0 && (
            <>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
                {companies.map((company) => (
                  <div
                    key={company._id}
                    className="glass-card group overflow-hidden rounded-xl transition-all duration-300 hover:scale-[1.02]"
                  >
                    {/* Header */}
                    <div className="relative border-b border-border p-4">
                      <div className="flex items-start gap-4">
                        <img
                          src={company.profileImage || "/placeholder.svg"}
                          alt={company.companyName}
                          className="h-14 w-14 rounded-xl object-cover"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold text-foreground truncate">{company.companyName}</h3>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {getCategories(company)[0] || "Company"}
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className={savedCompanies.includes(company._id) ? "text-red-500" : "text-muted-foreground"}
                          onClick={() => toggleSave(company._id)}
                        >
                          <Heart className={`h-5 w-5 ${savedCompanies.includes(company._id) ? "fill-current" : ""}`} />
                        </Button>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-4">
                      <p className="mb-4 text-sm text-muted-foreground line-clamp-2">
                        {company.description || "No description available"}
                      </p>

                      <div className="mb-4 flex flex-wrap gap-2">
                        {getCategories(company).map((category) => (
                          <Badge key={category} variant="secondary" className="text-xs">
                            {category}
                          </Badge>
                        ))}
                      </div>

                      <div className="mb-4 grid grid-cols-2 gap-3 text-sm">
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <MapPin className="h-4 w-4" />
                          <span className="truncate">{getLocation(company)}</span>
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Calendar className="h-4 w-4" />
                          <span>Est. {company.establishedYear}</span>
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground col-span-2">
                          <Building2 className="h-4 w-4" />
                          <span className="truncate">{company.products.join(", ") || "Products"}</span>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button className="flex-1" size="sm" asChild>
                          <Link href={`/dashboard/influencer/companies/${company._id}`}>
                            View Profile
                          </Link>
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleMessageCompany(company._id)}
                        >
                          <MessageSquare className="h-4 w-4" />
                        </Button>
                        {company.socialLinks.find(s => s.platform === 'website') && (
                          <Button variant="outline" size="sm" asChild>
                            <a
                              href={company.socialLinks.find(s => s.platform === 'website')?.link}
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
          {!loading && companies.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <Building2 className="mb-4 h-12 w-12 text-muted-foreground" />
              <h3 className="text-lg font-medium text-foreground">No companies found</h3>
              <p className="mt-1 text-muted-foreground">Try adjusting your search or filters</p>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}