/* eslint-disable @typescript-eslint/no-explicit-any */
// eslint-disable-next-line react-hooks/exhaustive-deps
// eslint-disable-next-line @next/next/no-img-element
"use client"

import { useState, useEffect } from "react"
import { Sidebar } from "@/components/dashboard/sidebar"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { ArrowLeft, Loader2, Check, X, Search, Eye, Users, Calendar } from "lucide-react"
import Link from "next/link"
import { campaignsAPI, applicationsAPI } from "@/lib/api"
import { useParams } from "next/navigation"

interface Application {
  _id: string
  influencer: {
    _id: string
    username: string
    displayName: string
    profileImage?: string
    bio?: string
    platforms: { platform: string; count: number }[]
    experienceYears: number
  }
  campaign: {
    _id: string
    title: string
    budget?: number
    budgetRange?: string
    status: string
    startDate: string
    endDate: string
  }
  status: "pending" | "accepted" | "rejected"
  message: string
  appliedAt: string
}

const statusConfig = {
  pending: { color: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20", label: "Pending" },
  accepted: { color: "bg-green-500/10 text-green-500 border-green-500/20", label: "Accepted" },
  rejected: { color: "bg-red-500/10 text-red-500 border-red-500/20", label: "Rejected" },
}

export default function CampaignApplicationsPage() {
  const params = useParams<{ id: string }>()
  const [applications, setApplications] = useState<Application[]>([])
  const [filteredApplications, setFilteredApplications] = useState<Application[]>([])
  const [campaign, setCampaign] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [error, setError] = useState("")

  useEffect(() => {
    loadData()
  }, [params.id])

  useEffect(() => {
    filterApplications()
  }, [applications, searchQuery, statusFilter])

  const loadData = async () => {
    try {
      setLoading(true)
      
      // Load campaign details
      const campaignResponse = await campaignsAPI.get(params.id)
      const campaignData = (campaignResponse.data as { data: any }).data
      console.log(campaignData)
      if (campaignData && !campaignResponse.error) {
        setCampaign(campaignData)
      }

      // Load applications
      const appsResponse = await applicationsAPI.getByCampaign(params.id)
      const appdata = (appsResponse.data as { data: Application[] }).data
      if (appdata && !appsResponse.error) {
        setApplications(appdata)
      } else {
        setError(appsResponse.error || "Failed to load applications")
      }
    } catch (error) {
      console.error('Error loading data:', error)
      setError("Failed to load applications")
    } finally {
      setLoading(false)
    }
  }

  const filterApplications = () => {
    let filtered = applications

    // Filter by status
    if (statusFilter !== "all") {
      filtered = filtered.filter(app => app.status === statusFilter)
    }

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(app =>
        app.influencer.displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        app.influencer.username.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    setFilteredApplications(filtered)
  }

  const handleStatusUpdate = async (applicationId: string, newStatus: "accepted" | "rejected") => {
    setUpdating(applicationId)
    setError("")

    try {
      const response = await applicationsAPI.updateApplicationStatus(applicationId, newStatus)
      
      if (response.data && !response.error) {
        // Update local state
        setApplications(apps =>
          apps.map(app =>
            app._id === applicationId ? { ...app, status: newStatus } : app
          )
        )
      } else {
        setError(response.error || "Failed to update status")
      }
    } catch (error) {
      console.error('Error updating status:', error)
      setError("Failed to update status")
    } finally {
      setUpdating(null)
    }
  }

  const getTotalFollowers = (platforms: { platform: string; count: number }[]) => {
    const total = platforms.reduce((sum, p) => sum + p.count, 0)
    if (total >= 1000000) return `${(total / 1000000).toFixed(1)}M`
    if (total >= 1000) return `${(total / 1000).toFixed(0)}K`
    return total.toString()
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  const stats = {
    total: applications.length,
    pending: applications.filter(a => a.status === "pending").length,
    accepted: applications.filter(a => a.status === "accepted").length,
    rejected: applications.filter(a => a.status === "rejected").length,
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Sidebar userType="company" />
        <main className="lg:pl-64">
          <div className="flex items-center justify-center min-h-screen">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Sidebar userType="company" />

      <main className="lg:pl-64">
        <div className="px-4 py-8 pt-24 lg:px-8 lg:pt-8">
          <Button variant="ghost" size="sm" asChild className="mb-4">
            <Link href="/dashboard/company/campaigns">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Campaigns
            </Link>
          </Button>

          <DashboardHeader
            title={campaign?.title || "Campaign Applications"}
            subtitle={`Manage applications for this campaign`}
          />

          {error && (
            <div className="mb-6 rounded-lg bg-red-500/10 border border-red-500/20 p-4">
              <p className="text-sm text-red-500">{error}</p>
            </div>
          )}

          {/* Stats */}
          <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
            <div className="glass-card rounded-xl p-4">
              <p className="text-2xl font-bold text-foreground">{stats.total}</p>
              <p className="text-sm text-muted-foreground">Total</p>
            </div>
            <div className="glass-card rounded-xl p-4">
              <p className="text-2xl font-bold text-yellow-500">{stats.pending}</p>
              <p className="text-sm text-muted-foreground">Pending</p>
            </div>
            <div className="glass-card rounded-xl p-4">
              <p className="text-2xl font-bold text-green-500">{stats.accepted}</p>
              <p className="text-sm text-muted-foreground">Accepted</p>
            </div>
            <div className="glass-card rounded-xl p-4">
              <p className="text-2xl font-bold text-red-500">{stats.rejected}</p>
              <p className="text-sm text-muted-foreground">Rejected</p>
            </div>
          </div>

          {/* Filters */}
          <div className="mb-6 glass-card rounded-xl p-4">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search influencers..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="flex gap-2">
                {["all", "pending", "accepted", "rejected"].map((status) => (
                  <Button
                    key={status}
                    variant={statusFilter === status ? "default" : "outline"}
                    size="sm"
                    onClick={() => setStatusFilter(status)}
                    className="capitalize"
                  >
                    {status}
                  </Button>
                ))}
              </div>
            </div>
          </div>

          {/* Applications List */}
          <div className="space-y-4">
            {filteredApplications.length === 0 ? (
              <div className="glass-card rounded-xl p-12 text-center">
                <Users className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium text-foreground">No applications found</h3>
                <p className="text-muted-foreground mt-1">
                  {searchQuery || statusFilter !== "all" 
                    ? "Try adjusting your filters" 
                    : "No one has applied to this campaign yet"}
                </p>
              </div>
            ) : (
              filteredApplications.map((application) => (
                <div
                  key={application._id}
                  className="glass-card rounded-xl p-6 transition-all hover:scale-[1.01]"
                >
                  <div className="flex items-start gap-4">
                    {/* Influencer Avatar */}
                    <Link href={`/dashboard/company/influencers/${application.influencer._id}`}>
                      <img
                        src={application.influencer.profileImage || "/placeholder.svg"}
                        alt={application.influencer.displayName}
                        className="h-16 w-16 rounded-full object-cover ring-2 ring-border hover:ring-primary transition-all cursor-pointer"
                      />
                    </Link>

                    {/* Main Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4 mb-2">
                        <div>
                          <Link 
                            href={`/dashboard/company/influencers/${application.influencer._id}`}
                            className="font-semibold text-foreground hover:text-primary transition-colors"
                          >
                            {application.influencer.displayName}
                          </Link>
                          <p className="text-sm text-muted-foreground">@{application.influencer.username}</p>
                        </div>
                        <Badge className={`${statusConfig[application.status].color} border`}>
                          {statusConfig[application.status].label}
                        </Badge>
                      </div>

                      {/* Stats */}
                      <div className="flex items-center gap-4 mb-3 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Users className="h-4 w-4" />
                          {getTotalFollowers(application.influencer.platforms)} followers
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {application.influencer.experienceYears} years exp
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          Applied {formatDate(application.appliedAt)}
                        </span>
                      </div>

                      {/* Message Preview */}
                      <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                        {application.message}
                      </p>

                      {/* Actions */}
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          asChild
                        >
                          <Link href={`/dashboard/company/applications/${application._id}`}>
                            <Eye className="mr-2 h-4 w-4" />
                            View Details
                          </Link>
                        </Button>

                        {application.status === "pending" && (
                          <>
                            <Button
                              size="sm"
                              onClick={() => handleStatusUpdate(application._id, "accepted")}
                              disabled={updating === application._id}
                            >
                              {updating === application._id ? (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              ) : (
                                <Check className="mr-2 h-4 w-4" />
                              )}
                              Accept
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleStatusUpdate(application._id, "rejected")}
                              disabled={updating === application._id}
                            >
                              <X className="mr-2 h-4 w-4" />
                              Reject
                            </Button>
                          </>
                        )}

                        {application.status === "accepted" && (
                          <Badge variant="secondary" className="bg-green-500/10 text-green-500">
                            ✓ Accepted
                          </Badge>
                        )}

                        {application.status === "rejected" && (
                          <Badge variant="secondary" className="bg-red-500/10 text-red-500">
                            ✗ Rejected
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </main>
    </div>
  )
}