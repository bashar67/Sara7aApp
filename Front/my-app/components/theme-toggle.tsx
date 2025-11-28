"use client";

import { useTheme } from "@/context/ThemeProvider";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="relative w-14 h-8 flex items-center rounded-full bg-gray-300 dark:bg-gray-700 transition-all duration-500 focus:outline-none focus:ring-2 focus:ring-blue-500 px-1 border border-gray-400 dark:border-gray-600"
      aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
    >
      <div className="w-full flex justify-between items-center text-xs">
        <span
          className={`transition-all duration-500 ${
            theme === "light"
              ? "opacity-100 text-yellow-500 scale-110"
              : "opacity-40 scale-100"
          }`}
        >
          ☀️
        </span>
        <span
          className={`transition-all duration-500 ${
            theme === "dark"
              ? "opacity-100 text-blue-400 scale-110"
              : "opacity-40 scale-100"
          }`}
        >
          🌙
        </span>
      </div>

      <div
        className={`absolute top-1 w-6 h-6 bg-white rounded-full shadow-lg transition-all duration-500 ${
          theme === "light" ? "translate-x-0" : "translate-x-6"
        }`}
      />
    </button>
  );
}
