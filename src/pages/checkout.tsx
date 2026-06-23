'use client';

/**
 * pages/checkout.tsx  →  Route: /checkout
 * ─────────────────────────────────────────────────────────────────────────────
 * Two-step checkout flow.
 *
 * Step 0 — Delivery & Instructions:
 *  Address, phone, optional save-address checkbox, special instructions.
 *  Validation: address + phone required.
 *
 * Step 1 — Payment & Confirm:
 *  Payment method (Pay on Delivery / Card), order summary, place order.
 *  On success: calls addOrder(), clearCart(), shows success screen.
 */

import { useState } from "react";
import { useRouter } from "next/router";
import { ChevronLeft, ChevronRight, MapPin, Phone, CreditCard, Truck, CheckCircle2, MessageSquare } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { useOrder } from "@/context/OrderContext";

type PaymentMethod = "pay-on-delivery" | "pay-with-card" | null;

export default function CheckoutPage() {
  const router = useRouter();
  const { currentUser, updateAddress } = useAuth();
  const { items, total, clearCart }    = useCart();
  const { addOrder }                   = useOrder();

  const [step, setStep]               = useState(0);
  const [address, setAddress]         = useState(currentUser?.address || "");
  const [phone, setPhone]             = useState("");
  const [saveAddress, setSaveAddress] = useState(false);
  const [instructions, setInstructions] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(null);
  const [isSuccess, setIsSuccess]     = useState(false);

  const deliveryFee = 500;
  const grandTotal  = total + deliveryFee;

  // Guard: redirect to cart if it became empty
  if (items.length === 0 && !isSuccess) { router.replace("/cart"); return null; }

  const handlePlaceOrder = () => {
    if (saveAddress && currentUser) updateAddress(address);
    const orderId = `ORD-${Math.floor(Math.random() * 10000).toString().padStart(4, "0")}`;
    addOrder({
      id: orderId,
      customerId: currentUser?.id || "guest",
      customerName: currentUser?.name || "Guest",
      items: items.map(i => ({
        menuItemId: i.menuItem.id,
        name: i.menuItem.name,
        quantity: i.quantity,
        size: i.size,
        price: i.menuItem.hasSizes
          ? (i.size === "Medium" ? i.menuItem.price + 2000
           : i.size === "Large"  ? i.menuItem.price + 4500
           : i.menuItem.price)
          : i.menuItem.price,
      })),
      total: grandTotal,
      status: "pending",
      date: new Date().toISOString(),
      address,
      phone,
      instructions,
      paymentMethod: paymentMethod === "pay-with-card" ? "Card" : "Pay on Delivery",
    });
    clearCart();
    setIsSuccess(true);
  };

  // Success screen
  if (isSuccess) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-white p-6 text-center mx-auto max-w-[420px]">
        <div className="mb-6 rounded-full bg-green-100 p-5"><CheckCircle2 className="h-16 w-16 text-green-600" /></div>
        <h1 className="mb-2 text-3xl font-bold">Order Placed!</h1>
        <p className="mb-8 text-gray-400">Your food is on its way. Track it in your account.</p>
        <button onClick={() => router.push("/account")} className="w-full rounded-2xl bg-orange-500 py-4 text-lg font-bold text-white mb-3">View Order History</button>
        <button onClick={() => router.push("/")} className="w-full rounded-2xl border border-gray-200 py-4 text-lg font-bold">Back to Home</button>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-white mx-auto max-w-[420px]">
      {/* Header with step indicator */}
      <header className="sticky top-0 z-30 border-b bg-white px-4 py-4 shadow-sm">
        <div className="flex items-center gap-3 mb-3">
          <button onClick={() => step === 0 ? router.back() : setStep(0)}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100">
            <ChevronLeft className="h-5 w-5" />
          </button>
          <div>
            <h1 className="text-lg font-bold">{step === 0 ? "Delivery & Instructions" : "Payment & Confirm"}</h1>
            <p className="text-xs text-gray-400">Step {step + 1} of 2</p>
          </div>
        </div>
        {/* Progress bar */}
        <div className="flex gap-2">
          {[0, 1].map(i => (
            <div key={i} className="h-1.5 flex-1 rounded-full transition-all"
              style={{ background: i <= step ? "#f97316" : "#f3f4f6" }} />
          ))}
        </div>
      </header>

      <div className="flex-1 p-5 space-y-5">

        {/* ── Step 0: Delivery info ─────────────────────────────────────── */}
        {step === 0 && (
          <>
            <div className="space-y-2">
              <label className="flex items-center gap-1.5 text-sm font-semibold">
                <MapPin className="h-4 w-4 text-orange-500" />Delivery Address
              </label>
              <input value={address} onChange={e => setAddress(e.target.value)}
                placeholder="e.g. 14 Adeola Odeku Street, Victoria Island"
                className="w-full h-12 rounded-xl bg-gray-50 border border-gray-200 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300" />
            </div>
            <div className="space-y-2">
              <label className="flex items-center gap-1.5 text-sm font-semibold">
                <Phone className="h-4 w-4 text-orange-500" />Phone Number
              </label>
              <input value={phone} onChange={e => setPhone(e.target.value)}
                placeholder="e.g. 08012345678" type="tel"
                className="w-full h-12 rounded-xl bg-gray-50 border border-gray-200 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300" />
            </div>
            {currentUser && (
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={saveAddress} onChange={e => setSaveAddress(e.target.checked)} className="accent-orange-500" />
                <span className="text-sm">Save address to my account</span>
              </label>
            )}
            <div className="space-y-2">
              <label className="flex items-center gap-1.5 text-sm font-semibold">
                <MessageSquare className="h-4 w-4 text-orange-500" />Special Instructions
                <span className="text-gray-400 font-normal">(optional)</span>
              </label>
              <textarea value={instructions} onChange={e => setInstructions(e.target.value)} rows={4}
                placeholder="e.g. Extra sauce, no onions, pack separately..."
                className="w-full rounded-xl bg-gray-50 border border-gray-200 px-4 py-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-orange-300" />
            </div>
          </>
        )}

        {/* ── Step 1: Payment & summary ─────────────────────────────────── */}
        {step === 1 && (
          <>
            <p className="font-semibold">Select payment method</p>
            {([
              { id: "pay-on-delivery" as PaymentMethod, icon: Truck,       title: "Pay on Delivery", desc: "Cash or bank transfer when order arrives" },
              { id: "pay-with-card"   as PaymentMethod, icon: CreditCard,  title: "Pay with Card",   desc: "Pay now with your debit or credit card" },
            ] as { id: PaymentMethod; icon: typeof Truck; title: string; desc: string }[]).map(({ id, icon: Icon, title, desc }) => (
              <button key={String(id)} onClick={() => setPaymentMethod(id)}
                className={`w-full rounded-2xl border-2 p-4 text-left transition-all ${paymentMethod === id ? "border-orange-500 bg-orange-50" : "border-gray-100 bg-white"}`}>
                <div className="flex items-center gap-4">
                  <div className={`flex h-11 w-11 items-center justify-center rounded-full ${paymentMethod === id ? "bg-orange-500 text-white" : "bg-gray-100 text-gray-400"}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="flex-1"><p className="font-bold">{title}</p><p className="text-xs text-gray-400">{desc}</p></div>
                  <div className={`flex h-5 w-5 items-center justify-center rounded-full border-2 ${paymentMethod === id ? "border-orange-500 bg-orange-500" : "border-gray-200"}`}>
                    {paymentMethod === id && <div className="h-2 w-2 rounded-full bg-white" />}
                  </div>
                </div>
              </button>
            ))}

            {/* Order summary */}
            <div className="rounded-2xl border bg-white p-4 space-y-2">
              <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">Order Summary</p>
              {items.map((item, i) => {
                const price = item.menuItem.hasSizes
                  ? (item.size === "Medium" ? item.menuItem.price + 2000 : item.size === "Large" ? item.menuItem.price + 4500 : item.menuItem.price)
                  : item.menuItem.price;
                return (
                  <div key={i} className="flex justify-between text-sm">
                    <span className="text-gray-600">{item.menuItem.name}{item.size ? ` (${item.size})` : ""} x{item.quantity}</span>
                    <span className="font-semibold">₦{(price * item.quantity).toLocaleString()}</span>
                  </div>
                );
              })}
              <div className="border-t pt-2 mt-2 space-y-1">
                <div className="flex justify-between text-sm text-gray-400"><span>Delivery</span><span>₦500</span></div>
                <div className="flex justify-between font-bold text-base"><span>Total</span><span className="text-orange-500">₦{grandTotal.toLocaleString()}</span></div>
              </div>
            </div>

            {instructions && (
              <div className="rounded-xl border bg-gray-50 p-3 text-sm">
                <span className="font-semibold">Note: </span><span className="text-gray-500">{instructions}</span>
              </div>
            )}
          </>
        )}
      </div>

      {/* Sticky CTA */}
      <div className="sticky bottom-0 border-t bg-white px-4 pb-6 pt-4 shadow-lg">
        {step === 0 ? (
          <button onClick={() => setStep(1)} disabled={!address.trim() || !phone.trim()}
            className="w-full rounded-2xl bg-orange-500 py-4 text-lg font-bold text-white disabled:opacity-50 flex items-center justify-center gap-2">
            Continue <ChevronRight className="h-5 w-5" />
          </button>
        ) : (
          <button onClick={handlePlaceOrder} disabled={!paymentMethod}
            className="w-full rounded-2xl bg-orange-500 py-4 text-lg font-bold text-white disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg">
            <CheckCircle2 className="h-5 w-5" /> Place Order
          </button>
        )}
      </div>
    </div>
  );
}
