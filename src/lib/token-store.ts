// Simple localStorage-backed token store.
// This is a real Next.js app running in the user's own browser (not a sandboxed
// artifact), so localStorage is the right tool here for persisting sessions
// across page reloads.

const ACCESS_TOKEN_KEY = "met_access_token";
const REFRESH_TOKEN_KEY = "met_refresh_token";
const USER_KEY = "met_user";

export const tokenStore = {
  getAccessToken(): string | null {
    if (typeof window === "undefined") return null;
    return localStorage.getItem(ACCESS_TOKEN_KEY);
  },
  getRefreshToken(): string | null {
    if (typeof window === "undefined") return null;
    return localStorage.getItem(REFRESH_TOKEN_KEY);
  },
  getUser<T>(): T | null {
    if (typeof window === "undefined") return null;
    const raw = localStorage.getItem(USER_KEY);
    return raw ? (JSON.parse(raw) as T) : null;
  },
  setSession(accessToken: string, refreshToken: string, user: unknown) {
    localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
    localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  },
  setAccessToken(accessToken: string) {
    localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
  },
  clear() {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  },
};
