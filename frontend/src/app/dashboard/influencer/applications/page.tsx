"use client"
import { Sidebar } from "@/components/dashboard/sidebar"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Calendar, Building2, ExternalLink } from "lucide-react"
import useSWR from "swr"
import { Button } from "@/components/ui/button"

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export default function InfluencerApplicationsPage() {
  const { data: applications } = useSWR("/api/influencers/me/applications", fetcher)

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Sidebar userType="influencer" />
      <main className="lg:pl-64">
        <div className="px-4 py-8 lg:px-8">
          <DashboardHeader title="My Applications" subtitle="Track the status of your sponsorship applications" />

          <div className="mt-8 grid gap-4">
            {!applications || applications.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center border-2 border-dashed border-border rounded-xl">
                <p className="text-muted-foreground">You haven't applied to any campaigns yet.</p>
                <Button variant="link" className="mt-2" asChild>
                  <a href="/dashboard/influencer/discover">Discover Campaigns</a>
                </Button>
              </div>
            ) : (
              applications.map((app: any) => (
                <Card key={app.id} className="border-border bg-card">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded bg-secondary flex items-center justify-center">
                          <Building2 className="h-6 w-6 text-muted-foreground" />
                        </div>
                        <div>
                          <h3 className="font-semibold">{app.campaign.title}</h3>
                          <p className="text-sm text-muted-foreground">{app.campaign.company.name}</p>
                        </div>
                      </div>
                      <Badge
                        className={
                          app.status === "accepted"
                            ? "bg-green-500/10 text-green-500 border-green-500/20"
                            : app.status === "rejected"
                              ? "bg-red-500/10 text-red-500 border-red-500/20"
                              : "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
                        }
                      >
                        {app.status.toUpperCase()}
                      </Badge>
                    </div>

                    <div className="mt-6 flex items-center gap-6 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        Applied on {new Date(app.createdAt).toLocaleDateString()}
                      </div>
                      <button className="flex items-center gap-1 text-primary hover:underline">
                        <ExternalLink className="h-4 w-4" />
                        View Campaign
                      </button>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
