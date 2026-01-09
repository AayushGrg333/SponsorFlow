"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Loader2 } from "lucide-react"
import { authAPI, authHelpers } from "@/lib/api"
import { authStorage } from "@/lib/authHelper"

export default function OAuthCallbackPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const handleOAuthCallback = async () => {
      try {
        // Get token from URL
        const token = searchParams.get("token")


        if (!token) {
          setError("Authentication failed - no token received")
          setTimeout(() => {
            router.push("/login?error=no_token")
          }, 2000)
          return
        }

        // Store the token in localStorage
        authHelpers.setTokens(token)

        // Fetch user data using the token
        const { data, error: apiError } = await authAPI.getCurrentUser(token)

        if (apiError || !data) {
          setError(apiError || "Failed to load user data")
          setTimeout(() => {
            router.push("/login?error=oauth_failed")
          }, 2000)
          return
        }


        // Store user data in localStorage
        authStorage.setUser(data.user)


        if (data.user.isProfileComplete) {
          const destination =
            data.user.role === "influencer"
              ? "/dashboard/influencer"
              : "/dashboard/company"
          router.push(destination)
        } else {
          const destination = `/profile/setup/${data.user.role}`
          router.push(destination)
        }
      } catch (err) {
        setError("An unexpected error occurred")
        setTimeout(() => {
          router.push("/login?error=oauth_failed")
        }, 2000)
      }
    }

    handleOAuthCallback()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

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
