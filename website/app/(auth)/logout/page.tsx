"use client";

import { useState } from "react";
import { useClerk } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

export default function LogoutPage() {
  const { signOut } = useClerk();
  const router = useRouter();

  const [loading, setLoading] = useState(false);

  async function handleLogout() {
    setLoading(true);

    await signOut();

    router.push("/signin"); // redirect after logout
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted px-6">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow border">
        <h1 className="text-2xl font-semibold text-center mb-4">
          Sign Out
        </h1>

        <p className="text-center text-gray-600 mb-8">
          Are you sure you want to log out of your account?
        </p>

        <div className="flex flex-col gap-3">
          <button
            onClick={handleLogout}
            disabled={loading}
            className="w-full py-3 rounded-md bg-black text-white font-medium hover:bg-black/90 disabled:opacity-50"
          >
            {loading ? "Signing out…" : "Yes, log me out"}
          </button>

          <button
            onClick={() => router.push("/")}
            disabled={loading}
            className="w-full py-3 rounded-md border font-medium hover:bg-gray-50 disabled:opacity-50"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
