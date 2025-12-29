'use client'

import { Sidebar } from "@/components/dashboard/sidebar"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { StatsCard } from "@/components/dashboard/stats-card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Eye, MessageSquare, DollarSign, Briefcase, ArrowRight, Building2, Calendar } from "lucide-react"
import Link from "next/link"
import { authStorage } from "@/lib/authHelper"
import { useEffect, useState } from "react"
import { influencerAPI, applicationsAPI, campaignsAPI } from "@/lib/api"

interface Campaign {
  _id: string
  title: string
  description: string
  budget: number
  deadline: string
  status: string
  companyId: {
    _id: string
    companyName: string
    profileImage?: string
  }
  categories: string[]
}

interface Application {
  _id: string
  campaignId: Campaign
  status: 'pending' | 'accepted' | 'rejected'
  proposedRate?: number
  createdAt: string
}

const statusColors = {
  pending: "bg-yellow-500/10 text-yellow-500",
  accepted: "bg-green-500/10 text-green-500",
  rejected: "bg-red-500/10 text-red-500",
}

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export default function InfluencerDashboard() {
  const [user, setUser] = useState<any>(null)
  const [applications, setApplications] = useState<Application[]>([])
  const [recommendedCampaigns, setRecommendedCampaigns] = useState<Campaign[]>([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    profileViews: 0,
    activeApplications: 0,
    messages: 0,
    totalEarnings: 0
  })

  useEffect(() => {
    const storedUser = authStorage.getUser()
    setUser(storedUser)
    
    if (storedUser) {
      // Try different possible ID fields
      const userId = storedUser._id || storedUser.id || storedUser.userId || storedUser.influencerId
      
      if (userId) {
        loadDashboardData(userId)
      } else {
        console.error('No valid user ID found in user object')
      }
    }
  }, [])

const loadDashboardData = async (influencerId: string) => {
  try {
    setLoading(true);

    // ================== FETCH APPLICATIONS ==================
    const appsResponse = await applicationsAPI.getByInfluencer(influencerId) as {
      data: ApiResponse<Application[]> | null;
      error: string | null;
    };

    const applicationsData: Application[] = Array.isArray(appsResponse.data?.data)
      ? appsResponse.data!.data
      : [];

    setApplications(applicationsData);

    // ================== CALCULATE STATS ==================
    const acceptedApps = applicationsData.filter(
      app => app.status === "accepted"
    );

    const totalEarnings = acceptedApps.reduce(
      (sum, app) =>
        sum + (app.proposedRate || app.campaignId?.budget || 0),
      0
    );

    const activeApplications = applicationsData.filter(
      app => app.status === "pending" || app.status === "accepted"
    ).length;

    setStats(prev => ({
      ...prev,
      activeApplications,
      totalEarnings,
    }));

    // ================== FETCH CAMPAIGNS ==================
    const campaignsResponse = await campaignsAPI.list({ status: "active" }) as {
      data: ApiResponse<Campaign[]> | null;
      error: string | null;
    };

    const campaignsData: Campaign[] = Array.isArray(
      campaignsResponse.data?.data
    )
      ? campaignsResponse.data!.data
      : [];

    // ================== FILTER RECOMMENDED ==================
    const appliedCampaignIds = applicationsData
      .map(app => app.campaignId?._id)
      .filter(Boolean) as string[];

    const recommended = campaignsData.filter(
      campaign => !appliedCampaignIds.includes(campaign._id)
    );

    setRecommendedCampaigns(recommended.slice(0, 3));
  } catch (error) {
    console.error("Error loading dashboard data:", error);
    setApplications([]);
    setRecommendedCampaigns([]);
  } finally {
    setLoading(false);
  }
};


  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  if (!user) return null

  return (
    <div className="min-h-screen bg-background">
      <Sidebar userType={user.role} />

      <main className="lg:pl-64">
        <div className="px-4 py-8 pt-24 lg:px-8 lg:pt-8">
          <DashboardHeader
            title={`Welcome back, ${user.displayName}!`}
            subtitle="Here's what's happening with your sponsorships"
          />

          {/* Stats Grid */}
          <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatsCard
              title="Profile Views"
              value={stats.profileViews.toString()}
              change="+12.5%"
              changeType="positive"
              icon={Eye}
              iconColor="text-primary"
            />
            <StatsCard
              title="Active Applications"
              value={stats.activeApplications.toString()}
              change={`${applications.filter(app => app.status === 'pending').length} pending`}
              changeType="neutral"
              icon={Briefcase}
              iconColor="text-accent"
            />
            <StatsCard
              title="Messages"
              value={stats.messages.toString()}
              change="0 unread"
              changeType="neutral"
              icon={MessageSquare}
              iconColor="text-chart-3"
            />
            <StatsCard
              title="Total Earnings"
              value={formatCurrency(stats.totalEarnings)}
              change={`${applications.filter(app => app.status === 'accepted').length} accepted`}
              changeType="positive"
              icon={DollarSign}
              iconColor="text-green-500"
            />
          </div>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            {/* Recent Applications */}
            <div className="lg:col-span-2">
              <div className="glass-card rounded-xl p-6">
                <div className="mb-6 flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-foreground">Recent Applications</h2>
                  <Button variant="ghost" size="sm" asChild>
                    <Link href="/dashboard/influencer/applications" className="gap-1">
                      View All
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                </div>

                {loading ? (
                  <div className="text-center text-muted-foreground py-8">Loading...</div>
                ) : applications.length === 0 ? (
                  <div className="text-center text-muted-foreground py-8">
                    No applications yet. Start applying to campaigns!
                  </div>
                ) : (
                  <div className="space-y-4">
                    {applications.slice(0, 3).map((application) => (
                      <div
                        key={application._id}
                        className="flex items-center gap-4 rounded-lg border border-border bg-secondary/30 p-4 transition-colors hover:bg-secondary/50"
                      >
                        <img
                          src={application.campaignId?.companyId?.profileImage || "/placeholder.svg"}
                          alt={application.campaignId?.companyId?.companyName}
                          className="h-12 w-12 rounded-lg object-cover"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <h3 className="font-medium text-foreground truncate">
                              {application.campaignId?.title}
                            </h3>
                            <Badge className={statusColors[application.status]}>
                              {application.status}
                            </Badge>
                          </div>
                          <div className="mt-1 flex items-center gap-4 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Building2 className="h-3 w-3" />
                              {application.campaignId?.companyId?.companyName}
                            </span>
                            <span className="flex items-center gap-1">
                              <DollarSign className="h-3 w-3" />
                              {formatCurrency(application.proposedRate || application.campaignId?.budget || 0)}
                            </span>
                            <span className="hidden items-center gap-1 sm:flex">
                              <Calendar className="h-3 w-3" />
                              {formatDate(application.campaignId?.deadline)}
                            </span>
                          </div>
                        </div>
                        <Button variant="outline" size="sm" asChild>
                          <Link href={`/dashboard/influencer/applications/${application._id}`}>
                            View
                          </Link>
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Recommended Campaigns */}
            <div>
              <div className="glass-card rounded-xl p-6">
                <div className="mb-6 flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-foreground">Available Campaigns</h2>
                  <Button variant="ghost" size="sm" asChild>
                    <Link href="/dashboard/influencer/discover" className="gap-1">
                      See More
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                </div>

                {loading ? (
                  <div className="text-center text-muted-foreground py-8">Loading...</div>
                ) : recommendedCampaigns.length === 0 ? (
                  <div className="text-center text-muted-foreground py-8 text-sm">
                    No new campaigns available
                  </div>
                ) : (
                  <div className="space-y-4">
                    {recommendedCampaigns.map((campaign) => (
                      <div
                        key={campaign._id}
                        className="flex items-center gap-3 rounded-lg border border-border bg-secondary/30 p-3 transition-colors hover:bg-secondary/50"
                      >
                        <img
                          src={campaign.companyId?.profileImage || "/placeholder.svg"}
                          alt={campaign.companyId?.companyName}
                          className="h-10 w-10 rounded-lg object-cover"
                        />
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-foreground text-sm truncate">
                            {campaign.title}
                          </h3>
                          <p className="text-xs text-muted-foreground">
                            {campaign.categories[0]} • {formatCurrency(campaign.budget)}
                          </p>
                        </div>
                        <Button variant="outline" size="sm" asChild>
                          <Link href={`/dashboard/influencer/campaigns/${campaign._id}`}>
                            View
                          </Link>
                        </Button>
                      </div>
                    ))}
                  </div>
                )}

                <Button className="mt-4 w-full bg-transparent" variant="outline" asChild>
                  <Link href="/dashboard/influencer/discover">Discover More Campaigns</Link>
                </Button>
              </div>

              {/* Quick Actions */}
              <div className="glass-card mt-4 rounded-xl p-6">
                <h2 className="mb-4 text-lg font-semibold text-foreground">Quick Actions</h2>
                <div className="grid grid-cols-2 gap-3">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="h-auto flex-col gap-1 py-3 bg-transparent"
                    asChild
                  >
                    <Link href="/dashboard/influencer/messages">
                      <MessageSquare className="h-4 w-4" />
                      <span className="text-xs">Messages</span>
                    </Link>
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="h-auto flex-col gap-1 py-3 bg-transparent"
                    asChild
                  >
                    <Link href="/dashboard/influencer/applications">
                      <Briefcase className="h-4 w-4" />
                      <span className="text-xs">Applications</span>
                    </Link>
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="h-auto flex-col gap-1 py-3 bg-transparent"
                    asChild
                  >
                    <Link href="/dashboard/influencer/discover">
                      <Building2 className="h-4 w-4" />
                      <span className="text-xs">Discover</span>
                    </Link>
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="h-auto flex-col gap-1 py-3 bg-transparent"
                    asChild
                  >
                    <Link href="/dashboard/influencer/profile">
                      <Eye className="h-4 w-4" />
                      <span className="text-xs">Profile</span>
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}