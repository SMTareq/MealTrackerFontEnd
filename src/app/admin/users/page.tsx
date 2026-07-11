"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { getErrorMessage } from "@/lib/utils";
import type { User } from "@/lib/types";
import { PageHeader, Banner, Spinner, EmptyState, Card } from "@/components/ui";

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  async function load() {
    setIsLoading(true);
    try {
      const { data } = await api.get<User[]>("/users");
      setUsers(data);
      setError(null);
    } catch (err) {
      setError(getErrorMessage(err, "Couldn't load users."));
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function toggleStatus(user: User) {
    setUpdatingId(user.id);
    try {
      await api.patch(`/users/${user.id}/status`, !user.isActive, {
        headers: { "Content-Type": "application/json" },
      });
      setUsers((prev) =>
        prev.map((u) => (u.id === user.id ? { ...u, isActive: !u.isActive } : u))
      );
    } catch (err) {
      setError(getErrorMessage(err, "Couldn't update that user."));
    } finally {
      setUpdatingId(null);
    }
  }

  return (
    <div>
      <PageHeader title="Users" subtitle="Everyone with access to Ledger." />

      {error && <Banner kind="error">{error}</Banner>}

      <Card className="p-0 overflow-hidden">
        {isLoading ? (
          <Spinner />
        ) : users.length === 0 ? (
          <EmptyState title="No users yet" />
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-ink-faint text-xs uppercase tracking-wide border-b border-border">
                <th className="px-5 py-3 font-medium">Name</th>
                <th className="px-5 py-3 font-medium">Email</th>
                <th className="px-5 py-3 font-medium">Phone</th>
                <th className="px-5 py-3 font-medium">Role</th>
                <th className="px-5 py-3 font-medium">Status</th>
                <th className="px-5 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="border-b border-border last:border-0">
                  <td className="px-5 py-3 font-medium">{user.fullName}</td>
                  <td className="px-5 py-3 text-ink-faint">{user.email}</td>
                  <td className="px-5 py-3 text-ink-faint">{user.phone}</td>
                  <td className="px-5 py-3">
                    <span className="text-xs px-2 py-1 rounded bg-pine-light text-pine-dark font-medium">
                      {user.role}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    <span
                      className={`text-xs px-2 py-1 rounded font-medium ${
                        user.isActive
                          ? "bg-success-light text-success"
                          : "bg-danger-light text-danger"
                      }`}
                    >
                      {user.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-right">
                    <button
                      onClick={() => toggleStatus(user)}
                      disabled={updatingId === user.id}
                      className="btn-secondary text-xs px-3 py-1.5"
                    >
                      {updatingId === user.id
                        ? "Updating…"
                        : user.isActive
                        ? "Deactivate"
                        : "Activate"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Card>
    </div>
  );
}
