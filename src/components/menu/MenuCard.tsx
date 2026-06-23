/**
 * MenuCard.tsx
 * ─────────────────────────────────────────────────────────────────────────────
 * Horizontal card used in the "Full Menu" list on the home page.
 *
 * • Tapping the card navigates to /item/[id].
 * • Tapping "+" adds the item directly (or opens a size picker for pizzas).
 * • Size bottom sheet uses local state — no portal needed.
 */

import { useState } from "react";
import Link from "next/link";
import { Plus, X } from "lucide-react";
import { MenuItem } from "@/data/menuItems";
import { useCart } from "@/context/CartContext";

const labelColors: Record<string, string> = {
  "Fan Favourite": "bg-orange-500 text-white",
  "Best Seller":   "bg-amber-500 text-white",
  "Chef's Pick":   "bg-emerald-600 text-white",
  "New":           "bg-sky-500 text-white",
};

export function MenuCard({ item }: { item: MenuItem; index?: number }) {
  const { addItem } = useCart();
  const [showSizeSheet, setShowSizeSheet] = useState(false);
  const [selectedSize, setSelectedSize]   = useState<"Small" | "Medium" | "Large">("Medium");
  const [isAdded, setIsAdded]             = useState(false);

  const flash = () => { setIsAdded(true); setTimeout(() => setIsAdded(false), 900); };

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault(); e.stopPropagation();
    if (item.hasSizes) { setShowSizeSheet(true); return; }
    addItem(item, 1);
    flash();
  };

  const confirmSize = () => {
    addItem(item, 1, selectedSize);
    setShowSizeSheet(false);
    flash();
  };

  const sizePrice = (size: "Small" | "Medium" | "Large") =>
    size === "Small" ? item.price : size === "Medium" ? item.price + 2000 : item.price + 4500;

  return (
    <>
      <Link href={`/item/${item.id}`}>
        <div className="group relative flex gap-3 overflow-hidden rounded-2xl bg-white border border-gray-100 p-3 shadow-sm active:scale-[0.98] cursor-pointer transition-transform">
          <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-gray-100">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={item.imageUrl} alt={item.name}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" />
            {item.label && (
              <span className={`absolute bottom-0 left-0 right-0 text-center py-0.5 text-[9px] font-bold uppercase ${labelColors[item.label]}`}>
                {item.label}
              </span>
            )}
          </div>
          <div className="flex flex-1 flex-col justify-between py-0.5">
            <div>
              <h3 className="font-bold text-sm truncate">{item.name}</h3>
              <p className="mt-0.5 text-xs text-gray-400 line-clamp-2 leading-relaxed">{item.description}</p>
            </div>
            <div className="flex items-center justify-between mt-2">
              <span className="font-bold text-orange-500">₦{item.price.toLocaleString()}</span>
              <button onClick={handleAdd}
                className={`flex h-8 w-8 items-center justify-center rounded-full shadow-sm transition-all ${isAdded ? "bg-green-500" : "bg-orange-500"} text-white`}>
                <Plus className={`h-4 w-4 transition-transform ${isAdded ? "rotate-45" : ""}`} />
              </button>
            </div>
          </div>
        </div>
      </Link>

      {/* Size selection bottom sheet (pizzas only) */}
      {showSizeSheet && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40" onClick={() => setShowSizeSheet(false)}>
          <div className="w-full max-w-[420px] rounded-t-3xl bg-white p-6" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-1">
              <h3 className="text-lg font-bold">Select Size</h3>
              <button onClick={() => setShowSizeSheet(false)} className="p-1 text-gray-400"><X className="h-5 w-5" /></button>
            </div>
            <p className="text-sm text-gray-400 mb-5">{item.name}</p>
            <div className="space-y-3">
              {(["Small", "Medium", "Large"] as const).map(size => (
                <button key={size} onClick={() => setSelectedSize(size)}
                  className={`w-full flex justify-between items-center rounded-2xl border-2 p-4 transition-all ${selectedSize === size ? "border-orange-500 bg-orange-50" : "border-gray-100"}`}>
                  <div className="text-left">
                    <p className="font-bold">{size}</p>
                    <p className="text-xs text-gray-400">{size === "Small" ? '9"' : size === "Medium" ? '12"' : '16"'}</p>
                  </div>
                  <span className="font-bold text-orange-500">₦{sizePrice(size).toLocaleString()}</span>
                </button>
              ))}
            </div>
            <button onClick={confirmSize}
              className="mt-6 w-full rounded-2xl bg-orange-500 py-4 text-lg font-bold text-white">
              Add to Cart — ₦{sizePrice(selectedSize).toLocaleString()}
            </button>
          </div>
        </div>
      )}
    </>
  );
}
