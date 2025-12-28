'use client'

import { Sidebar } from "@/components/dashboard/sidebar"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { StatsCard } from "@/components/dashboard/stats-card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Eye, MessageSquare, DollarSign, Briefcase, ArrowRight, Building2, Calendar, Clock } from "lucide-react"
import Link from "next/link"
import { authStorage } from "@/lib/authHelper"
import { useEffect, useState } from "react"

const recentCampaigns = [
  {
    id: 1,
    company: "TechGear Pro",
    title: "Product Review Campaign",
    status: "active",
    budget: "$2,500",
    deadline: "Dec 15, 2024",
    logo: "/placeholder.svg?key=gkqhj",
  },
  {
    id: 2,
    company: "StyleCo Fashion",
    title: "Summer Collection Promo",
    status: "pending",
    budget: "$1,800",
    deadline: "Dec 20, 2024",
    logo: "/placeholder.svg?key=6t6qu",
  },
  {
    id: 3,
    company: "FitLife Supplements",
    title: "Fitness Challenge Series",
    status: "completed",
    budget: "$3,200",
    deadline: "Nov 30, 2024",
    logo: "/placeholder.svg?key=q3zz4",
  },
]

const recommendedBrands = [
  {
    id: 1,
    name: "GameZone Studios",
    category: "Gaming",
    budget: "$5K - $10K",
    logo: "/placeholder.svg?key=e2gj1",
    match: 95,
  },
  {
    id: 2,
    name: "BeautyBlend",
    category: "Skincare",
    budget: "$2K - $5K",
    logo: "/placeholder.svg?key=3cpfl",
    match: 88,
  },
  {
    id: 3,
    name: "TravelEase",
    category: "Travel",
    budget: "$3K - $8K",
    logo: "/placeholder.svg?key=h3xao",
    match: 82,
  },
]

const statusColors = {
  active: "bg-green-500/10 text-green-500",
  pending: "bg-yellow-500/10 text-yellow-500",
  completed: "bg-primary/10 text-primary",
}

export default function InfluencerDashboard() {
    const [user, setUser] = useState<any>(null)

  useEffect(() => {
    const storedUser = authStorage.getUser()
    setUser(storedUser)
  }, [])

  console.log("Stored user:", authStorage.getUser())

  if (!user) return null // or loader
  return (
    <div className="min-h-screen bg-background">
      <Sidebar userType={user.role} />


      <main className="lg:pl-64">
        <div className="px-4 py-8 pt-24 lg:px-8 lg:pt-8">
         <DashboardHeader
  title={`Welcome back, ${user.username}!`}
  subtitle="Here's what's happening with your sponsorships"
/>


          {/* Stats Grid */}
          <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatsCard
              title="Profile Views"
              value="1,284"
              change="+12.5%"
              changeType="positive"
              icon={Eye}
              iconColor="text-primary"
            />
            <StatsCard
              title="Active Campaigns"
              value="3"
              change="+1"
              changeType="positive"
              icon={Briefcase}
              iconColor="text-accent"
            />
            <StatsCard
              title="Messages"
              value="18"
              change="5 unread"
              changeType="neutral"
              icon={MessageSquare}
              iconColor="text-chart-3"
            />
            <StatsCard
              title="Total Earnings"
              value="$12,450"
              change="+$2,500"
              changeType="positive"
              icon={DollarSign}
              iconColor="text-green-500"
            />
          </div>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            {/* Recent Campaigns */}
            <div className="lg:col-span-2">
              <div className="glass-card rounded-xl p-6">
                <div className="mb-6 flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-foreground">Recent Campaigns</h2>
                  <Button variant="ghost" size="sm" asChild>
                    <Link href="/dashboard/influencer/campaigns" className="gap-1">
                      View All
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                </div>

                <div className="space-y-4">
                  {recentCampaigns.map((campaign) => (
                    <div
                      key={campaign.id}
                      className="flex items-center gap-4 rounded-lg border border-border bg-secondary/30 p-4 transition-colors hover:bg-secondary/50"
                    >
                      <img
                        src={campaign.logo || "/placeholder.svg"}
                        alt={campaign.company}
                        className="h-12 w-12 rounded-lg object-cover"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium text-foreground truncate">{campaign.title}</h3>
                          <Badge className={statusColors[campaign.status as keyof typeof statusColors]}>
                            {campaign.status}
                          </Badge>
                        </div>
                        <div className="mt-1 flex items-center gap-4 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Building2 className="h-3 w-3" />
                            {campaign.company}
                          </span>
                          <span className="flex items-center gap-1">
                            <DollarSign className="h-3 w-3" />
                            {campaign.budget}
                          </span>
                          <span className="hidden items-center gap-1 sm:flex">
                            <Calendar className="h-3 w-3" />
                            {campaign.deadline}
                          </span>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        View
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Recommended Brands */}
            <div>
              <div className="glass-card rounded-xl p-6">
                <div className="mb-6 flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-foreground">Recommended</h2>
                  <Button variant="ghost" size="sm" asChild>
                    <Link href="/dashboard/influencer/discover" className="gap-1">
                      See More
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                </div>

                <div className="space-y-4">
                  {recommendedBrands.map((brand) => (
                    <div
                      key={brand.id}
                      className="flex items-center gap-3 rounded-lg border border-border bg-secondary/30 p-3 transition-colors hover:bg-secondary/50"
                    >
                      <img
                        src={brand.logo || "/placeholder.svg"}
                        alt={brand.name}
                        className="h-10 w-10 rounded-lg object-cover"
                      />
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-foreground text-sm truncate">{brand.name}</h3>
                        <p className="text-xs text-muted-foreground">
                          {brand.category} • {brand.budget}
                        </p>
                      </div>
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                        {brand.match}%
                      </div>
                    </div>
                  ))}
                </div>

                <Button className="mt-4 w-full bg-transparent" variant="outline" asChild>
                  <Link href="/dashboard/influencer/discover">Discover More Brands</Link>
                </Button>
              </div>

              {/* Quick Actions */}
              <div className="glass-card mt-4 rounded-xl p-6">
                <h2 className="mb-4 text-lg font-semibold text-foreground">Quick Actions</h2>
                <div className="grid grid-cols-2 gap-3">
                  <Button variant="outline" size="sm" className="h-auto flex-col gap-1 py-3 bg-transparent">
                    <MessageSquare className="h-4 w-4" />
                    <span className="text-xs">Messages</span>
                  </Button>
                  <Button variant="outline" size="sm" className="h-auto flex-col gap-1 py-3 bg-transparent">
                    <Briefcase className="h-4 w-4" />
                    <span className="text-xs">Campaigns</span>
                  </Button>
                  <Button variant="outline" size="sm" className="h-auto flex-col gap-1 py-3 bg-transparent">
                    <Building2 className="h-4 w-4" />
                    <span className="text-xs">Find Brands</span>
                  </Button>
                  <Button variant="outline" size="sm" className="h-auto flex-col gap-1 py-3 bg-transparent">
                    <Clock className="h-4 w-4" />
                    <span className="text-xs">Schedule</span>
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
