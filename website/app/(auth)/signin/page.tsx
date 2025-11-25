"use client";

import { useState } from "react";
import { useSignIn } from "@clerk/nextjs";

export default function SignInPage() {
  const { isLoaded, signIn, setActive } = useSignIn();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  if (!isLoaded) return null;

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");

    try {
      if (!signIn) {
        setError("Sign in is not available.");
        return;
      }
      const result = await signIn.create({
        identifier: email,
        password,
      });

      if (result.status === "complete") {
        await setActive({ session: result.createdSessionId });
      } else {
        console.log(result);
      }
    } catch (err) {
      // Clerk errors are usually objects, but for safety:
      if (typeof err === "object" && err !== null && "errors" in err) {
        const errors = (err as { errors?: { message?: string }[] }).errors;
        setError(errors?.[0]?.message || "Something went wrong.");
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Something went wrong.");
      }
    }
  }

  return (
    <div className="max-w-sm mx-auto mt-12">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          className="border rounded px-3 py-2"
          placeholder="Email"
          value={email}
          type="email"
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          className="border rounded px-3 py-2"
          placeholder="Password"
          value={password}
          type="password"
          onChange={(e) => setPassword(e.target.value)}
        />

        {error && <p className="text-red-500">{error}</p>}

        <button className="bg-black text-white py-2 rounded">Sign In</button>
      </form>
    </div>
  );
}