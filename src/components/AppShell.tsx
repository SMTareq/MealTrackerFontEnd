"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import type { ReactNode } from "react";

interface NavItem {
  href: string;
  label: string;
}

export function AppShell({
  children,
  navItems,
  sectionLabel,
}: {
  children: ReactNode;
  navItems: NavItem[];
  sectionLabel: string;
}) {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen flex bg-paper">
      <aside className="w-64 shrink-0 bg-ink text-paper flex flex-col justify-between">
        <div>
          <div className="px-6 py-6 border-b border-paper/10">
            <p className="font-display italic text-lg leading-none">Ledger</p>
            <p className="text-[11px] uppercase tracking-wider text-paper/50 mt-1">
              {sectionLabel}
            </p>
          </div>
          <nav className="px-3 py-4 flex flex-col gap-1">
            {navItems.map((item) => {
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-3 py-2 rounded text-sm transition-colors ${
                    active
                      ? "bg-paper/10 text-paper font-medium"
                      : "text-paper/70 hover:bg-paper/5 hover:text-paper"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="px-6 py-5 border-t border-paper/10">
          <p className="text-sm font-medium truncate">{user?.fullName}</p>
          <p className="text-xs text-paper/50 truncate mb-3">{user?.email}</p>
          <button
            onClick={() => logout()}
            className="text-xs text-paper/70 hover:text-paper underline underline-offset-2"
          >
            Sign out
          </button>
        </div>
      </aside>

      <main className="flex-1 px-8 py-8 max-w-5xl">{children}</main>
    </div>
  );
}
