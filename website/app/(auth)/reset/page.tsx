"use client";

import { useState } from "react";
import { useSignIn } from "@clerk/nextjs";

export default function ResetPasswordPage() {
  const { isLoaded, signIn } = useSignIn();

  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [stage, setStage] = useState("request"); // request | verify
  const [error, setError] = useState("");

  if (!isLoaded) return null;

  async function requestReset(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");

    try {
      if (!signIn) {
        setError("Sign in is not available.");
        return;
      }
      await signIn.create({
        strategy: "reset_password_email_code",
        identifier: email,
      });

      setStage("verify");
    } catch (err) {
      if (typeof err === "object" && err !== null && "errors" in err) {
        const errors = (err as { errors?: { message?: string }[] }).errors;
        setError(errors?.[0]?.message || "Unable to send reset code.");
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Unable to send reset code.");
      }
    }
  }

  async function verifyReset(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");

    try {
      if (!signIn) {
        setError("Sign in is not available.");
        return;
      }
      await signIn.resetPassword({
        password,
      });

      await signIn.attemptFirstFactor({
        strategy: "reset_password_email_code",
        code,
      });

      // Redirect manually
      window.location.href = "/signin";
    } catch (err) {
      if (typeof err === "object" && err !== null && "errors" in err) {
        const errors = (err as { errors?: { message?: string }[] }).errors;
        setError(errors?.[0]?.message || "Invalid code.");
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Invalid code.");
      }
    }
  }

  return (
    <div className="max-w-sm mx-auto mt-12">
      {stage === "request" ? (
        <form onSubmit={requestReset} className="flex flex-col gap-4">
          <input
            className="border rounded px-3 py-2"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <button className="bg-black text-white py-2 rounded">
            Send Reset Code
          </button>

          {error && <p className="text-red-500">{error}</p>}
        </form>
      ) : (
        <form onSubmit={verifyReset} className="flex flex-col gap-4">
          <input
            className="border rounded px-3 py-2"
            placeholder="Verification Code"
            value={code}
            onChange={(e) => setCode(e.target.value)}
          />

          <input
            className="border rounded px-3 py-2"
            placeholder="New Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button className="bg-black text-white py-2 rounded">
            Reset Password
          </button>

          {error && <p className="text-red-500">{error}</p>}
        </form>
      )}
    </div>
  );
}
