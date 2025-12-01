"use client"

import { Sidebar } from "@/components/dashboard/sidebar"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { StatsCard } from "@/components/dashboard/stats-card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Users, Briefcase, MessageSquare, TrendingUp, ArrowRight, Calendar, DollarSign, Plus } from "lucide-react"
import Link from "next/link"

const activeCampaigns = [
  {
    id: 1,
    title: "Summer Product Launch",
    budget: "$8,000",
    spent: "$5,200",
    progress: 65,
    applications: 24,
    status: "active",
    deadline: "Dec 20, 2024",
  },
  {
    id: 2,
    title: "Holiday Season Promo",
    budget: "$12,000",
    spent: "$3,600",
    progress: 30,
    applications: 18,
    status: "active",
    deadline: "Dec 31, 2024",
  },
  {
    id: 3,
    title: "New Year Campaign",
    budget: "$6,500",
    spent: "$0",
    progress: 0,
    applications: 5,
    status: "draft",
    deadline: "Jan 15, 2025",
  },
]

const topInfluencers = [
  {
    id: 1,
    name: "Alex Johnson",
    avatar: "/placeholder.svg?key=diqb9",
    category: "Tech",
    followers: "520K",
    engagement: "4.8%",
    match: 96,
  },
  {
    id: 2,
    name: "Sarah Chen",
    avatar: "/placeholder.svg?key=uh1k4",
    category: "Lifestyle",
    followers: "380K",
    engagement: "5.2%",
    match: 92,
  },
  {
    id: 3,
    name: "Mike Rodriguez",
    avatar: "/placeholder.svg?key=r8lad",
    category: "Gaming",
    followers: "1.2M",
    engagement: "3.9%",
    match: 88,
  },
  {
    id: 4,
    name: "Emma Wilson",
    avatar: "/placeholder.svg?key=a0blv",
    category: "Beauty",
    followers: "890K",
    engagement: "4.5%",
    match: 85,
  },
]

const recentApplications = [
  {
    id: 1,
    influencer: "David Kim",
    avatar: "/placeholder.svg?key=3y9of",
    campaign: "Summer Product Launch",
    followers: "245K",
    status: "pending",
    date: "2h ago",
  },
  {
    id: 2,
    influencer: "Lisa Park",
    avatar: "/placeholder.svg?key=k5ue3",
    campaign: "Holiday Season Promo",
    followers: "560K",
    status: "pending",
    date: "5h ago",
  },
  {
    id: 3,
    influencer: "James Wilson",
    avatar: "/placeholder.svg?key=ycywt",
    campaign: "Summer Product Launch",
    followers: "180K",
    status: "accepted",
    date: "1d ago",
  },
]

const statusColors = {
  active: "bg-green-500/10 text-green-500",
  draft: "bg-yellow-500/10 text-yellow-500",
  completed: "bg-primary/10 text-primary",
  pending: "bg-yellow-500/10 text-yellow-500",
  accepted: "bg-green-500/10 text-green-500",
  rejected: "bg-red-500/10 text-red-500",
}

export default function CompanyDashboard() {
  return (
    <div className="min-h-screen bg-background">
      <Sidebar userType="company" />

      <main className="lg:pl-64">
        <div className="px-4 py-8 pt-24 lg:px-8 lg:pt-8">
          <DashboardHeader
            title="Welcome back, TechGear Pro!"
            subtitle="Manage your campaigns and find the perfect influencers"
          />

          {/* Stats Grid */}
          <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatsCard
              title="Active Campaigns"
              value="3"
              change="+1 this month"
              changeType="positive"
              icon={Briefcase}
              iconColor="text-accent"
            />
            <StatsCard
              title="Total Applications"
              value="47"
              change="+12 new"
              changeType="positive"
              icon={Users}
              iconColor="text-primary"
            />
            <StatsCard
              title="Messages"
              value="23"
              change="8 unread"
              changeType="neutral"
              icon={MessageSquare}
              iconColor="text-chart-3"
            />
            <StatsCard
              title="Campaign ROI"
              value="285%"
              change="+15%"
              changeType="positive"
              icon={TrendingUp}
              iconColor="text-green-500"
            />
          </div>

          <div className="grid grid-cols-1 gap-8 xl:grid-cols-3">
            {/* Active Campaigns */}
            <div className="xl:col-span-2">
              <div className="glass-card rounded-xl p-6">
                <div className="mb-6 flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-foreground">Active Campaigns</h2>
                  <Button variant="default" size="sm" asChild>
                    <Link href="/dashboard/company/campaigns/new" className="gap-1">
                      <Plus className="h-4 w-4" />
                      New Campaign
                    </Link>
                  </Button>
                </div>

                <div className="space-y-4">
                  {activeCampaigns.map((campaign) => (
                    <div key={campaign.id} className="rounded-lg border border-border bg-secondary/30 p-4">
                      <div className="mb-3 flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-medium text-foreground">{campaign.title}</h3>
                            <Badge className={statusColors[campaign.status as keyof typeof statusColors]}>
                              {campaign.status}
                            </Badge>
                          </div>
                          <div className="mt-1 flex items-center gap-4 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <DollarSign className="h-3 w-3" />
                              {campaign.budget}
                            </span>
                            <span className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {campaign.deadline}
                            </span>
                            <span className="flex items-center gap-1">
                              <Users className="h-3 w-3" />
                              {campaign.applications} applications
                            </span>
                          </div>
                        </div>
                        <Button variant="outline" size="sm">
                          Manage
                        </Button>
                      </div>
                      <div className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Budget spent: {campaign.spent}</span>
                          <span className="text-foreground">{campaign.progress}%</span>
                        </div>
                        <Progress value={campaign.progress} className="h-2" />
                      </div>
                    </div>
                  ))}
                </div>

                <Button className="mt-4 w-full bg-transparent" variant="outline" asChild>
                  <Link href="/dashboard/company/campaigns">
                    View All Campaigns
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Top Matching Influencers */}
              <div className="glass-card rounded-xl p-6">
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-foreground">Top Matches</h2>
                  <Button variant="ghost" size="sm" asChild>
                    <Link href="/dashboard/company/discover">View All</Link>
                  </Button>
                </div>

                <div className="space-y-3">
                  {topInfluencers.map((influencer) => (
                    <div
                      key={influencer.id}
                      className="flex items-center gap-3 rounded-lg border border-border bg-secondary/30 p-3 transition-colors hover:bg-secondary/50"
                    >
                      <img
                        src={influencer.avatar || "/placeholder.svg"}
                        alt={influencer.name}
                        className="h-10 w-10 rounded-full object-cover"
                      />
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-foreground text-sm truncate">{influencer.name}</h3>
                        <p className="text-xs text-muted-foreground">
                          {influencer.category} • {influencer.followers}
                        </p>
                      </div>
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-accent/10 text-xs font-bold text-accent">
                        {influencer.match}%
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Applications */}
              <div className="glass-card rounded-xl p-6">
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-foreground">Recent Applications</h2>
                  <Button variant="ghost" size="sm" asChild>
                    <Link href="/dashboard/company/applications">View All</Link>
                  </Button>
                </div>

                <div className="space-y-3">
                  {recentApplications.map((app) => (
                    <div
                      key={app.id}
                      className="flex items-center gap-3 rounded-lg border border-border bg-secondary/30 p-3"
                    >
                      <img
                        src={app.avatar || "/placeholder.svg"}
                        alt={app.influencer}
                        className="h-10 w-10 rounded-full object-cover"
                      />
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-foreground text-sm truncate">{app.influencer}</h3>
                        <p className="text-xs text-muted-foreground truncate">{app.campaign}</p>
                      </div>
                      <Badge className={statusColors[app.status as keyof typeof statusColors]}>{app.status}</Badge>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
