"use client";

import { useEffect } from "react";
import { signOut } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

export default function LogoutPage() {
  const router = useRouter();

  useEffect(() => {
    async function doLogout() {
      console.log("[Logout] Attempting to sign out user...");
      try {
        await signOut();
        console.log("[Logout] Sign out successful. Redirecting to /auth/sign-in");
        router.push("/auth/sign-in");
      } catch (e) {
        console.error("[Logout] Error during sign out:", e);
        router.push("/auth/sign-in");
      }
    }
    doLogout();
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-screen w-full bg-background dark:bg-zinc-950">
      <div className="mx-auto w-full max-w-md space-y-6 bg-white dark:bg-zinc-900 dark:border-zinc-800 border border-zinc-200 rounded-xl p-8 shadow-lg text-center">
        <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-100">Logging out...</h1>
        <p className="text-muted-foreground dark:text-zinc-400">You are being signed out. Redirecting to sign in page.</p>
      </div>
    </div>
  );
}
