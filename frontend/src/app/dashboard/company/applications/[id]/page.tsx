"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Sidebar } from "@/components/dashboard/sidebar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Calendar, DollarSign, Loader2, Check, X, User, Briefcase } from "lucide-react"
import Link from "next/link"
import { applicationsAPI } from "@/lib/api"
import { authStorage } from "@/lib/authHelper"

interface Application {
  _id: string
  influencer?: {
    username: string
    displayName: string
    email: string
    contentType: { content: string }[]
    platforms: { platform: string; count: number }[]
    socialMediaProfileLinks: { platform: string; link: string }[]
    experienceYears: number
  }
  campaign: {
    title: string
    description: string
    budget?: number
    status: string
    startDate: string
    endDate: string
  }
  company?: {
    companyName: string
    email: string
  }
  status: "pending" | "accepted" | "rejected"
  message: string
  appliedAt: string
}

const statusConfig = {
  pending: { color: "bg-yellow-500/10 text-yellow-500", label: "Pending" },
  accepted: { color: "bg-green-500/10 text-green-500", label: "Accepted" },
  rejected: { color: "bg-red-500/10 text-red-500", label: "Rejected" },
}

export default function ApplicationDetailPage() {
  const params = useParams<{ id: string }>()
  const router = useRouter()
  const [application, setApplication] = useState<Application | null>(null)
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)
  const [error, setError] = useState("")
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    const storedUser = authStorage.getUser()
    setUser(storedUser)
    loadApplication()
  }, [params.id])

  const loadApplication = async () => {
    try {
      setLoading(true)
      const response = await applicationsAPI.getDetails(params.id)
      console.log('Application details response:', response)
      if (response.data && !response.error) {
        setApplication(response.data as Application)
      } else {
        setError(response.error || "Application not found")
      }
    } catch (error) {
      console.error('Error loading application:', error)
      setError("Failed to load application")
    } finally {
      setLoading(false)
    }
  }

  const handleStatusUpdate = async (newStatus: "accepted" | "rejected") => {
    setUpdating(true)
    setError("")

    try {
      const response = await applicationsAPI.updateApplicationStatus(params.id, newStatus)
      
      if (response.data && !response.error) {
        await loadApplication()
      } else {
        setError(response.error || "Failed to update status")
      }
    } catch (error) {
      console.error('Error updating status:', error)
      setError("Failed to update status")
    } finally {
      setUpdating(false)
    }
  }

  const handleWithdraw = async () => {
    if (!confirm("Are you sure you want to withdraw this application?")) return

    setUpdating(true)
    try {
      const response = await applicationsAPI.delete(params.id)
      
      if (response.data && !response.error) {
        router.push("/dashboard/influencer/applications")
      } else {
        setError(response.error || "Failed to withdraw application")
      }
    } catch (error) {
      console.error('Error withdrawing application:', error)
      setError("Failed to withdraw application")
    } finally {
      setUpdating(false)
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

  if (!application) {
    return (
      <div className="min-h-screen bg-background">
        <Sidebar userType={user?.role || "influencer"} />
        <main className="lg:pl-64">
          <div className="flex items-center justify-center min-h-screen">
            <div className="text-center">
              <h3 className="text-lg font-medium text-foreground">Application not found</h3>
              <Button className="mt-4" asChild>
                <Link href={user?.role === "company" ? "/dashboard/company/applications" : "/dashboard/influencer/applications"}>
                  Back to Applications
                </Link>
              </Button>
            </div>
          </div>
        </main>
      </div>
    )
  }

  const isCompany = user?.role === "company"
  const isInfluencer = user?.role === "influencer"

  return (
    <div className="min-h-screen bg-background">
      <Sidebar userType={user?.role} />

      <main className="lg:pl-64">
        <div className="px-4 py-8 pt-24 lg:px-8 lg:pt-8">
          <Button variant="ghost" size="sm" asChild className="mb-4">
            <Link href={isCompany ? "/dashboard/company/applications" : "/dashboard/influencer/applications"}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Applications
            </Link>
          </Button>

          {error && (
            <div className="mb-6 rounded-lg bg-red-500/10 border border-red-500/20 p-4">
              <p className="text-sm text-red-500">{error}</p>
            </div>
          )}

          <div className="grid gap-6 lg:grid-cols-3">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Application Status */}
              <div className="glass-card rounded-xl p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h1 className="text-2xl font-bold text-foreground">{application.campaign.title}</h1>
                    <Badge className={`mt-2 ${statusConfig[application.status].color}`}>
                      {statusConfig[application.status].label}
                    </Badge>
                  </div>
                  {isCompany && application.status === "pending" && (
                    <div className="flex gap-2">
                      <Button size="sm" onClick={() => handleStatusUpdate("accepted")} disabled={updating}>
                        <Check className="mr-2 h-4 w-4" />
                        Accept
                      </Button>
                      <Button size="sm" variant="destructive" onClick={() => handleStatusUpdate("rejected")} disabled={updating}>
                        <X className="mr-2 h-4 w-4" />
                        Reject
                      </Button>
                    </div>
                  )}
                </div>

                <div className="prose prose-sm max-w-none">
                  <h3 className="text-foreground">Campaign Description</h3>
                  <p className="text-muted-foreground whitespace-pre-wrap">{application.campaign.description}</p>
                </div>
              </div>

              {/* Application Message */}
              <div className="glass-card rounded-xl p-6">
                <h3 className="text-lg font-semibold text-foreground mb-4">
                  {isCompany ? "Influencer's Message" : "Your Message"}
                </h3>
                <p className="text-muted-foreground whitespace-pre-wrap">{application.message}</p>
              </div>

              {/* Influencer Details (for company) */}
              {isCompany && application.influencer && (
                <div className="glass-card rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-foreground mb-4">Influencer Details</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Name</p>
                      <p className="font-medium text-foreground">{application.influencer.displayName}</p>
                    </div>

                    <div>
                      <p className="text-sm text-muted-foreground">Username</p>
                      <p className="font-medium text-foreground">@{application.influencer.username}</p>
                    </div>

                    <div>
                      <p className="text-sm text-muted-foreground">Experience</p>
                      <p className="font-medium text-foreground">{application.influencer.experienceYears} years</p>
                    </div>

                    {application.influencer.contentType.length > 0 && (
                      <div>
                        <p className="text-sm text-muted-foreground mb-2">Categories</p>
                        <div className="flex flex-wrap gap-2">
                          {application.influencer.contentType.map((ct) => (
                            <Badge key={ct.content} variant="secondary">
                              {ct.content}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Company Details (for influencer) */}
              {isInfluencer && application.company && (
                <div className="glass-card rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-foreground mb-4">Company Details</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Company Name</p>
                      <p className="font-medium text-foreground">{application.company.companyName}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Actions for Influencer */}
              {isInfluencer && application.status === "pending" && (
                <div className="glass-card rounded-xl p-6">
                  <Button variant="destructive" onClick={handleWithdraw} disabled={updating}>
                    {updating ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Withdrawing...
                      </>
                    ) : (
                      "Withdraw Application"
                    )}
                  </Button>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <div className="glass-card rounded-xl p-6 sticky top-8">
                <h3 className="text-lg font-semibold text-foreground mb-4">Details</h3>
                
                <div className="space-y-4">
                  {application.campaign.budget && (
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                        <DollarSign className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Budget</p>
                        <p className="font-medium text-foreground">
                          ${application.campaign.budget.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10">
                      <Calendar className="h-5 w-5 text-accent" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Campaign Period</p>
                      <p className="font-medium text-foreground text-sm">
                        {formatDate(application.campaign.startDate)} - {formatDate(application.campaign.endDate)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-chart-3/10">
                      <Briefcase className="h-5 w-5 text-chart-3" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Applied On</p>
                      <p className="font-medium text-foreground">
                        {formatDate(application.appliedAt)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-500/10">
                      <User className="h-5 w-5 text-green-500" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Status</p>
                      <p className="font-medium text-foreground capitalize">
                        {application.status}
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