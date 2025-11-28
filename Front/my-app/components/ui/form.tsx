"use client";

import { ReactNode } from "react";

interface FormProps {
  children: ReactNode;
  onSubmit: (data: FormData) => void;
  title?: string;
  subtitle?: string;
  submitText?: string;
  loading?: boolean;
}

export default function Form({
  children,
  onSubmit,
  title,
  subtitle,
  submitText = "Submit",
  loading = false,
}: FormProps) {
  return (
    <div className="w-full max-w-md bg-card border border-border rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-500">
      {(title || subtitle) && (
        <div className="text-center mb-8">
          {title && (
            <h1 className="text-3xl font-bold mb-3 text-primary">{title}</h1>
          )}
          {subtitle && (
            <p className="text-muted-foreground text-lg leading-relaxed">
              {subtitle}
            </p>
          )}
        </div>
      )}

      <form
        onSubmit={(e) => {
          e.preventDefault();
          const formData = new FormData(e.currentTarget);
          onSubmit(formData);
        }}
        className="space-y-6"
      >
        {children}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3.5 px-4 bg-primary text-primary-foreground rounded-xl font-medium hover:opacity-90 disabled:opacity-50 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-3 group"
        >
          {loading && (
            <div className="w-5 h-5 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
          )}
          <span className="group-hover:translate-x-1 transition-transform duration-300">
            {submitText}
          </span>
        </button>
      </form>
    </div>
  );
}
