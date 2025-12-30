"use client";

import { Sidebar } from "@/components/dashboard/sidebar";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { StatsCard } from "@/components/dashboard/stats-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
     Eye,
     MessageSquare,
     TrendingUp,
     Briefcase,
     ArrowRight,
     User,
     Calendar,
     DollarSign,
     Users,
} from "lucide-react";
import Link from "next/link";
import { authStorage } from "@/lib/authHelper";
import { useEffect, useState } from "react";
import { campaignsAPI, applicationsAPI, influencerAPI } from "@/lib/api";

interface Campaign {
     _id: string;
     title: string;
     description: string;
     budget: number;
     deadline: string;
     status: string;
     categories: string[];
     companyId?: string;
     applicationCount?: number;
}

interface Application {
     _id: string;
     campaignId: {
          _id: string;
          title: string;
          budget: number;
     };
     influencerId: {
          _id: string;
          displayName: string;
          profileImage?: string;
          followers?: number;
     };
     status: "pending" | "accepted" | "rejected";
     proposedRate?: number;
     createdAt: string;
}

interface Influencer {
     _id: string;
     displayName: string;
     profileImage?: string;
     followers?: number;
     categories?: string[];
     bio?: string;
}

const statusColors = {
     pending: "bg-yellow-500/10 text-yellow-500",
     accepted: "bg-green-500/10 text-green-500",
     rejected: "bg-red-500/10 text-red-500",
};

interface ApiResponse<T> {
     success: boolean;
     message: string;
     data: T;
}

export default function CompanyDashboard() {
     const [user, setUser] = useState<any>(null);
     const [applications, setApplications] = useState<Application[]>([]);
     const [campaigns, setCampaigns] = useState<Campaign[]>([]);
     const [recommendedInfluencers, setRecommendedInfluencers] = useState<
          Influencer[]
     >([]);
     const [loading, setLoading] = useState(true);
     const [stats, setStats] = useState({
          totalCampaigns: 0,
          pendingApplications: 0,
          messages: 0,
          totalReach: 0,
     });

     useEffect(() => {
          const storedUser = authStorage.getUser();
          setUser(storedUser);

          if (storedUser) {
               // Try different possible ID fields
               const userId =
                    storedUser._id ||
                    storedUser.id ||
                    storedUser.userId ||
                    storedUser.companyId;

               if (userId) {
                    loadDashboardData(userId);
               } else {
                    console.error("No valid user ID found in user object");
               }
          }
     }, []);

     const loadDashboardData = async (companyId: string) => {
          try {
               setLoading(true);

               /* ================== 1. FETCH CAMPAIGNS ================== */
               const campaignsResponse = (await campaignsAPI.getByCompany(
                    companyId
               )) as {
                    data: ApiResponse<Campaign[]> | null;
                    error: string | null;
               };

               const campaignsData: Campaign[] =
                    campaignsResponse.data?.data ?? [];
               setCampaigns(campaignsData);

               if (campaignsData.length === 0) {
                    // No campaigns → nothing else to fetch
                    setApplications([]);
                    setRecommendedInfluencers([]);
                    return;
               }

               /* ================== 2. PICK MOST RECENT CAMPAIGN ================== */
               const recentCampaign = campaignsData[0]; // backend should already sort by createdAt desc

               /* ================== 3. FETCH APPLICATIONS ================== */
               const appsResponse = (await applicationsAPI.getByCampaign(
                    recentCampaign._id
               )) as {
                    data: ApiResponse<Application[]> | null;
                    error: string | null;
               };

               const applicationsData: Application[] =
                    appsResponse.data?.data ?? [];
               setApplications(applicationsData);

               /* ================== 4. FETCH INFLUENCERS ================== */
               const influencersResponse =
                    (await influencerAPI.listInfluencers()) as {
                         data: ApiResponse<Influencer[]> | null;
                         error: string | null;
                    };

               const allInfluencers: Influencer[] =
                    influencersResponse.data?.data ?? [];

               /* ================== 5. RECOMMENDED INFLUENCERS ================== */
               const appliedInfluencerIds = applicationsData
                    .map((app) => app.influencerId?._id)
                    .filter(Boolean) as string[];

               const availableInfluencers = allInfluencers.filter(
                    (influencer) =>
                         !appliedInfluencerIds.includes(influencer._id)
               );

               const companyCategories = [
                    ...new Set(campaignsData.flatMap((c) => c.categories)),
               ];

               const recommended = availableInfluencers
                    .map((influencer) => ({
                         influencer,
                         score:
                              influencer.categories?.filter((cat) =>
                                   companyCategories.includes(cat)
                              ).length || 0,
                    }))
                    .sort((a, b) => b.score - a.score)
                    .slice(0, 3)
                    .map((item) => item.influencer);

               setRecommendedInfluencers(recommended);

               /* ================== 6. STATS ================== */
               setStats({
                    totalCampaigns: campaignsData.length,
                    pendingApplications: applicationsData.filter(
                         (a) => a.status === "pending"
                    ).length,
                    messages: 0,
                    totalReach: applicationsData
                         .filter((a) => a.status === "accepted")
                         .reduce(
                              (sum, a) =>
                                   sum + (a.influencerId?.followers || 0),
                              0
                         ),
               });
          } catch (error) {
               console.error("Dashboard load error:", error);
               setCampaigns([]);
               setApplications([]);
               setRecommendedInfluencers([]);
          } finally {
               setLoading(false);
          }
     };

     const formatCurrency = (amount: number) => {
          return new Intl.NumberFormat("en-US", {
               style: "currency",
               currency: "USD",
               minimumFractionDigits: 0,
          }).format(amount);
     };

     const formatNumber = (num: number) => {
          if (num >= 1000000) {
               return (num / 1000000).toFixed(1) + "M";
          }
          if (num >= 1000) {
               return (num / 1000).toFixed(1) + "K";
          }
          return num.toString();
     };

     const formatDate = (dateString: string) => {
          return new Date(dateString).toLocaleDateString("en-US", {
               month: "short",
               day: "numeric",
               year: "numeric",
          });
     };

     if (!user) return null;

     return (
          <div className="min-h-screen bg-background">
               <Sidebar userType={user.role} />

               <main className="lg:pl-64">
                    <div className="px-4 py-8 pt-24 lg:px-8 lg:pt-8">
                         <DashboardHeader
                              title={`Welcome back, ${
                                   user.companyName || user.displayName
                              }!`}
                              subtitle="Manage your campaigns and influencer partnerships"
                         />

                         {/* Stats Grid */}
                         <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                              <StatsCard
                                   title="Active Campaigns"
                                   value={stats.totalCampaigns.toString()}
                                   change={`${
                                        campaigns.filter(
                                             (c) => c.status === "active"
                                        ).length
                                   } running`}
                                   changeType="positive"
                                   icon={Briefcase}
                                   iconColor="text-primary"
                              />
                              <StatsCard
                                   title="Pending Applications"
                                   value={stats.pendingApplications.toString()}
                                   change="Needs review"
                                   changeType="neutral"
                                   icon={Eye}
                                   iconColor="text-accent"
                              />
                              <StatsCard
                                   title="Total Reach"
                                   value={formatNumber(stats.totalReach)}
                                   change="From partnerships"
                                   changeType="positive"
                                   icon={TrendingUp}
                                   iconColor="text-chart-3"
                              />
                         </div>

                         <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                              {/* Recent Applications */}
                              <div className="lg:col-span-2">
                                   <div className="glass-card rounded-xl min-h-[400px] p-6">
                                        <div className="mb-6 flex items-center justify-between">
                                             <h2 className="text-lg font-semibold text-foreground">
                                                  Recent Applications
                                             </h2>
                                             <Button
                                                  variant="ghost"
                                                  size="sm"
                                                  asChild
                                             >
                                                  <Link
                                                       href="/dashboard/company/applications"
                                                       className="gap-1"
                                                  >
                                                       View All
                                                       <ArrowRight className="h-4 w-4" />
                                                  </Link>
                                             </Button>
                                        </div>

                                        {loading ? (
                                             <div className="text-center flex justify-center items-center text-muted-foreground py-8">
                                                  Loading...
                                             </div>
                                        ) : applications.length === 0 ? (
                                             <div className="text-center flex justify-center items-center text-muted-foreground py-8">
                                                  No applications yet. Create a
                                                  campaign to get started!
                                             </div>
                                        ) : (
                                             <div className="space-y-4">
                                                  {applications
                                                       .slice(0, 3)
                                                       .map((application) => (
                                                            <div
                                                                 key={
                                                                      application._id
                                                                 }
                                                                 className="flex items-center gap-4 rounded-lg border border-border bg-secondary/30 p-4 transition-colors hover:bg-secondary/50"
                                                            >
                                                                 <img
                                                                      src={
                                                                           application
                                                                                .influencerId
                                                                                ?.profileImage ||
                                                                           "/placeholder.svg"
                                                                      }
                                                                      alt={
                                                                           application
                                                                                .influencerId
                                                                                ?.displayName
                                                                      }
                                                                      className="h-12 w-12 rounded-lg object-cover"
                                                                 />
                                                                 <div className="flex-1 min-w-0">
                                                                      <div className="flex items-center gap-2">
                                                                           <h3 className="font-medium text-foreground truncate">
                                                                                {
                                                                                     application
                                                                                          .influencerId
                                                                                          ?.displayName
                                                                                }
                                                                           </h3>
                                                                           <Badge
                                                                                className={
                                                                                     statusColors[
                                                                                          application
                                                                                               .status
                                                                                     ]
                                                                                }
                                                                           >
                                                                                {
                                                                                     application.status
                                                                                }
                                                                           </Badge>
                                                                      </div>
                                                                      <div className="mt-1 flex items-center gap-4 text-sm text-muted-foreground">
                                                                           <span className="flex items-center gap-1">
                                                                                <Briefcase className="h-3 w-3" />
                                                                                {
                                                                                     application
                                                                                          .campaignId
                                                                                          ?.title
                                                                                }
                                                                           </span>
                                                                           <span className="flex items-center gap-1">
                                                                                <DollarSign className="h-3 w-3" />
                                                                                {formatCurrency(
                                                                                     application.proposedRate ||
                                                                                          application
                                                                                               .campaignId
                                                                                               ?.budget ||
                                                                                          0
                                                                                )}
                                                                           </span>
                                                                           <span className="hidden items-center gap-1 sm:flex">
                                                                                <User className="h-3 w-3" />
                                                                                {formatNumber(
                                                                                     application
                                                                                          .influencerId
                                                                                          ?.followers ||
                                                                                          0
                                                                                )}{" "}
                                                                                followers
                                                                           </span>
                                                                      </div>
                                                                 </div>
                                                                 <Button
                                                                      variant="outline"
                                                                      size="sm"
                                                                      asChild
                                                                 >
                                                                      <Link
                                                                           href={`/dashboard/company/applications/${application._id}`}
                                                                      >
                                                                           Review
                                                                      </Link>
                                                                 </Button>
                                                            </div>
                                                       ))}
                                             </div>
                                        )}
                                   </div>
                              </div>

                              {/* Right Column: Campaigns + Recommended Influencers */}
                              <div className="space-y-8">
                                   {/* Your Campaigns */}
                                   <div className="glass-card rounded-xl p-6">
                                        <div className="mb-6 flex items-center justify-between">
                                             <h2 className="text-lg font-semibold text-foreground">
                                                  Your Campaigns
                                             </h2>
                                             <Button
                                                  variant="ghost"
                                                  size="sm"
                                                  asChild
                                             >
                                                  <Link
                                                       href="/dashboard/company/campaigns"
                                                       className="gap-1"
                                                  >
                                                       See All
                                                       <ArrowRight className="h-4 w-4" />
                                                  </Link>
                                             </Button>
                                        </div>

                                        {loading ? (
                                             <div className="text-center text-muted-foreground py-8">
                                                  Loading...
                                             </div>
                                        ) : campaigns.length === 0 ? (
                                             <div className="text-center text-muted-foreground py-8 text-sm">
                                                  No campaigns yet
                                             </div>
                                        ) : (
                                             <div className="space-y-4">
                                                  {campaigns
                                                       .slice(0, 2)
                                                       .map((campaign) => (
                                                            <div
                                                                 key={
                                                                      campaign._id
                                                                 }
                                                                 className="rounded-lg border border-border bg-secondary/30 p-3 transition-colors hover:bg-secondary/50"
                                                            >
                                                                 <div className="flex items-start justify-between gap-2 mb-2">
                                                                      <h3 className="font-medium text-foreground text-sm truncate">
                                                                           {
                                                                                campaign.title
                                                                           }
                                                                      </h3>
                                                                      <Badge
                                                                           className={
                                                                                campaign.status ===
                                                                                "active"
                                                                                     ? "bg-green-500/10 text-green-500"
                                                                                     : "bg-gray-500/10 text-gray-500"
                                                                           }
                                                                      >
                                                                           {
                                                                                campaign.status
                                                                           }
                                                                      </Badge>
                                                                 </div>
                                                                 <div className="space-y-1">
                                                                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                                                                           <DollarSign className="h-3 w-3" />
                                                                           {formatCurrency(
                                                                                campaign.budget
                                                                           )}{" "}
                                                                           budget
                                                                      </p>
                                                                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                                                                           <Calendar className="h-3 w-3" />
                                                                           Due{" "}
                                                                           {formatDate(
                                                                                campaign.deadline
                                                                           )}
                                                                      </p>
                                                                 </div>
                                                                 <Button
                                                                      variant="outline"
                                                                      size="sm"
                                                                      className="w-full mt-3"
                                                                      asChild
                                                                 >
                                                                      <Link
                                                                           href={`/dashboard/company/campaigns/${campaign._id}`}
                                                                      >
                                                                           Manage
                                                                      </Link>
                                                                 </Button>
                                                            </div>
                                                       ))}
                                             </div>
                                        )}

                                        <Button
                                             className="mt-4 w-full bg-transparent"
                                             variant="outline"
                                             asChild
                                        >
                                             <Link href="/dashboard/company/campaigns/new">
                                                  Create New Campaign
                                             </Link>
                                        </Button>
                                   </div>

                                   {/* Recommended Influencers */}
                                   <div className="glass-card rounded-xl p-6">
                                        <div className="mb-6 flex items-center justify-between">
                                             <h2 className="text-lg font-semibold text-foreground">
                                                  Suggested Influencers
                                             </h2>
                                             <Button
                                                  variant="ghost"
                                                  size="sm"
                                                  asChild
                                             >
                                                  <Link
                                                       href="/dashboard/company/influencers"
                                                       className="gap-1"
                                                  >
                                                       Browse
                                                       <ArrowRight className="h-4 w-4" />
                                                  </Link>
                                             </Button>
                                        </div>

                                        {loading ? (
                                             <div className="text-center text-muted-foreground py-8">
                                                  Loading...
                                             </div>
                                        ) : recommendedInfluencers.length ===
                                          0 ? (
                                             <div className="text-center text-muted-foreground py-8 text-sm">
                                                  No recommendations yet
                                             </div>
                                        ) : (
                                             <div className="space-y-4">
                                                  {recommendedInfluencers.map(
                                                       (influencer) => (
                                                            <div
                                                                 key={
                                                                      influencer._id
                                                                 }
                                                                 className="flex items-center gap-3 rounded-lg border border-border bg-secondary/30 p-3 transition-colors hover:bg-secondary/50"
                                                            >
                                                                 <img
                                                                      src={
                                                                           influencer.profileImage ||
                                                                           "/placeholder.svg"
                                                                      }
                                                                      alt={
                                                                           influencer.displayName
                                                                      }
                                                                      className="h-10 w-10 rounded-lg object-cover"
                                                                 />
                                                                 <div className="flex-1 min-w-0">
                                                                      <h3 className="font-medium text-foreground text-sm truncate">
                                                                           {
                                                                                influencer.displayName
                                                                           }
                                                                      </h3>
                                                                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                                                                           <Users className="h-3 w-3" />
                                                                           {formatNumber(
                                                                                influencer.followers ||
                                                                                     0
                                                                           )}{" "}
                                                                           followers
                                                                      </p>
                                                                 </div>
                                                                 <Button
                                                                      variant="outline"
                                                                      size="sm"
                                                                      asChild
                                                                 >
                                                                      <Link
                                                                           href={`/dashboard/company/influencers/${influencer._id}`}
                                                                      >
                                                                           View
                                                                      </Link>
                                                                 </Button>
                                                            </div>
                                                       )
                                                  )}
                                             </div>
                                        )}

                                        <Button
                                             className="mt-4 w-full bg-transparent"
                                             variant="outline"
                                             asChild
                                        >
                                             <Link href="/dashboard/company/influencers">
                                                  Discover More
                                             </Link>
                                        </Button>
                                   </div>
                              </div>
                         </div>
                    </div>
               </main>
          </div>
     );
}
