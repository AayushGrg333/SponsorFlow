"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Sidebar } from "@/components/dashboard/sidebar";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
     Card,
     CardContent,
     CardDescription,
     CardHeader,
     CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
     Clock,
     CheckCircle2,
     XCircle,
     Users,
     MessageSquare,
     Eye,
     ChevronDown,
     ChevronUp,
     Briefcase,
} from "lucide-react";
import { campaignsAPI, applicationsAPI } from "@/lib/api";
import Link from "next/link";
import { authStorage } from "@/lib/authHelper";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { startConversation } from "@/lib/conversationHelper";

interface Application {
     _id: string;
     influencer: {
          _id: string;
          username: string;
          displayName: string;
          profileImage?: string;
          bio?: string;
          platforms?: { platform: string; count: number }[];
          experienceYears?: number;
     };
     campaign: {
          _id: string;
          campaignName: string;
          budget: number;
     };
     status: "pending" | "accepted" | "rejected";
     message?: string;
     appliedAt: string;
}

interface Campaign {
     _id: string;
     title: string;
     description: string;
     budget: number;
     startDate: string;
     endDate: string;
     status: string;
     applications?: Application[];
}

const statusConfig = {
     pending: {
          label: "Pending",
          icon: Clock,
          variant: "secondary" as const,
          color: "text-yellow-500",
          bgColor: "bg-yellow-500/10",
     },
     accepted: {
          label: "Accepted",
          icon: CheckCircle2,
          variant: "default" as const,
          color: "text-green-500",
          bgColor: "bg-green-500/10",
     },
     rejected: {
          label: "Rejected",
          icon: XCircle,
          variant: "destructive" as const,
          color: "text-red-500",
          bgColor: "bg-red-500/10",
     },
};

export default function CompanyApplicationsPage() {
     const router = useRouter();
     const [campaigns, setCampaigns] = useState<Campaign[]>([]);
     const [loading, setLoading] = useState(true);
     const [activeTab, setActiveTab] = useState("all");
     const [expandedCampaigns, setExpandedCampaigns] = useState<Set<string>>(new Set());
     const [updatingStatus, setUpdatingStatus] = useState<string | null>(null);
     const [user, setUser] = useState<any>(null);

     useEffect(() => {
          const storedUser = authStorage.getUser();
          setUser(storedUser);
          loadCampaignsWithApplications();
     }, []);

     const loadCampaignsWithApplications = async () => {
          try {
               setLoading(true);
               const currentUser = authStorage.getUser();
               if (!currentUser || !currentUser.id) {
                    console.error("No user found");
                    return;
               }

               // Fetch all campaigns for this company
               const campaignsResponse = await campaignsAPI.getByCompany(currentUser.id);
               
               if (campaignsResponse.data && !campaignsResponse.error) {
                    const campaignsData = (campaignsResponse.data as { data: Campaign[] }).data;
                    console.log("Fetched campaigns:", campaignsData);
                    // Fetch applications for each campaign
                    const campaignsWithApplications = await Promise.all(
                         campaignsData.map(async (campaign: Campaign) => {
                              const appsResponse = await applicationsAPI.getByCampaign(campaign._id);
                              const applications = (appsResponse.data as { data: Application[] }).data;
                              return { ...campaign, applications };
                         })
                    );

                    setCampaigns(campaignsWithApplications);
               }
          } catch (error) {
               console.error("Error loading campaigns:", error);
          } finally {
               setLoading(false);
          }
     };

     const handleStatusUpdate = async (applicationId: string, newStatus: string) => {
          try {
               setUpdatingStatus(applicationId);
               const response = await applicationsAPI.updateApplicationStatus(applicationId, newStatus);
               
               if (response.data && !response.error) {
                    // Update local state
                    setCampaigns(prevCampaigns =>
                         prevCampaigns.map(campaign => ({
                              ...campaign,
                              applications: campaign.applications?.map(app =>
                                   app._id === applicationId ? { ...app, status: newStatus as any } : app
                              ),
                         }))
                    );
               }
          } catch (error) {
               console.error("Error updating status:", error);
          } finally {
               setUpdatingStatus(null);
          }
     };

     const handleMessageInfluencer = (influencerId: string) => {
          if (!user) return;
          startConversation(user.id, user.role, influencerId, "influencer", router);
     };

     const toggleCampaign = (campaignId: string) => {
          setExpandedCampaigns(prev => {
               const newSet = new Set(prev);
               if (newSet.has(campaignId)) {
                    newSet.delete(campaignId);
               } else {
                    newSet.add(campaignId);
               }
               return newSet;
          });
     };

     const formatDate = (dateString: string) => {
          return new Date(dateString).toLocaleDateString("en-US", {
               year: "numeric",
               month: "short",
               day: "numeric",
          });
     };

     const formatCurrency = (amount: number) => {
          return new Intl.NumberFormat("en-US", {
               style: "currency",
               currency: "USD",
               minimumFractionDigits: 0,
          }).format(amount);
     };

     const getTotalFollowers = (platforms?: { platform: string; count: number }[]) => {
          if (!platforms || platforms.length === 0) return "0";
          const total = platforms.reduce((sum, p) => sum + p.count, 0);
          if (total >= 1000000) return `${(total / 1000000).toFixed(1)}M`;
          if (total >= 1000) return `${(total / 1000).toFixed(0)}K`;
          return total.toString();
     };

     const getFilteredApplications = (applications: Application[]) => {
          if (activeTab === "all") return applications;
          return applications.filter(app => app.status === activeTab);
     };

     const getAllApplications = () => {
          return campaigns.flatMap(c => c.applications || []);
     };

     const getStats = () => {
          const allApps = getAllApplications();
          return {
               total: allApps.length,
               pending: allApps.filter(app => app.status === "pending").length,
               accepted: allApps.filter(app => app.status === "accepted").length,
               rejected: allApps.filter(app => app.status === "rejected").length,
          };
     };

     const stats = getStats();

     return (
          <div className="min-h-screen bg-background">
               <Sidebar userType="company" />

               <main className="lg:pl-64">
                    <div className="px-4 py-8 pt-24 lg:px-8 lg:pt-8">
                         <DashboardHeader
                              title="Campaign Applications"
                              subtitle="Review and manage influencer applications for your campaigns"
                         />

                         {/* Stats Cards */}
                         <div className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
                              <Card>
                                   <CardHeader className="pb-3">
                                        <CardDescription>Total Applications</CardDescription>
                                        <CardTitle className="text-3xl">{stats.total}</CardTitle>
                                   </CardHeader>
                              </Card>
                              <Card>
                                   <CardHeader className="pb-3">
                                        <CardDescription className="text-yellow-500">
                                             Pending Review
                                        </CardDescription>
                                        <CardTitle className="text-3xl">{stats.pending}</CardTitle>
                                   </CardHeader>
                              </Card>
                              <Card>
                                   <CardHeader className="pb-3">
                                        <CardDescription className="text-green-500">
                                             Accepted
                                        </CardDescription>
                                        <CardTitle className="text-3xl">{stats.accepted}</CardTitle>
                                   </CardHeader>
                              </Card>
                              <Card>
                                   <CardHeader className="pb-3">
                                        <CardDescription className="text-red-500">
                                             Rejected
                                        </CardDescription>
                                        <CardTitle className="text-3xl">{stats.rejected}</CardTitle>
                                   </CardHeader>
                              </Card>
                         </div>

                         {/* Tabs */}
                         <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                              <TabsList className="grid w-full grid-cols-4 lg:w-[400px]">
                                   <TabsTrigger value="all">All</TabsTrigger>
                                   <TabsTrigger value="pending">Pending</TabsTrigger>
                                   <TabsTrigger value="accepted">Accepted</TabsTrigger>
                                   <TabsTrigger value="rejected">Rejected</TabsTrigger>
                              </TabsList>

                              <TabsContent value={activeTab} className="space-y-6">
                                   {/* Loading State */}
                                   {loading && (
                                        <div className="flex items-center justify-center py-16">
                                             <div className="text-muted-foreground">
                                                  Loading campaigns and applications...
                                             </div>
                                        </div>
                                   )}

                                   {/* Campaigns List */}
                                   {!loading && campaigns.length > 0 && (
                                        <div className="space-y-6">
                                             {campaigns.map((campaign) => {
                                                  const filteredApps = getFilteredApplications(
                                                       campaign.applications || []
                                                  );
                                                  if (filteredApps.length === 0 && activeTab !== "all") return null;

                                                  const isExpanded = expandedCampaigns.has(campaign._id);

                                                  return (
                                                       <Card key={campaign._id} className="overflow-hidden">
                                                            <Collapsible
                                                                 open={isExpanded}
                                                                 onOpenChange={() => toggleCampaign(campaign._id)}
                                                            >
                                                                 <CollapsibleTrigger asChild>
                                                                      <CardHeader className="cursor-pointer border-b bg-muted/50 transition-colors hover:bg-muted">
                                                                           <div className="flex items-center justify-between">
                                                                                <div className="flex items-center gap-4">
                                                                                     <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                                                                                          <Briefcase className="h-6 w-6 text-primary" />
                                                                                     </div>
                                                                                     <div>
                                                                                          <CardTitle className="text-xl">
                                                                                               {campaign.title}
                                                                                          </CardTitle>
                                                                                          <CardDescription className="mt-1 flex items-center gap-4">
                                                                                               <span className="flex items-center gap-1">
                                                                                                    <Users className="h-4 w-4" />
                                                                                                    {filteredApps.length} applications
                                                                                               </span>
                                                                                               <span>
                                                                                                    Budget: {formatCurrency(campaign.budget)}
                                                                                               </span>
                                                                                          </CardDescription>
                                                                                     </div>
                                                                                </div>
                                                                                <Button variant="ghost" size="sm">
                                                                                     {isExpanded ? (
                                                                                          <ChevronUp className="h-5 w-5" />
                                                                                     ) : (
                                                                                          <ChevronDown className="h-5 w-5" />
                                                                                     )}
                                                                                </Button>
                                                                           </div>
                                                                      </CardHeader>
                                                                 </CollapsibleTrigger>

                                                                 <CollapsibleContent>
                                                                      <CardContent className="p-6">
                                                                           {filteredApps.length === 0 ? (
                                                                                <div className="py-8 text-center text-muted-foreground">
                                                                                     No {activeTab !== "all" && activeTab} applications for this campaign
                                                                                </div>
                                                                           ) : (
                                                                                <div className="space-y-4">
                                                                                     {filteredApps.map((application) => {
                                                                                          const config = statusConfig[application.status];
                                                                                          const StatusIcon = config.icon;

                                                                                          return (
                                                                                               <Card
                                                                                                    key={application._id}
                                                                                                    className="overflow-hidden border-2"
                                                                                               >
                                                                                                    <CardContent className="p-0">
                                                                                                         <div className="flex flex-col md:flex-row">
                                                                                                              {/* Influencer Info */}
                                                                                                              <div className="flex flex-1 items-start gap-4 p-6">
                                                                                                                   <img
                                                                                                                        src={
                                                                                                                             application.influencer.profileImage ||
                                                                                                                             "/placeholder.svg"
                                                                                                                        }
                                                                                                                        alt={application.influencer.displayName}
                                                                                                                        className="h-16 w-16 rounded-full object-cover ring-2 ring-border"
                                                                                                                   />
                                                                                                                   <div className="flex-1 min-w-0">
                                                                                                                        <div className="flex items-center gap-2 mb-1">
                                                                                                                             <h3 className="text-lg font-semibold truncate">
                                                                                                                                  {application.influencer.displayName}
                                                                                                                             </h3>
                                                                                                                             <Badge
                                                                                                                                  variant={config.variant}
                                                                                                                                  className={`${config.bgColor} ${config.color} flex items-center gap-1`}
                                                                                                                             >
                                                                                                                                  <StatusIcon className="h-3 w-3" />
                                                                                                                                  {config.label}
                                                                                                                             </Badge>
                                                                                                                        </div>
                                                                                                                        <p className="text-sm text-muted-foreground mb-2">
                                                                                                                             @{application.influencer.username}
                                                                                                                        </p>
                                                                                                                        {application.influencer.bio && (
                                                                                                                             <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                                                                                                                                  {application.influencer.bio}
                                                                                                                             </p>
                                                                                                                        )}
                                                                                                                        {application.message && (
                                                                                                                             <div className="rounded-lg bg-muted p-3 mt-3">
                                                                                                                                  <p className="text-xs font-medium text-muted-foreground mb-1">
                                                                                                                                       Application Message:
                                                                                                                                  </p>
                                                                                                                                  <p className="text-sm italic">
                                                                                                                                       "{application.message}"
                                                                                                                                  </p>
                                                                                                                             </div>
                                                                                                                        )}
                                                                                                                   </div>
                                                                                                              </div>

                                                                                                              {/* Stats & Actions */}
                                                                                                              <div className="flex flex-col justify-between gap-4 border-t border-border bg-secondary/30 p-6 md:w-72 md:border-l md:border-t-0">
                                                                                                                   <div className="space-y-3">
                                                                                                                        <div className="flex justify-between text-sm">
                                                                                                                             <span className="text-muted-foreground">
                                                                                                                                  Followers:
                                                                                                                             </span>
                                                                                                                             <span className="font-semibold">
                                                                                                                                  {getTotalFollowers(
                                                                                                                                       application.influencer.platforms
                                                                                                                                  )}
                                                                                                                             </span>
                                                                                                                        </div>
                                                                                                                        <div className="flex justify-between text-sm">
                                                                                                                             <span className="text-muted-foreground">
                                                                                                                                  Experience:
                                                                                                                             </span>
                                                                                                                             <span className="font-semibold">
                                                                                                                                  {application.influencer.experienceYears || 0} years
                                                                                                                             </span>
                                                                                                                        </div>
                                                                                                                        <div className="flex justify-between text-sm">
                                                                                                                             <span className="text-muted-foreground">
                                                                                                                                  Applied:
                                                                                                                             </span>
                                                                                                                             <span className="font-semibold">
                                                                                                                                  {formatDate(application.appliedAt)}
                                                                                                                             </span>
                                                                                                                        </div>
                                                                                                                   </div>

                                                                                                                   <div className="space-y-2">
                                                                                                                        {/* Action buttons */}
                                                                                                                        {application.status === "pending" && (
                                                                                                                             <div className="flex gap-2">
                                                                                                                                  <Button
                                                                                                                                       className="flex-1 bg-green-600 hover:bg-green-700"
                                                                                                                                       size="sm"
                                                                                                                                       onClick={() =>
                                                                                                                                            handleStatusUpdate(
                                                                                                                                                 application._id,
                                                                                                                                                 "accepted"
                                                                                                                                            )
                                                                                                                                       }
                                                                                                                                       disabled={updatingStatus === application._id}
                                                                                                                                  >
                                                                                                                                       <CheckCircle2 className="mr-1 h-4 w-4" />
                                                                                                                                       Accept
                                                                                                                                  </Button>
                                                                                                                                  <Button
                                                                                                                                       variant="destructive"
                                                                                                                                       className="flex-1"
                                                                                                                                       size="sm"
                                                                                                                                       onClick={() =>
                                                                                                                                            handleStatusUpdate(
                                                                                                                                                 application._id,
                                                                                                                                                 "rejected"
                                                                                                                                            )
                                                                                                                                       }
                                                                                                                                       disabled={updatingStatus === application._id}
                                                                                                                                  >
                                                                                                                                       <XCircle className="mr-1 h-4 w-4" />
                                                                                                                                       Reject
                                                                                                                                  </Button>
                                                                                                                             </div>
                                                                                                                        )}

                                                                                                                        <div className="flex gap-2">
                                                                                                                             <Button
                                                                                                                                  variant="outline"
                                                                                                                                  className="flex-1"
                                                                                                                                  size="sm"
                                                                                                                                  asChild
                                                                                                                             >
                                                                                                                                  <Link
                                                                                                                                       href={`/dashboard/company/influencers/${application.influencer._id}`}
                                                                                                                                  >
                                                                                                                                       <Eye className="mr-1 h-4 w-4" />
                                                                                                                                       Profile
                                                                                                                                  </Link>
                                                                                                                             </Button>
                                                                                                                             <Button
                                                                                                                                  variant="outline"
                                                                                                                                  className="flex-1"
                                                                                                                                  size="sm"
                                                                                                                                  onClick={() => handleMessageInfluencer(application.influencer._id)}
                                                                                                                             >
                                                                                                                                  <MessageSquare className="mr-1 h-4 w-4" />
                                                                                                                                  Message
                                                                                                                             </Button>
                                                                                                                        </div>
                                                                                                                   </div>
                                                                                                              </div>
                                                                                                         </div>
                                                                                                    </CardContent>
                                                                                               </Card>
                                                                                          );
                                                                                     })}
                                                                                </div>
                                                                           )}
                                                                      </CardContent>
                                                                 </CollapsibleContent>
                                                            </Collapsible>
                                                       </Card>
                                                  );
                                             })}
                                        </div>
                                   )}

                                   {/* Empty State */}
                                   {!loading && campaigns.length === 0 && (
                                        <Card>
                                             <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                                                  <Briefcase className="mb-4 h-12 w-12 text-muted-foreground" />
                                                  <CardTitle className="mb-2">No campaigns found</CardTitle>
                                                  <CardDescription className="mb-6">
                                                       Create your first campaign to start receiving applications
                                                  </CardDescription>
                                                  <Button asChild>
                                                       <Link href="/dashboard/company/campaigns/new">
                                                            Create Campaign
                                                       </Link>
                                                  </Button>
                                             </CardContent>
                                        </Card>
                                   )}
                              </TabsContent>
                         </Tabs>
                    </div>
               </main>
          </div>
     );
}