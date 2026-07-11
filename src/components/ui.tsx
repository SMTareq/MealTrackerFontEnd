"use client";

import { ReactNode } from "react";

export function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`card p-5 ${className}`}>{children}</div>;
}

export function PageHeader({ title, subtitle, action }: { title: string; subtitle?: string; action?: ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-4 mb-6">
      <div>
        <h1 className="font-display text-2xl font-semibold text-ink">{title}</h1>
        {subtitle && <p className="text-ink-faint text-sm mt-1">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

export function StatBlock({
  label,
  value,
  tone = "default",
}: {
  label: string;
  value: string;
  tone?: "default" | "amber" | "pine";
}) {
  const valueColor =
    tone === "amber" ? "text-amber" : tone === "pine" ? "text-pine" : "text-paper";
  return (
    <div className="flex flex-col gap-1">
      <span className="text-[11px] uppercase tracking-wider text-paper/60">{label}</span>
      <span className={`num text-2xl font-semibold ${valueColor}`}>{value}</span>
    </div>
  );
}

export function EmptyState({ title, hint }: { title: string; hint?: string }) {
  return (
    <div className="text-center py-12 px-4">
      <p className="text-ink-soft font-medium">{title}</p>
      {hint && <p className="text-ink-faint text-sm mt-1">{hint}</p>}
    </div>
  );
}

export function Banner({ kind, children }: { kind: "error" | "success"; children: ReactNode }) {
  const styles =
    kind === "error"
      ? "bg-danger-light text-danger border-danger/20"
      : "bg-success-light text-success border-success/20";
  return (
    <div className={`text-sm border rounded px-3 py-2 mb-4 ${styles}`} role="status">
      {children}
    </div>
  );
}

export function Spinner() {
  return (
    <div className="flex items-center justify-center py-12">
      <div className="h-5 w-5 border-2 border-pine border-t-transparent rounded-full animate-spin" />
    </div>
  );
}
