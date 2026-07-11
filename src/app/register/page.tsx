"use client";

import { useState, FormEvent } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { getErrorMessage } from "@/lib/utils";
import { Banner } from "@/components/ui";

export default function RegisterPage() {
  const { register } = useAuth();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    if (phone.length !== 11 || !/^\d+$/.test(phone)) {
      setError("Phone number must be 11 digits.");
      return;
    }

    setIsSubmitting(true);
    try {
      await register(fullName, email, phone, password);
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
          <p className="text-ink-faint text-sm mt-2">Create an account to start tracking.</p>
        </div>

        <div className="card p-6">
          {error && <Banner kind="error">{error}</Banner>}
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="label" htmlFor="fullName">Full name</label>
              <input
                id="fullName"
                type="text"
                required
                className="input"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Tareq Rahman"
              />
            </div>
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
              <label className="label" htmlFor="phone">Phone</label>
              <input
                id="phone"
                type="tel"
                required
                maxLength={11}
                className="input"
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
                placeholder="01XXXXXXXXX"
              />
            </div>
            <div>
              <label className="label" htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                required
                minLength={6}
                className="input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 6 characters"
              />
            </div>
            <button type="submit" disabled={isSubmitting} className="btn-primary mt-2">
              {isSubmitting ? "Creating account…" : "Create account"}
            </button>
          </form>
        </div>

        <p className="text-center text-sm text-ink-faint mt-6">
          Already have an account?{" "}
          <Link href="/login" className="text-pine font-medium hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
