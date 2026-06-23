'use client';

/**
 * pages/cart.tsx  →  Route: /cart
 * ─────────────────────────────────────────────────────────────────────────────
 * Shopping cart page. Shows all line-items with qty controls and totals.
 * Empty state renders a friendly illustration with a "Browse Menu" CTA.
 */

import Link from "next/link";
import { useRouter } from "next/router";
import { ChevronLeft, Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import { useCart, CartItemType } from "@/context/CartContext";

const deliveryFee = 500;

/** Compute unit price for a cart item (accounts for size uplifts) */
function getLinePrice(item: CartItemType): number {
  if (!item.menuItem.hasSizes || !item.size) return item.menuItem.price;
  if (item.size === "Medium") return item.menuItem.price + 2000;
  if (item.size === "Large")  return item.menuItem.price + 4500;
  return item.menuItem.price;
}

export default function CartPage() {
  const router = useRouter();
  const { items, removeItem, updateQuantity, total } = useCart();

  if (items.length === 0) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center p-6 text-center mx-auto max-w-[420px]">
        <div className="mb-4 rounded-full bg-orange-50 p-6"><ShoppingBag className="h-12 w-12 text-orange-300" /></div>
        <h2 className="text-xl font-bold mb-2">Your cart is empty</h2>
        <p className="text-gray-400 mb-6">Add some delicious food to get started</p>
        <Link href="/">
          <button className="rounded-2xl bg-orange-500 px-8 py-3 font-bold text-white">Browse Menu</button>
        </Link>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-white mx-auto max-w-[420px]">
      <header className="sticky top-0 z-30 border-b bg-white px-4 py-4 shadow-sm flex items-center gap-3">
        <button onClick={() => router.back()}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100">
          <ChevronLeft className="h-5 w-5" />
        </button>
        <h1 className="text-lg font-bold">My Cart</h1>
      </header>

      {/* Line-items list */}
      <div className="flex-1 p-4 space-y-3 pb-40">
        {items.map(item => (
          <div key={item.cartItemId} className="flex gap-3 rounded-2xl border bg-white p-3 shadow-sm">
            <div className="h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-gray-100">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={item.menuItem.imageUrl} alt={item.menuItem.name} className="h-full w-full object-cover" />
            </div>
            <div className="flex flex-1 flex-col justify-between">
              <div className="flex items-start justify-between gap-1">
                <div>
                  <p className="font-bold text-sm">{item.menuItem.name}</p>
                  {item.size && <p className="text-xs text-gray-400">{item.size}</p>}
                </div>
                <button onClick={() => removeItem(item.cartItemId)} className="p-1 text-gray-300 hover:text-red-400">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-bold text-orange-500">₦{(getLinePrice(item) * item.quantity).toLocaleString()}</span>
                <div className="flex items-center gap-2">
                  <button onClick={() => updateQuantity(item.cartItemId, item.quantity - 1)}
                    className="flex h-7 w-7 items-center justify-center rounded-full bg-gray-100 text-gray-600">
                    <Minus className="h-3.5 w-3.5" />
                  </button>
                  <span className="w-6 text-center text-sm font-bold">{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.cartItemId, item.quantity + 1)}
                    className="flex h-7 w-7 items-center justify-center rounded-full bg-orange-500 text-white">
                    <Plus className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Sticky order summary + checkout CTA */}
      <div className="fixed bottom-0 left-0 right-0 mx-auto w-full max-w-[420px] border-t bg-white px-4 pb-6 pt-4 shadow-lg">
        <div className="flex justify-between text-sm text-gray-500 mb-1"><span>Subtotal</span><span>₦{total.toLocaleString()}</span></div>
        <div className="flex justify-between text-sm text-gray-500 mb-3"><span>Delivery</span><span>₦{deliveryFee.toLocaleString()}</span></div>
        <div className="flex justify-between font-bold text-lg mb-4">
          <span>Total</span>
          <span className="text-orange-500">₦{(total + deliveryFee).toLocaleString()}</span>
        </div>
        <Link href="/checkout">
          <button className="w-full rounded-2xl bg-orange-500 py-4 text-lg font-bold text-white shadow-lg">
            Proceed to Checkout
          </button>
        </Link>
      </div>
    </div>
  );
}
