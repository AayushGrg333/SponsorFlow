// lib/authHelper.ts

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

  clear() {
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem(TOKEN_KEY);
    
    // ✅ Also clear cookie
    removeUserCookie();
  },
};