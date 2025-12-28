"use client"

import { useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Loader2 } from "lucide-react"
import { authAPI } from "@/lib/api"
import { authStorage } from "@/lib/authHelper"

export default function OAuthCallbackPage() {
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const handleOAuthCallback = async () => {
      try {
        
        const { data, error } = await authAPI.getCurrentUser()

        if (error || !data) {
          console.error("Failed to get user data:", error)
          router.push("/login?error=oauth_failed")
          return
        }

        // Store user data in localStorage
        authStorage.setUser(data.user)

        // Redirect based on profile completion and role
        if (data.user.isProfileComplete) {
          router.push(
            data.user.role === "influencer"
              ? "/dashboard/influencer"
              : "/dashboard/company"
          )
        } else {
          router.push(`/profile/setup/${data.user.role}`)
        }
      } catch (err) {
        console.error("OAuth callback error:", err)
        router.push("/login?error=oauth_failed")
      }
    }

    handleOAuthCallback()
  }, [router, searchParams])

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <Loader2 className="mx-auto h-12 w-12 animate-spin text-primary" />
        <p className="mt-4 text-muted-foreground">Completing authentication...</p>
      </div>
    </div>
  )
}