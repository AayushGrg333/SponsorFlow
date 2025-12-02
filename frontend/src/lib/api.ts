// API Configuration and Service Layer for SponsorFlow Backend

const API_BASE_URL = "https://sponsorflow-v1.onrender.com/api"

// Generic fetch wrapper with auth handling
async function fetchAPI<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<{ data: T | null; error: string | null }> {
  try {
    const token = typeof window !== "undefined" ? localStorage.getItem("accessToken") : null

    const headers: HeadersInit = {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
      credentials: "include", // For cookies (refresh tokens)
    })

    const data = await response.json()

    if (!response.ok) {
      // Handle token refresh
      if (response.status === 401 && token) {
        const refreshed = await refreshToken()
        if (refreshed) {
          // Retry the original request
          return fetchAPI(endpoint, options)
        }
      }
      return { data: null, error: data.message || "An error occurred" }
    }

    return { data, error: null }
  } catch (error) {
    console.error("API Error:", error)
    return { data: null, error: "Network error. Please try again." }
  }
}

// Token refresh
async function refreshToken(): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/refresh-token`, {
      method: "POST",
      credentials: "include",
    })

    if (response.ok) {
      const data = await response.json()
      localStorage.setItem("accessToken", data.accessToken)
      return true
    }
    return false
  } catch {
    return false
  }
}

// ==================== AUTH API ====================

export const authAPI = {
  // Login
  login: async (email: string, password: string, userType: "influencer" | "company") => {
    return fetchAPI<{ accessToken: string; user: any }>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password, userType }),
    })
  },

  // Logout
  logout: async () => {
    const result = await fetchAPI("/auth/logout", { method: "POST" })
    localStorage.removeItem("accessToken")
    return result
  },

  // Google OAuth URLs
  getGoogleAuthUrl: (userType: "influencer" | "company") => {
    return `${API_BASE_URL}/${userType}/auth/google`
  },

  // Forgot Password
  forgotPassword: async (email: string) => {
    return fetchAPI("/auth/forgot-password", {
      method: "POST",
      body: JSON.stringify({ email }),
    })
  },
}

// ==================== INFLUENCER API ====================

export const influencerAPI = {
  signup: async (data: { username: string; email: string; password: string }) => {
    return fetchAPI<{ message: string; username: string }>("/influencer/auth/sign-up", {
      method: "POST",
      body: JSON.stringify(data),
    })
  },


  // Verify signup code
  verifySignupCode: async (username: string, code: string) => {
    return fetchAPI(`/auth/signup/verify/influencer/${username}`, {
      method: "POST",
      body: JSON.stringify({ code }),
    })
  },

  // Resend verification code
  resendVerifyCode: async (username: string) => {
    return fetchAPI(`/auth/signup/resend-verify/influencer/${username}`, {
      method: "POST",
    })
  },

  // Profile setup
  setupProfile: async (profileData: {
    bio: string
    categories: string[]
    instagram?: string
    youtube?: string
    twitter?: string
    website?: string
    followers?: number
    experience?: number
    avatar?: string
  }) => {
    return fetchAPI("/influencer/profile", {
      method: "POST",
      body: JSON.stringify(profileData),
    })
  },

  // Get profile
  getProfile: async (influencerId: string) => {
    return fetchAPI(`/influencer/profile/${influencerId}`)
  },

  // Update profile
  updateProfile: async (influencerId: string, profileData: any) => {
    return fetchAPI(`/influencer/profile/${influencerId}`, {
      method: "PUT",
      body: JSON.stringify(profileData),
    })
  },

  // List influencers (for companies to discover)
  listInfluencers: async (filters?: { category?: string; search?: string }) => {
    const params = new URLSearchParams()
    if (filters?.category) params.append("category", filters.category)
    if (filters?.search) params.append("search", filters.search)
    return fetchAPI(`/influencer/profile/me?${params}`)
  },

  // Get influencer campaigns
  getCampaigns: async (influencerId: string) => {
    return fetchAPI(`/influencer/profile/${influencerId}/campaigns`)
  },

  // Get applications by influencer
  getApplications: async (influencerId: string) => {
    return fetchAPI(`/applications/influencers/${influencerId}/applications`)
  },
}

// ==================== COMPANY API ====================

export const companyAPI = {
  // Signup
  signup: async (data: {
    companyName: string
    email: string
    password: string
  }) => {
    return fetchAPI<{ message: string; companyName: string }>("/company/auth/sign-up", {
      method: "POST",
      body: JSON.stringify(data),
    })
  },

  // Verify signup code
  verifySignupCode: async (companyName: string, code: string) => {
    return fetchAPI(`/auth/signup/verify/company/${companyName}`, {
      method: "POST",
      body: JSON.stringify({ code }),
    })
  },

  // Resend verification code
  resendVerifyCode: async (companyName: string) => {
    return fetchAPI(`/auth/signup/resend-verify/company/${companyName}`, {
      method: "POST",
    })
  },

  // Profile setup
  setupProfile: async (profileData: {
    description: string
    categories: string[]
    website?: string
    industry?: string
    size?: string
    targetAudience?: string
    marketingBudget?: string
    logo?: string
  }) => {
    return fetchAPI("/company/profile", {
      method: "POST",
      body: JSON.stringify(profileData),
    })
  },

  // Get profile
  getProfile: async (companyId: string) => {
    return fetchAPI(`/company/profile/${companyId}`)
  },

  // Update profile
  updateProfile: async (companyId: string, profileData: any) => {
    return fetchAPI(`/company/profile/update-profile/${companyId}`)
  },

  // List companies (for influencers to discover)
  listCompanies: async (filters?: { category?: string; search?: string }) => {
    const params = new URLSearchParams()
    if (filters?.category) params.append("category", filters.category)
    if (filters?.search) params.append("search", filters.search)
    return fetchAPI(`/company/profile/me?${params}`)
  },
}

// ==================== CAMPAIGNS API ====================

export const campaignsAPI = {
  // List all campaigns
  list: async (filters?: { status?: string; category?: string; search?: string }) => {
    const params = new URLSearchParams()
    if (filters?.status) params.append("status", filters.status)
    if (filters?.category) params.append("category", filters.category)
    if (filters?.search) params.append("search", filters.search)
    return fetchAPI(`/campaigns?${params}`)
  },

  // Get single campaign
  get: async (campaignId: string) => {
    return fetchAPI(`/campaigns/${campaignId}`)
  },

  // Create campaign
  create: async (campaignData: {
    title: string
    description: string
    budget: number
    deadline: string
    categories: string[]
    contentTypes: string[]
    requirements?: string
  }) => {
    return fetchAPI("/campaigns", {
      method: "POST",
      body: JSON.stringify(campaignData),
    })
  },

  // Update campaign
  update: async (campaignId: string, campaignData: any) => {
    return fetchAPI(`/campaigns/${campaignId}`, {
      method: "PUT",
      body: JSON.stringify(campaignData),
    })
  },

  // Delete campaign
  delete: async (campaignId: string) => {
    return fetchAPI(`/campaigns/${campaignId}`, {
      method: "DELETE",
    })
  },

  // Get campaigns by company
  getByCompany: async (companyId: string) => {
    return fetchAPI(`/campaigns/companies/${companyId}/campaigns`)
  },
}

// ==================== APPLICATIONS API ====================

export const applicationsAPI = {
  // Create application
  create: async (
    campaignId: string,
    applicationData: {
      coverLetter?: string
      proposedRate?: number
    },
  ) => {
    return fetchAPI(`/applications/campaigns/${campaignId}/applications`, {
      method: "POST",
      body: JSON.stringify(applicationData),
    })
  },

  // Get applications for a campaign
  getByCampaign: async (campaignId: string) => {
    return fetchAPI(`/applications/campaigns/${campaignId}/applications`)
  },

  // Get application details
  getDetails: async (applicationId: string) => {
    return fetchAPI(`/applications/applications/${applicationId}`)
  },

  // Update application status (accept/reject)
  updateStatus: async (applicationId: string, status: "accepted" | "rejected" | "pending") => {
    return fetchAPI(`/applications/applications/${applicationId}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    })
  },

  // Delete application
  delete: async (applicationId: string) => {
    return fetchAPI(`/applications/applications/${applicationId}`, {
      method: "DELETE",
    })
  },

  // Get applications by influencer
  getByInfluencer: async (influencerId: string) => {
    return fetchAPI(`/applications/influencers/${influencerId}/applications`)
  },
}

// ==================== AUTH CONTEXT HELPERS ====================

export const authHelpers = {
  setTokens: (accessToken: string) => {
    localStorage.setItem("accessToken", accessToken)
  },

  clearTokens: () => {
    localStorage.removeItem("accessToken")
  },

  getAccessToken: () => {
    return typeof window !== "undefined" ? localStorage.getItem("accessToken") : null
  },

  isAuthenticated: () => {
    return !!authHelpers.getAccessToken()
  },
}
