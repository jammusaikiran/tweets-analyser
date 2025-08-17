import React, { useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";

const Login = () => {
  const API_BASE = import.meta.env.VITE_API_BASE;
  const { login } = useContext(AuthContext);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${API_BASE}/api/login`, { username, password });
      localStorage.setItem("token", res.data.access_token);
      login({ username: res.data.username });
      navigate("/"); 
    } catch (err) {
      alert(err.response?.data?.msg || "Login failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-black to-gray-800">
      <div className="backdrop-blur-lg bg-gray-800/60 rounded-2xl shadow-2xl max-w-md w-full p-8 transform transition-all hover:scale-105 duration-300">
        <h2 className="text-3xl font-bold text-green-400 text-center mb-6 animate-pulse">Login</h2>
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
