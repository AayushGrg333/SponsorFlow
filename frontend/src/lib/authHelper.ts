/* eslint-disable @typescript-eslint/no-explicit-any */
// eslint-disable-next-line react-hooks/exhaustive-deps
// eslint-disable-next-line @next/next/no-img-element
import { setUserCookie, removeUserCookie } from "./cookiehelper"

const USER_KEY = "sf_user";
const TOKEN_KEY = "sf_token";

export const authStorage = {
  getUser() {
    if (typeof window === "undefined") return null;
    const raw = localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  },

  setUser(user: any) {
    // Store in localStorage
    localStorage.setItem(USER_KEY, JSON.stringify(user));
    
    // ✅ Also store in cookie for middleware access
    setUserCookie(user);
  },

  updateUser(patch: Partial<any>) {
    const user = this.getUser();
    if (!user) return;
    const updated = { ...user, ...patch };
    this.setUser(updated);
  },

  // Get token from cookies (accessToken or token)
  getToken(): string | null {
    if (typeof window === "undefined") return null;
    
    // Try to get from cookies first
    const cookies = document.cookie.split(';');
    
    let tokenCookie = cookies.find(c => c.trim().startsWith('accessToken='));
    if (tokenCookie) {
      return tokenCookie.split('=')[1];
    }
    
    tokenCookie = cookies.find(c => c.trim().startsWith('token='));
    if (tokenCookie) {
      return tokenCookie.split('=')[1];
    }
    
    // Fallback to localStorage
    return localStorage.getItem(TOKEN_KEY) || localStorage.getItem('accessToken');
  },

  // Store token (optional, if you want to store in localStorage too)
  setToken(token: string) {
    if (typeof window !== "undefined") {
      localStorage.setItem(TOKEN_KEY, token);
      localStorage.setItem('accessToken', token);
    }
  },

    // Check if user is authenticated
  isAuthenticated(): boolean {
    return !!(this.getUser() && this.getToken());
  },


  clear() {
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem(TOKEN_KEY);
    
    // ✅ Also clear cookie
    removeUserCookie();

    // Clear token cookies
    if (typeof window !== "undefined") {
      document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=' + window.location.hostname;
      document.cookie = 'accessToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=' + window.location.hostname;
      document.cookie = 'refreshToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=' + window.location.hostname;
    }
  },

  
};