"use client";

interface InputProps {
  label: string;
  type: string;
  name: string;
  placeholder?: string;
  required?: boolean;
  error?: string;
  options?: { value: string; label: string }[];
}

export default function Input({
  label,
  type,
  name,
  placeholder,
  required = false,
  error,
  options,
}: InputProps) {
  return (
    <div>
      <label
        htmlFor={name}
        className="block text-sm font-medium mb-2 text-foreground"
      >
        {label} {required && <span className="text-red-500">*</span>}
      </label>

      {type === "select" ? (
        <select
          id={name}
          name={name}
          className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground transition-all duration-300 ${
            error ? "border-red-500" : "border-border hover:border-primary/50"
          }`}
          required={required}
        >
          <option value="">Select {label}</option>
          {options?.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      ) : (
        <input
          id={name}
          name={name}
          type={type}
          className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground placeholder-muted-foreground transition-all duration-300 ${
            error ? "border-red-500" : "border-border hover:border-primary/50"
          }`}
          placeholder={placeholder}
          required={required}
        />
      )}

      {error && (
        <p className="text-red-500 text-sm mt-2 animate-pulse">{error}</p>
      )}
    </div>
  );
}
