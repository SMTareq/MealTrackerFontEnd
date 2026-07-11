"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { dateOnly, getErrorMessage } from "@/lib/utils";
import type { Meal } from "@/lib/types";
import { PageHeader, Banner, Spinner, EmptyState, Card } from "@/components/ui";

const today = new Date();

function formatGuestCount(meal: Meal) {
  if (!meal.isGuest) return "—";

  const rawValue = meal.guestCount;
  if (rawValue == null || Number.isNaN(Number(rawValue))) return "—";

  return Number(rawValue).toFixed(1);
}

export default function MealsHistoryPage() {
  const [meals, setMeals] = useState<Meal[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth() + 1);

  async function load() {
    setIsLoading(true);
    try {
      const { data } = await api.get<Meal[]>("/meals", { params: { year, month } });
      setMeals(data);
      setError(null);
    } catch (err) {
      setError(getErrorMessage(err, "Couldn't load meals."));
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [year, month]);

  async function handleDelete(id: number) {
    try {
      await api.delete(`/meals/${id}`);
      setMeals((prev) => prev.filter((m) => m.id !== id));
    } catch (err) {
      setError(getErrorMessage(err, "Couldn't delete that meal."));
    }
  }

  const total = meals.reduce((sum, m) => sum + Number(m.count ?? 0) + Number(m.guestCount ?? 0), 0);

  return (
    <div>
      <PageHeader
        title="Meals"
        subtitle="Every meal you've logged, by month."
        action={<MonthPicker year={year} month={month} onChange={(y, m) => { setYear(y); setMonth(m); }} />}
      />

      {error && <Banner kind="error">{error}</Banner>}

      <Card className="p-0 overflow-hidden">
        {isLoading ? (
          <Spinner />
        ) : meals.length === 0 ? (
          <EmptyState title="No meals logged this month" hint="Add one from the Overview page." />
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-ink-faint text-xs uppercase tracking-wide border-b border-border">
                <th className="px-5 py-3 font-medium">Date</th>
                <th className="px-5 py-3 font-medium">Count</th>
                <th className="px-5 py-3 font-medium">Guest</th>
                <th className="px-5 py-3 font-medium">Note</th>
                <th className="px-5 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {meals.map((meal) => (
                <tr key={meal.id} className="border-b border-border last:border-0">
                  <td className="px-5 py-3">{dateOnly(meal.date)}</td>
                  <td className="px-5 py-3 num">{meal.count.toFixed(1)}</td>
                  <td className="px-5 py-3 num text-ink-faint">
                    {formatGuestCount(meal)}
                  </td>
                  <td className="px-5 py-3 text-ink-faint">{meal.note ?? "—"}</td>
                  <td className="px-5 py-3 text-right">
                    <button onClick={() => handleDelete(meal.id)} className="btn-danger">
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td className="px-5 py-3 font-medium">Total</td>
                <td className="px-5 py-3 num font-medium">{total.toFixed(1)}</td>
                <td colSpan={3}></td>
              </tr>
            </tfoot>
          </table>
        )}
      </Card>
    </div>
  );
}

function MonthPicker({
  year,
  month,
  onChange,
}: {
  year: number;
  month: number;
  onChange: (year: number, month: number) => void;
}) {
  return (
    <input
      type="month"
      className="input w-auto"
      value={`${year}-${String(month).padStart(2, "0")}`}
      onChange={(e) => {
        const [y, m] = e.target.value.split("-").map(Number);
        onChange(y, m);
      }}
    />
  );
}
