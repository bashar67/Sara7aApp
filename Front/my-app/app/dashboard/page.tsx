"use client";

import { useState } from "react";
import Link from "next/link";

export default function Dashboard() {
  // User data state
  const [userData, setUserData] = useState({
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@example.com",
    gender: "MALE",
  });

  // Account settings state
  const [accountSettings, setAccountSettings] = useState({
    isFrozen: false,
    emailNotifications: true,
    pushNotifications: true,
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      // TODO: Add profile update API call
      console.log("Updating profile:", userData);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setMessage("✅ Profile updated successfully!");
    } catch (error) {
      setMessage("❌ Error updating profile");
    } finally {
      setLoading(false);
    }
  };

  const handleFreezeAccount = async () => {
    setLoading(true);
    try {
      // TODO: Add freeze account API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setAccountSettings({
        ...accountSettings,
        isFrozen: !accountSettings.isFrozen,
      });
      setMessage(
        accountSettings.isFrozen ? "✅ Account unfrozen!" : "❄️ Account frozen!"
      );
    } catch (error) {
      setMessage("❌ Error updating account status");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    setLoading(true);
    try {
      // TODO: Add delete account API call
      await new Promise((resolve) => setTimeout(resolve, 2000));
      setMessage("🗑️ Account deletion initiated!");
      setShowDeleteConfirm(false);
    } catch (error) {
      setMessage("❌ Error deleting account");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-500">
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Profile Settings
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage your profile and account preferences
          </p>
        </div>

        {/* Message Alert */}
        {message && (
          <div
            className={`mb-6 p-4 rounded-xl ${
              message.includes("❌")
                ? "bg-red-100 dark:bg-red-900/30 border border-red-200 dark:border-red-700 text-red-800 dark:text-red-200"
                : "bg-green-100 dark:bg-green-900/30 border border-green-200 dark:border-green-700 text-green-800 dark:text-green-200"
            }`}
          >
            {message}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Profile Settings */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
              👤 Profile Information
            </h2>

            <form onSubmit={handleProfileUpdate} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    First Name
                  </label>
                  <input
                    type="text"
                    value={userData.firstName}
                    onChange={(e) =>
                      setUserData({ ...userData, firstName: e.target.value })
                    }
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-all duration-300"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Last Name
                  </label>
                  <input
                    type="text"
                    value={userData.lastName}
                    onChange={(e) =>
                      setUserData({ ...userData, lastName: e.target.value })
                    }
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-all duration-300"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  value={userData.email}
                  onChange={(e) =>
                    setUserData({ ...userData, email: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-all duration-300"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Gender
                </label>
                <select
                  value={userData.gender}
                  onChange={(e) =>
                    setUserData({ ...userData, gender: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-all duration-300"
                >
                  <option value="MALE">Male</option>
                  <option value="FEMALE">Female</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-xl font-medium transition-all duration-300 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Updating...
                  </>
                ) : (
                  "Update Profile"
                )}
              </button>
            </form>
          </div>

          {/* Account Settings */}
          <div className="space-y-6">
            {/* Security Settings */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                🔒 Security
              </h2>

              <div className="space-y-4">
                <Link
                  href="/change-password"
                  className="w-full flex items-center justify-between p-4 border border-gray-200 dark:border-gray-600 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-lg">🔑</span>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">
                        Change Password
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Update your password regularly
                      </p>
                    </div>
                  </div>
                  <span className="text-gray-400">→</span>
                </Link>
              </div>
            </div>

            {/* Account Actions */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                ⚙️ Account Actions
              </h2>

              <div className="space-y-4">
                {/* Freeze Account */}
                <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-600 rounded-xl">
                  <div className="flex items-center gap-3">
                    <span className="text-lg">❄️</span>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">
                        Freeze Account
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {accountSettings.isFrozen
                          ? "Account is frozen"
                          : "Temporarily disable your account"}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={handleFreezeAccount}
                    disabled={loading}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      accountSettings.isFrozen
                        ? "bg-green-600 hover:bg-green-700 text-white"
                        : "bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300"
                    }`}
                  >
                    {accountSettings.isFrozen ? "Unfreeze" : "Freeze"}
                  </button>
                </div>

                {/* Delete Account */}
                <div className="p-4 border border-red-200 dark:border-red-700 rounded-xl bg-red-50 dark:bg-red-900/20">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-lg">🗑️</span>
                    <div>
                      <p className="font-medium text-red-800 dark:text-red-200">
                        Delete Account
                      </p>
                      <p className="text-sm text-red-600 dark:text-red-300">
                        Permanently delete your account and all data
                      </p>
                    </div>
                  </div>

                  {!showDeleteConfirm ? (
                    <button
                      onClick={() => setShowDeleteConfirm(true)}
                      className="w-full bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg font-medium transition-colors"
                    >
                      Delete Account
                    </button>
                  ) : (
                    <div className="space-y-3">
                      <p className="text-sm text-red-700 dark:text-red-300 font-medium">
                        Are you sure? This action cannot be undone!
                      </p>
                      <div className="flex gap-2">
                        <button
                          onClick={handleDeleteAccount}
                          disabled={loading}
                          className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg font-medium transition-colors disabled:opacity-50"
                        >
                          {loading ? "Deleting..." : "Yes, Delete"}
                        </button>
                        <button
                          onClick={() => setShowDeleteConfirm(false)}
                          className="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded-lg font-medium transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
