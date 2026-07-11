"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";

export default function Home() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;
    if (!user) {
      router.replace("/login");
    } else {
      router.replace(user.role === "Admin" ? "/admin" : "/dashboard");
    }
  }, [user, isLoading, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-paper">
      <p className="text-ink-faint text-sm">Loading…</p>
    </div>
  );
}
