"use client";

import { useState } from "react";
import Link from "next/link";
import Form from "@/components/ui/form";

export default function ForgotPassword() {
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const handleSubmit = async (formData: FormData) => {
    setLoading(true);

    const email = formData.get("email") as string;

    try {
      // TODO: Add your forgot password API call here
      console.log("Forgot password email:", email);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Redirect to OTP page instead of showing success message
      window.location.href = "/reset-password";
    } catch (error) {
      console.error("Forgot password error:", error);
    } finally {
      setLoading(false);
    }
  };

  if (emailSent) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen px-6 py-8 bg-background text-foreground transition-colors duration-500">
        <div className="w-full max-w-md bg-card border border-border rounded-2xl p-8 shadow-lg text-center">
          <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-2xl">✅</span>
          </div>

          <h1 className="text-2xl font-bold text-primary mb-4">
            Check Your Email
          </h1>

          <p className="text-muted-foreground mb-6 leading-relaxed">
            We`&apos;ve sent a password reset link to your email address. Please
            check your inbox and follow the instructions to reset your password.
          </p>

          <div className="space-y-4">
            <Link
              href="/login"
              className="block w-full py-3 px-4 bg-primary text-primary-foreground rounded-xl font-medium hover:opacity-90 transition-all duration-300 shadow-lg text-center"
            >
              Back to Login
            </Link>

            <p className="text-sm text-muted-foreground">
              Didn`&apos;t receive the email?{" "}
              <button
                onClick={() => setEmailSent(false)}
                className="text-primary hover:text-primary/80 font-medium hover:underline transition-all duration-300"
              >
                Try again
              </button>
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-6 py-8 bg-background text-foreground transition-colors duration-500">
      <Form
        onSubmit={handleSubmit}
        title="Reset Your Password"
        subtitle="Enter your email and we'll send you a link to reset your password"
        submitText="Send Reset Link"
        loading={loading}
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Email Address
            </label>
            <input
              name="email"
              type="email"
              required
              className="w-full px-4 py-3 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground placeholder-muted-foreground transition-all duration-300 hover:border-primary/50"
              placeholder="Enter your email address"
            />
          </div>

          <div className="bg-gradient-to-r from-green-50 to-lime-50 border border-green-200 dark:border-green-600 rounded-xl p-4">
            <p className="text-sm !text-gray-900 dark:text-gray-300">
              💡 We&apos;ll send you a link to reset your password. Make sure to
              check your spam folder if you don`&apos;t see it in your inbox.
            </p>
          </div>
        </div>
      </Form>

      <div className="mt-6 text-center">
        <p className="text-muted-foreground">
          Remember your password?{" "}
          <Link
            href="/login"
            className="text-primary hover:text-primary/80 font-medium hover:underline transition-all duration-300"
          >
            Back to Login
          </Link>
        </p>
      </div>
    </div>
  );
}
