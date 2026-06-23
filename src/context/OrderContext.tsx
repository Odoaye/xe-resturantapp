/**
 * OrderContext.tsx
 * ─────────────────────────────────────────────────────────────────────────────
 * Central store for all orders placed in the app.
 *
 * Status lifecycle (enforced by the Admin Orders page):
 *  pending → accepted → preparing → ready → delivered
 *                                         ↘ rejected
 *
 * Orders are persisted to localStorage. On first load the store is seeded
 * with `initialOrders` from data/orders.ts.
 */

import React, { createContext, useContext, useState, useEffect } from "react";
import { Order, OrderStatus, initialOrders } from "@/data/orders";

type OrderContextType = {
  orders: Order[];
  addOrder: (order: Order) => void;
  updateOrderStatus: (id: string, status: OrderStatus) => void;
  getCustomerOrders: (customerId: string) => Order[];
};

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export function OrderProvider({ children }: { children: React.ReactNode }) {
  const [orders, setOrders] = useState<Order[]>(initialOrders);

  useEffect(() => {
    try {
      const s = localStorage.getItem("naija_orders");
      if (s) setOrders(JSON.parse(s));
    } catch {}
  }, []);

  const save = (o: Order[]) => {
    setOrders(o);
    localStorage.setItem("naija_orders", JSON.stringify(o));
  };

  const addOrder            = (order: Order) => save([order, ...orders]);
  const updateOrderStatus   = (id: string, status: OrderStatus) => save(orders.map(o => o.id === id ? { ...o, status } : o));
  const getCustomerOrders   = (customerId: string) => orders.filter(o => o.customerId === customerId);

  return (
    <OrderContext.Provider value={{ orders, addOrder, updateOrderStatus, getCustomerOrders }}>
      {children}
    </OrderContext.Provider>
  );
}

export const useOrder = () => {
  const ctx = useContext(OrderContext);
  if (!ctx) throw new Error("useOrder must be used within OrderProvider");
  return ctx;
};
