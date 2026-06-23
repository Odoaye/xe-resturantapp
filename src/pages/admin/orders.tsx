/**
 * pages/admin/orders.tsx  →  Route: /admin/orders
 * ─────────────────────────────────────────────────────────────────────────────
 * Full order management screen. Collapsible cards per order.
 * Admin can advance status along the lifecycle or reject at any step.
 *
 * Status flow: pending → accepted → preparing → ready → delivered
 * STATUS_FLOW array drives the "next status" button logic.
 *
 * Auth guard: redirects to /admin if no admin session.
 */

import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { ChevronLeft, ChevronDown, ChevronUp } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useOrder } from "@/context/OrderContext";
import { OrderStatus } from "@/data/orders";
import { format } from "date-fns";

/** Full status progression — drives "Mark as next" button */
const STATUS_FLOW: OrderStatus[] = ["pending", "accepted", "preparing", "ready", "delivered"];

const statusColors: Record<string, string> = {
  pending:   "bg-yellow-100 text-yellow-800",
  accepted:  "bg-blue-100 text-blue-800",
  preparing: "bg-orange-100 text-orange-800",
  ready:     "bg-purple-100 text-purple-800",
  delivered: "bg-green-100 text-green-800",
  rejected:  "bg-red-100 text-red-800",
};

export default function AdminOrdersPage() {
  const { currentAdmin }       = useAuth();
  const { orders, updateOrderStatus } = useOrder();
  const router   = useRouter();
  const [expanded, setExpanded] = useState<string | null>(null);

  // Auth guard
  useEffect(() => { if (!currentAdmin) router.replace("/admin"); }, [currentAdmin, router]);
  if (!currentAdmin) return null;

  const sortedOrders = [...orders].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  /** Returns the next status in the flow, or null if already at the end */
  const getNextStatus = (current: OrderStatus): OrderStatus | null => {
    const idx = STATUS_FLOW.indexOf(current);
    return idx >= 0 && idx < STATUS_FLOW.length - 1 ? STATUS_FLOW[idx + 1] : null;
  };

  return (
    <div className="min-h-screen bg-gray-50 mx-auto max-w-[420px]">
      <header className="sticky top-0 z-30 border-b bg-white px-4 py-4 shadow-sm flex items-center gap-3">
        <Link href="/admin/dashboard">
          <button className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100">
            <ChevronLeft className="h-5 w-5" />
          </button>
        </Link>
        <div>
          <h1 className="text-lg font-bold">Order Management</h1>
          <p className="text-xs text-gray-400">{sortedOrders.length} orders</p>
        </div>
      </header>

      <div className="p-4 space-y-3 pb-8">
        {sortedOrders.map(order => (
          <div key={order.id} className="rounded-2xl border bg-white shadow-sm overflow-hidden">
            {/* Collapsed header row — always visible */}
            <button
              className="w-full p-4 text-left flex items-center justify-between"
              onClick={() => setExpanded(expanded === order.id ? null : order.id)}>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <p className="font-bold text-sm">{order.id}</p>
                  <span className={`rounded-full px-2 py-0.5 text-xs font-semibold capitalize ${statusColors[order.status]}`}>
                    {order.status}
                  </span>
                </div>
                <p className="text-xs text-gray-400">
                  {order.customerName} · {format(new Date(order.date), "MMM d, h:mm a")}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-orange-500 text-sm">₦{order.total.toLocaleString()}</span>
                {expanded === order.id
                  ? <ChevronUp className="h-4 w-4 text-gray-400" />
                  : <ChevronDown className="h-4 w-4 text-gray-400" />}
              </div>
            </button>

            {/* Expanded detail panel */}
            {expanded === order.id && (
              <div className="border-t p-4 space-y-3">
                {/* Line-items */}
                <div className="space-y-1">
                  {order.items.map((item, i) => (
                    <p key={i} className="text-sm text-gray-600">
                      {item.name}{item.size ? ` (${item.size})` : ""} x{item.quantity} — ₦{(item.price * item.quantity).toLocaleString()}
                    </p>
                  ))}
                </div>
                {order.address      && <p className="text-xs text-gray-400">📍 {order.address}</p>}
                {order.instructions && <p className="text-xs text-gray-400">📝 {order.instructions}</p>}

                {/* Status action buttons */}
                <div className="flex flex-wrap gap-2 pt-1">
                  {getNextStatus(order.status) && (
                    <button
                      onClick={() => updateOrderStatus(order.id, getNextStatus(order.status)!)}
                      className="rounded-xl bg-orange-500 px-4 py-2 text-xs font-bold text-white capitalize">
                      Mark as {getNextStatus(order.status)}
                    </button>
                  )}
                  {order.status !== "rejected" && order.status !== "delivered" && (
                    <button
                      onClick={() => updateOrderStatus(order.id, "rejected")}
                      className="rounded-xl bg-red-50 border border-red-200 px-4 py-2 text-xs font-bold text-red-600">
                      Reject
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
