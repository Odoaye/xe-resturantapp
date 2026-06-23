/**
 * AuthContext.tsx
 * ─────────────────────────────────────────────────────────────────────────────
 * Manages authentication for both customer users and admin users.
 *
 * Two separate auth slots:
 *  • currentUser  — logged-in customer (role: "customer")
 *  • currentAdmin — logged-in admin    (role: "admin")
 *
 * Sessions are persisted to localStorage so a page refresh doesn't log you out.
 * Credentials are checked against the hardcoded `users` array in data/users.ts.
 *
 * Address update policy:
 *  An address can only be changed once every 14 days (enforced in AccountPage).
 */

import React, { createContext, useContext, useState, useEffect } from "react";
import { users, AppUser } from "@/data/users";

type AuthContextType = {
  currentUser: AppUser | null;
  currentAdmin: AppUser | null;
  loginCustomer: (email: string, password: string) => boolean;
  loginAdmin: (email: string, password: string) => boolean;
  logout: () => void;
  updateAddress: (addr: string) => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser,  setCurrentUser]  = useState<AppUser | null>(null);
  const [currentAdmin, setCurrentAdmin] = useState<AppUser | null>(null);

  useEffect(() => {
    try {
      const u = localStorage.getItem("naija_customer");
      const a = localStorage.getItem("naija_admin");
      if (u) setCurrentUser(JSON.parse(u));
      if (a) setCurrentAdmin(JSON.parse(a));
    } catch {}
  }, []);

  const loginCustomer = (email: string, password: string) => {
    const user = users.find(u => u.email === email && u.password === password && u.role === "customer");
    if (user) { setCurrentUser(user); localStorage.setItem("naija_customer", JSON.stringify(user)); return true; }
    return false;
  };

  const loginAdmin = (email: string, password: string) => {
    const admin = users.find(u => u.email === email && u.password === password && u.role === "admin");
    if (admin) { setCurrentAdmin(admin); localStorage.setItem("naija_admin", JSON.stringify(admin)); return true; }
    return false;
  };

  const logout = () => {
    setCurrentUser(null); setCurrentAdmin(null);
    localStorage.removeItem("naija_customer"); localStorage.removeItem("naija_admin");
  };

  const updateAddress = (addr: string) => {
    if (currentUser) {
      const updated = { ...currentUser, address: addr, addressLastUpdated: new Date().toISOString() };
      setCurrentUser(updated);
      localStorage.setItem("naija_customer", JSON.stringify(updated));
    }
  };

  return (
    <AuthContext.Provider value={{ currentUser, currentAdmin, loginCustomer, loginAdmin, logout, updateAddress }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
