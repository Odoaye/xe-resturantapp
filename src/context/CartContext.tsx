/**
 * CartContext.tsx
 * ─────────────────────────────────────────────────────────────────────────────
 * Global shopping-cart state shared across the entire app.
 *
 * Cart ID strategy:
 *  Each line-item gets a cartItemId = "<menuItemId>-<size|'default'>".
 *  This means "Suya Pizza (Medium)" and "Suya Pizza (Large)" are tracked
 *  as separate rows instead of merging into one.
 *
 * Persistence: cart is saved to localStorage so it survives page refreshes.
 */

import React, { createContext, useContext, useState, useEffect } from "react";
import { MenuItem } from "@/data/menuItems";

/** One line-item inside the user's cart */
export type CartItemType = {
  menuItem: MenuItem;
  quantity: number;
  size?: "Small" | "Medium" | "Large";
  cartItemId: string;
};

type CartContextType = {
  items: CartItemType[];
  addItem: (item: MenuItem, qty: number, size?: "Small" | "Medium" | "Large") => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, qty: number) => void;
  clearCart: () => void;
  total: number;
  itemCount: number;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

/** Compute the effective unit price accounting for size */
const getPrice = (item: MenuItem, size?: "Small" | "Medium" | "Large") => {
  if (!item.hasSizes || !size) return item.price;
  if (size === "Medium") return item.price + 2000;
  if (size === "Large")  return item.price + 4500;
  return item.price;
};

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItemType[]>([]);

  useEffect(() => {
    try {
      const s = localStorage.getItem("naija_cart");
      if (s) setItems(JSON.parse(s));
    } catch {}
  }, []);

  const save = (newItems: CartItemType[]) => {
    setItems(newItems);
    localStorage.setItem("naija_cart", JSON.stringify(newItems));
  };

  const addItem = (menuItem: MenuItem, qty: number, size?: "Small" | "Medium" | "Large") => {
    const id = `${menuItem.id}-${size || "default"}`;
    const existing = items.find(i => i.cartItemId === id);
    if (existing) {
      save(items.map(i => i.cartItemId === id ? { ...i, quantity: i.quantity + qty } : i));
    } else {
      save([...items, { menuItem, quantity: qty, size, cartItemId: id }]);
    }
  };

  const removeItem = (id: string) => save(items.filter(i => i.cartItemId !== id));

  const updateQuantity = (id: string, qty: number) => {
    if (qty <= 0) { removeItem(id); return; }
    save(items.map(i => i.cartItemId === id ? { ...i, quantity: qty } : i));
  };

  const clearCart = () => save([]);

  const total     = items.reduce((s, i) => s + getPrice(i.menuItem, i.size) * i.quantity, 0);
  const itemCount = items.reduce((s, i) => s + i.quantity, 0);

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, updateQuantity, clearCart, total, itemCount }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
};
