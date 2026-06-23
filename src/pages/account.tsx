/**
 * pages/account.tsx  →  Route: /account
 * ─────────────────────────────────────────────────────────────────────────────
 * Customer account page. Two states:
 *
 * Logged-out: shows login form. Demo: demo@customer.com / password123
 *
 * Logged-in — two tabs:
 *  Profile: avatar, email, address (editable once per 14 days), order stats.
 *  Order History: all customer orders newest-first with status badges.
 */

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useAuth } from "@/context/AuthContext";
import { useOrder } from "@/context/OrderContext";
import { Mail, MapPin, LogOut, ShieldCheck, Clock, Package } from "lucide-react";
import { differenceInDays, format } from "date-fns";
import { BottomNav } from "@/components/layout/BottomNav";

type Tab = "profile" | "history";

const statusColors: Record<string, string> = {
  pending:   "bg-yellow-100 text-yellow-800",
  accepted:  "bg-blue-100 text-blue-800",
  preparing: "bg-orange-100 text-orange-800",
  ready:     "bg-purple-100 text-purple-800",
  delivered: "bg-green-100 text-green-800",
  rejected:  "bg-red-100 text-red-800",
};

export default function AccountPage() {
  const router = useRouter();
  const { currentUser, loginCustomer, logout, updateAddress } = useAuth();
  const { getCustomerOrders } = useOrder();

  const [activeTab, setActiveTab] = useState<Tab>("profile");
  const [email,    setEmail]    = useState("demo@customer.com");
  const [password, setPassword] = useState("password123");
  const [loginError, setLoginError] = useState("");

  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [newAddress, setNewAddress] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const ok = loginCustomer(email, password);
    if (!ok) setLoginError("Invalid credentials. Try demo@customer.com / password123");
  };

  const canEditAddress  = () => !currentUser?.addressLastUpdated ||
    differenceInDays(new Date(), new Date(currentUser.addressLastUpdated)) >= 14;
  const getDaysUntilEdit = () => currentUser?.addressLastUpdated
    ? Math.max(0, 14 - differenceInDays(new Date(), new Date(currentUser.addressLastUpdated))) : 0;

  const handleSaveAddress = () => { updateAddress(newAddress); setIsEditingAddress(false); };

  // ── Logged-out: show login form ────────────────────────────────────────────
  if (!currentUser) {
    return (
      <div className="flex min-h-screen flex-col bg-white px-6 py-12 mx-auto max-w-[420px]">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-orange-500 text-2xl font-black text-white shadow-lg">NB</div>
          <h1 className="text-3xl font-bold">Welcome Back</h1>
          <p className="mt-1 text-gray-400">Sign in to manage your orders</p>
        </div>
        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <div>
            <label className="text-sm font-semibold text-gray-600 mb-1 block">Email</label>
            <input type="email" value={email} onChange={e => { setEmail(e.target.value); setLoginError(""); }}
              className="w-full h-12 rounded-xl bg-gray-50 border border-gray-200 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300" required />
          </div>
          <div>
            <label className="text-sm font-semibold text-gray-600 mb-1 block">Password</label>
            <input type="password" value={password} onChange={e => { setPassword(e.target.value); setLoginError(""); }}
              className="w-full h-12 rounded-xl bg-gray-50 border border-gray-200 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300" required />
          </div>
          {loginError && <p className="text-sm text-red-500">{loginError}</p>}
          <button type="submit" className="mt-2 h-12 rounded-xl bg-orange-500 text-lg font-bold text-white">Sign In</button>
        </form>
        <div className="mt-auto pb-8 pt-10 text-center">
          <Link href="/admin" className="flex items-center justify-center gap-2 text-xs text-gray-400 hover:text-orange-500">
            <ShieldCheck className="h-4 w-4" /><span>Admin Portal Access</span>
          </Link>
        </div>
        <BottomNav />
      </div>
    );
  }

  const myOrders = getCustomerOrders(currentUser.id).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  // ── Logged-in: profile + order history tabs ────────────────────────────────
  return (
    <div className="flex min-h-screen flex-col bg-gray-50 mx-auto max-w-[420px]">
      <header className="sticky top-0 z-30 border-b bg-white px-6 py-4 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <h1 className="text-2xl font-bold">My Account</h1>
          <button onClick={logout} className="p-2 text-gray-400 hover:text-red-500"><LogOut className="h-5 w-5" /></button>
        </div>
        <div className="flex gap-1 rounded-xl bg-gray-100 p-1">
          {(["profile", "history"] as Tab[]).map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className={`flex-1 rounded-lg py-2 text-sm font-semibold capitalize transition-all ${activeTab === tab ? "bg-white shadow-sm text-gray-900" : "text-gray-400"}`}>
              {tab === "history" ? "Order History" : "Profile"}
            </button>
          ))}
        </div>
      </header>

      <div className="p-4 space-y-4 pb-28">
        {activeTab === "profile" && (
          <>
            {/* Avatar + name */}
            <div className="rounded-2xl border bg-white p-5 shadow-sm flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-orange-100 text-xl font-bold text-orange-500">
                {currentUser.name.charAt(0)}
              </div>
              <div>
                <h2 className="text-xl font-bold">{currentUser.name}</h2>
                <p className="flex items-center gap-1 text-sm text-gray-400"><Mail className="h-3.5 w-3.5" />{currentUser.email}</p>
              </div>
            </div>

            {/* Delivery address */}
            <div className="rounded-2xl border bg-white p-5 shadow-sm">
              <div className="mb-3 flex items-center justify-between">
                <h3 className="font-bold flex items-center gap-2"><MapPin className="h-5 w-5 text-orange-500" />Delivery Address</h3>
                {!isEditingAddress && canEditAddress() && (
                  <button onClick={() => { setNewAddress(currentUser.address || ""); setIsEditingAddress(true); }}
                    className="text-xs font-semibold text-orange-500 bg-orange-50 px-3 py-1 rounded-full">Edit</button>
                )}
              </div>
              {isEditingAddress ? (
                <div className="space-y-3">
                  <input value={newAddress} onChange={e => setNewAddress(e.target.value)} placeholder="Enter full address"
                    className="w-full h-12 rounded-xl bg-gray-50 border border-gray-200 px-4 text-sm focus:outline-none" autoFocus />
                  <div className="flex gap-2">
                    <button onClick={handleSaveAddress} disabled={!newAddress.trim()}
                      className="flex-1 rounded-xl bg-orange-500 py-2.5 font-bold text-white disabled:opacity-50">Save</button>
                    <button onClick={() => setIsEditingAddress(false)}
                      className="flex-1 rounded-xl border border-gray-200 py-2.5 font-bold">Cancel</button>
                  </div>
                </div>
              ) : (
                <div>
                  <p className="text-sm">{currentUser.address || <span className="italic text-gray-400">No address saved</span>}</p>
                  {!canEditAddress() && (
                    <p className="mt-2 text-xs text-orange-600 bg-orange-50 p-2 rounded-lg">
                      Address can be updated in {getDaysUntilEdit()} days.
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-2xl border bg-white p-4 text-center shadow-sm">
                <span className="block text-3xl font-black text-orange-500">{myOrders.length}</span>
                <span className="text-xs font-medium uppercase tracking-wider text-gray-400">Total Orders</span>
              </div>
              <div className="rounded-2xl border bg-white p-4 text-center shadow-sm">
                <span className="block text-3xl font-black text-orange-500">{myOrders.filter(o => o.status === "delivered").length}</span>
                <span className="text-xs font-medium uppercase tracking-wider text-gray-400">Delivered</span>
              </div>
            </div>
          </>
        )}

        {activeTab === "history" && (
          myOrders.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="mb-4 rounded-full bg-gray-100 p-6"><Package className="h-12 w-12 text-gray-300" /></div>
              <h3 className="text-lg font-bold text-gray-600">No orders yet</h3>
              <p className="mt-1 text-sm text-gray-400">Your order history will appear here</p>
              <Link href="/"><button className="mt-6 rounded-xl bg-orange-500 px-6 py-3 font-bold text-white">Browse Menu</button></Link>
            </div>
          ) : (
            <div className="space-y-3">
              {myOrders.map(order => (
                <div key={order.id} className="rounded-2xl border bg-white p-4 shadow-sm">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="font-bold text-sm">{order.id}</p>
                      <p className="text-xs text-gray-400 flex items-center gap-1">
                        <Clock className="h-3 w-3" />{format(new Date(order.date), "MMM d, yyyy · h:mm a")}
                      </p>
                    </div>
                    <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${statusColors[order.status] || "bg-gray-100 text-gray-600"}`}>
                      {order.status}
                    </span>
                  </div>
                  <div className="border-t pt-2 mt-2 space-y-0.5">
                    {order.items.map((item, i) => (
                      <p key={i} className="text-sm text-gray-400">
                        {item.name}{item.size ? ` (${item.size})` : ""} <span className="text-gray-700 font-medium">x{item.quantity}</span>
                      </p>
                    ))}
                  </div>
                  <div className="border-t pt-2 mt-2 flex justify-between">
                    <span className="text-xs text-gray-400">Total</span>
                    <span className="font-bold text-orange-500">₦{order.total.toLocaleString()}</span>
                  </div>
                </div>
              ))}
            </div>
          )
        )}
      </div>
      <BottomNav />
    </div>
  );
}
