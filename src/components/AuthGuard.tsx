"use client";

import { ReactNode, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { Spinner } from "./ui";
import type { Role } from "@/lib/types";

export function AuthGuard({
  children,
  requireRole,
}: {
  children: ReactNode;
  requireRole?: Role;
}) {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;
    if (!user) {
      router.replace("/login");
      return;
    }
    if (requireRole && user.role !== requireRole) {
      router.replace(user.role === "Admin" ? "/admin" : "/dashboard");
    }
  }, [user, isLoading, requireRole, router]);

  if (isLoading || !user || (requireRole && user.role !== requireRole)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-paper">
        <Spinner />
      </div>
    );
  }

  return <>{children}</>;
}
