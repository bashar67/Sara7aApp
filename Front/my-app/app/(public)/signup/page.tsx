"use client";

import { useState } from "react";
import Link from "next/link";
import Form from "@/components/ui/form";
import Input from "@/components/ui/input";
import { validateSignup } from "@/lib/validation";

export default function Signup() {
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = async (formData: FormData) => {
    setLoading(true);
    setErrors({});

    // Validation
    const validation = validateSignup(formData);
    if (!validation.isValid) {
      setErrors(validation.errors);
      setLoading(false);
      return;
    }

    try {
      // TODO: Add your signup API call here
      console.log("Signup data:", {
        firstName: formData.get("firstName"),
        lastName: formData.get("lastName"),
        email: formData.get("email"),
        gender: formData.get("gender"),
        password: formData.get("password"),
      });

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Redirect or show success message
    } catch (error) {
      console.error("Signup error:", error);
    } finally {
      setLoading(false);
    }
  };

  const genderOptions = [
    { value: "MALE", label: "Male" },
    { value: "FEMALE", label: "Female" },
  ];

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-6 py-8 bg-background text-foreground transition-colors duration-500">
      <Form
        onSubmit={handleSubmit}
        title="Create Account"
        subtitle="Join TruthBox and start receiving anonymous messages"
        submitText="Create Account"
        loading={loading}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="First Name"
            type="text"
            name="firstName"
            placeholder="Enter your first name"
            required
            error={errors.firstName}
          />

          <Input
            label="Last Name"
            type="text"
            name="lastName"
            placeholder="Enter your last name"
            required
            error={errors.lastName}
          />
        </div>

        <Input
          label="Email"
          type="email"
          name="email"
          placeholder="Enter your email"
          required
          error={errors.email}
        />

        <Input
          label="Gender"
          type="select"
          name="gender"
          required
          error={errors.gender}
          options={genderOptions}
        />

        <Input
          label="Password"
          type="password"
          name="password"
          placeholder="Create a strong password"
          required
          error={errors.password}
        />

        <Input
          label="Confirm Password"
          type="password"
          name="confirmPassword"
          placeholder="Confirm your password"
          required
          error={errors.confirmPassword}
        />

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-card text-muted-foreground">
              Or continue with
            </span>
          </div>
        </div>

        <button
          type="button"
          className="w-full flex items-center justify-center gap-3 py-3 px-4 border border-border rounded-xl font-medium hover:bg-muted hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 group"
        >
          <svg
            className="w-5 h-5 group-hover:scale-110 transition-transform duration-300"
            viewBox="0 0 24 24"
          >
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          <span className="group-hover:text-primary transition-colors duration-300">
            Continue with Google
          </span>
        </button>
      </Form>

      <div className="mt-6 text-center">
        <p className="text-muted-foreground">
          Already have an account?{" "}
          <Link
            href="/login"
            className="text-primary hover:text-primary/80 font-medium hover:underline transition-all duration-300"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
