/* eslint-disable @typescript-eslint/no-explicit-any */
// eslint-disable-next-line react-hooks/exhaustive-deps
// eslint-disable-next-line @next/next/no-img-element
"use client";

import { useState, useEffect } from "react";
import { Sidebar } from "@/components/dashboard/sidebar";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
     Edit2,
     Camera,
     Globe,
     MapPin,
     Users,
     Building2,
     Briefcase,
     DollarSign,
     Check,
     Loader2,
     Instagram,
     Facebook,
     Twitter,
     Linkedin,
     Youtube,
     Plus,
     X,
} from "lucide-react";
import { companyAPI, campaignsAPI } from "@/lib/api";
import { authStorage } from "@/lib/authHelper";
import { toast } from "sonner";

const categories = [
     "Tech",
     "Gaming",
     "Lifestyle",
     "Fashion",
     "Beauty",
     "Skincare",
     "Food",
     "Travel",
     "Fitness",
     "Finance",
     "Education",
     "Entertainment",
];

const socialPlatformIcons: Record<string, any> = {
     instagram: Instagram,
     facebook: Facebook,
     twitter: Twitter,
     linkedin: Linkedin,
     youtube: Youtube,
     website: Globe,
};

interface Company {
     _id: string;
     companyName: string;
     email: string;
     addressType?: "Physical" | "Online";
     address?: string;
     contactNumber?: string;
     contentType?: { content: string }[];
     profileImage?: string;
     products?: string[];
     establishedYear?: number;
     description?: string;
     socialLinks?: { types: string; url: string }[];
     slug?: string;
}

interface Campaign {
     _id: string;
     campaignName: string;
     budget: number;
     startDate: string;
     endDate: string;
     status: string;
}

export default function CompanyProfilePage() {
     const [isEditing, setIsEditing] = useState(false);
     const [isLoading, setIsLoading] = useState(false);
     const [loading, setLoading] = useState(true);
     const [company, setCompany] = useState<Company | null>(null);
     const [campaigns, setCampaigns] = useState<Campaign[]>([]);
     const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

     // Form state
     const [formData, setFormData] = useState({
          companyName: "",
          description: "",
          addressType: "Physical" as "Physical" | "Online",
          address: "",
          contactNumber: "",
          products: [] as string[],
          establishedYear: new Date().getFullYear(),
          socialLinks: [] as { types: string; url: string }[],
     });

     // New product input
     const [newProduct, setNewProduct] = useState("");
     const [newSocialPlatform, setNewSocialPlatform] = useState("website");
     const [newSocialUrl, setNewSocialUrl] = useState("");

     useEffect(() => {
          loadProfile();
     }, []);

     const loadProfile = async () => {
          try {
               setLoading(true);
               const user = authStorage.getUser();
               if (!user || !user.id) {
                    console.error("No user found");
                    return;
               }

               // Fetch company profile
               const response = await companyAPI.getprivateProfile();
               if (response.data && !response.error) {
                    const companyData = (response.data as { data: Company }).data;
                    setCompany(companyData);

                    // Set form data
                    setFormData({
                         companyName: companyData.companyName || "",
                         description: companyData.description || "",
                         addressType: companyData.addressType || "Physical",
                         address: companyData.address || "",
                         contactNumber: companyData.contactNumber || "",
                         products: companyData.products || [],
                         establishedYear: companyData.establishedYear || new Date().getFullYear(),
                         socialLinks: companyData.socialLinks || [],
                    });

                    // Set selected categories
                    if (companyData.contentType) {
                         setSelectedCategories(
                              companyData.contentType.map((ct: { content: string }) => ct.content)
                         );
                    }

                    // Fetch campaigns
                    const campaignsResponse = await campaignsAPI.getByCompany(user.id);
                    if (campaignsResponse.data && !campaignsResponse.error) {
                         const campaignsData = (campaignsResponse.data as { data: Campaign[] }).data;
                         setCampaigns(campaignsData);
                    }
               }
          } catch (error) {
               console.error("Error loading profile:", error);
               toast.error("Failed to load profile");
          } finally {
               setLoading(false);
          }
     };

     const toggleCategory = (category: string) => {
          if (selectedCategories.includes(category)) {
               setSelectedCategories(selectedCategories.filter((c) => c !== category));
          } else if (selectedCategories.length < 5) {
               setSelectedCategories([...selectedCategories, category]);
          }
     };

     const addProduct = () => {
          if (newProduct.trim() && !formData.products.includes(newProduct.trim())) {
               setFormData({
                    ...formData,
                    products: [...formData.products, newProduct.trim()],
               });
               setNewProduct("");
          }
     };

     const removeProduct = (product: string) => {
          setFormData({
               ...formData,
               products: formData.products.filter((p) => p !== product),
          });
     };

     const addSocialLink = () => {
          if (newSocialUrl.trim()) {
               const exists = formData.socialLinks.some((link) => link.types === newSocialPlatform);
               if (exists) {
                    toast.error("This platform is already added");
                    return;
               }
               setFormData({
                    ...formData,
                    socialLinks: [
                         ...formData.socialLinks,
                         { types: newSocialPlatform, url: newSocialUrl.trim() },
                    ],
               });
               setNewSocialUrl("");
          }
     };

     const removeSocialLink = (types: string) => {
          setFormData({
               ...formData,
               socialLinks: formData.socialLinks.filter((link) => link.types !== types),
          });
     };

     const handleSave = async () => {
          try {
               setIsLoading(true);
               const user = authStorage.getUser();
               if (!user || !user.id) return;

               const updateData = {
                    ...formData,
                    contentType: selectedCategories.map((cat) => ({ content: cat })),
               };

               const response = await companyAPI.updateProfile(user.id, updateData);

               if (response.data && !response.error) {
                    toast.success("Profile updated successfully");
                    setIsEditing(false);
                    loadProfile(); // Reload profile
               } else {
                    toast.error(response.error || "Failed to update profile");
               }
          } catch (error) {
               console.error("Error updating profile:", error);
               toast.error("Failed to update profile");
          } finally {
               setIsLoading(false);
          }
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

     if (loading) {
          return (
               <div className="min-h-screen bg-background">
                    <Sidebar userType="company" />
                    <main className="lg:pl-64">
                         <div className="flex h-screen items-center justify-center">
                              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                         </div>
                    </main>
               </div>
          );
     }

     if (!company) {
          return (
               <div className="min-h-screen bg-background">
                    <Sidebar userType="company" />
                    <main className="lg:pl-64">
                         <div className="flex h-screen flex-col items-center justify-center">
                              <Building2 className="mb-4 h-12 w-12 text-muted-foreground" />
                              <p className="text-muted-foreground">Company profile not found</p>
                         </div>
                    </main>
               </div>
          );
     }

     return (
          <div className="min-h-screen bg-background">
               <Sidebar userType="company" />

               <main className="lg:pl-64">
                    <div className="px-4 py-8 pt-24 lg:px-8 lg:pt-8">
                         <DashboardHeader title="Company Profile" subtitle="Manage your company's public profile" />

                         <Tabs defaultValue="profile" className="space-y-6">
                              <TabsList className="bg-secondary">
                                   <TabsTrigger value="profile">Profile</TabsTrigger>
                                   <TabsTrigger value="campaigns">Campaign History</TabsTrigger>
                                   <TabsTrigger value="analytics">Analytics</TabsTrigger>
                              </TabsList>

                              <TabsContent value="profile">
                                   <div className="grid gap-6 lg:grid-cols-3">
                                        {/* Profile Card */}
                                        <div className="glass-card rounded-xl p-6">
                                             <div className="relative mb-6">
                                                  <div className="relative mx-auto w-fit">
                                                       <img
                                                            src={company.profileImage || "/placeholder.svg"}
                                                            alt="Company Logo"
                                                            className="h-32 w-32 rounded-2xl object-cover ring-4 ring-accent/20"
                                                       />
                                                       <button className="absolute bottom-0 right-0 flex h-10 w-10 items-center justify-center rounded-full bg-accent text-accent-foreground hover:bg-accent/90">
                                                            <Camera className="h-5 w-5" />
                                                       </button>
                                                  </div>
                                             </div>

                                             <div className="text-center">
                                                  <h2 className="text-xl font-bold text-foreground">
                                                       {company.companyName}
                                                  </h2>
                                                  <p className="text-muted-foreground">{company.email}</p>
                                                  {company.addressType && (
                                                       <Badge variant="outline" className="mt-2">
                                                            {company.addressType}
                                                       </Badge>
                                                  )}
                                             </div>

                                             {/* Stats */}
                                             <div className="mt-6 grid grid-cols-3 gap-4 text-center">
                                                  <div className="rounded-lg bg-secondary p-3">
                                                       <p className="text-xl font-bold text-foreground">
                                                            {campaigns.length}
                                                       </p>
                                                       <p className="text-xs text-muted-foreground">Campaigns</p>
                                                  </div>
                                                  <div className="rounded-lg bg-secondary p-3">
                                                       <p className="text-xl font-bold text-foreground">
                                                            {company.products?.length || 0}
                                                       </p>
                                                       <p className="text-xs text-muted-foreground">Products</p>
                                                  </div>
                                                  <div className="rounded-lg bg-secondary p-3">
                                                       <p className="text-xl font-bold text-foreground">
                                                            {company.establishedYear || "N/A"}
                                                       </p>
                                                       <p className="text-xs text-muted-foreground">Est.</p>
                                                  </div>
                                             </div>

                                             {/* Info */}
                                             <div className="mt-6 space-y-3">
                                                  {company.contactNumber && (
                                                       <div className="flex items-center gap-3 text-sm">
                                                            <Users className="h-4 w-4 text-muted-foreground" />
                                                            <span className="text-muted-foreground">
                                                                 {company.contactNumber}
                                                            </span>
                                                       </div>
                                                  )}
                                                  {company.address && (
                                                       <div className="flex items-start gap-3 text-sm">
                                                            <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                                                            <span className="text-muted-foreground">
                                                                 {company.address}
                                                            </span>
                                                       </div>
                                                  )}
                                             </div>

                                             {/* Social Links */}
                                             {company.socialLinks && company.socialLinks.length > 0 && (
                                                  <div className="mt-6">
                                                       <p className="mb-3 text-sm font-medium text-foreground">
                                                            Social Media
                                                       </p>
                                                       <div className="flex flex-wrap gap-2">
                                                            {company.socialLinks.map((social, index) => {
                                                                 const Icon =
                                                                      socialPlatformIcons[social.types?.toLowerCase()] ||
                                                                      Globe;
                                                                 return (
                                                                      <a
                                                                           key={index}
                                                                           href={social.url}
                                                                           target="_blank"
                                                                           rel="noopener noreferrer"
                                                                           className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary hover:bg-accent hover:text-accent-foreground transition-colors"
                                                                      >
                                                                           <Icon className="h-5 w-5" />
                                                                      </a>
                                                                 );
                                                            })}
                                                       </div>
                                                  </div>
                                             )}

                                             {/* Categories */}
                                             {selectedCategories.length > 0 && (
                                                  <div className="mt-6">
                                                       <p className="mb-2 text-sm font-medium text-foreground">
                                                            Target Categories
                                                       </p>
                                                       <div className="flex flex-wrap gap-2">
                                                            {selectedCategories.map((cat) => (
                                                                 <Badge key={cat} className="bg-accent/10 text-accent">
                                                                      {cat}
                                                                 </Badge>
                                                            ))}
                                                       </div>
                                                  </div>
                                             )}

                                             {/* Products */}
                                             {company.products && company.products.length > 0 && (
                                                  <div className="mt-6">
                                                       <p className="mb-2 text-sm font-medium text-foreground">Products</p>
                                                       <div className="flex flex-wrap gap-2">
                                                            {company.products.map((product, index) => (
                                                                 <Badge key={index} variant="outline">
                                                                      {product}
                                                                 </Badge>
                                                            ))}
                                                       </div>
                                                  </div>
                                             )}
                                        </div>

                                        {/* Edit Form */}
                                        <div className="lg:col-span-2 space-y-6">
                                             <div className="glass-card rounded-xl p-6">
                                                  <div className="mb-6 flex items-center justify-between">
                                                       <h3 className="text-lg font-semibold text-foreground">
                                                            Company Information
                                                       </h3>
                                                       <Button
                                                            variant={isEditing ? "outline" : "default"}
                                                            size="sm"
                                                            className={
                                                                 !isEditing
                                                                      ? "bg-accent hover:bg-accent/90 text-accent-foreground"
                                                                      : ""
                                                            }
                                                            onClick={() => setIsEditing(!isEditing)}
                                                       >
                                                            <Edit2 className="mr-2 h-4 w-4" />
                                                            {isEditing ? "Cancel" : "Edit Profile"}
                                                       </Button>
                                                  </div>

                                                  <div className="space-y-4">
                                                       <div className="grid gap-4 sm:grid-cols-2">
                                                            <div className="space-y-2">
                                                                 <Label>Company Name</Label>
                                                                 <Input
                                                                      value={formData.companyName}
                                                                      onChange={(e) =>
                                                                           setFormData({
                                                                                ...formData,
                                                                                companyName: e.target.value,
                                                                           })
                                                                      }
                                                                      disabled={!isEditing}
                                                                 />
                                                            </div>
                                                            <div className="space-y-2">
                                                                 <Label>Contact Number</Label>
                                                                 <Input
                                                                      value={formData.contactNumber}
                                                                      onChange={(e) =>
                                                                           setFormData({
                                                                                ...formData,
                                                                                contactNumber: e.target.value,
                                                                           })
                                                                      }
                                                                      disabled={!isEditing}
                                                                      placeholder="1234567890"
                                                                 />
                                                            </div>
                                                       </div>

                                                       <div className="space-y-2">
                                                            <Label>Description</Label>
                                                            <Textarea
                                                                 value={formData.description}
                                                                 onChange={(e) =>
                                                                      setFormData({ ...formData, description: e.target.value })
                                                                 }
                                                                 disabled={!isEditing}
                                                                 className="min-h-[100px]"
                                                            />
                                                       </div>

                                                       <div className="grid gap-4 sm:grid-cols-2">
                                                            <div className="space-y-2">
                                                                 <Label>Address Type</Label>
                                                                 <Select
                                                                      value={formData.addressType}
                                                                      onValueChange={(value: "Physical" | "Online") =>
                                                                           setFormData({ ...formData, addressType: value })
                                                                      }
                                                                      disabled={!isEditing}
                                                                 >
                                                                      <SelectTrigger>
                                                                           <SelectValue />
                                                                      </SelectTrigger>
                                                                      <SelectContent>
                                                                           <SelectItem value="Physical">Physical</SelectItem>
                                                                           <SelectItem value="Online">Online</SelectItem>
                                                                      </SelectContent>
                                                                 </Select>
                                                            </div>
                                                            <div className="space-y-2">
                                                                 <Label>Established Year</Label>
                                                                 <Input
                                                                      type="number"
                                                                      value={formData.establishedYear}
                                                                      onChange={(e) =>
                                                                           setFormData({
                                                                                ...formData,
                                                                                establishedYear: parseInt(e.target.value),
                                                                           })
                                                                      }
                                                                      disabled={!isEditing}
                                                                 />
                                                            </div>
                                                       </div>

                                                       {formData.addressType === "Physical" && (
                                                            <div className="space-y-2">
                                                                 <Label>Address</Label>
                                                                 <Textarea
                                                                      value={formData.address}
                                                                      onChange={(e) =>
                                                                           setFormData({ ...formData, address: e.target.value })
                                                                      }
                                                                      disabled={!isEditing}
                                                                      placeholder="Enter your complete address"
                                                                 />
                                                            </div>
                                                       )}

                                                       {isEditing && (
                                                            <Button
                                                                 onClick={handleSave}
                                                                 disabled={isLoading}
                                                                 className="bg-accent hover:bg-accent/90 text-accent-foreground"
                                                            >
                                                                 {isLoading ? (
                                                                      <>
                                                                           <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                                           Saving...
                                                                      </>
                                                                 ) : (
                                                                      <>
                                                                           <Check className="mr-2 h-4 w-4" />
                                                                           Save Changes
                                                                      </>
                                                                 )}
                                                            </Button>
                                                       )}
                                                  </div>
                                             </div>

                                             {/* Categories */}
                                             {isEditing && (
                                                  <div className="glass-card rounded-xl p-6">
                                                       <h3 className="mb-4 text-lg font-semibold text-foreground">
                                                            Target Categories
                                                       </h3>
                                                       <p className="mb-4 text-sm text-muted-foreground">
                                                            Select up to 5 categories
                                                       </p>
                                                       <div className="flex flex-wrap gap-2">
                                                            {categories.map((category) => (
                                                                 <Badge
                                                                      key={category}
                                                                      variant={
                                                                           selectedCategories.includes(category)
                                                                                ? "default"
                                                                                : "outline"
                                                                      }
                                                                      className={`cursor-pointer transition-all ${
                                                                           selectedCategories.includes(category)
                                                                                ? "bg-accent text-accent-foreground"
                                                                                : "hover:border-accent hover:text-accent"
                                                                      }`}
                                                                      onClick={() => toggleCategory(category)}
                                                                 >
                                                                      {category}
                                                                 </Badge>
                                                            ))}
                                                       </div>
                                                  </div>
                                             )}

                                             {/* Products Management */}
                                             {isEditing && (
                                                  <div className="glass-card rounded-xl p-6">
                                                       <h3 className="mb-4 text-lg font-semibold text-foreground">
                                                            Products
                                                       </h3>
                                                       <div className="space-y-4">
                                                            <div className="flex gap-2">
                                                                 <Input
                                                                      placeholder="Add a product"
                                                                      value={newProduct}
                                                                      onChange={(e) => setNewProduct(e.target.value)}
                                                                      onKeyPress={(e) => e.key === "Enter" && addProduct()}
                                                                 />
                                                                 <Button onClick={addProduct} size="icon">
                                                                      <Plus className="h-4 w-4" />
                                                                 </Button>
                                                            </div>
                                                            <div className="flex flex-wrap gap-2">
                                                                 {formData.products.map((product, index) => (
                                                                      <Badge
                                                                           key={index}
                                                                           variant="secondary"
                                                                           className="flex items-center gap-1"
                                                                      >
                                                                           {product}
                                                                           <X
                                                                                className="h-3 w-3 cursor-pointer"
                                                                                onClick={() => removeProduct(product)}
                                                                           />
                                                                      </Badge>
                                                                 ))}
                                                            </div>
                                                       </div>
                                                  </div>
                                             )}

                                             {/* Social Links Management */}
                                             {isEditing && (
                                                  <div className="glass-card rounded-xl p-6">
                                                       <h3 className="mb-4 text-lg font-semibold text-foreground">
                                                            Social Media Links
                                                       </h3>
                                                       <div className="space-y-4">
                                                            <div className="flex gap-2">
                                                                 <Select
                                                                      value={newSocialPlatform}
                                                                      onValueChange={setNewSocialPlatform}
                                                                 >
                                                                      <SelectTrigger className="w-[180px]">
                                                                           <SelectValue />
                                                                      </SelectTrigger>
                                                                      <SelectContent>
                                                                           <SelectItem value="website">Website</SelectItem>
                                                                           <SelectItem value="instagram">Instagram</SelectItem>
                                                                           <SelectItem value="facebook">Facebook</SelectItem>
                                                                           <SelectItem value="twitter">Twitter</SelectItem>
                                                                           <SelectItem value="linkedin">LinkedIn</SelectItem>
                                                                           <SelectItem value="youtube">YouTube</SelectItem>
                                                                      </SelectContent>
                                                                 </Select>
                                                                 <Input
                                                                      placeholder="URL"
                                                                      value={newSocialUrl}
                                                                      onChange={(e) => setNewSocialUrl(e.target.value)}
                                                                      onKeyPress={(e) =>
                                                                           e.key === "Enter" && addSocialLink()
                                                                      }
                                                                 />
                                                                 <Button onClick={addSocialLink} size="icon">
                                                                      <Plus className="h-4 w-4" />
                                                                 </Button>
                                                            </div>
                                                            <div className="space-y-2">
                                                                 {formData.socialLinks.map((link, index) => {
                                                                      const Icon =
                                                                           socialPlatformIcons[link.types?.toLowerCase()] ||
                                                                           Globe;
                                                                      return (
                                                                           <div
                                                                                key={index}
                                                                                className="flex items-center justify-between rounded-lg bg-secondary p-3"
                                                                           >
                                                                                <div className="flex items-center gap-3">
                                                                                     <Icon className="h-5 w-5" />
                                                                                     <span className="capitalize">
                                                                                          {link.types}
                                                                                     </span>
                                                                                     <span className="text-sm text-muted-foreground truncate max-w-[200px]">
                                                                                          {link.url}
                                                                                     </span>
                                                                                </div>
                                                                                <Button
                                                                                     variant="ghost"
                                                                                     size="icon"
                                                                                     onClick={() => removeSocialLink(link.types)}
                                                                                >
                                                                                     <X className="h-4 w-4" />
                                                                                </Button>
                                                                           </div>
                                                                      );
                                                                 })}
                                                            </div>
                                                       </div>
                                                  </div>
                                             )}
                                        </div>
                                   </div>
                              </TabsContent>

                              <TabsContent value="campaigns">
                                   <div className="glass-card rounded-xl p-6">
                                        <h3 className="mb-6 text-lg font-semibold text-foreground">
                                             Campaign History
                                        </h3>
                                        {campaigns.length === 0 ? (
                                             <div className="flex flex-col items-center justify-center py-16 text-center">
                                                  <Briefcase className="mb-4 h-12 w-12 text-muted-foreground" />
                                                  <p className="text-muted-foreground">No campaigns yet</p>
                                             </div>
                                        ) : (
                                             <div className="space-y-4">
                                                  {campaigns.map((campaign) => (
                                                       <div
                                                            key={campaign._id}
                                                            className="rounded-lg border border-border bg-secondary/30 p-4"
                                                       >
                                                            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                                                                 <div>
                                                                      <div className="flex items-center gap-2">
                                                                           <h4 className="font-medium text-foreground">
                                                                                {campaign.campaignName}
                                                                           </h4>
                                                                           <Badge
                                                                                variant={
                                                                                     campaign.status === "active"
                                                                                          ? "default"
                                                                                          : "secondary"
                                                                                }
                                                                           >
                                                                                {campaign.status}
                                                                           </Badge>
                                                                      </div>
                                                                      <p className="text-sm text-muted-foreground">
                                                                           {formatDate(campaign.startDate)} -{" "}
                                                                           {formatDate(campaign.endDate)}
                                                                      </p>
                                                                 </div>
                                                                 <div className="flex flex-wrap gap-6 text-sm">
                                                                      <div className="text-center">
                                                                           <p className="font-bold text-foreground">
                                                                                {formatCurrency(campaign.budget)}
                                                                           </p>
                                                                           <p className="text-xs text-muted-foreground">
                                                                                Budget
                                                                           </p>
                                                                      </div>
                                                                 </div>
                                                            </div>
                                                       </div>
                                                  ))}
                                             </div>
                                        )}
                                   </div>
                              </TabsContent>

                              <TabsContent value="analytics">
                                   <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                                        <div className="glass-card rounded-xl p-6">
                                             <div className="flex items-center gap-3">
                                                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10">
                                                       <Briefcase className="h-5 w-5 text-accent" />
                                                  </div>
                                                  <div>
                                                       <p className="text-2xl font-bold text-foreground">
                                                            {campaigns.length}
                                                       </p>
                                                       <p className="text-sm text-muted-foreground">Total Campaigns</p>
                                                  </div>
                                             </div>
                                        </div>
                                        <div className="glass-card rounded-xl p-6">
                                             <div className="flex items-center gap-3">
                                                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                                                       <Users className="h-5 w-5 text-primary" />
                                                  </div>
                                                  <div>
                                                       <p className="text-2xl font-bold text-foreground">
                                                            {company.products?.length || 0}
                                                       </p>
                                                       <p className="text-sm text-muted-foreground">Products</p>
                                                  </div>
                                             </div>
                                        </div>
                                        <div className="glass-card rounded-xl p-6">
                                             <div className="flex items-center gap-3">
                                                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-chart-3/10">
                                                       <DollarSign className="h-5 w-5 text-chart-3" />
                                                  </div>
                                                  <div>
                                                       <p className="text-2xl font-bold text-foreground">
                                                            {formatCurrency(
                                                                 campaigns.reduce((sum, c) => sum + c.budget, 0)
                                                            )}
                                                       </p>
                                                       <p className="text-sm text-muted-foreground">Total Budget</p>
                                                  </div>
                                             </div>
                                        </div>
                                        <div className="glass-card rounded-xl p-6">
                                             <div className="flex items-center gap-3">
                                                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-500/10">
                                                       <Building2 className="h-5 w-5 text-green-500" />
                                                  </div>
                                                  <div>
                                                       <p className="text-2xl font-bold text-foreground">
                                                            {company.establishedYear || "N/A"}
                                                       </p>
                                                       <p className="text-sm text-muted-foreground">Est. Year</p>
                                                  </div>
                                             </div>
                                        </div>
                                   </div>

                                   <div className="glass-card mt-6 rounded-xl p-6">
                                        <h3 className="mb-4 text-lg font-semibold text-foreground">
                                             Performance Overview
                                        </h3>
                                        <div className="flex h-64 items-center justify-center rounded-lg border border-dashed border-border">
                                             <p className="text-muted-foreground">Analytics chart coming soon</p>
                                        </div>
                                   </div>
                              </TabsContent>
                         </Tabs>
                    </div>
               </main>
          </div>
     );
}