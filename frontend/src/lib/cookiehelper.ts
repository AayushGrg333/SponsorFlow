// lib/cookieHelper.ts

/**
 * Set a cookie that's accessible by Next.js middleware
 */
export function setUserCookie(user: any) {
  // Set cookie for 30 days
  const maxAge = 30 * 24 * 60 * 60
  document.cookie = `sf_user=${JSON.stringify(user)}; path=/; max-age=${maxAge}; SameSite=Lax`
}

/**
 * Remove user cookie
 */
export function removeUserCookie() {
  document.cookie = 'sf_user=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT'
}

/**
 * Get user from cookie (client-side only)
 */
export function getUserFromCookie(): any | null {
  if (typeof window === 'undefined') return null
  
  const cookies = document.cookie.split(';')
  const userCookie = cookies.find(c => c.trim().startsWith('sf_user='))
  
  if (!userCookie) return null
  
  try {
    const value = userCookie.split('=')[1]
    return JSON.parse(decodeURIComponent(value))
  } catch {
    return null
  }
}