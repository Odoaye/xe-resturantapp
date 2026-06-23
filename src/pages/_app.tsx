/**
 * _app.tsx
 * ─────────────────────────────────────────────────────────────────────────────
 * Next.js custom App component. Every page is wrapped with:
 *  • AuthProvider   — logged-in user/admin state + localStorage session
 *  • OrderProvider  — all order data + status updates
 *  • CartProvider   — shopping cart state + localStorage persistence
 *
 * Provider order matters: Auth and Order have no deps, Cart has no deps either
 * so all three can sit at the same level; the nesting here is just convention.
 */

import type { AppProps } from "next/app";
import { AuthProvider } from "@/context/AuthContext";
import { OrderProvider } from "@/context/OrderContext";
import { CartProvider } from "@/context/CartContext";
import "@/styles/globals.css";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
      <OrderProvider>
        <CartProvider>
          <Component {...pageProps} />
        </CartProvider>
      </OrderProvider>
    </AuthProvider>
  );
}
