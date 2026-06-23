/**
 * orders.ts
 * ─────────────────────────────────────────────────────────────────────────────
 * Type definitions and seed data for the order system.
 *
 * OrderStatus lifecycle:
 *  pending → accepted → preparing → ready → delivered
 *                                         ↘ rejected  (admin can reject at any point)
 *
 * `initialOrders` seeds the OrderContext on first run. Once the user places a
 * real order the full list is persisted to localStorage and this seed is ignored.
 *
 * All monetary values (price, total) are in Nigerian Naira (₦).
 * Dates are ISO 8601 strings — use date-fns to format them for display.
 */

/** All possible states an order can be in during its lifecycle */
export type OrderStatus = "pending" | "accepted" | "preparing" | "ready" | "delivered" | "rejected";

export type OrderItem = {
  menuItemId: string;
  name: string;
  price: number;
  quantity: number;
  size?: "Small" | "Medium" | "Large";
};

export type Order = {
  id: string;
  customerId: string;
  customerName: string;
  items: OrderItem[];
  total: number;
  status: OrderStatus;
  date: string;          // ISO 8601
  address: string;
  phone?: string;
  instructions?: string;
  paymentMethod?: string;
};

export const initialOrders: Order[] = [
  {
    id: "ORD-001", customerId: "c1", customerName: "Adaeze Okonkwo",
    items: [
      { menuItemId: "m3", name: "Jollof Rice", price: 3000, quantity: 2 },
      { menuItemId: "m5", name: "Suya Platter", price: 2500, quantity: 1 },
    ],
    total: 9000, status: "delivered",
    date: new Date(Date.now() - 86400000 * 5).toISOString(),
    address: "14 Adeola Odeku Street, Victoria Island, Lagos",
    paymentMethod: "Pay on Delivery",
  },
  {
    id: "ORD-002", customerId: "c1", customerName: "Adaeze Okonkwo",
    items: [{ menuItemId: "m8", name: "Suya Chicken Pizza", price: 7500, quantity: 1, size: "Medium" }],
    total: 8000, status: "delivered",
    date: new Date(Date.now() - 86400000 * 2).toISOString(),
    address: "14 Adeola Odeku Street, Victoria Island, Lagos",
    paymentMethod: "Card",
  },
  {
    id: "ORD-003", customerId: "c1", customerName: "Adaeze Okonkwo",
    items: [
      { menuItemId: "m1", name: "Egusi Soup", price: 3500, quantity: 1 },
      { menuItemId: "m7", name: "Puff Puff", price: 1000, quantity: 2 },
    ],
    total: 6000, status: "preparing",
    date: new Date(Date.now() - 1800000).toISOString(),
    address: "14 Adeola Odeku Street, Victoria Island, Lagos",
    paymentMethod: "Pay on Delivery",
  },
];
