// API Configuration and Service Layer for SponsorFlow Backend

const API_BASE_URL = "https://sponsorflow-v1.onrender.com/api";
// const API_BASE_URL = "http://localhost:8000/api";

// Generic fetch wrapper with auth handling
async function fetchAPI<T>(
     endpoint: string,
     options: RequestInit = {}
): Promise<{ data: T | null; error: string | null }> {
     try {
          const token =
               typeof window !== "undefined"
                    ? localStorage.getItem("accessToken")
                    : null;

          const headers: HeadersInit = {
               "Content-Type": "application/json",
               ...(token && { Authorization: `Bearer ${token}` }),
               ...options.headers,
          };

          const response = await fetch(`${API_BASE_URL}${endpoint}`, {
               ...options,
               headers,
               credentials: "include" as RequestCredentials, // For cookies (refresh tokens)
          });

          const data = await response.json();

          if (!response.ok) {
               // Handle token refresh
               if (response.status === 401 && token) {
                    const refreshed = await refreshToken();
                    if (refreshed) {
                         // Retry the original request
                         return fetchAPI(endpoint, options);
                    }
               }
               return {
                    data: null,
                    error: data.message || "An error occurred",
               };
          }

          return { data, error: null };
     } catch (error) {
          console.error("API Error:", error);
          return { data: null, error: "Network error. Please try again." };
     }
}

// Token refresh
async function refreshToken(): Promise<boolean> {
     try {
          const response = await fetch(`${API_BASE_URL}/auth/refresh-token`, {
               method: "POST",
               credentials: "include",
          });

          if (response.ok) {
               const data = await response.json();
               localStorage.setItem("accessToken", data.accessToken);
               return true;
          }
          return false;
     } catch {
          return false;
     }
}

// ==================== AUTH API ====================

export const authAPI = {
     // Login
     login: async (
          email: string,
          password: string,
          userType: "influencer" | "company"
     ): Promise<{
          data: { accessToken: string; user: any } | null;
          error: string | null;
     }> => {
          return fetchAPI<{ accessToken: string; user: any }>("/auth/login", {
               method: "POST",
               body: JSON.stringify({
                    identifier: email,
                    password,
                    usertype: userType,
               }),
               credentials: "include",
          });
     },
     // Logout
     logout: async () => {
          const result = await fetchAPI("/auth/logout", { method: "POST" });
          localStorage.removeItem("accessToken");
          return result;
     },

     // Google OAuth URLs
     getGoogleAuthUrl: (userType: "influencer" | "company") => {
          return `${API_BASE_URL}/${userType}/auth/google`;
     },

  getCurrentUser: async (token?: string) => {
     try {
          const headers: Record<string, string> = {
               "Content-Type": "application/json",
          };

          if (token) {
               headers["Authorization"] = `Bearer ${token}`;
          } else {
          }


          const response = await fetch(`${API_BASE_URL}/auth/me`, {
               credentials: "include",
               headers,
          });


          if (!response.ok) {
               const error = await response.json();
               return {
                    data: null,
                    error: error.message || "Failed to get user data",
               };
          }

          const data = await response.json();
          return { data, error: null };
     } catch (error) {
          return { data: null, error: "Network error" };
     }
},
     // Forgot Password
     forgotPassword: async (email: string) => {
          return fetchAPI("/auth/forgot-password", {
               method: "POST",
               body: JSON.stringify({ email }),
          });
     },
};

// ==================== INFLUENCER API ====================

export const influencerAPI = {
     signup: async (data: {
          username: string;
          email: string;
          password: string;
     }) => {
          return fetchAPI<{ message: string; username: string }>(
               "/influencer/auth/sign-up",
               {
                    method: "POST",
                    body: JSON.stringify(data),
               }
          );
     },

     // Verify signup code
     verifySignupCode: async (username: string, code: string) => {
          return fetchAPI(`/auth/signup/verify/influencer/${username}`, {
               method: "POST",
               body: JSON.stringify({
                    verificationCode: code,
               }),
          });
     },

     // Resend verification code
     resendVerifyCode: async (username: string) => {
          return fetchAPI(`/auth/signup/resend-verify/influencer/${username}`, {
               method: "POST",
          });
     },

     // Profile setup
     /**
      * Send influencer profile data to backend
      * Matches influencerProfileSchema exactly
      */
     setupProfile: async (profileData: {
          realName: {
               givenName: string;
               middleName?: string;
               familyName: string;
          };
          displayName: string;
          bio?: string;
          categories: string[];
          instagram?: string;
          youtube?: string;
          twitter?: string;
          facebook?: string;
          followers?: number;
          experience?: number;
          avatar?: string;
     }) => {
          // Build social links array
          const socialMediaProfileLinks = [
               profileData.instagram?.trim() && {
                    platform: "instagram",
                    link: profileData.instagram,
               },
               profileData.youtube?.trim() && {
                    platform: "youtube",
                    link: profileData.youtube,
               },
               profileData.twitter?.trim() && {
                    platform: "twitter",
                    link: profileData.twitter,
               },
               profileData.facebook?.trim() && {
                    platform: "facebook",
                    link: profileData.facebook,
               },
          ].filter((p): p is { platform: string; link: string } => !!p);

          // Build platforms array
          const platforms = [
               profileData.instagram && {
                    platform: "instagram",
                    count: profileData.followers ?? 0,
               },
               profileData.youtube && {
                    platform: "youtube",
                    count: profileData.followers ?? 0,
               },
               profileData.twitter && {
                    platform: "twitter",
                    count: profileData.followers ?? 0,
               },
               profileData.facebook && {
                    platform: "facebook",
                    count: profileData.followers ?? 0,
               },
          ].filter((p): p is { platform: string; count: number } => !!p);

          // Final backend payload
          const backendPayload = {
               realName: profileData.realName,
               displayName: profileData.displayName,
               bio: profileData.bio || "",
               socialMediaProfileLinks, // required by Zod
               experienceYears: profileData.experience ?? 0,
               previousSponsorships: [],
               contentType: profileData.categories.map((cat) => ({
                    content: cat,
               })),
               profileImage: profileData.avatar || "",
               platforms, // optional, defaults to [] in schema
          };

          return fetchAPI("/influencer/setup/profile/", {
               method: "POST",
               body: JSON.stringify(backendPayload),
          });
     },
     // Get profile
     getProfile: async (influencerId: string) => {
          return fetchAPI(`/influencer/profile/${influencerId}`);
     },

     // Update profile
     updateProfile: async (influencerId: string, profileData: any) => {
          return fetchAPI(`/influencer/profile/${influencerId}`, {
               method: "PUT",
               body: JSON.stringify(profileData),
          });
     },

     // List influencers (for companies to discover)
     listInfluencers: async (filters?: {
          category?: string;
          search?: string;
     }) => {
          const params = new URLSearchParams();
          if (filters?.category) params.append("category", filters.category);
          if (filters?.search) params.append("search", filters.search);
          return fetchAPI(`/influencer/profile/me?${params}`);
     },

     // Get influencer campaigns
     getCampaigns: async (influencerId: string) => {
          return fetchAPI(`/influencer/profile/${influencerId}/campaigns`);
     },

     // Get applications by influencer
     getApplications: async (influencerId: string) => {
          return fetchAPI(
               `/applications/influencers/${influencerId}/applications`
          );
     },
};

// ==================== COMPANY API ====================

export const companyAPI = {
     // Signup
     signup: async (data: {
          companyName: string;
          email: string;
          password: string;
     }) => {
          return fetchAPI<{
               message: string;
               companyName: string;
               slug: string;
          }>("/company/auth/sign-up", {
               method: "POST",
               body: JSON.stringify(data),
          });
     },

     // Verify signup code
     verifySignupCode: async (companyName: string, code: string) => {
          return fetchAPI(`/auth/signup/verify/company/${companyName}`, {
               method: "POST",
               body: JSON.stringify({
                    verificationCode: code,
               }),
          });
     },

     setupProfile: async (profileData: {
          email: string;
          addressType: "Online" | "Physical";
          address?: string;
          contactNumber: string;
          description?: string;
          categories: string[];
          logo?: string;
          products: string[];
          establishedYear: number;
          website?: string;
          instagram?: string;
          linkedin?: string;
          twitter?: string;
          youtube?: string;
          facebook?: string;
     }) => {
          // Build socialLinks array based on available URLs
          const socialLinks = [
               profileData.website?.trim() && {
                    platform: "website",
                    link: profileData.website,
               },
               profileData.instagram?.trim() && {
                    platform: "instagram",
                    link: profileData.instagram,
               },
               profileData.linkedin?.trim() && {
                    platform: "linkedin",
                    link: profileData.linkedin,
               },
               profileData.twitter?.trim() && {
                    platform: "twitter",
                    link: profileData.twitter,
               },
               profileData.youtube?.trim() && {
                    platform: "youtube",
                    link: profileData.youtube,
               },
               profileData.facebook?.trim() && {
                    platform: "facebook",
                    link: profileData.facebook,
               },
          ].filter((p): p is { platform: string; link: string } => !!p);

          // Build contentType array
          const contentType = profileData.categories.map((cat) => ({
               content: cat,
          }));

          // Final payload for backend
          const backendPayload = {
               email: profileData.email,
               addressType: profileData.addressType,
               ...(profileData.addressType === "Physical" && profileData.address
                    ? { address: profileData.address }
                    : {}),
               contactNumber: profileData.contactNumber,
               categories: profileData.categories,
               contentType, // { content: string } objects
               ...(profileData.logo ? { profileImage: profileData.logo } : {}),
               products: profileData.products,
               establishedYear: profileData.establishedYear,
               ...(profileData.description
                    ? { description: profileData.description }
                    : {}),
               socialLinks, // { platform, link } objects
          };

          return fetchAPI("/company/profile", {
               method: "POST",
               body: JSON.stringify(backendPayload),
          });
     },

     // Get profile
     getProfile: async (companyId: string) => {
          return fetchAPI(`/company/profile/${companyId}`);
     },

     // Update profile
     updateProfile: async (companyId: string, profileData: any) => {
          return fetchAPI(`/company/profile/update-profile/${companyId}`);
     },

     // List companies (for influencers to discover)
     listCompanies: async (filters?: {
          category?: string;
          search?: string;
     }) => {
          const params = new URLSearchParams();
          if (filters?.category) params.append("category", filters.category);
          if (filters?.search) params.append("search", filters.search);
          return fetchAPI(`/company/profile/me?${params}`);
     },
};

// ==================== CAMPAIGNS API ====================

export const campaignsAPI = {
     // List all campaigns
     list: async (filters?: {
          status?: string;
          category?: string;
          search?: string;
     }) => {
          const params = new URLSearchParams();
          if (filters?.status) params.append("status", filters.status);
          if (filters?.category) params.append("category", filters.category);
          if (filters?.search) params.append("search", filters.search);
          return fetchAPI(`/campaigns?${params}`);
     },

     // Get single campaign
     get: async (campaignId: string) => {
          return fetchAPI(`/campaigns/${campaignId}`);
     },

     // Create campaign
     create: async (campaignData: {
          title: string;
          description: string;
          budget: number;
          deadline: string;
          categories: string[];
          contentTypes: string[];
          requirements?: string;
     }) => {
          return fetchAPI("/campaigns", {
               method: "POST",
               body: JSON.stringify(campaignData),
          });
     },

     // Update campaign
     update: async (campaignId: string, campaignData: any) => {
          return fetchAPI(`/campaigns/${campaignId}`, {
               method: "PUT",
               body: JSON.stringify(campaignData),
          });
     },

     // Delete campaign
     delete: async (campaignId: string) => {
          return fetchAPI(`/campaigns/${campaignId}`, {
               method: "DELETE",
          });
     },

     // Get campaigns by company
     getByCompany: async (companyId: string) => {
          return fetchAPI(`/campaigns/companies/${companyId}/campaigns`);
     },
};

// ==================== APPLICATIONS API ====================

export const applicationsAPI = {
     // Create application
     create: async (
          campaignId: string,
          applicationData: {
               coverLetter?: string;
               proposedRate?: number;
          }
     ) => {
          return fetchAPI(
               `/applications/campaigns/${campaignId}/applications`,
               {
                    method: "POST",
                    body: JSON.stringify(applicationData),
               }
          );
     },

     // Get applications for a campaign
     getByCampaign: async (campaignId: string) => {
          return fetchAPI(`/applications/campaigns/${campaignId}/applications`);
     },

     // Get application details
     getDetails: async (applicationId: string) => {
          return fetchAPI(`/applications/applications/${applicationId}`);
     },

     // Update application status (accept/reject)
     updateStatus: async (
          applicationId: string,
          status: "accepted" | "rejected" | "pending"
     ) => {
          return fetchAPI(
               `/applications/applications/${applicationId}/status`,
               {
                    method: "PATCH",
                    body: JSON.stringify({ status }),
               }
          );
     },

     // Delete application
     delete: async (applicationId: string) => {
          return fetchAPI(`/applications/applications/${applicationId}`, {
               method: "DELETE",
          });
     },

     // Get applications by influencer
     getByInfluencer: async (influencerId: string) => {
          return fetchAPI(
               `/applications/influencers/${influencerId}/applications`
          );
     },
};

// ==================== AUTH CONTEXT HELPERS ====================

export const authHelpers = {
     setTokens: (accessToken: string) => {
          localStorage.setItem("accessToken", accessToken);
     },

     clearTokens: () => {
          localStorage.removeItem("accessToken");
     },

     getAccessToken: () => {
          return typeof window !== "undefined"
               ? localStorage.getItem("accessToken")
               : null;
     },

     isAuthenticated: () => {
          return !!authHelpers.getAccessToken();
     },
};
