"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import { api } from "./api";
import { tokenStore } from "./token-store";
import type { AuthResponse, User } from "./types";

interface AuthContextValue {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (fullName: string, email: string, phone: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Hydrate from localStorage on first load.
    const storedUser = tokenStore.getUser<User>();
    const accessToken = tokenStore.getAccessToken();
    if (storedUser && accessToken) {
      setUser(storedUser);
    }
    setIsLoading(false);
  }, []);

  async function login(email: string, password: string) {
    const { data } = await api.post<AuthResponse>("/auth/login", {
      email,
      password,
    });
    tokenStore.setSession(data.accessToken, data.refreshToken, data.user);
    setUser(data.user);
    router.push(data.user.role === "Admin" ? "/admin" : "/dashboard");
  }

  async function register(fullName: string, email: string, phone: string, password: string) {
    const { data } = await api.post<AuthResponse>("/auth/register", {
      fullName,
      email,
      phone,
      password,
    });
    tokenStore.setSession(data.accessToken, data.refreshToken, data.user);
    setUser(data.user);
    router.push("/dashboard");
  }

  async function logout() {
    const refreshToken = tokenStore.getRefreshToken();
    try {
      if (refreshToken) {
        await api.post("/auth/logout", { refreshToken });
      }
    } catch {
      // Ignore network errors on logout — clear local session regardless.
    }
    tokenStore.clear();
    setUser(null);
    router.push("/login");
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
