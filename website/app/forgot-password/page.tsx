"use client";

import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowRight, Lock, Mail, Key, Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";

export default function ForgotPasswordPage() {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isVisibleConfirm, setIsVisibleConfirm] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  // Send OTP to email using authClient
  const handleSendEmail = async () => {
    console.log(`[Forgot Password] Sending OTP to email: ${email}`);
    setLoading(true);
    setError("");
    try {
      const { error } = await authClient.forgetPassword.emailOtp({ email });
      if (!error) {
        console.log(`[Forgot Password] OTP sent successfully to ${email}`);
      } else {
        console.log(`[Forgot Password] Failed to send OTP to ${email}: ${error.message}`);
      }
      if (error) {
        setError(error.message || "Failed to send OTP. Try again.");
        setLoading(false);
        console.error(`[Forgot Password] Error sending OTP to ${email}:`, error);
        return;
      }
      setStep(2);
      console.log("[Forgot Password] Proceeding to OTP entry step.");
    } catch (e: unknown) {
      console.error("[Forgot Password] Exception while sending OTP:", e);
      if (e && typeof e === "object" && "message" in e && typeof (e as { message?: string }).message === "string") {
        setError((e as { message?: string }).message || "Failed to send OTP. Try again.");
      } else {
        setError("Failed to send OTP. Try again.");
      }
    } finally {
      setLoading(false);
      console.log("[Forgot Password] Send OTP flow finished.");
    }
  };

  // Verify OTP using Better Auth
  const handleVerifyOtp = async () => {
    console.log(`[Forgot Password] Verifying OTP for email: ${email}, OTP: ${otp}`);
    setLoading(true);
    setError("");
    try {
      const { error } = await authClient.emailOtp.checkVerificationOtp({
        email,
        type: "forget-password",
        otp,
      });
      if (!error) {
        console.log(`[Forgot Password] OTP verified for ${email}`);
      } else {
        console.log(`[Forgot Password] OTP verification failed for ${email}: ${error.message}`);
      }
      if (error) {
        setError(error.message || "Invalid OTP. Please try again.");
        setLoading(false);
        console.error(`[Forgot Password] Error verifying OTP for ${email}:`, error);
        return;
      }
      setStep(3);
      console.log("[Forgot Password] Proceeding to new password entry step.");
    } catch (e: unknown) {
      console.error("[Forgot Password] Exception while verifying OTP:", e);
      if (e && typeof e === "object" && "message" in e && typeof (e as { message?: string }).message === "string") {
        setError((e as { message?: string }).message || "Invalid OTP. Please try again.");
      } else {
        setError("Invalid OTP. Please try again.");
      }
    } finally {
      setLoading(false);
      console.log("[Forgot Password] OTP verification flow finished.");
    }
  };

  // Reset password using Better Auth
  const handleResetPassword = async () => {
    console.log(`[Forgot Password] Attempting password reset for email: ${email}`);
    setLoading(true);
    setError("");
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      setLoading(false);
      console.warn("[Forgot Password] Passwords do not match.");
      return;
    }
    try {
      const { error } = await authClient.emailOtp.resetPassword({
        email,
        otp,
        password: newPassword,
      });
      if (!error) {
        console.log(`[Forgot Password] Password reset successful for ${email}`);
      } else {
        console.log(`[Forgot Password] Password reset failed for ${email}: ${error.message}`);
      }
      if (error) {
        setError(error.message || "Failed to reset password. Try again.");
        setLoading(false);
        console.error(`[Forgot Password] Error resetting password for ${email}:`, error);
        return;
      }
      setStep(4);
      console.log("[Forgot Password] Password reset complete. Prompting user to sign in.");
    } catch (e: unknown) {
      console.error("[Forgot Password] Exception while resetting password:", e);
      if (e && typeof e === "object" && "message" in e && typeof (e as { message?: string }).message === "string") {
        setError((e as { message?: string }).message || "Failed to reset password. Try again.");
      } else {
        setError("Failed to reset password. Try again.");
      }
    } finally {
      setLoading(false);
      console.log("[Forgot Password] Password reset flow finished.");
    }
  };

  const toggleVisibility = () => setIsVisible((prev) => !prev);
  const toggleVisibilityConfirm = () => setIsVisibleConfirm((prev) => !prev);

  return (
    <div className="flex items-center justify-center min-h-screen w-full bg-background dark:bg-zinc-950 py-12">
      <div className="mx-auto w-full max-w-md space-y-6 bg-white dark:bg-zinc-900 dark:border-zinc-800 border border-zinc-200 rounded-xl p-8 shadow-lg">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-semibold text-zinc-900 dark:text-zinc-100">
            Forgot Password
          </h1>
          <p className="text-muted-foreground dark:text-zinc-400">
            {step === 1 && "Enter your email to receive a reset code."}
            {step === 2 && "Enter the OTP sent to your email."}
            {step === 3 && "Set your new password."}
            {step === 4 && "Password reset! Please sign in with your new password."}
          </p>
        </div>
        <div className="space-y-6">
          {error && <div className="text-red-500 text-sm text-center">{error}</div>}
          {step === 1 && (
            <form
              onSubmit={e => {
                e.preventDefault();
                handleSendEmail();
              }}
              className="space-y-6"
            >
              <div>
                <Label htmlFor="email" className="dark:text-zinc-200">Email</Label>
                <div className="relative mt-2.5">
                  <Input
                    id="email"
                    className="peer ps-9"
                    placeholder="example@example.com"
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                  />
                  <div className="text-muted-foreground/80 dark:text-zinc-400 pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 peer-disabled:opacity-50">
                    <Mail size={16} aria-hidden="true" />
                  </div>
                </div>
              </div>
              <Button className="w-full" type="submit" disabled={loading}>
                {loading ? <ArrowRight className="h-4 w-4 animate-spin" /> : <>Send OTP <ArrowRight className="h-4 w-4" /></>}
              </Button>
            </form>
          )}
          {step === 2 && (
            <form
              onSubmit={e => {
                e.preventDefault();
                handleVerifyOtp();
              }}
              className="space-y-6"
            >
              <div>
                <Label htmlFor="otp" className="dark:text-zinc-200">OTP</Label>
                <div className="relative mt-2.5">
                  <Input
                    id="otp"
                    className="peer ps-9"
                    placeholder="Enter 6-digit code"
                    type="text"
                    value={otp}
                    onChange={e => setOtp(e.target.value)}
                    required
                    maxLength={6}
                  />
                  <div className="text-muted-foreground/80 dark:text-zinc-400 pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 peer-disabled:opacity-50">
                    <Key size={16} aria-hidden="true" />
                  </div>
                </div>
              </div>
              <Button className="w-full" type="submit" disabled={loading}>
                {loading ? <ArrowRight className="h-4 w-4 animate-spin" /> : <>Verify OTP <ArrowRight className="h-4 w-4" /></>}
              </Button>
            </form>
          )}
          {step === 3 && (
            <form
              onSubmit={e => {
                e.preventDefault();
                handleResetPassword();
              }}
              className="space-y-6"
            >
              <div>
                <Label htmlFor="new-password" className="dark:text-zinc-200">New Password</Label>
                <div className="relative mt-2.5">
                  <Input
                    id="new-password"
                    className="ps-9 pe-9"
                    placeholder="Enter new password"
                    type={isVisible ? "text" : "password"}
                    value={newPassword}
                    onChange={e => setNewPassword(e.target.value)}
                    autoComplete="new-password"
                    required
                  />
                  <div className="text-muted-foreground/80 dark:text-zinc-400 pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 peer-disabled:opacity-50">
                    <Lock size={16} aria-hidden="true" />
                  </div>
                  <button
                    className="text-muted-foreground/80 hover:text-foreground focus-visible:border-ring focus-visible:ring-ring/50 absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center rounded-e-md transition-[color,box-shadow] outline-none focus:z-10 focus-visible:ring-[3px] disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
                    type="button"
                    onClick={toggleVisibility}
                    aria-label={isVisible ? "Hide password" : "Show password"}
                    aria-pressed={isVisible}
                    aria-controls="new-password"
                  >
                    {isVisible ? <EyeOff size={16} aria-hidden="true" /> : <Eye size={16} aria-hidden="true" />}
                  </button>
                </div>
              </div>
              <div>
                <Label htmlFor="confirm-password" className="dark:text-zinc-200">Confirm New Password</Label>
                <div className="relative mt-2.5">
                  <Input
                    id="confirm-password"
                    className="ps-9 pe-9"
                    placeholder="Confirm new password"
                    type={isVisibleConfirm ? "text" : "password"}
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                    autoComplete="new-password"
                    required
                  />
                  <div className="text-muted-foreground/80 dark:text-zinc-400 pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 peer-disabled:opacity-50">
                    <Lock size={16} aria-hidden="true" />
                  </div>
                  <button
                    className="text-muted-foreground/80 hover:text-foreground focus-visible:border-ring focus-visible:ring-ring/50 absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center rounded-e-md transition-[color,box-shadow] outline-none focus:z-10 focus-visible:ring-[3px] disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
                    type="button"
                    onClick={toggleVisibilityConfirm}
                    aria-label={isVisibleConfirm ? "Hide password" : "Show password"}
                    aria-pressed={isVisibleConfirm}
                    aria-controls="confirm-password"
                  >
                    {isVisibleConfirm ? <EyeOff size={16} aria-hidden="true" /> : <Eye size={16} aria-hidden="true" />}
                  </button>
                </div>
              </div>
              <Button className="w-full" type="submit" disabled={loading}>
                {loading ? <ArrowRight className="h-4 w-4 animate-spin" /> : <>Reset Password <ArrowRight className="h-4 w-4" /></>}
              </Button>
            </form>
          )}
          {step === 4 && (
            <div className="space-y-6">
              <div className="text-green-600 text-center text-lg font-medium">Password reset successfully!</div>
              <Button className="w-full" onClick={() => router.push("/auth/sign-in")}>Back to Sign In</Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
