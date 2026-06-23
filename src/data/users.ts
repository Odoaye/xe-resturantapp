/**
 * users.ts
 * ─────────────────────────────────────────────────────────────────────────────
 * Hardcoded user database for the prototype. In production this would be
 * replaced by a real authentication backend (e.g. NextAuth.js, Supabase Auth).
 *
 * Demo credentials:
 *  Customer : demo@customer.com  / password123
 *  Admin    : admin@restaurant.com / admin123
 *
 * NOTE: Passwords are stored in plain text because this is a frontend-only demo.
 * NEVER do this in a real application — always hash passwords server-side.
 *
 * `addressLastUpdated` is an ISO timestamp. AuthContext uses it to enforce a
 * 14-day cooldown on address changes, visible on the Account page.
 */

/** Represents both a customer and an admin user */
export type AppUser = {
  id: string;
  name: string;
  email: string;
  password: string;                    // Plain text — demo only!
  role: "customer" | "admin";
  address?: string;                    // Saved delivery address (customers only)
  addressLastUpdated?: string | null;  // ISO timestamp of last address edit
  orderCount?: number;                 // Historical order count (display only)
};

export const users: AppUser[] = [
  {
    id: "c1",
    name: "Adaeze Okonkwo",
    email: "demo@customer.com",
    password: "password123",
    role: "customer",
    address: "14 Adeola Odeku Street, Victoria Island, Lagos",
    addressLastUpdated: null,
    orderCount: 7,
  },
  {
    id: "a1",
    name: "Admin",
    email: "admin@restaurant.com",
    password: "admin123",
    role: "admin",
  },
];
