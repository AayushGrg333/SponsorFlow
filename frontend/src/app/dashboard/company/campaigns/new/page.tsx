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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, X, Loader2, Calendar, DollarSign, Info } from "lucide-react"
import Link from "next/link"
import { campaignsAPI } from "@/lib/api"

const platforms = ["instagram", "youtube", "twitter", "facebook", "linkedin", "website"]

const budgetVisibilityOptions = [
  { value: "public", label: "Public (Visible to all)" },
  { value: "masked", label: "Masked (Show range only)" },
  { value: "private", label: "Private (Hidden from influencers)" },
]

export default function NewCampaignPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([])
  const [error, setError] = useState<string>("")

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    budget: "",
    budgetVisibility: "masked",
    budgetRange: "",
    startDate: "",
    endDate: "",
    status: "draft",
  })

  const togglePlatform = (platform: string) => {
    if (selectedPlatforms.includes(platform)) {
      setSelectedPlatforms(selectedPlatforms.filter((p) => p !== platform))
    } else {
      setSelectedPlatforms([...selectedPlatforms, platform])
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      // Validate dates
      if (new Date(formData.startDate) >= new Date(formData.endDate)) {
        setError("End date must be after start date")
        setIsLoading(false)
        return
      }

      // Prepare campaign data
      const campaignData: any = {
        title: formData.title,
        description: formData.description,
        budgetVisibility: formData.budgetVisibility,
        startDate: formData.startDate,
        endDate: formData.endDate,
        status: formData.status,
      }

      // Add budget only if provided
      if (formData.budget) {
        campaignData.budget = Number(formData.budget)
      } else {
        // If no budget, set a default or handle as per your backend
        campaignData.budget = 0 // or you can modify backend to make it optional
      }

      // Add budget range if provided
      if (formData.budgetRange) {
        campaignData.budgetRange = formData.budgetRange
      }

      // Add platforms if selected
      if (selectedPlatforms.length > 0) {
        campaignData.platforms = selectedPlatforms
      }

      console.log('Sending campaign data:', campaignData)

      const response = await campaignsAPI.create(campaignData)
      
      if (response.error) {
        setError(response.error)
        console.error('Campaign creation error:', response.error)
      } else {
        console.log('Campaign created:', response.data)
        router.push("/dashboard/company/campaigns")
      }
    } catch (error) {
      console.error('Error creating campaign:', error)
      setError("Failed to create campaign. Please try again.")
    } finally {
      setIsLoading(false)
    }
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

          {error && (
            <div className="mb-6 rounded-lg bg-red-500/10 border border-red-500/20 p-4">
              <p className="text-sm text-red-500">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="grid gap-8 lg:grid-cols-3">
            {/* Main Form */}
            <div className="space-y-6 lg:col-span-2">
              {/* Basic Info */}
              <div className="glass-card rounded-xl p-6">
                <h2 className="mb-4 text-lg font-semibold text-foreground">Campaign Details</h2>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Campaign Title *</Label>
                    <Input
                      id="title"
                      placeholder="e.g., Summer Product Launch"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      required
                      minLength={5}
                      maxLength={100}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Description *</Label>
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
                      <Label htmlFor="startDate">Start Date *</Label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                          id="startDate"
                          type="date"
                          className="pl-10"
                          value={formData.startDate}
                          onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="endDate">End Date *</Label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                          id="endDate"
                          type="date"
                          className="pl-10"
                          value={formData.endDate}
                          onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                          required
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Budget */}
              <div className="glass-card rounded-xl p-6">
                <h2 className="mb-4 text-lg font-semibold text-foreground">Budget (Optional)</h2>
                
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="budget">Campaign Budget ($)</Label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        id="budget"
                        type="number"
                        placeholder="5000 (optional)"
                        className="pl-10"
                        value={formData.budget}
                        onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                        min="0"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="budgetVisibility">Budget Visibility</Label>
                    <Select 
                      value={formData.budgetVisibility} 
                      onValueChange={(value) => setFormData({ ...formData, budgetVisibility: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {budgetVisibilityOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {formData.budgetVisibility === "masked" && (
                    <div className="space-y-2">
                      <Label htmlFor="budgetRange">Budget Range (for display)</Label>
                      <Input
                        id="budgetRange"
                        placeholder="e.g., $5,000 - $10,000"
                        value={formData.budgetRange}
                        onChange={(e) => setFormData({ ...formData, budgetRange: e.target.value })}
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Platforms */}
              <div className="glass-card rounded-xl p-6">
                <h2 className="mb-4 text-lg font-semibold text-foreground">Target Platforms</h2>
                <p className="mb-4 text-sm text-muted-foreground">
                  Select the platforms where you want influencers to create content
                </p>
                <div className="flex flex-wrap gap-2">
                  {platforms.map((platform) => (
                    <Badge
                      key={platform}
                      variant={selectedPlatforms.includes(platform) ? "default" : "outline"}
                      className={`cursor-pointer transition-all capitalize ${
                        selectedPlatforms.includes(platform)
                          ? "bg-primary text-primary-foreground"
                          : "hover:border-primary hover:text-primary"
                      }`}
                      onClick={() => togglePlatform(platform)}
                    >
                      {platform}
                      {selectedPlatforms.includes(platform) && <X className="ml-1 h-3 w-3" />}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Status */}
              <div className="glass-card rounded-xl p-6">
                <h2 className="mb-4 text-lg font-semibold text-foreground">Campaign Status</h2>
                <Select 
                  value={formData.status} 
                  onValueChange={(value) => setFormData({ ...formData, status: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Draft (Not visible to influencers)</SelectItem>
                    <SelectItem value="active">Active (Visible to influencers)</SelectItem>
                  </SelectContent>
                </Select>
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
                      {formData.budget ? `$${Number.parseInt(formData.budget).toLocaleString()}` : "Not set"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between border-b border-border pb-2">
                    <span className="text-sm text-muted-foreground">Start Date</span>
                    <span className="font-medium text-foreground">{formData.startDate || "-"}</span>
                  </div>
                  <div className="flex items-center justify-between border-b border-border pb-2">
                    <span className="text-sm text-muted-foreground">End Date</span>
                    <span className="font-medium text-foreground">{formData.endDate || "-"}</span>
                  </div>
                  <div className="flex items-center justify-between border-b border-border pb-2">
                    <span className="text-sm text-muted-foreground">Platforms</span>
                    <span className="font-medium text-foreground">{selectedPlatforms.length || 0}</span>
                  </div>
                  <div className="flex items-center justify-between border-b border-border pb-2">
                    <span className="text-sm text-muted-foreground">Status</span>
                    <span className="font-medium text-foreground capitalize">{formData.status}</span>
                  </div>

                  <div className="rounded-lg bg-primary/10 p-3">
                    <div className="flex items-start gap-2">
                      <Info className="h-4 w-4 text-primary mt-0.5" />
                      <p className="text-xs text-muted-foreground">
                        {formData.status === "active" 
                          ? "Your campaign will be visible to all influencers once created."
                          : "Save as draft to review before making it visible to influencers."}
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
                        formData.status === "active" ? "Create & Publish" : "Save as Draft"
                      )}
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