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
               credentials: "include" as RequestCredentials,
          });

          const data = await response.json();

          if (!response.ok) {
               if (response.status === 401 && token) {
                    const refreshed = await refreshToken();
                    if (refreshed) {
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
          await fetch(`${API_BASE_URL}/auth/logout`, {
               method: "POST",
               credentials: "include",
          });

          localStorage.removeItem("accessToken");

          window.location.href = "/login"; 
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

     // Profile setup - CORRECTED: POST /influencer/setup/profile
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

          const backendPayload = {
               realName: profileData.realName,
               displayName: profileData.displayName,
               bio: profileData.bio || "",
               socialMediaProfileLinks,
               experienceYears: profileData.experience ?? 0,
               previousSponsorships: [],
               contentType: profileData.categories.map((cat) => ({
                    content: cat,
               })),
               profileImage: profileData.avatar || "",
               platforms,
          };

          return fetchAPI("/influencer/setup/profile", {
               method: "POST",
               body: JSON.stringify(backendPayload),
          });
     },

     // CORRECTED: GET /influencer/profile/:influencerId
     getProfile: async (influencerId: string) => {
          return fetchAPI(`/influencer/profile/${influencerId}`);
     },

     // CORRECTED: PUT /influencer/profile/:influencerId
     updateProfile: async (influencerId: string, profileData: any) => {
          return fetchAPI(`/influencer/profile/${influencerId}`, {
               method: "PUT",
               body: JSON.stringify(profileData),
          });
     },

     // CORRECTED: GET /influencer/profile/me (for current user's profile)
     listInfluencers: async () => {
          return fetchAPI(`/influencer/profile/me`);
     },

     // CORRECTED: GET /influencer/profile/:influencerId/campaigns
     getCampaigns: async (influencerId: string) => {
          return fetchAPI(`/influencer/profile/${influencerId}/campaigns`);
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

     // CORRECTED: POST /company/profile
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

          const contentType = profileData.categories.map((cat) => ({
               content: cat,
          }));

          const backendPayload = {
               email: profileData.email,
               addressType: profileData.addressType,
               ...(profileData.addressType === "Physical" && profileData.address
                    ? { address: profileData.address }
                    : {}),
               contactNumber: profileData.contactNumber,
               categories: profileData.categories,
               contentType,
               ...(profileData.logo ? { profileImage: profileData.logo } : {}),
               products: profileData.products,
               establishedYear: profileData.establishedYear,
               ...(profileData.description
                    ? { description: profileData.description }
                    : {}),
               socialLinks,
          };

          return fetchAPI("/company/profile", {
               method: "POST",
               body: JSON.stringify(backendPayload),
          });
     },

     // CORRECTED: GET /company/profile/:companyId
     getProfile: async (companyId: string) => {
          return fetchAPI(`/company/profile/${companyId}`);
     },

     // CORRECTED: GET /company/profile/update-profile/:companyId (should be PUT but keeping as per your route)
     updateProfile: async (companyId: string, profileData: any) => {
          return fetchAPI(`/company/profile/update-profile/${companyId}`, {
               method: "PUT",
               body: JSON.stringify(profileData),
          });
     },

     // CORRECTED: GET /company/profile/me
     getMyProfile: async () => {
          return fetchAPI(`/company/profile/me`);
     },
};

// ==================== CAMPAIGNS API ====================

export const campaignsAPI = {
     // CORRECTED: GET /campaigns
     list: async (filters?: {
          status?: string;
          category?: string;
          search?: string;
     }) => {
          const params = new URLSearchParams();
          if (filters?.status) params.append("status", filters.status);
          if (filters?.category) params.append("category", filters.category);
          if (filters?.search) params.append("search", filters.search);
          return fetchAPI(
               `/campaigns${params.toString() ? "?" + params.toString() : ""}`
          );
     },

     // CORRECTED: GET /campaigns/:campaignId
     get: async (campaignId: string) => {
          return fetchAPI(`/campaigns/${campaignId}`);
     },

     // CORRECTED: POST /campaigns
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

     // CORRECTED: PUT /campaigns/:campaignId
     update: async (campaignId: string, campaignData: any) => {
          return fetchAPI(`/campaigns/${campaignId}`, {
               method: "PUT",
               body: JSON.stringify(campaignData),
          });
     },

     // CORRECTED: DELETE /campaigns/:campaignId
     delete: async (campaignId: string) => {
          return fetchAPI(`/campaigns/${campaignId}`, {
               method: "DELETE",
          });
     },

     // CORRECTED: GET /campaigns/companies/:companyId/campaigns
     getByCompany: async (companyId: string) => {
          return fetchAPI(`/company/${companyId}/campaigns`);
     },
};

// ==================== APPLICATIONS API ====================

export const applicationsAPI = {
     // CORRECTED: POST /campaigns/:campaignId/applications
     create: async (
          campaignId: string,
          applicationData: {
               coverLetter?: string;
               proposedRate?: number;
          }
     ) => {
          return fetchAPI(`/campaigns/${campaignId}/applications`, {
               method: "POST",
               body: JSON.stringify(applicationData),
          });
     },

     //get applicaionts by campaingn
     getByCampaign: async (campaignId: string) => {
          return fetchAPI(`/campaigns/${campaignId}/applications`);
     },

     // CORRECTED: GET /applications/:applicationId
     getDetails: async (applicationId: string) => {
          return fetchAPI(`/applications/${applicationId}`);
     },

     // CORRECTED: PATCH /applications/:applicationId/status
     updateStatus: async (
          applicationId: string,
          status: "accepted" | "rejected" | "pending"
     ) => {
          return fetchAPI(`/applications/${applicationId}/status`, {
               method: "PATCH",
               body: JSON.stringify({ status }),
          });
     },

     // CORRECTED: DELETE /applications/:applicationId
     delete: async (applicationId: string) => {
          return fetchAPI(`/applications/${applicationId}`, {
               method: "DELETE",
          });
     },

     // CORRECTED: GET /influencers/:influencerId/applications
     getByInfluencer: async (influencerId: string) => {
          return fetchAPI(`/influencer/${influencerId}/applications`);
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
