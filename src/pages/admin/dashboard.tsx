'use client';

/**
 * pages/admin/dashboard.tsx  →  Route: /admin/dashboard
 * ─────────────────────────────────────────────────────────────────────────────
 * Admin overview dashboard with KPI cards and Recharts bar charts.
 *
 * Live data: order counts and revenue are pulled from OrderContext.
 * Static data: weekly sales and top items charts use sample/mock data.
 *   In production these would be fetched from an analytics API.
 *
 * Auth guard: redirects to /admin if no admin session is found.
 */

import { useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useOrder } from "@/context/OrderContext";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import { TrendingUp, ShoppingBag, Clock, CheckCircle, LogOut, ClipboardList } from "lucide-react";

// Sample weekly sales data (₦) — replace with real API data in production
const weeklyData = [
  { day: "Mon", sales: 45000 }, { day: "Tue", sales: 62000 }, { day: "Wed", sales: 38000 },
  { day: "Thu", sales: 71000 }, { day: "Fri", sales: 95000 }, { day: "Sat", sales: 112000 }, { day: "Sun", sales: 88000 },
];

// Top 5 most ordered items (mock) — replace with real aggregation in production
const topItems = [
  { name: "Jollof Rice",     orders: 48 }, { name: "Suya Platter",   orders: 41 },
  { name: "Pepperoni Pizza", orders: 35 }, { name: "Puff Puff",       orders: 29 },
  { name: "Egusi Soup",      orders: 24 },
];

export default function AdminDashboardPage() {
  const { currentAdmin, logout } = useAuth();
  const { orders } = useOrder();
  const router = useRouter();

  // Auth guard
  useEffect(() => { if (!currentAdmin) router.replace("/admin"); }, [currentAdmin, router]);
  if (!currentAdmin) return null;

  // Live KPIs derived from OrderContext
  const pending      = orders.filter(o => o.status === "pending").length;
  const delivered    = orders.filter(o => o.status === "delivered").length;
  const totalRevenue = orders.reduce((s, o) => s + o.total, 0);
  const avgOrder     = orders.length ? Math.round(totalRevenue / orders.length) : 0;

  const stats = [
    { label: "Total Orders", value: orders.length,                    icon: ShoppingBag, color: "bg-blue-50 text-blue-600",    full: false },
    { label: "Pending",      value: pending,                          icon: Clock,       color: "bg-yellow-50 text-yellow-600", full: false },
    { label: "Delivered",    value: delivered,                        icon: CheckCircle, color: "bg-green-50 text-green-600",   full: false },
    { label: "Avg Order",    value: `₦${avgOrder.toLocaleString()}`,  icon: TrendingUp,  color: "bg-purple-50 text-purple-600", full: false },
    { label: "Revenue",      value: `₦${totalRevenue.toLocaleString()}`, icon: TrendingUp, color: "bg-orange-50 text-orange-600", full: true },
  ];

  return (
    <div className="min-h-screen bg-gray-50 mx-auto max-w-[420px]">
      <header className="sticky top-0 z-30 border-b bg-white px-6 py-4 shadow-sm flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold">Dashboard</h1>
          <p className="text-xs text-gray-400">Welcome, Admin</p>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/admin/orders">
            <button className="flex items-center gap-2 rounded-xl bg-orange-500 px-4 py-2 text-sm font-bold text-white">
              <ClipboardList className="h-4 w-4" /> Orders
            </button>
          </Link>
          <button onClick={() => { logout(); router.push("/admin"); }} className="p-2 text-gray-400 hover:text-red-500">
            <LogOut className="h-5 w-5" />
          </button>
        </div>
      </header>

      <div className="p-4 space-y-4 pb-8">
        {/* KPI grid */}
        <div className="grid grid-cols-2 gap-3">
          {stats.map(({ label, value, icon: Icon, color, full }) => (
            <div key={label} className={`rounded-2xl border bg-white p-4 shadow-sm ${full ? "col-span-2" : ""}`}>
              <div className="flex items-center gap-3">
                <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${color}`}><Icon className="h-5 w-5" /></div>
                <div>
                  <p className="text-2xl font-black">{value}</p>
                  <p className="text-xs text-gray-400">{label}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Weekly sales bar chart */}
        <div className="rounded-2xl border bg-white p-4 shadow-sm">
          <h2 className="font-bold mb-4">Weekly Sales</h2>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={weeklyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
              <XAxis dataKey="day" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 10 }} tickFormatter={(v: number) => `₦${(v / 1000).toFixed(0)}k`} />
              <Tooltip formatter={(v: number) => `₦${v.toLocaleString()}`} />
              <Bar dataKey="sales" fill="#f97316" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Top items horizontal bar chart */}
        <div className="rounded-2xl border bg-white p-4 shadow-sm">
          <h2 className="font-bold mb-4">Top Ordered Items</h2>
          <ResponsiveContainer width="100%" height={160}>
            <BarChart data={topItems} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
              <XAxis type="number" tick={{ fontSize: 11 }} />
              <YAxis type="category" dataKey="name" tick={{ fontSize: 10 }} width={90} />
              <Tooltip />
              <Bar dataKey="orders" fill="#fb923c" radius={[0, 6, 6, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Recent orders list */}
        <div className="rounded-2xl border bg-white p-4 shadow-sm">
          <h2 className="font-bold mb-3">Recent Orders</h2>
          <div className="space-y-3">
            {orders.slice(0, 5).map(order => (
              <div key={order.id} className="flex items-center justify-between border-b pb-3 last:border-0 last:pb-0">
                <div>
                  <p className="font-semibold text-sm">{order.customerName}</p>
                  <p className="text-xs text-gray-400">{order.items.map(i => i.name).join(", ").slice(0, 40)}…</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-orange-500 text-sm">₦{order.total.toLocaleString()}</p>
                  <span className={`text-xs rounded-full px-2 py-0.5 capitalize ${
                    order.status === "delivered" ? "bg-green-100 text-green-700"
                    : order.status === "preparing" ? "bg-orange-100 text-orange-700"
                    : "bg-yellow-100 text-yellow-700"}`}>{order.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
