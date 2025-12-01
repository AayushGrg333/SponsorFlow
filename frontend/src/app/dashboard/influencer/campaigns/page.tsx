"use client"

import { Sidebar } from "@/components/dashboard/sidebar"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, Calendar, DollarSign, Building2, Clock, Eye, MessageSquare, ExternalLink } from "lucide-react"

const myCampaigns = [
  {
    id: 1,
    title: "Summer Tech Review Series",
    company: "TechGear Pro",
    logo: "/placeholder.svg?key=mbqey",
    budget: "$3,500",
    deadline: "Dec 15, 2024",
    status: "active",
    progress: 60,
    deliverables: "2 YouTube Videos, 3 Instagram Posts",
  },
  {
    id: 2,
    title: "Holiday Fashion Collection",
    company: "StyleCo Fashion",
    logo: "/placeholder.svg?key=p5e1m",
    budget: "$2,200",
    deadline: "Dec 25, 2024",
    status: "in-review",
    progress: 100,
    deliverables: "5 Instagram Posts, 10 Stories",
  },
  {
    id: 3,
    title: "Gaming Peripherals Launch",
    company: "GameZone Studios",
    logo: "/placeholder.svg?key=0k0xy",
    budget: "$4,800",
    deadline: "Jan 10, 2025",
    status: "pending",
    progress: 0,
    deliverables: "3 Twitch Streams, 1 YouTube Video",
  },
]

const availableCampaigns = [
  {
    id: 1,
    title: "New Smartphone Launch",
    company: "TechCorp",
    logo: "/placeholder.svg?key=e8f2a",
    budget: "$5,000 - $8,000",
    deadline: "Jan 20, 2025",
    category: "Tech",
    requirements: "100K+ followers, Tech niche",
    match: 95,
  },
  {
    id: 2,
    title: "Fitness App Promotion",
    company: "FitLife Pro",
    logo: "/placeholder.svg?key=km6wd",
    budget: "$2,000 - $4,000",
    deadline: "Jan 15, 2025",
    category: "Fitness",
    requirements: "50K+ followers, Fitness/Health niche",
    match: 72,
  },
  {
    id: 3,
    title: "Skincare Product Review",
    company: "GlowUp Skincare",
    logo: "/placeholder.svg?key=ybqwk",
    budget: "$3,000 - $5,000",
    deadline: "Jan 25, 2025",
    category: "Beauty",
    requirements: "80K+ followers, Beauty/Lifestyle niche",
    match: 68,
  },
  {
    id: 4,
    title: "Travel Destination Campaign",
    company: "WanderLust Travel",
    logo: "/placeholder.svg?key=lwr2d",
    budget: "$6,000 - $10,000",
    deadline: "Feb 1, 2025",
    category: "Travel",
    requirements: "200K+ followers, Travel/Lifestyle niche",
    match: 82,
  },
]

const statusColors = {
  active: "bg-green-500/10 text-green-500",
  "in-review": "bg-yellow-500/10 text-yellow-500",
  pending: "bg-blue-500/10 text-blue-500",
  completed: "bg-primary/10 text-primary",
}

export default function InfluencerCampaignsPage() {
  return (
    <div className="min-h-screen bg-background">
      <Sidebar userType="influencer" />

      <main className="lg:pl-64">
        <div className="px-4 py-8 pt-24 lg:px-8 lg:pt-8">
          <DashboardHeader title="Campaigns" subtitle="Manage your active campaigns and discover new opportunities" />

          <Tabs defaultValue="my-campaigns" className="space-y-6">
            <TabsList className="bg-secondary">
              <TabsTrigger value="my-campaigns">My Campaigns</TabsTrigger>
              <TabsTrigger value="discover">Discover</TabsTrigger>
            </TabsList>

            <TabsContent value="my-campaigns">
              {/* Filters */}
              <div className="mb-6 flex flex-col gap-4 sm:flex-row">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input placeholder="Search campaigns..." className="pl-10" />
                </div>
                <Select defaultValue="all">
                  <SelectTrigger className="w-full sm:w-40">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="in-review">In Review</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Campaigns List */}
              <div className="space-y-4">
                {myCampaigns.map((campaign) => (
                  <div key={campaign.id} className="glass-card rounded-xl p-6">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                      <div className="flex gap-4">
                        <img
                          src={campaign.logo || "/placeholder.svg"}
                          alt={campaign.company}
                          className="h-14 w-14 rounded-xl object-cover"
                        />
                        <div>
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="font-semibold text-foreground">{campaign.title}</h3>
                            <Badge className={statusColors[campaign.status as keyof typeof statusColors]}>
                              {campaign.status.replace("-", " ")}
                            </Badge>
                          </div>
                          <p className="mt-1 text-sm text-muted-foreground">
                            <Building2 className="mr-1 inline h-3 w-3" />
                            {campaign.company}
                          </p>
                          <div className="mt-2 flex flex-wrap gap-4 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <DollarSign className="h-3 w-3" />
                              {campaign.budget}
                            </span>
                            <span className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {campaign.deadline}
                            </span>
                          </div>
                          <p className="mt-2 text-sm text-muted-foreground">
                            <Clock className="mr-1 inline h-3 w-3" />
                            {campaign.deliverables}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <MessageSquare className="mr-2 h-4 w-4" />
                          Message
                        </Button>
                        <Button size="sm">
                          <Eye className="mr-2 h-4 w-4" />
                          View Details
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="discover">
              {/* Filters */}
              <div className="mb-6 flex flex-col gap-4 sm:flex-row">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input placeholder="Search available campaigns..." className="pl-10" />
                </div>
                <Select defaultValue="all">
                  <SelectTrigger className="w-full sm:w-40">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="tech">Tech</SelectItem>
                    <SelectItem value="beauty">Beauty</SelectItem>
                    <SelectItem value="fitness">Fitness</SelectItem>
                    <SelectItem value="travel">Travel</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Available Campaigns */}
              <div className="grid gap-6 md:grid-cols-2">
                {availableCampaigns.map((campaign) => (
                  <div
                    key={campaign.id}
                    className="glass-card rounded-xl p-6 transition-all duration-300 hover:scale-[1.02]"
                  >
                    <div className="mb-4 flex items-start justify-between">
                      <div className="flex gap-3">
                        <img
                          src={campaign.logo || "/placeholder.svg"}
                          alt={campaign.company}
                          className="h-12 w-12 rounded-xl object-cover"
                        />
                        <div>
                          <h3 className="font-semibold text-foreground">{campaign.title}</h3>
                          <p className="text-sm text-muted-foreground">{campaign.company}</p>
                        </div>
                      </div>
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                        {campaign.match}%
                      </div>
                    </div>

                    <div className="mb-4 space-y-2 text-sm">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <DollarSign className="h-4 w-4" />
                        <span>
                          Budget: <span className="text-foreground">{campaign.budget}</span>
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        <span>
                          Deadline: <span className="text-foreground">{campaign.deadline}</span>
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        <span className="text-foreground">{campaign.requirements}</span>
                      </div>
                    </div>

                    <Badge variant="secondary" className="mb-4">
                      {campaign.category}
                    </Badge>

                    <div className="flex gap-2">
                      <Button className="flex-1" size="sm">
                        Apply Now
                      </Button>
                      <Button variant="outline" size="sm">
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  )
}
