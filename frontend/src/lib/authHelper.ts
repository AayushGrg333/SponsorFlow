// lib/authHelper.ts

const USER_KEY = "sf_user";
const TOKEN_KEY = "sf_token";

export const authStorage = {
  getUser() {
    if (typeof window === "undefined") return null;
    const raw = localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  },

  setUser(user: any) {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
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
  },
};
