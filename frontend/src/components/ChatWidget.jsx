import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";

const ChatWidget = ({ close }) => {
  const { user } = useContext(AuthContext);
  const [chatHistory, setChatHistory] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [botTyping, setBotTyping] = useState(false);

  const API_BASE = import.meta.env.VITE_API_BASE;
  const token = localStorage.getItem("token");

  // Fetch chat history
  useEffect(() => {
    if (!token) return;
    axios
      .get(`${API_BASE}/api/chat/history`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        const history = res.data.flatMap((chat) => [
          { type: "user", message: chat.question },
          { type: "bot", message: chat.answer },
        ]);
        setChatHistory(history);
      })
      .catch((err) => console.error(err));
  }, [token]);

  // Send message
  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = input;
    setChatHistory((prev) => [...prev, { type: "user", message: userMessage }]);
    setInput("");
    setLoading(true);
    setBotTyping(true);

    try {
      const res = await axios.post(
        `${API_BASE}/api/chat`,
        { userInput: userMessage },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setTimeout(() => {
        setChatHistory((prev) => [
          ...prev,
          { type: "bot", message: res.data.response },
        ]);
        setLoading(false);
        setBotTyping(false);
      }, 1200);
    } catch (err) {
      console.error(err);
      setChatHistory((prev) => [
        ...prev,
        { type: "bot", message: "⚠️ Error occurred" },
      ]);
      setLoading(false);
      setBotTyping(false);
    }
  };

  // Delete history
  const deleteChat = () => {
    axios
      .delete(`${API_BASE}/api/chat/delete`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(() => setChatHistory([]));
  };

  return (
    <div
      className="
        fixed bottom-0 right-0 
        w-full h-full sm:bottom-4 sm:right-4 sm:w-96 sm:h-[500px]
        bg-white rounded-none sm:rounded-2xl
        shadow-2xl flex flex-col overflow-hidden z-50
        max-h-[100vh] sm:max-h-[80vh]
      "
    >
      {/* Header */}
      <div className="flex justify-between items-center bg-blue-600 text-white px-4 py-2">
        <span className="font-semibold text-sm sm:text-base">Chatbot 🤖</span>
        <div className="space-x-2">
          <button
            onClick={deleteChat}
            className="bg-white/20 px-2 py-1 rounded-md text-xs sm:text-sm hover:bg-white/30"
          >
            Clear
          </button>
          <button
            onClick={close}
            className="bg-white/20 px-2 py-1 rounded-md text-xs sm:text-sm hover:bg-white/30"
          >
            ✖
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3 bg-gray-50">
        {chatHistory.length === 0 && !loading ? (
          <div className="text-center text-gray-400 mt-10 text-sm sm:text-base">
            Start chatting with the bot 👋
          </div>
        ) : (
          chatHistory.map((c, idx) => (
            <div
              key={idx}
              className={`flex ${
                c.type === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`px-3 py-2 rounded-2xl text-sm max-w-[80%] sm:max-w-[70%] ${
                  c.type === "user"
                    ? "bg-blue-600 text-white rounded-br-none"
                    : "bg-gray-200 text-gray-800 rounded-bl-none"
                }`}
              >
                {c.message}
              </div>
            </div>
          ))
        )}

        {/* Typing animation */}
        {botTyping && (
          <div className="flex justify-start">
            <div className="flex space-x-1 bg-gray-200 px-3 py-2 rounded-2xl text-gray-700">
              <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></span>
              <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-150"></span>
              <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-300"></span>
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <form
        onSubmit={sendMessage}
        className="flex items-center p-2 sm:p-3 border-t border-gray-200"
      >
        <input
          type="text"
          className="flex-1 border border-gray-300 rounded-lg px-2 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message..."
          disabled={loading}
        />
        <button
          type="submit"
          disabled={loading}
          className="ml-2 px-3 py-2 sm:px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50 text-sm"
        >
          Send
        </button>
      </form>
    </div>
  );
};

export default ChatWidget;
