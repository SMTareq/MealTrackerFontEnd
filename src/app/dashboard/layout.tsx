"use client";

import { AuthGuard } from "@/components/AuthGuard";
import { AppShell } from "@/components/AppShell";

const navItems = [
  { href: "/dashboard", label: "Overview" },
  { href: "/dashboard/meals", label: "Meals" },
  { href: "/dashboard/expenses", label: "Expenses" },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard requireRole="User">
      <AppShell navItems={navItems} sectionLabel="Your account">
        {children}
      </AppShell>
    </AuthGuard>
  );
}
