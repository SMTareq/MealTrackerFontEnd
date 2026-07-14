"use client";

import { AuthGuard } from "@/components/AuthGuard";
import { AppShell } from "@/components/AppShell";

const navItems = [
  { href: "/admin", label: "Overview" },
  { href: "/admin/meals-expenses", label: "Meal & Expense" },
  { href: "/admin/users", label: "Users" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard requireRole="Admin">
      <AppShell navItems={navItems} sectionLabel="Admin">
        {children}
      </AppShell>
    </AuthGuard>
  );
}
