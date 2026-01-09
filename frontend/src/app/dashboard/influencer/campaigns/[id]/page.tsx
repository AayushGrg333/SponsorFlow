/* eslint-disable @typescript-eslint/no-explicit-any */
// eslint-disable-next-line react-hooks/exhaustive-deps
// eslint-disable-next-line @next/next/no-img-element
"use client"

import { useState, useEffect } from "react"
import { useRouter,useParams } from "next/navigation"
import { Sidebar } from "@/components/dashboard/sidebar"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Calendar, DollarSign, Loader2, Send, Building2 } from "lucide-react"
import Link from "next/link"
import { campaignsAPI, applicationsAPI } from "@/lib/api"
import { authStorage } from "@/lib/authHelper"


interface Campaign {
  _id: string
  company: string
  title: string
  description: string
  budget?: number
  budgetRange?: string
  platforms?: string[]
  startDate: string
  endDate: string
  status: string
  createdAt: string
}
export default function CampaignDetailPage() {
  const params = useParams<{ id: string }>()
  const campaignId = params.id
  const router = useRouter()
  const [campaign, setCampaign] = useState<Campaign | null>(null)
  const [loading, setLoading] = useState(true)
  const [applying, setApplying] = useState(false)
  const [showApplication, setShowApplication] = useState(false)
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    const storedUser = authStorage.getUser()
    setUser(storedUser)
    loadCampaign()
  }, [campaignId])

  const loadCampaign = async () => {
    try {
      setLoading(true)
      const response = await campaignsAPI.get(campaignId)
      console.log('Application response:', response)
      
      if (response.data && !response.error) {
        setCampaign((response.data as { data: Campaign }).data)
      } else {
        setError(response.error || "Campaign not found")
      }
    } catch (error) {
      console.error('Error loading campaign:', error)
      setError("Failed to load campaign")
    } finally {
      setLoading(false)
    }
  }

  const handleApply = async () => {
    if (!message.trim()) {
      setError("Please write a message")
      return
    }

    setApplying(true)
    setError("")

    try {
      const response = await applicationsAPI.create(campaignId, { message })
      if (response.data && !response.error) {
        router.push("/dashboard/influencer/applications")
      } else {
        setError(response.error || "Failed to submit application")
      }
    } catch (error) {
      console.error('Error applying:', error)
      setError("Failed to submit application")
    } finally {
      setApplying(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
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

  if (!campaign) {
    return (
      <div className="min-h-screen bg-background">
        <Sidebar userType={user?.role || "influencer"} />
        <main className="lg:pl-64">
          <div className="flex items-center justify-center min-h-screen">
            <div className="text-center">
              <h3 className="text-lg font-medium text-foreground">Campaign not found</h3>
              <Button className="mt-4" asChild>
                <Link href="/dashboard/influencer/discover">Back to Campaigns</Link>
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
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              <div className="glass-card rounded-xl p-6">
                <div className="mb-4 flex items-start justify-between">
                  <div>
                    <h1 className="text-2xl font-bold text-foreground">{campaign.title}</h1>
                    <Badge variant="secondary" className="mt-2 capitalize">
                      {campaign.status}
                    </Badge>
                  </div>
                </div>

                <div className="prose prose-sm max-w-none mt-6">
                  <h3 className="text-foreground">Description</h3>
                  <p className="text-muted-foreground whitespace-pre-wrap">{campaign.description}</p>
                </div>

                {campaign.platforms && campaign.platforms.length > 0 && (
                  <div className="mt-6">
                    <h3 className="text-sm font-medium text-foreground mb-2">Platforms</h3>
                    <div className="flex flex-wrap gap-2">
                      {campaign.platforms.map((platform) => (
                        <Badge key={platform} variant="outline" className="capitalize">
                          {platform}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Application Form */}
              {user?.role === "influencer" && !showApplication && (
                <div className="glass-card rounded-xl p-6">
                  <Button onClick={() => setShowApplication(true)} className="w-full">
                    <Send className="mr-2 h-4 w-4" />
                    Apply to this Campaign
                  </Button>
                </div>
              )}

              {showApplication && (
                <div className="glass-card rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-foreground mb-4">Submit Application</h3>
                  
                  {error && (
                    <div className="mb-4 rounded-lg bg-red-500/10 border border-red-500/20 p-3">
                      <p className="text-sm text-red-500">{error}</p>
                    </div>
                  )}

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="message">Your Message *</Label>
                      <Textarea
                        id="message"
                        placeholder="Explain why you're a good fit for this campaign..."
                        className="min-h-[150px]"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        disabled={applying}
                      />
                    </div>

                    <div className="flex gap-2">
                      <Button onClick={handleApply} disabled={applying}>
                        {applying ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Submitting...
                          </>
                        ) : (
                          <>
                            <Send className="mr-2 h-4 w-4" />
                            Submit Application
                          </>
                        )}
                      </Button>
                      <Button variant="outline" onClick={() => setShowApplication(false)} disabled={applying}>
                        Cancel
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <div className="glass-card rounded-xl p-6 sticky top-8">
                <h3 className="text-lg font-semibold text-foreground mb-4">Campaign Details</h3>
                
                <div className="space-y-4">
                  {(campaign.budget || campaign.budgetRange) && (
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                        <DollarSign className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Budget</p>
                        <p className="font-medium text-foreground">
                          {campaign.budgetRange || `$${campaign.budget?.toLocaleString()}`}
                        </p>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10">
                      <Calendar className="h-5 w-5 text-accent" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Duration</p>
                      <p className="font-medium text-foreground text-sm">
                        {formatDate(campaign.startDate)} - {formatDate(campaign.endDate)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-chart-3/10">
                      <Building2 className="h-5 w-5 text-chart-3" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Posted</p>
                      <p className="font-medium text-foreground">
                        {formatDate(campaign.createdAt)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}