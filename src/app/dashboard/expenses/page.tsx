"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import { currency, dateOnly, getErrorMessage } from "@/lib/utils";
import type { Expense } from "@/lib/types";
import { PageHeader, Banner, Spinner, EmptyState, Card } from "@/components/ui";

const today = new Date();

export default function ExpensesHistoryPage() {
  const { user } = useAuth();
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth() + 1);
  const isAdmin = user?.role === "Admin";

  async function load() {
    setIsLoading(true);
    try {
      const { data } = await api.get<Expense[]>("/expenses", { params: { year, month } });
      setExpenses(data);
      setError(null);
    } catch (err) {
      setError(getErrorMessage(err, "Couldn't load expenses."));
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
      await api.delete(`/expenses/${id}`);
      setExpenses((prev) => prev.filter((e) => e.id !== id));
    } catch (err) {
      setError(getErrorMessage(err, "Couldn't delete that expense."));
    }
  }

  const total = expenses.reduce((sum, e) => sum + e.amount, 0);

  return (
    <div>
      <PageHeader
        title="Expenses"
        subtitle="Every expense you've logged, by month."
        action={<MonthPicker year={year} month={month} onChange={(y, m) => { setYear(y); setMonth(m); }} />}
      />

      {error && <Banner kind="error">{error}</Banner>}

      <Card className="p-0 overflow-hidden">
        {isLoading ? (
          <Spinner />
        ) : expenses.length === 0 ? (
          <EmptyState title="No expenses logged this month" hint="Add one from the Overview page." />
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-ink-faint text-xs uppercase tracking-wide border-b border-border">
                <th className="px-5 py-3 font-medium">Date</th>
                <th className="px-5 py-3 font-medium">Counts toward</th>
                <th className="px-5 py-3 font-medium">Category</th>
                <th className="px-5 py-3 font-medium">Amount</th>
                <th className="px-5 py-3 font-medium">Note</th>
                {isAdmin && <th className="px-5 py-3"></th>}
              </tr>
            </thead>
            <tbody>
              {expenses.map((expense) => (
                <tr key={expense.id} className="border-b border-border last:border-0">
                  <td className="px-5 py-3">{dateOnly(expense.date)}</td>
                  <td className="px-5 py-3 text-ink-faint">{dateOnly(expense.countDate)}</td>
                  <td className="px-5 py-3">{expense.category}</td>
                  <td className="px-5 py-3 num text-amber">{currency(expense.amount)}</td>
                  <td className="px-5 py-3 text-ink-faint">{expense.note ?? "—"}</td>
                  {isAdmin && (
                    <td className="px-5 py-3 text-right">
                      <button onClick={() => handleDelete(expense.id)} className="btn-danger">
                        Delete
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td className="px-5 py-3 font-medium">Total</td>
                <td></td>
                <td></td>
                <td className="px-5 py-3 num font-medium text-amber">{currency(total)}</td>
                <td colSpan={isAdmin ? 2 : 1}></td>
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
