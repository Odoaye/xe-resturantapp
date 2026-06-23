'use client';

/**
 * pages/item/[id].tsx  →  Route: /item/:id
 * ─────────────────────────────────────────────────────────────────────────────
 * Full-screen detail view for a single menu item.
 * The dynamic segment `[id]` maps to the MenuItem.id field.
 *
 * Features:
 *  • Full-bleed hero image with back chevron.
 *  • Size selector for items with hasSizes=true (pizzas).
 *  • Quantity stepper (+/-) with running total.
 *  • "Add to Cart" button — flashes green then returns to home.
 */

import { useState } from "react";
import { useRouter } from "next/router";
import { ChevronLeft, Minus, Plus, Clock } from "lucide-react";
import { menuItems } from "@/data/menuItems";
import { useCart } from "@/context/CartContext";

export default function ItemDetailPage() {
  const router = useRouter();
  const id     = router.query.id as string;
  const item   = menuItems.find(m => m.id === id);

  const { addItem }                   = useCart();
  const [quantity, setQuantity]       = useState(1);
  const [selectedSize, setSelectedSize] = useState<"Small" | "Medium" | "Large">("Medium");
  const [added, setAdded]             = useState(false);

  if (!item) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Item not found</p>
      </div>
    );
  }

  const getPrice = () => {
    if (!item.hasSizes) return item.price;
    return selectedSize === "Small" ? item.price
         : selectedSize === "Medium" ? item.price + 2000
         : item.price + 4500;
  };

  const handleAddToCart = () => {
    addItem(item, quantity, item.hasSizes ? selectedSize : undefined);
    setAdded(true);
    setTimeout(() => { setAdded(false); router.push("/"); }, 800);
  };

  return (
    <div className="flex min-h-screen flex-col bg-white mx-auto max-w-[420px]">
      {/* Hero image */}
      <div className="relative h-64 w-full overflow-hidden bg-gray-100">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={item.imageUrl} alt={item.name} className="h-full w-full object-cover" />
        <button onClick={() => router.back()}
          className="absolute left-4 top-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 shadow-md">
          <ChevronLeft className="h-5 w-5" />
        </button>
      </div>

      {/* Item info */}
      <div className="flex-1 p-5 space-y-4 pb-32">
        <div>
          <h1 className="text-2xl font-black">{item.name}</h1>
          <p className="mt-1 text-sm text-gray-400 leading-relaxed">{item.description}</p>
        </div>

        <div className="flex items-center gap-4 text-sm text-gray-400">
          <span className="flex items-center gap-1"><Clock className="h-4 w-4" />{item.preparationTime} mins</span>
          {item.label && (
            <span className="rounded-full bg-orange-50 px-2 py-0.5 text-xs font-bold text-orange-500">{item.label}</span>
          )}
        </div>

        {/* Size selector — pizzas only */}
        {item.hasSizes && (
          <div>
            <p className="font-bold mb-3">Select Size</p>
            <div className="space-y-2">
              {(["Small", "Medium", "Large"] as const).map(size => {
                const price = size === "Small" ? item.price : size === "Medium" ? item.price + 2000 : item.price + 4500;
                return (
                  <button key={size} onClick={() => setSelectedSize(size)}
                    className={`w-full flex justify-between items-center rounded-2xl border-2 p-4 transition-all ${selectedSize === size ? "border-orange-500 bg-orange-50" : "border-gray-100"}`}>
                    <div className="text-left">
                      <p className="font-bold">{size}</p>
                      <p className="text-xs text-gray-400">{size === "Small" ? '9"' : size === "Medium" ? '12"' : '16"'}</p>
                    </div>
                    <span className="font-bold text-orange-500">₦{price.toLocaleString()}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Sticky bottom bar — quantity + add to cart */}
      <div className="fixed bottom-0 left-0 right-0 mx-auto w-full max-w-[420px] border-t bg-white px-5 pb-6 pt-4 shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <button onClick={() => setQuantity(q => Math.max(1, q - 1))}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-100">
              <Minus className="h-4 w-4" />
            </button>
            <span className="text-lg font-bold w-8 text-center">{quantity}</span>
            <button onClick={() => setQuantity(q => q + 1)}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-orange-500 text-white">
              <Plus className="h-4 w-4" />
            </button>
          </div>
          <span className="text-xl font-black text-orange-500">₦{(getPrice() * quantity).toLocaleString()}</span>
        </div>
        <button onClick={handleAddToCart}
          className={`w-full rounded-2xl py-4 text-lg font-bold text-white transition-all ${added ? "bg-green-500" : "bg-orange-500"}`}>
          {added ? "Added!" : "Add to Cart"}
        </button>
      </div>
    </div>
  );
}
