"use client";

import { useState } from "react";

interface Message {
  id: string;
  content: string;
  timestamp: string;
  isRead: boolean;
  type: "positive" | "constructive" | "neutral";
}

export default function Messages() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content: "Your work is truly inspiring! Keep going!",
      timestamp: "2 hours ago",
      isRead: true,
      type: "positive",
    },
    {
      id: "2",
      content:
        "I appreciate your honesty and transparency in everything you do.",
      timestamp: "1 day ago",
      isRead: false,
      type: "positive",
    },
    {
      id: "3",
      content: "Maybe consider being more active in community discussions?",
      timestamp: "2 days ago",
      isRead: true,
      type: "constructive",
    },
  ]);

  const userLink = "https://truthbox.com/user/johndoe123";

  const deleteMessage = (id: string) => {
    setMessages(messages.filter((msg) => msg.id !== id));
  };

  const markAsRead = (id: string) => {
    setMessages(
      messages.map((msg) => (msg.id === id ? { ...msg, isRead: true } : msg))
    );
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(userLink);
      alert("Link copied to clipboard!");
    } catch (err) {
      console.error("Failed to copy link:", err);
    }
  };

  const getMessageTypeColor = (type: string) => {
    switch (type) {
      case "positive":
        return "bg-green-100 dark:bg-green-900/30 border-green-200 dark:border-green-700";
      case "constructive":
        return "bg-yellow-100 dark:bg-yellow-900/30 border-yellow-200 dark:border-yellow-700";
      default:
        return "bg-gray-100 dark:bg-gray-800 border-gray-200 dark:border-gray-700";
    }
  };

  const getMessageTypeIcon = (type: string) => {
    switch (type) {
      case "positive":
        return "💚";
      case "constructive":
        return "💡";
      default:
        return "💬";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-500">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Messages
            </h1>
            <div className="text-gray-500 dark:text-gray-400">
              {messages.length} message{messages.length !== 1 ? "s" : ""}
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Messages List - 3/4 width */}
          <div className="lg:col-span-3">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700">
              {/* Messages Header */}
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                    All Messages
                  </h2>
                  <div className="flex items-center space-x-4">
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {messages.filter((m) => !m.isRead).length} unread
                    </span>
                  </div>
                </div>
              </div>

              {/* Messages Content */}
              <div className="p-6">
                {messages.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="text-6xl mb-4">📭</div>
                    <p className="text-gray-500 dark:text-gray-400 text-lg mb-2">
                      No messages yet
                    </p>
                    <p className="text-gray-400 dark:text-gray-500">
                      Share your link to start receiving anonymous messages
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={`p-6 rounded-xl border-2 transition-all duration-300 ${getMessageTypeColor(
                          message.type
                        )} ${
                          !message.isRead
                            ? "ring-2 ring-blue-500 ring-opacity-50"
                            : ""
                        }`}
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-start space-x-3 flex-1">
                            <span className="text-xl mt-1">
                              {getMessageTypeIcon(message.type)}
                            </span>
                            <div className="flex-1">
                              <p className="text-gray-800 dark:text-gray-200 leading-relaxed">
                                {message.content}
                              </p>
                              <div className="flex items-center space-x-4 mt-2">
                                <span className="text-sm text-gray-500 dark:text-gray-400">
                                  {message.timestamp}
                                </span>
                                {!message.isRead && (
                                  <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded-full">
                                    New
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center space-x-2 ml-4">
                            {!message.isRead && (
                              <button
                                onClick={() => markAsRead(message.id)}
                                className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 text-sm font-medium"
                              >
                                Mark Read
                              </button>
                            )}
                            <button
                              onClick={() => deleteMessage(message.id)}
                              className="text-red-500 hover:text-red-600 text-sm font-medium"
                              title="Delete message"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Share Link Sidebar - 1/4 width */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 sticky top-8">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                Your Share Link
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Share this link to receive anonymous messages:
              </p>

              <div className="bg-gray-100 dark:bg-gray-700 rounded-xl p-4 mb-4">
                <code className="text-sm text-gray-800 dark:text-gray-200 break-all">
                  {userLink}
                </code>
              </div>

              <button
                onClick={copyLink}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-xl font-medium transition-all duration-300 shadow-lg hover:shadow-xl mb-4"
              >
                Copy Link
              </button>

              <div className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
                <div className="flex items-center gap-2">
                  <span>🔒</span>
                  <span>100% Anonymous</span>
                </div>
                <div className="flex items-center gap-2">
                  <span>⚡</span>
                  <span>Real-time Updates</span>
                </div>
                <div className="flex items-center gap-2">
                  <span>🛡️</span>
                  <span>Safe & Secure</span>
                </div>
                <div className="flex items-center gap-2">
                  <span>📧</span>
                  <span>Email Notifications</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
