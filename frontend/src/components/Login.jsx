import React, { useState, useContext, useEffect } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";

const Login = () => {
  const API_BASE = import.meta.env.VITE_API_BASE;
  const { login, user } = useContext(AuthContext); // Added user
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [logText, setLogText] = useState("Logging in");
  const navigate = useNavigate();

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      navigate("/"); // Redirect to homepage
    }
  }, [user, navigate]);

  // Handle Enter key
  useEffect(() => {
    const handleEnter = (e) => {
      if (e.key === "Enter") handleSubmit(e);
    };
    window.addEventListener("keydown", handleEnter);
    return () => window.removeEventListener("keydown", handleEnter);
  });

  // Animate "Logging in..."
  useEffect(() => {
    if (!loading) return;
    let dots = 0;
    const interval = setInterval(() => {
      dots = (dots + 1) % 4;
      setLogText("Logging in" + ".".repeat(dots));
    }, 500);
    return () => clearInterval(interval);
  }, [loading]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post(`${API_BASE}/api/login`, { username, password });
      localStorage.setItem("token", res.data.access_token);
      login({ username: res.data.username });
      toast.success("Login successful!");
      navigate("/"); // Redirect after login
    } catch (err) {
      toast.error(err.response?.data?.msg || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-black to-gray-800 overflow-hidden">
      
      {/* Animated background circles */}
      <div className="absolute w-[600px] h-[600px] bg-purple-600 rounded-full top-[-200px] left-[-200px] animate-pulse-slow opacity-30 mix-blend-multiply"></div>
      <div className="absolute w-[500px] h-[500px] bg-green-500 rounded-full bottom-[-150px] right-[-150px] animate-spin-slow opacity-20 mix-blend-multiply"></div>

      <div className="backdrop-blur-lg bg-gray-800/60 rounded-2xl shadow-2xl max-w-md w-full p-8 transform transition-all hover:scale-105 duration-300 relative z-10">
        <Toaster position="top-center" reverseOrder={false} />
        <h2 className="text-3xl font-bold text-green-400 text-center mb-6 animate-pulse">Login</h2>

        {loading ? (
          <div className="flex flex-col items-center justify-center space-y-4 py-10">
            <div className="w-12 h-12 border-4 border-green-400 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-green-200 font-medium">{logText}</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-green-300 font-medium mb-2">Username</label>
              <input
                type="text"
                className="w-full px-4 py-3 rounded-xl bg-gray-700/50 placeholder-green-200 text-white focus:outline-none focus:ring-2 focus:ring-green-400 focus:bg-gray-600/50 transition"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block text-green-300 font-medium mb-2">Password</label>
              <input
                type="password"
                className="w-full px-4 py-3 rounded-xl bg-gray-700/50 placeholder-green-200 text-white focus:outline-none focus:ring-2 focus:ring-green-400 focus:bg-gray-600/50 transition"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-green-500 hover:bg-green-600 text-white font-semibold transition duration-300 shadow-lg hover:shadow-green-500/50"
            >
              Login
            </button>
          </form>
        )}

        <p className="mt-4 text-center text-green-200">
          New here?{" "}
          <Link to="/register" className="font-bold hover:text-green-400 transition">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
