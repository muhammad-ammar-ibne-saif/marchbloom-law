"use client";

import { useState, FormEvent, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Lock } from "lucide-react";
import BloomMark from "@/components/BloomMark";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    setLoading(false);

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error || "Something went wrong.");
      return;
    }

    const redirectTo = searchParams.get("from") || "/admin";
    router.replace(redirectTo);
    router.refresh();
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-bone-100 px-6">
      <div className="w-full max-w-sm rounded-xl2 border border-ink-900/10 bg-bone-50 p-8 shadow-soft">
        <div className="flex items-center gap-2.5 text-ink-900">
          <BloomMark className="h-7 w-7 text-ink-700" />
          <span className="font-display text-lg">March &amp; Bloom</span>
        </div>
        <h1 className="mt-6 font-display text-2xl text-ink-900">Admin sign in</h1>
        <p className="mt-1 text-sm text-ink-600">Lead dashboard access only.</p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label htmlFor="username" className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-ink-600">
              Username
            </label>
            <input
              id="username"
              autoComplete="username"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full rounded-lg border border-ink-900/15 bg-bone-50 px-4 py-3 text-sm text-ink-900 focus:border-brass-500 focus:outline-none"
            />
          </div>
          <div>
            <label htmlFor="password" className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-ink-600">
              Password
            </label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border border-ink-900/15 bg-bone-50 px-4 py-3 text-sm text-ink-900 focus:border-brass-500 focus:outline-none"
            />
          </div>

          {error && <p className="text-sm text-clay-500">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-full bg-ink-900 px-6 py-3 text-sm font-medium text-bone-50 transition-opacity hover:bg-ink-800 disabled:opacity-60"
          >
            <Lock size={15} />
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
}
