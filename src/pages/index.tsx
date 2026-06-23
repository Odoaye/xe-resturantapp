/**
 * pages/index.tsx  →  Route: /
 * ─────────────────────────────────────────────────────────────────────────────
 * Home page — the main menu browsing experience.
 *
 * Sections:
 *  1. Hero with background food image, tagline, and live search bar.
 *  2. Horizontal category filter pills.
 *  3. "Most Loved" 2-column grid (hidden during search / category filter).
 *  4. Full menu list filtered by active category and search query.
 */

import { useState, useMemo } from "react";
import Link from "next/link";
import { Search, MapPin } from "lucide-react";
import { menuItems, categories } from "@/data/menuItems";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { MenuCard } from "@/components/menu/MenuCard";
import { BottomNav } from "@/components/layout/BottomNav";

const labelColors: Record<string, string> = {
  "Fan Favourite": "bg-orange-500 text-white",
  "Best Seller":   "bg-amber-500 text-white",
  "Chef's Pick":   "bg-emerald-600 text-white",
  "New":           "bg-sky-500 text-white",
};

export default function HomePage() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery,    setSearchQuery]    = useState("");
  const { itemCount }   = useCart();
  const { currentUser } = useAuth();

  // "Most Loved" — top 6 popular items shown above the full list
  const popularItems = useMemo(() => menuItems.filter(i => i.isPopular).slice(0, 6), []);

  // Full menu filtered by category pill + search input
  const filteredItems = useMemo(() => menuItems.filter(item => {
    const matchesCat    = activeCategory === "All" || item.category === activeCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  }), [activeCategory, searchQuery]);

  return (
    <div className="flex flex-col min-h-screen bg-white pb-24 mx-auto max-w-[420px]">

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <div className="relative overflow-hidden" style={{ minHeight: 260 }}>
        {/* Background food photo */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&q=80"
          alt="Colourful Nigerian food spread"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/80" />

        <div className="relative z-10 px-5 pt-10 pb-6">
          {/* Brand header — cart icon lives in the floating bubble below */}
          <div className="mb-6">
            <div className="flex items-center gap-1.5 mb-1">
              <MapPin className="h-3.5 w-3.5 text-orange-400" />
              <span className="text-xs text-white/70 font-medium">
                {currentUser?.address ? currentUser.address.split(",")[0] : "Lagos Island"}
              </span>
            </div>
            <h1 className="text-2xl font-black text-white">Naija Bites</h1>
          </div>

          <div>
            <p className="text-3xl font-black text-white leading-tight">Fresh. Hot.</p>
            <p className="text-3xl font-black text-orange-400 leading-tight">Always.</p>
            <p className="mt-2 text-xs text-white/60">Open 24/7 &nbsp;·&nbsp; Free delivery above ₦10,000</p>
          </div>
        </div>

        {/* Search bar overlapping the hero bottom */}
        <div className="relative z-10 px-4 pb-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search for Jollof, Suya, Pizza..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full rounded-2xl bg-white pl-11 pr-4 py-3.5 text-sm shadow-xl border border-gray-100 focus:outline-none focus:ring-2 focus:ring-orange-300"
            />
          </div>
        </div>
      </div>

      {/* ── Category pills ───────────────────────────────────────────────── */}
      <div className="sticky top-0 z-20 bg-white pt-3 pb-2 shadow-sm">
        <div className="flex gap-2 overflow-x-auto px-4 scrollbar-hide">
          {categories.map(cat => (
            <button key={cat} onClick={() => setActiveCategory(cat)}
              className={`shrink-0 rounded-full px-4 py-2 text-sm font-semibold transition-all ${activeCategory === cat ? "bg-orange-500 text-white shadow-md" : "bg-orange-50 text-gray-500"}`}>
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* ── Most Loved grid (hidden during search or filtered category) ───── */}
      {!searchQuery && activeCategory === "All" && (
        <div className="px-4 mt-5">
          <h2 className="text-lg font-black mb-3"><span className="text-orange-500">★</span> Most Loved</h2>
          <div className="grid grid-cols-2 gap-3">
            {popularItems.map(item => (
              <Link key={item.id} href={`/item/${item.id}`}>
                <div className="group relative overflow-hidden rounded-2xl bg-white border border-gray-100 shadow-sm cursor-pointer active:scale-95 transition-transform">
                  <div className="relative h-32 w-full overflow-hidden bg-gray-100">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={item.imageUrl} alt={item.name}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" />
                    {item.label && (
                      <span className={`absolute left-2 top-2 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${labelColors[item.label]}`}>
                        {item.label}
                      </span>
                    )}
                  </div>
                  <div className="p-3">
                    <h3 className="text-sm font-bold truncate">{item.name}</h3>
                    <p className="mt-0.5 text-sm font-bold text-orange-500">₦{item.price.toLocaleString()}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* ── Full menu list ───────────────────────────────────────────────── */}
      <div className="px-4 mt-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-black">
            {searchQuery ? "Results" : activeCategory === "All" ? "Full Menu" : activeCategory}
          </h2>
          {!searchQuery && activeCategory === "All" && (
            <span className="text-sm text-gray-400">{menuItems.length} items</span>
          )}
        </div>

        {filteredItems.length === 0 ? (
          <div className="flex flex-col items-center py-12 text-center">
            <Search className="h-10 w-10 text-gray-300 mb-3" />
            <p className="font-semibold text-gray-500">Nothing found</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {filteredItems.map(item => <MenuCard key={item.id} item={item} />)}
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  );
}
