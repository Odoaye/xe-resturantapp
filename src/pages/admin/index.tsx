'use client';

/**
 * pages/admin/index.tsx  →  Route: /admin
 * ─────────────────────────────────────────────────────────────────────────────
 * Admin login screen. Restricted access — darker UI signals staff-only area.
 * Demo credentials: admin@restaurant.com / admin123
 * On success redirects to /admin/dashboard.
 */

import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useAuth } from "@/context/AuthContext";
import { ShieldCheck } from "lucide-react";

export default function AdminLoginPage() {
  const { loginAdmin, currentAdmin } = useAuth();
  const router = useRouter();
  const [email,    setEmail]    = useState("admin@restaurant.com");
  const [password, setPassword] = useState("admin123");
  const [error,    setError]    = useState("");

  // Already logged in → go straight to dashboard
  useEffect(() => {
    if (currentAdmin) router.replace("/admin/dashboard");
  }, [currentAdmin, router]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const ok = loginAdmin(email, password);
    if (ok) router.push("/admin/dashboard");
    else setError("Invalid admin credentials. Try admin@restaurant.com / admin123");
  };

  return (
    <div className="flex min-h-screen flex-col bg-gray-50 px-6 py-12 mx-auto max-w-[420px]">
      <div className="mb-8 text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-900 shadow-lg">
          <ShieldCheck className="h-8 w-8 text-white" />
        </div>
        <h1 className="text-3xl font-bold">Admin Portal</h1>
        <p className="mt-1 text-gray-400">Restricted access only</p>
      </div>
      <form onSubmit={handleLogin} className="flex flex-col gap-4">
        <div>
          <label className="text-sm font-semibold text-gray-600 mb-1 block">Email</label>
          <input type="email" value={email} onChange={e => { setEmail(e.target.value); setError(""); }}
            className="w-full h-12 rounded-xl bg-white border border-gray-200 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300" required />
        </div>
        <div>
          <label className="text-sm font-semibold text-gray-600 mb-1 block">Password</label>
          <input type="password" value={password} onChange={e => { setPassword(e.target.value); setError(""); }}
            className="w-full h-12 rounded-xl bg-white border border-gray-200 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300" required />
        </div>
        {error && <p className="text-sm text-red-500">{error}</p>}
        <button type="submit" className="mt-2 h-12 rounded-xl bg-gray-900 text-lg font-bold text-white hover:bg-gray-800 transition-colors">
          Sign In
        </button>
      </form>
    </div>
  );
}
