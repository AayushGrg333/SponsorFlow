"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Sidebar } from "@/components/dashboard/sidebar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
     Select,
     SelectContent,
     SelectItem,
     SelectTrigger,
     SelectValue,
} from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Calendar, DollarSign } from "lucide-react";

import { campaignsAPI } from "@/lib/api";

/* ------------------------------ types ------------------------------ */
type CampaignStatus = "active" | "draft" | "completed";

interface Campaign {
     _id: string;
     title: string;
     description: string;
     budget?: number;
     budgetRange?: string;
     platforms?: string[];
     startDate: string;
     endDate: string;
     status: CampaignStatus;
     createdAt: string;
}

const statusColors: Record<CampaignStatus, string> = {
     active: "bg-green-500/10 text-green-500",
     draft: "bg-yellow-500/10 text-yellow-500",
     completed: "bg-primary/10 text-primary",
};

/* --------------------------- helpers --------------------------- */
const formatDate = (date: string) =>
     new Date(date).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
     });

const formatBudget = (campaign: Campaign) => {
     if (campaign.budgetRange) return campaign.budgetRange;
     if (campaign.budget) return `$${campaign.budget.toLocaleString()}`;
     return "—";
};

/* --------------------------- component --------------------------- */
export default function InfluencerCampaignsPage() {
     const [campaigns, setCampaigns] = useState<Campaign[]>([]);
     const [loading, setLoading] = useState(true);
     const [error, setError] = useState<string | null>(null);

     const [search, setSearch] = useState("");
     const [status, setStatus] = useState("all");

     useEffect(() => {
          const fetchCampaigns = async () => {
               try {
                    setLoading(true);
                    const res = await campaignsAPI.list({
                         status: status !== "all" ? status : undefined,
                         search: search || undefined,
                    });
                    // Type assertion to Campaign[]
                    setCampaigns((res.data as { data: Campaign[] }).data);
                    setError(null);
               } catch (err: any) {
                    setError(err.message || "Failed to fetch campaigns");
               } finally {
                    setLoading(false);
               }
          };

          fetchCampaigns();
     }, [search, status]);

     return (
          <div className="min-h-screen bg-background">
               <Sidebar userType="influencer" />

               <main className="lg:pl-64">
                    <div className="px-4 py-8 pt-24 lg:px-8 lg:pt-8">
                         {/* Header */}
                         <div className="mb-8">
                              <h1 className="text-2xl font-bold sm:text-3xl">
                                   Campaigns
                              </h1>
                              <p className="mt-1 text-muted-foreground">
                                   Discover and apply to influencer campaigns
                              </p>
                         </div>

                         {/* Filters */}
                         <div className="mb-6 flex flex-col gap-4 sm:flex-row">
                              <div className="relative flex-1">
                                   <Input
                                        placeholder="Search campaigns..."
                                        className="pl-10"
                                        value={search}
                                        onChange={(e) =>
                                             setSearch(e.target.value)
                                        }
                                   />
                              </div>

                              <Select value={status} onValueChange={setStatus}>
                                   <SelectTrigger className="w-full sm:w-40">
                                        <SelectValue placeholder="Status" />
                                   </SelectTrigger>
                                   <SelectContent>
                                        <SelectItem value="all">
                                             All Status
                                        </SelectItem>
                                        <SelectItem value="active">
                                             Active
                                        </SelectItem>
                                        <SelectItem value="draft">
                                             Draft
                                        </SelectItem>
                                        <SelectItem value="completed">
                                             Completed
                                        </SelectItem>
                                   </SelectContent>
                              </Select>
                         </div>

                         {/* States */}
                         {loading && (
                              <p className="text-muted-foreground">
                                   Loading campaigns...
                              </p>
                         )}
                         {error && (
                              <p className="text-sm text-destructive">
                                   {error}
                              </p>
                         )}
                         {!loading && !error && campaigns.length === 0 && (
                              <p className="text-muted-foreground">
                                   No campaigns found.
                              </p>
                         )}

                         {/* Campaigns List */}
                         <div className="space-y-4">
                              {campaigns.map((campaign) => (
                                   <div
                                        key={campaign._id}
                                        className="glass-card rounded-xl p-6 transition-all hover:border-border/80"
                                   >
                                        <div className="flex flex-col gap-4 lg:flex-row lg:justify-between">
                                             {/* Info */}
                                             <div className="flex-1">
                                                  <div className="flex flex-wrap items-center gap-2">
                                                       <h3 className="text-lg font-semibold">
                                                            {campaign.title}
                                                       </h3>
                                                       <Badge
                                                            className={
                                                                 statusColors[
                                                                      campaign
                                                                           .status
                                                                 ]
                                                            }
                                                       >
                                                            {campaign.status}
                                                       </Badge>
                                                  </div>

                                                  <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
                                                       {campaign.description}
                                                  </p>

                                                  {/* Stats */}
                                                  <div className="mt-4 flex flex-wrap gap-4 text-sm">
                                                       <div className="flex items-center gap-1.5 text-muted-foreground">
                                                            <DollarSign className="h-4 w-4" />
                                                            <span>
                                                                 Budget:{" "}
                                                                 <span className="text-foreground font-medium">
                                                                      {formatBudget(
                                                                           campaign
                                                                      )}
                                                                 </span>
                                                            </span>
                                                       </div>
                                                       <div className="flex items-center gap-1.5 text-muted-foreground">
                                                            <Calendar className="h-4 w-4" />
                                                            <span>
                                                                 Deadline:{" "}
                                                                 <span className="text-foreground font-medium">
                                                                      {formatDate(
                                                                           campaign.endDate
                                                                      )}
                                                                 </span>
                                                            </span>
                                                       </div>
                                                  </div>

                                                  {/* Placeholder Progress */}
                                                  <div className="mt-4 space-y-2">
                                                       <div className="flex justify-between text-sm">
                                                            <span className="text-muted-foreground">
                                                                 Progress
                                                            </span>
                                                            <span className="text-foreground font-medium">
                                                                 —
                                                            </span>
                                                       </div>
                                                       <Progress
                                                            value={0}
                                                            className="h-2"
                                                       />
                                                  </div>
                                             </div>

                                             {/* Actions */}
                                             <div className="flex items-center gap-2 lg:flex-col lg:items-end">
                                                  <Button size="sm" asChild>
                                                       <Link
                                                            href={`/dashboard/influencer/campaigns/${campaign._id}`}
                                                       >
                                                            Apply
                                                       </Link>
                                                  </Button>
                                             </div>
                                        </div>
                                   </div>
                              ))}
                         </div>
                    </div>
               </main>
          </div>
     );
}
