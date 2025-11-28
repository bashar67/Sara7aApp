"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import Form from "@/components/ui/form";

export default function ResetPassword() {
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<"otp" | "newPassword">("otp");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleOtpChange = (index: number, value: string) => {
    if (value.length <= 1 && /^\d*$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      // Auto-focus next input
      if (value && index < 5) {
        inputRefs.current[index + 1]?.focus();
      }
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleOtpSubmit = async (formData: FormData) => {
    setLoading(true);

    const enteredOtp = otp.join("");

    try {
      // TODO: Add OTP verification API call here
      console.log("OTP entered:", enteredOtp);

      // Simulate API verification
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Move to next step if OTP is valid
      if (enteredOtp.length === 6) {
        setStep("newPassword");
      }
    } catch (error) {
      console.error("OTP verification error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordReset = async (formData: FormData) => {
    setLoading(true);

    const newPassword = formData.get("newPassword") as string;
    const confirmPassword = formData.get("confirmPassword") as string;

    try {
      // TODO: Add password reset API call here
      console.log("New password:", newPassword);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Show success message or redirect
      alert("Password reset successfully!");
    } catch (error) {
      console.error("Password reset error:", error);
    } finally {
      setLoading(false);
    }
  };

  // Step 1: OTP Verification
  if (step === "otp") {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen px-6 py-8 bg-background text-foreground transition-colors duration-500">
        <Form
          onSubmit={handleOtpSubmit}
          title="Enter Verification Code"
          subtitle="We sent a 6-digit code to your email. Please enter it below."
          submitText="Verify Code"
          loading={loading}
        >
          <div className="space-y-6">
            {/* OTP Inputs */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-4 text-center">
                Enter the 6-digit code
              </label>
              <div className="flex justify-center gap-3">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el) => (inputRefs.current[index] = el)}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(index, e)}
                    className="w-12 h-12 text-center text-lg font-bold border-2 border-border rounded-xl focus:outline-none focus:border-primary bg-background text-foreground transition-all duration-300"
                  />
                ))}
              </div>
            </div>

            {/* Helper Text */}
            <div className="bg-gradient-to-r from-green-50 to-lime-50 dark:from-green-900/20 dark:to-lime-900/20 border border-green-200 dark:border-green-600 rounded-xl p-4">
              <p className="text-sm  dark:text-gray-500 text-center">
                🔒 Check your email for the verification code. The code will
                expire in 10 minutes.
              </p>
            </div>

            {/* Resend Code Option */}
            <div className="text-center">
              <p className="text-muted-foreground text-sm">
                Did n`&apos;t receive the code?{" "}
                <button
                  type="button"
                  className="text-primary hover:text-primary/80 font-medium hover:underline transition-all duration-300"
                >
                  Resend code
                </button>
              </p>
            </div>
          </div>
        </Form>

        <div className="mt-6 text-center">
          <p className="text-muted-foreground">
            Back to{" "}
            <Link
              href="/login"
              className="text-primary hover:text-primary/80 font-medium hover:underline transition-all duration-300"
            >
              Login
            </Link>
          </p>
        </div>
      </div>
    );
  }

  // Step 2: New Password
  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-6 py-8 bg-background text-foreground transition-colors duration-500">
      <Form
        onSubmit={handlePasswordReset}
        title="Create New Password"
        subtitle="Enter your new password below. Make sure it's strong and secure."
        submitText="Reset Password"
        loading={loading}
      >
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              New Password
            </label>
            <input
              name="newPassword"
              type="password"
              required
              minLength={6}
              className="w-full px-4 py-3 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground placeholder-muted-foreground transition-all duration-300 hover:border-primary/50"
              placeholder="Enter new password"
            />
            <p className="text-xs text-muted-foreground mt-2">
              Must be at least 6 characters long
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Confirm New Password
            </label>
            <input
              name="confirmPassword"
              type="password"
              required
              className="w-full px-4 py-3 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground placeholder-muted-foreground transition-all duration-300 hover:border-primary/50"
              placeholder="Confirm new password"
            />
          </div>

          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-4">
            <p className="text-sm text-green-700 dark:text-green-300">
              ✅ Your identity has been verified. You can now set your new
              password.
            </p>
          </div>
        </div>
      </Form>

      <div className="mt-6 text-center">
        <p className="text-muted-foreground">
          Back to{" "}
          <Link
            href="/login"
            className="text-primary hover:text-primary/80 font-medium hover:underline transition-all duration-300"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
