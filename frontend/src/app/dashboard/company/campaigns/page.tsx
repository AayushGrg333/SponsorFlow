"use client"

import { Sidebar } from "@/components/dashboard/sidebar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Search, Calendar, DollarSign, Users, MoreVertical, Eye, Edit, Trash2, Copy } from "lucide-react"
import Link from "next/link"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const campaigns = [
  {
    id: 1,
    title: "Summer Product Launch",
    description: "Promote our new summer collection with authentic reviews and lifestyle content.",
    budget: "$8,000",
    spent: "$5,200",
    progress: 65,
    applications: 24,
    accepted: 8,
    status: "active",
    deadline: "Dec 20, 2024",
    created: "Nov 15, 2024",
    category: "Fashion",
  },
  {
    id: 2,
    title: "Holiday Season Promo",
    description: "Create festive content showcasing our holiday gift sets and special offers.",
    budget: "$12,000",
    spent: "$3,600",
    progress: 30,
    applications: 18,
    accepted: 5,
    status: "active",
    deadline: "Dec 31, 2024",
    created: "Nov 20, 2024",
    category: "Lifestyle",
  },
  {
    id: 3,
    title: "New Year Campaign",
    description: "Kick off 2025 with influencer content promoting our new product line.",
    budget: "$6,500",
    spent: "$0",
    progress: 0,
    applications: 5,
    accepted: 0,
    status: "draft",
    deadline: "Jan 15, 2025",
    created: "Nov 28, 2024",
    category: "Tech",
  },
  {
    id: 4,
    title: "Tech Review Series",
    description: "In-depth reviews of our latest gadgets by tech influencers.",
    budget: "$15,000",
    spent: "$15,000",
    progress: 100,
    applications: 45,
    accepted: 12,
    status: "completed",
    deadline: "Nov 30, 2024",
    created: "Oct 1, 2024",
    category: "Tech",
  },
  {
    id: 5,
    title: "Fitness Challenge",
    description: "30-day fitness challenge featuring our supplements and gear.",
    budget: "$10,000",
    spent: "$7,500",
    progress: 75,
    applications: 32,
    accepted: 10,
    status: "active",
    deadline: "Jan 5, 2025",
    created: "Nov 1, 2024",
    category: "Fitness",
  },
]

const statusColors = {
  active: "bg-green-500/10 text-green-500",
  draft: "bg-yellow-500/10 text-yellow-500",
  completed: "bg-primary/10 text-primary",
  paused: "bg-orange-500/10 text-orange-500",
}

export default function CampaignsPage() {
  return (
    <div className="min-h-screen bg-background">
      <Sidebar userType="company" />

      <main className="lg:pl-64">
        <div className="px-4 py-8 pt-24 lg:px-8 lg:pt-8">
          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground sm:text-3xl">Campaigns</h1>
              <p className="mt-1 text-muted-foreground">Manage all your influencer marketing campaigns</p>
            </div>
            <Button asChild>
              <Link href="/dashboard/company/campaigns/new">
                <Plus className="mr-2 h-4 w-4" />
                Create Campaign
              </Link>
            </Button>
          </div>

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
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="paused">Paused</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Campaigns List */}
          <div className="space-y-4">
            {campaigns.map((campaign) => (
              <div
                key={campaign.id}
                className="glass-card overflow-hidden rounded-xl transition-all duration-300 hover:border-border/80"
              >
                <div className="p-6">
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    {/* Campaign Info */}
                    <div className="flex-1">
                      <div className="flex items-start gap-3">
                        <div className="flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="text-lg font-semibold text-foreground">{campaign.title}</h3>
                            <Badge className={statusColors[campaign.status as keyof typeof statusColors]}>
                              {campaign.status}
                            </Badge>
                            <Badge variant="outline">{campaign.category}</Badge>
                          </div>
                          <p className="mt-1 text-sm text-muted-foreground line-clamp-2">{campaign.description}</p>
                        </div>
                      </div>

                      {/* Stats */}
                      <div className="mt-4 flex flex-wrap gap-4 text-sm">
                        <div className="flex items-center gap-1.5 text-muted-foreground">
                          <DollarSign className="h-4 w-4" />
                          <span>
                            Budget: <span className="text-foreground font-medium">{campaign.budget}</span>
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5 text-muted-foreground">
                          <Calendar className="h-4 w-4" />
                          <span>
                            Deadline: <span className="text-foreground font-medium">{campaign.deadline}</span>
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5 text-muted-foreground">
                          <Users className="h-4 w-4" />
                          <span>
                            Applications: <span className="text-foreground font-medium">{campaign.applications}</span>
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5 text-muted-foreground">
                          <Users className="h-4 w-4 text-green-500" />
                          <span>
                            Accepted: <span className="text-foreground font-medium">{campaign.accepted}</span>
                          </span>
                        </div>
                      </div>

                      {/* Progress */}
                      <div className="mt-4 space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Budget spent: {campaign.spent}</span>
                          <span className="text-foreground font-medium">{campaign.progress}%</span>
                        </div>
                        <Progress value={campaign.progress} className="h-2" />
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 lg:flex-col lg:items-end">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Eye className="mr-2 h-4 w-4" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit Campaign
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Copy className="mr-2 h-4 w-4" />
                            Duplicate
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-destructive">
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                      <Button size="sm">View Applications</Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
