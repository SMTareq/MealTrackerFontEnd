"use client";

import { useState, FormEvent } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { getErrorMessage } from "@/lib/utils";
import { Banner } from "@/components/ui";

export default function LoginPage() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);
    try {
      await login(email, password);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-paper px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <p className="font-display italic text-3xl text-ink">Ledger</p>
          <p className="text-ink-faint text-sm mt-2">Sign in to log today's meals and expenses.</p>
        </div>

        <div className="card p-6">
          {error && <Banner kind="error">{error}</Banner>}
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="label" htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                required
                className="input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label className="label" htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                required
                className="input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
              />
            </div>
            <button type="submit" disabled={isSubmitting} className="btn-primary mt-2">
              {isSubmitting ? "Signing in…" : "Sign in"}
            </button>
          </form>
        </div>

        <p className="text-center text-sm text-ink-faint mt-6">
          New here?{" "}
          <Link href="/register" className="text-pine font-medium hover:underline">
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
}
