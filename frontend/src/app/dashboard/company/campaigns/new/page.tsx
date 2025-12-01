"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Sidebar } from "@/components/dashboard/sidebar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, X, Loader2, Calendar, DollarSign, Users, Target, Info } from "lucide-react"
import Link from "next/link"

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

const contentTypes = [
  "Instagram Post",
  "Instagram Story",
  "Instagram Reel",
  "YouTube Video",
  "YouTube Short",
  "TikTok",
  "Twitter Post",
  "Blog Post",
  "Podcast",
]

export default function NewCampaignPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [selectedContentTypes, setSelectedContentTypes] = useState<string[]>([])

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    budget: "",
    deadline: "",
    minFollowers: "",
    maxInfluencers: "",
    requirements: "",
  })

  const toggleCategory = (category: string) => {
    if (selectedCategories.includes(category)) {
      setSelectedCategories(selectedCategories.filter((c) => c !== category))
    } else if (selectedCategories.length < 5) {
      setSelectedCategories([...selectedCategories, category])
    }
  }

  const toggleContentType = (type: string) => {
    if (selectedContentTypes.includes(type)) {
      setSelectedContentTypes(selectedContentTypes.filter((t) => t !== type))
    } else {
      setSelectedContentTypes([...selectedContentTypes, type])
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000))

    router.push("/dashboard/company/campaigns")
  }

  return (
    <div className="min-h-screen bg-background">
      <Sidebar userType="company" />

      <main className="lg:pl-64">
        <div className="px-4 py-8 pt-24 lg:px-8 lg:pt-8">
          {/* Header */}
          <div className="mb-8">
            <Button variant="ghost" size="sm" asChild className="mb-4">
              <Link href="/dashboard/company/campaigns">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Campaigns
              </Link>
            </Button>
            <h1 className="text-2xl font-bold text-foreground sm:text-3xl">Create New Campaign</h1>
            <p className="mt-1 text-muted-foreground">Set up a new influencer marketing campaign</p>
          </div>

          <form onSubmit={handleSubmit} className="grid gap-8 lg:grid-cols-3">
            {/* Main Form */}
            <div className="space-y-6 lg:col-span-2">
              {/* Basic Info */}
              <div className="glass-card rounded-xl p-6">
                <h2 className="mb-4 text-lg font-semibold text-foreground">Campaign Details</h2>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Campaign Title</Label>
                    <Input
                      id="title"
                      placeholder="e.g., Summer Product Launch"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      placeholder="Describe your campaign goals, what you're looking for in influencers, and any specific requirements..."
                      className="min-h-[120px] resize-none"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      required
                    />
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="budget">Total Budget ($)</Label>
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                          id="budget"
                          type="number"
                          placeholder="5000"
                          className="pl-10"
                          value={formData.budget}
                          onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="deadline">Campaign Deadline</Label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                          id="deadline"
                          type="date"
                          className="pl-10"
                          value={formData.deadline}
                          onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                          required
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Target Audience */}
              <div className="glass-card rounded-xl p-6">
                <h2 className="mb-4 text-lg font-semibold text-foreground">Target Categories</h2>
                <p className="mb-4 text-sm text-muted-foreground">Select up to 5 categories that match your campaign</p>
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
                      {selectedCategories.includes(category) && <X className="ml-1 h-3 w-3" />}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Content Requirements */}
              <div className="glass-card rounded-xl p-6">
                <h2 className="mb-4 text-lg font-semibold text-foreground">Content Types Required</h2>
                <p className="mb-4 text-sm text-muted-foreground">
                  Select the types of content you need from influencers
                </p>
                <div className="flex flex-wrap gap-2">
                  {contentTypes.map((type) => (
                    <Badge
                      key={type}
                      variant={selectedContentTypes.includes(type) ? "default" : "outline"}
                      className={`cursor-pointer transition-all ${
                        selectedContentTypes.includes(type)
                          ? "bg-primary text-primary-foreground"
                          : "hover:border-primary hover:text-primary"
                      }`}
                      onClick={() => toggleContentType(type)}
                    >
                      {type}
                      {selectedContentTypes.includes(type) && <X className="ml-1 h-3 w-3" />}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Influencer Requirements */}
              <div className="glass-card rounded-xl p-6">
                <h2 className="mb-4 text-lg font-semibold text-foreground">Influencer Requirements</h2>

                <div className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="minFollowers">Minimum Followers</Label>
                      <div className="relative">
                        <Users className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                          id="minFollowers"
                          type="number"
                          placeholder="10000"
                          className="pl-10"
                          value={formData.minFollowers}
                          onChange={(e) => setFormData({ ...formData, minFollowers: e.target.value })}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="maxInfluencers">Max Number of Influencers</Label>
                      <div className="relative">
                        <Target className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                          id="maxInfluencers"
                          type="number"
                          placeholder="10"
                          className="pl-10"
                          value={formData.maxInfluencers}
                          onChange={(e) => setFormData({ ...formData, maxInfluencers: e.target.value })}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="requirements">Additional Requirements</Label>
                    <Textarea
                      id="requirements"
                      placeholder="Any specific requirements for influencers (e.g., must have experience with product reviews, specific demographics, etc.)..."
                      className="min-h-[100px] resize-none"
                      value={formData.requirements}
                      onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Summary Card */}
              <div className="glass-card sticky top-8 rounded-xl p-6">
                <h2 className="mb-4 text-lg font-semibold text-foreground">Campaign Summary</h2>

                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b border-border pb-2">
                    <span className="text-sm text-muted-foreground">Budget</span>
                    <span className="font-medium text-foreground">
                      {formData.budget ? `$${Number.parseInt(formData.budget).toLocaleString()}` : "-"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between border-b border-border pb-2">
                    <span className="text-sm text-muted-foreground">Deadline</span>
                    <span className="font-medium text-foreground">{formData.deadline || "-"}</span>
                  </div>
                  <div className="flex items-center justify-between border-b border-border pb-2">
                    <span className="text-sm text-muted-foreground">Categories</span>
                    <span className="font-medium text-foreground">{selectedCategories.length || 0}</span>
                  </div>
                  <div className="flex items-center justify-between border-b border-border pb-2">
                    <span className="text-sm text-muted-foreground">Content Types</span>
                    <span className="font-medium text-foreground">{selectedContentTypes.length || 0}</span>
                  </div>

                  <div className="rounded-lg bg-primary/10 p-3">
                    <div className="flex items-start gap-2">
                      <Info className="h-4 w-4 text-primary mt-0.5" />
                      <p className="text-xs text-muted-foreground">
                        Your campaign will be visible to all matching influencers once published.
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 pt-2">
                    <Button type="submit" disabled={isLoading}>
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Creating...
                        </>
                      ) : (
                        "Create Campaign"
                      )}
                    </Button>
                    <Button type="button" variant="outline">
                      Save as Draft
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
      </main>
    </div>
  )
}
