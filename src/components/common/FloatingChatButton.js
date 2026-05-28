"use client";

import { useState } from "react";
import { MessageCircle, Send, X } from "lucide-react";

const quickReplies = [
  "Find a doctor near me",
  "Book a pathology test",
  "Need ambulance help",
];

export default function FloatingChatButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      from: "assistant",
      text: "Hi, I can help you find doctors, clinics, pathology tests, or ambulance services.",
    },
  ]);
  const [draft, setDraft] = useState("");

  const sendMessage = (text = draft) => {
    const value = text.trim();
    if (!value) return;

    setMessages((prev) => [
      ...prev,
      { from: "user", text: value },
      {
        from: "assistant",
        text: "Thanks. Use the search box above with your service and location, and I will keep this chat ready while you browse.",
      },
    ]);
    setDraft("");
  };

  return (
    <div className="fixed bottom-36 right-4 sm:bottom-40 sm:right-6 z-[9999]">
      {isOpen && (
        <div className="mb-3 w-[calc(100vw-2rem)] max-w-sm overflow-hidden rounded-lg border border-gray-200 bg-white shadow-2xl dark:border-gray-700 dark:bg-gray-900">
          <div className="flex items-center justify-between bg-primary-600 px-4 py-3 text-white">
            <div>
              <h2 className="text-sm font-semibold">Dr Help Chat</h2>
              <p className="text-xs text-primary-100">Quick guidance</p>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="rounded p-1 hover:bg-white/15"
              aria-label="Close chat"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="max-h-80 space-y-3 overflow-y-auto p-4">
            {messages.map((message, index) => (
              <div
                key={`${message.from}-${index}`}
                className={`flex ${
                  message.from === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[82%] rounded-lg px-3 py-2 text-sm ${
                    message.from === "user"
                      ? "bg-primary-600 text-white"
                      : "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100"
                  }`}
                >
                  {message.text}
                </div>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap gap-2 border-t border-gray-100 px-4 py-3 dark:border-gray-800">
            {quickReplies.map((reply) => (
              <button
                key={reply}
                type="button"
                onClick={() => sendMessage(reply)}
                className="rounded-full border border-primary-200 px-3 py-1 text-xs text-primary-700 hover:bg-primary-50 dark:border-primary-800 dark:text-primary-300 dark:hover:bg-primary-900/30"
              >
                {reply}
              </button>
            ))}
          </div>

          <form
            onSubmit={(event) => {
              event.preventDefault();
              sendMessage();
            }}
            className="flex gap-2 border-t border-gray-100 p-3 dark:border-gray-800"
          >
            <input
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              placeholder="Type your question"
              className="min-w-0 flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
            />
            <button
              type="submit"
              className="rounded-md bg-primary-600 px-3 py-2 text-white hover:bg-primary-700"
              aria-label="Send message"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>
        </div>
      )}

      <button
        type="button"
        onClick={() => setIsOpen((value) => !value)}
        className="flex h-14 min-w-14 items-center justify-center gap-2 rounded-full bg-primary-600 px-4 text-white shadow-2xl transition hover:bg-primary-700 focus:outline-none focus:ring-4 focus:ring-primary-200"
        aria-label="Open chat"
      >
        <MessageCircle className="h-6 w-6" />
        <span className="hidden text-sm font-semibold sm:inline">Chat</span>
      </button>
    </div>
  );
}
