"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { currency, formatMonth, getErrorMessage } from "@/lib/utils";
import type { MonthlySummary } from "@/lib/types";
import { PageHeader, Banner, Spinner, EmptyState, Card, StatBlock } from "@/components/ui";

const today = new Date();

export default function AdminOverviewPage() {
  const [rows, setRows] = useState<MonthlySummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth() + 1);

  async function load() {
    setIsLoading(true);
    try {
      const { data } = await api.get<MonthlySummary[]>("/reports/monthly-summary/all", {
        params: { year, month },
      });
      setRows(data);
      setError(null);
    } catch (err) {
      setError(getErrorMessage(err, "Couldn't load the report."));
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [year, month]);

  const totalMeals = rows.reduce((sum, r) => sum + r.totalMeals, 0);
  const totalExpense = rows.reduce((sum, r) => sum + r.totalExpense, 0);
  const blendedRate = totalMeals > 0 ? totalExpense / totalMeals : 0;

  return (
    <div>
      <PageHeader
        title="Overview"
        subtitle={`All users · ${formatMonth(year, month)}`}
        action={
          <input
            type="month"
            className="input w-auto"
            value={`${year}-${String(month).padStart(2, "0")}`}
            onChange={(e) => {
              const [y, m] = e.target.value.split("-").map(Number);
              setYear(y);
              setMonth(m);
            }}
          />
        }
      />

      {error && <Banner kind="error">{error}</Banner>}

      {!isLoading && (
        <div className="ledger-tape mb-8">
          <div className="grid grid-cols-3 gap-6 py-2">
            <StatBlock label="Active users" value={String(rows.length)} />
            <StatBlock label="Total meals" value={totalMeals.toFixed(1)} />
            <StatBlock label="Total spent" value={currency(totalExpense)} tone="amber" />
          </div>
        </div>
      )}

      <Card className="p-0 overflow-hidden">
        {isLoading ? (
          <Spinner />
        ) : rows.length === 0 ? (
          <EmptyState title="No activity this month" />
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-ink-faint text-xs uppercase tracking-wide border-b border-border">
                <th className="px-5 py-3 font-medium">User</th>
                <th className="px-5 py-3 font-medium">Meals</th>
                <th className="px-5 py-3 font-medium">Expenses</th>
                <th className="px-5 py-3 font-medium">Cost / meal</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.userId} className="border-b border-border last:border-0">
                  <td className="px-5 py-3 font-medium">{row.userName}</td>
                  <td className="px-5 py-3 num">{row.totalMeals.toFixed(1)}</td>
                  <td className="px-5 py-3 num text-amber">{currency(row.totalExpense)}</td>
                  <td className="px-5 py-3 num">{currency(row.mealRate)}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td className="px-5 py-3 font-medium">Blended</td>
                <td className="px-5 py-3 num font-medium">{totalMeals.toFixed(1)}</td>
                <td className="px-5 py-3 num font-medium text-amber">{currency(totalExpense)}</td>
                <td className="px-5 py-3 num font-medium">{currency(blendedRate)}</td>
              </tr>
            </tfoot>
          </table>
        )}
      </Card>
    </div>
  );
}
