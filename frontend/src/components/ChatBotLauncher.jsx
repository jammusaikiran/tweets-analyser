import React, { useState, useEffect, useContext } from "react";
import ChatWidget from "./ChatWidget";
import { AuthContext } from "../context/AuthContext"; // if you want to show only after login

const ChatBotLauncher = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showIntro, setShowIntro] = useState(true);
  const { user } = useContext(AuthContext); // user info from context

  // Show intro text only if logged in
  useEffect(() => {
    if (!user) {
      setShowIntro(false);
    }
  }, [user]);

  return (
    <div className="fixed bottom-4 right-4 z-50 flex items-end space-x-2">
      {/* Intro Text Bubble */}
      {showIntro && !isOpen && (
        <div className="bg-white shadow-lg rounded-xl px-3 py-2 text-sm text-gray-700 relative max-w-xs">
          <span>
            Hi, this is Sarathi your digital assistant.  
            Feel free to ask me a question 👋
          </span>
          <button
            onClick={() => setShowIntro(false)}
            className="absolute top-1 right-1 text-gray-500 hover:text-gray-700 text-xs"
          >
            ✖
          </button>
        </div>
      )}

      {/* Chat Widget */}
      {isOpen && <ChatWidget close={() => setIsOpen(false)} />}

      {/* Floating Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="
            flex items-center justify-center
            w-14 h-14 sm:w-16 sm:h-16
            bg-blue-600 rounded-full shadow-xl
            hover:bg-blue-700 transition
          "
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="white"
            viewBox="0 0 24 24"
            stroke="white"
            className="w-7 h-7"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 8h2a2 2 0 012 2v9.586a1 1 0 01-1.707.707L17 18H7a2 2 0 01-2-2V10a2 2 0 012-2h2"
            />
            <circle cx="9" cy="12" r="1.5" />
            <circle cx="15" cy="12" r="1.5" />
          </svg>
        </button>
      )}
    </div>
  );
};

export default ChatBotLauncher;
