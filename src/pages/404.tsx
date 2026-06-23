/**
 * pages/404.tsx
 * ─────────────────────────────────────────────────────────────────────────────
 * Custom 404 page rendered by Next.js for any unrecognised route.
 */

import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-6 text-center mx-auto max-w-[420px]">
      <h1 className="text-6xl font-black text-orange-500 mb-2">404</h1>
      <p className="text-xl font-bold mb-2">Page not found</p>
      <p className="text-gray-400 mb-6">The page you&apos;re looking for doesn&apos;t exist.</p>
      <Link href="/">
        <button className="rounded-2xl bg-orange-500 px-8 py-3 font-bold text-white">Go Home</button>
      </Link>
    </div>
  );
}
