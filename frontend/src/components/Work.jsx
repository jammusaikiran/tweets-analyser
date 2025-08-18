import React from "react";
import { useNavigate } from "react-router-dom";

const Work = () => {
  const navigate = useNavigate();

  const features = [
    {
      title: "Sentimental Analysis of LokSabha2024 Elections",
      desc: "Analyze real-time public sentiment on political parties and candidates.",
      extra: "Understand voter opinions with AI-powered sentiment analytics.",
      route: "/sentiment",
      gradient: "from-blue-600 via-cyan-500 to-blue-500",
      animation: "animate-fade-up",
    },
    {
      title: "Party Symbol Recognition",
      desc: "Upload and identify political party symbols instantly using AI recognition.",
      extra: "Quickly learn about parties just by scanning their symbols.",
      route: "/upload",
      gradient: "from-purple-700 via-pink-600 to-purple-600",
      animation: "animate-fade-left",
    },
    {
      title: "Know More About Parties",
      desc: "Explore detailed insights about major and regional political parties in India.",
      extra: "Stay updated with party history, leadership, and policies.",
      route: "/parties",
      gradient: "from-green-600 via-teal-500 to-green-500",
      animation: "animate-fade-right",
    },
    {
      title: "Constituencies",
      desc: "Search for candidates and constituencies with detailed election results.",
      extra: "Track past election performance and demographic insights.",
      route: "/search",
      gradient: "from-indigo-700 via-purple-600 to-indigo-600",
      animation: "animate-fade-down",
    },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-r from-slate-800 via-blue-900 to-slate-700 text-white">
      <div className="flex-grow max-w-7xl mx-auto px-6 py-16">
        {/* Intro Section */}
        <div className="text-center mb-20 animate-fade">
          <h1 className="text-5xl md:text-6xl font-extrabold mb-6 drop-shadow-lg text-white">
            Welcome to Election Insights 🗳️
          </h1>
          <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Your one-stop platform to explore the 2024 Lok Sabha elections with the 
            power of Artificial Intelligence. From real-time sentiment analysis to 
            constituency insights, party symbol recognition, and detailed political 
            information – we make election data accessible, engaging, and insightful 
            for everyone.
          </p>
        </div>

        {/* Title */}
        <h2 className="text-center text-4xl md:text-5xl font-extrabold mb-14 text-white animate-fade">
          Discover Our Features 🚀
        </h2>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {features.map((feature, index) => (
            <div
              key={index}
              className={`rounded-2xl bg-gradient-to-br ${feature.gradient} 
                          backdrop-blur-md border border-white/20 shadow-lg 
                          p-8 flex flex-col justify-between transition-all duration-500 
                          hover:scale-105 hover:shadow-2xl ${feature.animation}`}
            >
              <h5 className="text-xl font-semibold text-white mb-4">{feature.title}</h5>
              <p className="text-sm text-gray-200 mb-4">{feature.desc}</p>
              <p className="text-xs text-gray-300 italic mb-6">{feature.extra}</p>

              {/* Explore Button */}
              <button
                onClick={() => navigate(feature.route)}
                className="mt-auto bg-white text-gray-800 font-semibold px-4 py-2 rounded-lg shadow hover:bg-gray-100 transition"
              >
                Explore
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-6 mt-12">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center text-center md:text-left">
          <p className="text-sm">
            © {new Date().getFullYear()} Election Insights. All rights reserved.
          </p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <a
              href="https://www.eci.gov.in/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition"
            >
              Election Commission of India
            </a>
            <a
              href="mailto:jammusaikiran0@gmail.com?subject=Election%20Insights%20Query&body=Hello%20Sai%2C%0A%0AI%20would%20like%20to%20ask%20about..."
              className="hover:text-white transition"
            >
              Contact
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Work;
