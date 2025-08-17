import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

const Register = () => {
  const API_BASE = import.meta.env.VITE_API_BASE;
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [number, setNumber] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_BASE}/api/register`, { username, email, password, number });
      alert("Registration successful! Please login.");
      navigate("/login");
    } catch (err) {
      alert(err.response?.data?.msg || "Registration failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-black to-gray-800">
      <div className="backdrop-blur-lg bg-gray-800/60 rounded-2xl shadow-2xl max-w-md w-full p-8 transform transition-all hover:scale-105 duration-300">
        <h2 className="text-3xl font-bold text-blue-400 text-center mb-6 animate-pulse">Register</h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-blue-300 font-medium mb-2">Username</label>
            <input
              type="text"
              placeholder="Enter your username"
              className="w-full px-4 py-3 rounded-xl bg-gray-700/50 placeholder-blue-200 text-white focus:outline-none focus:ring-2 focus:ring-blue-400 focus:bg-gray-600/50 transition"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-blue-300 font-medium mb-2">Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full px-4 py-3 rounded-xl bg-gray-700/50 placeholder-blue-200 text-white focus:outline-none focus:ring-2 focus:ring-blue-400 focus:bg-gray-600/50 transition"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-blue-300 font-medium mb-2">Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              className="w-full px-4 py-3 rounded-xl bg-gray-700/50 placeholder-blue-200 text-white focus:outline-none focus:ring-2 focus:ring-blue-400 focus:bg-gray-600/50 transition"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-blue-300 font-medium mb-2">Phone Number</label>
            <input
              type="text"
              placeholder="Enter your phone number"
              className="w-full px-4 py-3 rounded-xl bg-gray-700/50 placeholder-blue-200 text-white focus:outline-none focus:ring-2 focus:ring-blue-400 focus:bg-gray-600/50 transition"
              value={number}
              onChange={(e) => setNumber(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-blue-500 hover:bg-blue-600 text-white font-semibold transition duration-300 shadow-lg hover:shadow-blue-500/50"
          >
            Register
          </button>
        </form>

        <p className="mt-4 text-center text-blue-200">
          Already have an account?{" "}
          <Link to="/login" className="font-bold hover:text-blue-400 transition">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
