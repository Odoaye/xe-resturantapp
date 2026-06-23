/**
 * BottomNav.tsx
 * ─────────────────────────────────────────────────────────────────────────────
 * Persistent bottom navigation bar shown on all customer-facing pages.
 *
 * Two tabs: Home (/) and Account (/account).
 * Active tab highlighted in orange via Next.js router.pathname comparison.
 *
 * Floating "View Cart" bubble:
 *  Appears above the nav when the cart has items and the user is on the home
 *  page. Links directly to /cart for quick checkout access.
 *  Sits at bottom-28 to leave a comfortable gap above the nav bar.
 */

import Link from "next/link";
import { useRouter } from "next/router";
import { Home, User, ShoppingCart } from "lucide-react";
import { useCart } from "@/context/CartContext";

export function BottomNav() {
  const router   = useRouter();
  const pathname = router.pathname;
  const { itemCount } = useCart();

  const tabs = [
    { icon: Home, label: "Home",    path: "/" },
    { icon: User, label: "Account", path: "/account" },
  ];

  return (
    <>
      {/* Floating "View Cart" pill — only visible on home page when cart has items */}
      {itemCount > 0 && pathname === "/" && (
        <div className="fixed bottom-28 left-0 right-0 z-40 mx-auto w-full max-w-[420px] px-4">
          <Link href="/cart">
            <div className="flex items-center justify-between rounded-full bg-orange-500 px-6 py-4 text-white shadow-lg cursor-pointer">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <ShoppingCart className="h-6 w-6" />
                  <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-white text-xs font-bold text-orange-500">
                    {itemCount}
                  </span>
                </div>
                <span className="font-semibold">View Cart</span>
              </div>
              <span className="text-sm">Checkout →</span>
            </div>
          </Link>
        </div>
      )}

      {/* Fixed bottom tab bar */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 mx-auto w-full max-w-[420px] border-t bg-white px-6 pt-2 shadow-lg">
        <div className="flex items-center justify-around pb-3">
          {tabs.map(({ icon: Icon, label, path }) => {
            const isActive = pathname === path;
            return (
              <Link key={path} href={path}>
                <div className={`flex flex-col items-center gap-1 p-2 min-w-[64px] ${isActive ? "text-orange-500" : "text-gray-400"}`}>
                  <Icon className={`h-6 w-6 ${isActive ? "fill-orange-100" : ""}`} />
                  <span className="text-xs font-medium">{label}</span>
                </div>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
