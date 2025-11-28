"use client";

import { useState } from "react";
import Link from "next/link";
import ThemeToggle from "./theme-toggle";

export default function Header() {
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const isLoggedIn = true;
  const user = {
    name: "John Doe",
    email: "john@example.com",
    firstName: "John",
    lastName: "Doe",
  };

  return (
    <header className="w-full flex justify-between items-center px-6 py-4 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50 transition-colors duration-500">
      {/* Logo */}
      <Link
        href="/"
        className="text-xl font-bold text-blue-600 dark:text-blue-400 hover:opacity-80 transition-opacity"
      >
        TruthBox
      </Link>

      <div className="flex items-center gap-4">
        {/* Navigation - Messages فقط */}
        <nav className="hidden md:flex items-center gap-6">
          {isLoggedIn && (
            <Link
              href="/messages"
              className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              Messages
            </Link>
          )}
        </nav>

        {/* Theme Toggle */}
        <ThemeToggle />

        {/* User Menu */}
        {isLoggedIn && (
          <div className="relative">
            <button
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-medium">
                {user.firstName.charAt(0).toUpperCase()}
              </div>
              <span className="hidden md:block text-sm font-medium text-gray-700 dark:text-gray-300">
                {user.firstName}
              </span>
            </button>

            {/* Dropdown Menu */}
            {userMenuOpen && (
              <div className="absolute right-0 top-12 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg py-2">
                <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
                  <p className="font-medium text-gray-900 dark:text-white">
                    {user.firstName} {user.lastName}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                    {user.email}
                  </p>
                </div>
                <Link
                  href="/dashboard"
                  className="block px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  onClick={() => setUserMenuOpen(false)}
                >
                  👤 Profile Settings
                </Link>
                <button className="block w-full text-left px-4 py-2 text-red-500 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                  🚪 Logout
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
