import React, { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import ChatWidget from "./ChatWidget";
import { Link } from "react-router-dom";

const NavBar = () => {
  const { user, logout } = useContext(AuthContext);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleClick = (callback) => {
    setIsMenuOpen(false);
    if (callback) callback();
  };

  const btnClass =
    "flex items-center justify-center h-10 px-5 rounded-lg shadow text-white font-medium hover:opacity-90 hover:scale-105 transition-all duration-300 no-underline";

  return (
    <>
      {/* Navbar */}
      <nav className="fixed top-0 w-full bg-gradient-to-r from-indigo-900 via-purple-800 to-pink-900 bg-[length:200%_200%] animate-gradient backdrop-blur-md text-white shadow-lg z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex-shrink-0">
              <Link
                to="/"
                className="text-2xl font-extrabold tracking-wide hover:scale-105 transition-transform no-underline text-white"
              >
                ElectoMate
              </Link>
            </div>

            {/* Hamburger for mobile */}
            <div className="lg:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-200 hover:text-white hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-indigo-800 focus:ring-white"
              >
                <span className="sr-only">Open main menu</span>
                {isMenuOpen ? (
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                ) : (
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  </svg>
                )}
              </button>
            </div>

            {/* Menu Items */}
            <div
              className={`${
                isMenuOpen ? "flex" : "hidden"
              } lg:flex flex-col lg:flex-row lg:items-center lg:space-x-4 text-center gap-2 
                absolute top-16 left-0 w-full bg-gradient-to-r from-indigo-900 via-purple-800 to-pink-900 
                lg:static lg:w-auto lg:bg-transparent lg:shadow-none p-4 lg:p-0 shadow-lg`}
            >
              {user ? (
                <>
                  <span className="text-white mb-2 lg:mb-0 font-medium">
                    {`Hello, ${user.username}`}
                  </span>
                  <button
                    onClick={() => handleClick(logout)}
                    className={`${btnClass} bg-red-600 hover:bg-red-500`}
                  >
                    Logout
                  </button>
                  <button
                    onClick={() =>
                      handleClick(() => setIsChatOpen(!isChatOpen))
                    }
                    className={`${btnClass} bg-green-600 hover:bg-green-500`}
                  >
                    Chat
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    onClick={() => handleClick()}
                    className={`${btnClass} bg-blue-600 hover:bg-blue-500`}
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => handleClick()}
                    className={`${btnClass} bg-green-600 hover:bg-green-500`}
                  >
                    Register
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Chat widget */}
      {user && isChatOpen && <ChatWidget close={() => setIsChatOpen(false)} />}
    </>
  );
};

export default NavBar;
