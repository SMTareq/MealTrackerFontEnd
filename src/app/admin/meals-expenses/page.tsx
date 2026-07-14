"use client";

import { useEffect, useMemo, useState, FormEvent } from "react";
import { api } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import { getErrorMessage } from "@/lib/utils";
import type { User } from "@/lib/types";
import { PageHeader, Banner, Spinner, Card } from "@/components/ui";

const today = new Date();

export default function AdminMealsExpensesPage() {
  const { user: authUser } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [isLoadingUsers, setIsLoadingUsers] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const [mealDate, setMealDate] = useState(toDateInput(today));
  const [mealCount, setMealCount] = useState("1");
  const [isGuest, setIsGuest] = useState(false);
  const [guestCount, setGuestCount] = useState("0");
  const [expenseDate, setExpenseDate] = useState(toDateInput(today));
  const [expenseCountDate, setExpenseCountDate] = useState(toDateInput(today));
  const [expenseCategory, setExpenseCategory] = useState("");
  const [expenseAmount, setExpenseAmount] = useState("");
  const [isSavingMeal, setIsSavingMeal] = useState(false);
  const [isSavingExpense, setIsSavingExpense] = useState(false);

  const selectedUser = useMemo(
    () => users.find((user) => user.id === selectedUserId) ?? null,
    [selectedUserId, users]
  );

  async function loadUsers() {
    setIsLoadingUsers(true);
    try {
      const { data } = await api.get<User[]>("/users");
      setUsers(data.filter((candidate) => candidate.id !== authUser?.id));
      setError(null);
    } catch (err) {
      setError(getErrorMessage(err, "Couldn't load users."));
    } finally {
      setIsLoadingUsers(false);
    }
  }

  useEffect(() => {
    loadUsers();
  }, []);

  useEffect(() => {
    if (!selectedUserId && users.length > 0) {
      setSelectedUserId(users[0].id);
    }
  }, [selectedUserId, users]);

  async function handleAddMeal(e: FormEvent) {
    e.preventDefault();
    if (!selectedUserId) return;

    setIsSavingMeal(true);
    setNotice(null);
    try {
      await api.post("/meals", {
        userId: selectedUserId,
        date: mealDate,
        count: Number(mealCount),
        isGuest,
        guestCount: isGuest ? Number(guestCount) : 0,
      });
      setNotice(`Meal logged for ${selectedUser?.fullName ?? "the selected user"}.`);
      setMealCount("1");
      setIsGuest(false);
      setGuestCount("0");
    } catch (err) {
      setError(getErrorMessage(err, "Couldn't save that meal."));
    } finally {
      setIsSavingMeal(false);
    }
  }

  async function handleAddExpense(e: FormEvent) {
    e.preventDefault();
    if (!selectedUserId) return;

    setIsSavingExpense(true);
    setNotice(null);
    try {
      await api.post("/expenses", {
        userId: selectedUserId,
        date: expenseDate,
        countDate: expenseCountDate,
        category: expenseCategory,
        amount: Number(expenseAmount),
      });
      setNotice(`Expense logged for ${selectedUser?.fullName ?? "the selected user"}.`);
      setExpenseCategory("");
      setExpenseAmount("");
    } catch (err) {
      setError(getErrorMessage(err, "Couldn't save that expense."));
    } finally {
      setIsSavingExpense(false);
    }
  }

  return (
    <div>
      <PageHeader
        title="Meal & Expense"
        subtitle="Add meals and expenses for any user from one place."
      />

      {error && <Banner kind="error">{error}</Banner>}
      {notice && <Banner kind="success">{notice}</Banner>}

      <Card className="mb-6">
        <label className="label" htmlFor="userSelect">
          Select user
        </label>
        {isLoadingUsers ? (
          <Spinner />
        ) : users.length === 0 ? (
          <p className="text-sm text-ink-soft">No users available.</p>
        ) : (
          <select
            id="userSelect"
            className="input"
            value={selectedUserId ?? ""}
            onChange={(e) => setSelectedUserId(Number(e.target.value))}
          >
            {users.map((user) => (
              <option key={user.id} value={user.id}>
                {user.fullName} ({user.email})
              </option>
            ))}
          </select>
        )}
      </Card>

      <div className="grid grid-cols-2 gap-6">
        <Card>
          <h2 className="font-display text-lg font-semibold mb-4">Add a meal</h2>
          <form onSubmit={handleAddMeal} className="flex flex-col gap-4">
            <div>
              <label className="label" htmlFor="adminMealDate">Date</label>
              <input
                id="adminMealDate"
                type="date"
                required
                className="input"
                value={mealDate}
                onChange={(e) => setMealDate(e.target.value)}
              />
            </div>
            <div>
              <label className="label" htmlFor="adminMealCount">Meal count</label>
              <input
                id="adminMealCount"
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
                id="adminIsGuest"
                type="checkbox"
                checked={isGuest}
                onChange={(e) => setIsGuest(e.target.checked)}
                className="h-4 w-4 rounded border-border text-pine focus:ring-pine"
              />
              <label htmlFor="adminIsGuest" className="text-sm text-ink-soft">
                Includes a guest meal
              </label>
            </div>
            {isGuest && (
              <div>
                <label className="label" htmlFor="adminGuestCount">Guest meal count</label>
                <input
                  id="adminGuestCount"
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
          <h2 className="font-display text-lg font-semibold mb-4">Add an expense</h2>
          <form onSubmit={handleAddExpense} className="flex flex-col gap-4">
            <div>
              <label className="label" htmlFor="adminExpenseDate">Date</label>
              <input
                id="adminExpenseDate"
                type="date"
                required
                className="input"
                value={expenseDate}
                onChange={(e) => setExpenseDate(e.target.value)}
              />
            </div>
            <div>
              <label className="label" htmlFor="adminExpenseCountDate">Counts toward month</label>
              <input
                id="adminExpenseCountDate"
                type="date"
                required
                className="input"
                value={expenseCountDate}
                onChange={(e) => setExpenseCountDate(e.target.value)}
              />
            </div>
            <div>
              <label className="label" htmlFor="adminExpenseCategory">Category</label>
              <input
                id="adminExpenseCategory"
                type="text"
                required
                className="input"
                placeholder="Groceries"
                value={expenseCategory}
                onChange={(e) => setExpenseCategory(e.target.value)}
              />
            </div>
            <div>
              <label className="label" htmlFor="adminExpenseAmount">Amount</label>
              <input
                id="adminExpenseAmount"
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
