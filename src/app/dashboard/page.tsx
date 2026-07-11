"use client";

import { useEffect, useState, FormEvent } from "react";
import { api } from "@/lib/api";
import { currency, formatMonth, getErrorMessage } from "@/lib/utils";
import type { MonthlySummary } from "@/lib/types";
import { Card, PageHeader, StatBlock, Banner, Spinner } from "@/components/ui";

const today = new Date();

export default function DashboardOverviewPage() {
  const [summary, setSummary] = useState<MonthlySummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Quick-add state
  const [mealDate, setMealDate] = useState(toDateInput(today));
  const [mealCount, setMealCount] = useState("1");
  const [isGuest, setIsGuest] = useState(false);
  const [guestCount, setGuestCount] = useState("0");
  const [expenseDate, setExpenseDate] = useState(toDateInput(today));
  const [expenseCountDate, setExpenseCountDate] = useState(toDateInput(today));
  const [expenseCategory, setExpenseCategory] = useState("");
  const [expenseAmount, setExpenseAmount] = useState("");
  const [notice, setNotice] = useState<string | null>(null);
  const [isSavingMeal, setIsSavingMeal] = useState(false);
  const [isSavingExpense, setIsSavingExpense] = useState(false);

  async function loadSummary() {
    setIsLoading(true);
    try {
      const { data } = await api.get<MonthlySummary>("/reports/monthly-summary", {
        params: { year: today.getFullYear(), month: today.getMonth() + 1 },
      });
      setSummary(data);
      setError(null);
    } catch (err) {
      setError(getErrorMessage(err, "Couldn't load your summary."));
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadSummary();
  }, []);

  async function handleAddMeal(e: FormEvent) {
    e.preventDefault();
    setIsSavingMeal(true);
    setNotice(null);
    try {
      await api.post("/meals", {
        date: mealDate,
        count: Number(mealCount),
        isGuest,
        guestCount: isGuest ? Number(guestCount) : 0,
      });
      setNotice("Meal logged.");
      setMealCount("1");
      setIsGuest(false);
      setGuestCount("0");
      await loadSummary();
    } catch (err) {
      setError(getErrorMessage(err, "Couldn't save that meal."));
    } finally {
      setIsSavingMeal(false);
    }
  }

  async function handleAddExpense(e: FormEvent) {
    e.preventDefault();
    setIsSavingExpense(true);
    setNotice(null);
    try {
      await api.post("/expenses", {
        date: expenseDate,
        countDate: expenseCountDate,
        category: expenseCategory,
        amount: Number(expenseAmount),
      });
      setNotice("Expense logged.");
      setExpenseCategory("");
      setExpenseAmount("");
      await loadSummary();
    } catch (err) {
      setError(getErrorMessage(err, "Couldn't save that expense."));
    } finally {
      setIsSavingExpense(false);
    }
  }

  return (
    <div>
      <PageHeader
        title="Overview"
        subtitle={`This month · ${formatMonth(today.getFullYear(), today.getMonth() + 1)}`}
      />

      {error && <Banner kind="error">{error}</Banner>}
      {notice && <Banner kind="success">{notice}</Banner>}

      {isLoading ? (
        <Spinner />
      ) : (
        <div className="ledger-tape mb-8">
          <div className="grid grid-cols-3 gap-6 py-2">
            <StatBlock label="Meals logged" value={summary?.totalMeals.toFixed(1) ?? "0.0"} />
            <StatBlock
              label="Total spent"
              value={currency(summary?.totalExpense ?? 0)}
              tone="amber"
            />
            <StatBlock
              label="Cost per meal"
              value={currency(summary?.mealRate ?? 0)}
              tone="amber"
            />
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 gap-6">
        <Card>
          <h2 className="font-display text-lg font-semibold mb-4">Log a meal</h2>
          <form onSubmit={handleAddMeal} className="flex flex-col gap-4">
            <div>
              <label className="label" htmlFor="mealDate">Date</label>
              <input
                id="mealDate"
                type="date"
                required
                className="input"
                value={mealDate}
                onChange={(e) => setMealDate(e.target.value)}
              />
            </div>
            <div>
              <label className="label" htmlFor="mealCount">Meal count</label>
              <input
                id="mealCount"
                type="number"
                step="0.5"
                min="0"
                required
                className="input num"
                value={mealCount}
                onChange={(e) => setMealCount(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2">
              <input
                id="isGuest"
                type="checkbox"
                checked={isGuest}
                onChange={(e) => setIsGuest(e.target.checked)}
                className="h-4 w-4 rounded border-border text-pine focus:ring-pine"
              />
              <label htmlFor="isGuest" className="text-sm text-ink-soft">
                Includes a guest meal
              </label>
            </div>
            {isGuest && (
              <div>
                <label className="label" htmlFor="guestCount">Guest meal count</label>
                <input
                  id="guestCount"
                  type="number"
                  step="0.5"
                  min="0"
                  className="input num"
                  value={guestCount}
                  onChange={(e) => setGuestCount(e.target.value)}
                />
              </div>
            )}
            <button type="submit" disabled={isSavingMeal} className="btn-primary">
              {isSavingMeal ? "Saving…" : "Add meal"}
            </button>
          </form>
        </Card>

        <Card>
          <h2 className="font-display text-lg font-semibold mb-4">Log an expense</h2>
          <form onSubmit={handleAddExpense} className="flex flex-col gap-4">
            <div>
              <label className="label" htmlFor="expenseDate">Date</label>
              <input
                id="expenseDate"
                type="date"
                required
                className="input"
                value={expenseDate}
                onChange={(e) => setExpenseDate(e.target.value)}
              />
            </div>
            <div>
              <label className="label" htmlFor="expenseCountDate">Counts toward month</label>
              <input
                id="expenseCountDate"
                type="date"
                required
                className="input"
                value={expenseCountDate}
                onChange={(e) => setExpenseCountDate(e.target.value)}
              />
            </div>
            <div>
              <label className="label" htmlFor="expenseCategory">Category</label>
              <input
                id="expenseCategory"
                type="text"
                required
                className="input"
                placeholder="Groceries"
                value={expenseCategory}
                onChange={(e) => setExpenseCategory(e.target.value)}
              />
            </div>
            <div>
              <label className="label" htmlFor="expenseAmount">Amount</label>
              <input
                id="expenseAmount"
                type="number"
                step="0.01"
                min="0.01"
                required
                className="input num"
                placeholder="0.00"
                value={expenseAmount}
                onChange={(e) => setExpenseAmount(e.target.value)}
              />
            </div>
            <button type="submit" disabled={isSavingExpense} className="btn-primary">
              {isSavingExpense ? "Saving…" : "Add expense"}
            </button>
          </form>
        </Card>
      </div>
    </div>
  );
}

function toDateInput(date: Date): string {
  return date.toISOString().slice(0, 10);
}
