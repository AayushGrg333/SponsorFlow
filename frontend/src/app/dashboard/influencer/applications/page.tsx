"use client"

import { useState, useEffect } from "react"
import { Sidebar } from "@/components/dashboard/sidebar"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Clock,
  CheckCircle2,
  XCircle,
  Calendar,
  DollarSign,
  Building2,
  FileText,
  Eye,
} from "lucide-react"
import { influencerAPI } from "@/lib/api"
import Link from "next/link"

interface Application {
  _id: string
  campaign: {
    _id: string
    campaignName: string
    description: string
    budget: number
    startDate: string
    endDate: string
    status: string
  }
  company: {
    _id: string
    companyName: string
    profileImage?: string
  }
  status: "pending" | "accepted" | "rejected"
  message?: string
  appliedAt: string
  createdAt: string
}

const statusConfig = {
  pending: {
    label: "Pending",
    icon: Clock,
    variant: "secondary" as const,
    color: "text-yellow-500",
    bgColor: "bg-yellow-500/10",
  },
  accepted: {
    label: "Accepted",
    icon: CheckCircle2,
    variant: "default" as const,
    color: "text-green-500",
    bgColor: "bg-green-500/10",
  },
  rejected: {
    label: "Rejected",
    icon: XCircle,
    variant: "destructive" as const,
    color: "text-red-500",
    bgColor: "bg-red-500/10",
  },
}

export default function ApplicationsPage() {
  const [applications, setApplications] = useState<Application[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("all")

  useEffect(() => {
    loadApplications()
  }, [])

  const loadApplications = async () => {
    try {
      setLoading(true)
      const response = await influencerAPI.getApplications()
      
      if (response.data && !response.error) {
        setApplications(response.data as Application[])
      } else {
        console.error('Error fetching applications:', response.error)
        setApplications([])
      }
    } catch (error) {
      console.error('Error loading applications:', error)
      setApplications([])
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(amount)
  }

  const getFilteredApplications = () => {
    if (activeTab === "all") return applications
    return applications.filter(app => app.status === activeTab)
  }

  const getStats = () => {
    return {
      total: applications.length,
      pending: applications.filter(app => app.status === "pending").length,
      accepted: applications.filter(app => app.status === "accepted").length,
      rejected: applications.filter(app => app.status === "rejected").length,
    }
  }

  const stats = getStats()
  const filteredApplications = getFilteredApplications()

  return (
    <div className="min-h-screen bg-background">
      <Sidebar userType="influencer" />

      <main className="lg:pl-64">
        <div className="px-4 py-8 pt-24 lg:px-8 lg:pt-8">
          <DashboardHeader 
            title="My Applications" 
            subtitle="Track the status of your campaign applications"
          />

          {/* Stats Cards */}
          <div className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
            <Card>
              <CardHeader className="pb-3">
                <CardDescription>Total Applications</CardDescription>
                <CardTitle className="text-3xl">{stats.total}</CardTitle>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardDescription className="text-yellow-500">Pending</CardDescription>
                <CardTitle className="text-3xl">{stats.pending}</CardTitle>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardDescription className="text-green-500">Accepted</CardDescription>
                <CardTitle className="text-3xl">{stats.accepted}</CardTitle>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardDescription className="text-red-500">Rejected</CardDescription>
                <CardTitle className="text-3xl">{stats.rejected}</CardTitle>
              </CardHeader>
            </Card>
          </div>

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-4 lg:w-[400px]">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="pending">Pending</TabsTrigger>
              <TabsTrigger value="accepted">Accepted</TabsTrigger>
              <TabsTrigger value="rejected">Rejected</TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab} className="space-y-4">
              {/* Loading State */}
              {loading && (
                <div className="flex items-center justify-center py-16">
                  <div className="text-muted-foreground">Loading applications...</div>
                </div>
              )}

              {/* Applications List */}
              {!loading && filteredApplications.length > 0 && (
                <div className="space-y-4">
                  {filteredApplications.map((application) => {
                    const config = statusConfig[application.status]
                    const StatusIcon = config.icon

                    return (
                      <Card key={application._id} className="overflow-hidden transition-all hover:shadow-md">
                        <CardHeader className="border-b bg-muted/50 pb-4">
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex items-start gap-4">
                              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                                <Building2 className="h-6 w-6 text-primary" />
                              </div>
                              <div className="flex-1">
                                <CardTitle className="text-xl">
                                  {application.campaign.campaignName}
                                </CardTitle>
                                <CardDescription className="mt-1 flex items-center gap-2">
                                  <Building2 className="h-4 w-4" />
                                  {application.company.companyName}
                                </CardDescription>
                              </div>
                            </div>
                            <Badge 
                              variant={config.variant}
                              className={`${config.bgColor} ${config.color} flex items-center gap-1.5`}
                            >
                              <StatusIcon className="h-4 w-4" />
                              {config.label}
                            </Badge>
                          </div>
                        </CardHeader>

                        <CardContent className="pt-6">
                          <div className="space-y-4">
                            {/* Campaign Description */}
                            <p className="text-sm text-muted-foreground line-clamp-2">
                              {application.campaign.description}
                            </p>

                            {/* Application Message */}
                            {application.message && (
                              <div className="rounded-lg bg-muted p-4">
                                <div className="mb-2 flex items-center gap-2 text-sm font-medium">
                                  <FileText className="h-4 w-4" />
                                  Your Message
                                </div>
                                <p className="text-sm text-muted-foreground">
                                  {application.message}
                                </p>
                              </div>
                            )}

                            {/* Details Grid */}
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                              <div className="flex items-center gap-3 rounded-lg bg-secondary p-3">
                                <DollarSign className="h-5 w-5 text-muted-foreground" />
                                <div>
                                  <p className="text-xs text-muted-foreground">Budget</p>
                                  <p className="font-semibold">
                                    {formatCurrency(application.campaign.budget)}
                                  </p>
                                </div>
                              </div>

                              <div className="flex items-center gap-3 rounded-lg bg-secondary p-3">
                                <Calendar className="h-5 w-5 text-muted-foreground" />
                                <div>
                                  <p className="text-xs text-muted-foreground">Applied On</p>
                                  <p className="font-semibold">
                                    {formatDate(application.appliedAt)}
                                  </p>
                                </div>
                              </div>

                              <div className="flex items-center gap-3 rounded-lg bg-secondary p-3">
                                <Clock className="h-5 w-5 text-muted-foreground" />
                                <div>
                                  <p className="text-xs text-muted-foreground">Campaign Period</p>
                                  <p className="text-sm font-semibold">
                                    {formatDate(application.campaign.startDate)} - {formatDate(application.campaign.endDate)}
                                  </p>
                                </div>
                              </div>
                            </div>

                            {/* Actions */}
                            <div className="flex gap-3 pt-2">
                              <Button asChild className="flex-1">
                                <Link href={`/dashboard/influencer/campaigns/${application.campaign._id}`}>
                                  <Eye className="mr-2 h-4 w-4" />
                                  View Campaign
                                </Link>
                              </Button>
                              {application.status === "accepted" && (
                                <Button variant="outline">
                                  View Contract
                                </Button>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )
                  })}
                </div>
              )}

              {/* Empty State */}
              {!loading && filteredApplications.length === 0 && (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                    <FileText className="mb-4 h-12 w-12 text-muted-foreground" />
                    <CardTitle className="mb-2">No applications found</CardTitle>
                    <CardDescription className="mb-6">
                      {activeTab === "all" 
                        ? "You haven't applied to any campaigns yet"
                        : `You have no ${activeTab} applications`
                      }
                    </CardDescription>
                    {activeTab === "all" && (
                      <Button asChild>
                        <Link href="/dashboard/influencer/campaigns">
                          Browse Campaigns
                        </Link>
                      </Button>
                    )}
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  )
}