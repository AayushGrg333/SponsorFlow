/* eslint-disable @typescript-eslint/no-explicit-any */
// eslint-disable-next-line react-hooks/exhaustive-deps
// eslint-disable-next-line @next/next/no-img-element
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Sidebar } from "@/components/dashboard/sidebar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import {
     Select,
     SelectContent,
     SelectItem,
     SelectTrigger,
     SelectValue,
} from "@/components/ui/select";
import {
     Plus,
     Search,
     Calendar,
     DollarSign,
     MoreVertical,
     Eye,
     Edit,
     Trash2,
     Copy,
} from "lucide-react";

import {
     DropdownMenu,
     DropdownMenuContent,
     DropdownMenuItem,
     DropdownMenuSeparator,
     DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { campaignsAPI } from "@/lib/api";

/* ---------------------------------- types --------------------------------- */
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
export interface ApiResponse<T> {
     success: boolean;
     message: string;
     data: T;
}

/* -------------------------------- constants ------------------------------- */
const statusColors: Record<CampaignStatus, string> = {
     active: "bg-green-500/10 text-green-500",
     draft: "bg-yellow-500/10 text-yellow-500",
     completed: "bg-primary/10 text-primary",
};

/* --------------------------------- helpers -------------------------------- */
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

/* -------------------------------- component ------------------------------- */
export default function CampaignsPage() {
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
               <Sidebar userType="company" />

               <main className="lg:pl-64">
                    <div className="px-4 py-8 pt-24 lg:px-8 lg:pt-8">
                         {/* Header */}
                         <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                              <div>
                                   <h1 className="text-2xl font-bold sm:text-3xl">
                                        Campaigns
                                   </h1>
                                   <p className="mt-1 text-muted-foreground">
                                        Manage all your influencer marketing
                                        campaigns
                                   </p>
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
                                        className="glass-card rounded-xl transition-all hover:border-border/80"
                                   >
                                        <div className="p-6">
                                             <div className="flex flex-col gap-4 lg:flex-row lg:justify-between">
                                                  {/* Info */}
                                                  <div className="flex-1">
                                                       <div className="flex flex-wrap items-center gap-2">
                                                            <h3 className="text-lg font-semibold">
                                                                 {
                                                                      campaign.title
                                                                 }
                                                            </h3>
                                                            <Badge
                                                                 className={
                                                                      statusColors[
                                                                           campaign
                                                                                .status
                                                                      ]
                                                                 }
                                                            >
                                                                 {
                                                                      campaign.status
                                                                 }
                                                            </Badge>
                                                       </div>

                                                       <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
                                                            {
                                                                 campaign.description
                                                            }
                                                       </p>

                                                       {/* Stats */}
                                                       <div className="mt-4 flex flex-wrap gap-4 text-sm">
                                                            <div className="flex items-center gap-1.5">
                                                                 <DollarSign className="h-4 w-4" />
                                                                 <span>
                                                                      Budget:{" "}
                                                                      <span className="font-medium">
                                                                           {formatBudget(
                                                                                campaign
                                                                           )}
                                                                      </span>
                                                                 </span>
                                                            </div>

                                                            <div className="flex items-center gap-1.5">
                                                                 <Calendar className="h-4 w-4" />
                                                                 <span>
                                                                      Deadline:{" "}
                                                                      <span className="font-medium">
                                                                           {formatDate(
                                                                                campaign.endDate
                                                                           )}
                                                                      </span>
                                                                 </span>
                                                            </div>
                                                       </div>

                                                       {/* Placeholder Progress (until payments are real) */}
                                                       <div className="mt-4 space-y-2">
                                                            <div className="flex justify-between text-sm">
                                                                 <span className="text-muted-foreground">
                                                                      Progress
                                                                 </span>
                                                                 <span className="font-medium">
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
                                                       <DropdownMenu>
                                                            <DropdownMenuTrigger
                                                                 asChild
                                                            >
                                                                 <Button
                                                                      variant="ghost"
                                                                      size="icon"
                                                                 >
                                                                      <MoreVertical className="h-4 w-4" />
                                                                 </Button>
                                                            </DropdownMenuTrigger>
                                                            <DropdownMenuContent align="end">
                                                                 <DropdownMenuItem>
                                                                      <Eye className="mr-2 h-4 w-4" />
                                                                      View
                                                                      Details
                                                                 </DropdownMenuItem>
                                                                 <DropdownMenuItem>
                                                                      <Edit className="mr-2 h-4 w-4" />
                                                                      Edit
                                                                      Campaign
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

                                                       <Link href={`/dashboard/company/campaigns/${campaign._id}`}>
                                                       <Button size="sm">
                                                            View Applications
                                                       </Button>
                                                       </Link>
                                                  </div>
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
