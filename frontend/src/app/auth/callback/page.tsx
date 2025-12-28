"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Loader2 } from "lucide-react"
import { authAPI,authHelpers } from "@/lib/api"
import { authStorage } from "@/lib/authHelper"

export default function OAuthCallbackPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const handleOAuthCallback = async () => {
      try {
        // ✅ Get token from URL
        const token = searchParams.get('token')
        
        console.log('=== OAuth Callback Debug ===')
        console.log('🔵 Full URL:', window.location.href)
        console.log('🔵 Token from URL:', token ? `${token.substring(0, 30)}...` : 'NOT FOUND')
        
        if (!token) {
          console.error("🔴 No token found in URL")
          setError("Authentication failed - no token received")
          setTimeout(() => {
            router.push("/login?error=no_token")
          }, 2000)
          return
        }

        // ✅ Store the token in localStorage
        console.log('🔵 Storing token in localStorage...')
        authHelpers.setTokens(token)

        // ✅ Fetch user data using the token
        console.log('🔵 Fetching user data with token...')
        const { data, error: apiError } = await authAPI.getCurrentUser(token)

        if (apiError || !data) {
          console.error("🔴 Failed to get user data:", apiError)
          setError(apiError || "Failed to load user data")
          
          setTimeout(() => {
            router.push("/login?error=oauth_failed")
          }, 2000)
          return
        }

        console.log('🟢 User data received:', data.user)

        // ✅ Store user data in localStorage
        authStorage.setUser(data.user)

        // ✅ Redirect based on profile completion and role
        console.log('🔵 Profile complete:', data.user.isProfileComplete)
        console.log('🔵 Role:', data.user.role)

        if (data.user.isProfileComplete) {
          const destination = data.user.role === "influencer"
            ? "/dashboard/influencer"
            : "/dashboard/company"
          console.log('🟢 Redirecting to:', destination)
          router.push(destination)
        } else {
          const destination = `/profile/setup/${data.user.role}`
          console.log('🟢 Redirecting to:', destination)
          router.push(destination)
        }
      } catch (err) {
        console.error("🔴 OAuth callback error:", err)
        setError("An unexpected error occurred")
        setTimeout(() => {
          router.push("/login?error=oauth_failed")
        }, 2000)
      }
    }

    handleOAuthCallback()
  }, [router, searchParams])

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <Loader2 className="mx-auto h-12 w-12 animate-spin text-primary" />
        <p className="mt-4 text-muted-foreground">
          {error ? error : "Completing authentication..."}
        </p>
        {error && (
          <p className="mt-2 text-xs text-muted-foreground">
            Redirecting to login page...
          </p>
        )}
      </div>
    </div>
  )
}