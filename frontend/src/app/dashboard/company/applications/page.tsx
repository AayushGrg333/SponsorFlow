"use client"

import { useState } from "react"
import { Sidebar } from "@/components/dashboard/sidebar"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Search, Filter, Check, X, Eye } from "lucide-react"
import useSWR from "swr"

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export default function CompanyApplicationsPage() {
  // but keeping general applications list for now as per your "list all applications" route
  const { data: applications, mutate } = useSWR("/api/campaigns/all/applications", fetcher)
  const [searchTerm, setSearchTerm] = useState("")

  const handleStatusUpdate = async (id: string, status: string) => {
    try {
      await fetch(`/api/applications/${id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      })
      mutate()
    } catch (error) {
      console.log("[v0] Error updating application status:", error)
    }
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Sidebar userType="company" />
      <main className="lg:pl-64">
        <div className="px-4 py-8 lg:px-8">
          <DashboardHeader title="Applications" subtitle="Manage influencer applications for your campaigns" />

          <div className="mt-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search by influencer or campaign..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button variant="outline" className="gap-2 bg-transparent">
              <Filter className="h-4 w-4" />
              Filter
            </Button>
          </div>

          <div className="mt-8 grid gap-6">
            {applications?.map((app: any) => (
              <Card key={app.id} className="overflow-hidden border-border bg-card">
                <CardContent className="p-0">
                  <div className="flex flex-col md:flex-row">
                    <div className="flex flex-1 items-start gap-4 p-6">
                      <img
                        src={app.influencer.avatar || "/placeholder.svg"}
                        alt={app.influencer.name}
                        className="h-16 w-16 rounded-full object-cover"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h3 className="text-lg font-semibold truncate">{app.influencer.name}</h3>
                          <Badge variant="secondary" className="text-xs">
                            {app.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{app.influencer.username}</p>
                        <p className="mt-2 text-sm font-medium">Campaign: {app.campaign.title}</p>
                        <p className="mt-2 text-sm line-clamp-2 text-muted-foreground italic">"{app.message}"</p>
                      </div>
                    </div>

                    <div className="flex flex-col justify-center gap-2 border-t border-border bg-secondary/30 p-6 md:w-64 md:border-l md:border-t-0">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Followers:</span>
                        <span className="font-semibold">{app.influencer.followers}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Engagement:</span>
                        <span className="font-semibold text-green-500">{app.influencer.engagement}</span>
                      </div>
                      <div className="mt-4 flex gap-2">
                        <Button
                          className="flex-1 bg-green-600 hover:bg-green-700 h-9"
                          onClick={() => handleStatusUpdate(app.id, "accepted")}
                        >
                          <Check className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="destructive"
                          className="flex-1 h-9"
                          onClick={() => handleStatusUpdate(app.id, "rejected")}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" className="flex-1 h-9 bg-transparent">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
