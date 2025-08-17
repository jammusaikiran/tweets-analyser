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
    },
    {
      title: "Party Symbol Recognition",
      desc: "Upload and identify political party symbols instantly using AI recognition.",
      extra: "Quickly learn about parties just by scanning their symbols.",
      route: "/upload",
    },
    {
      title: "Know More About Parties",
      desc: "Explore detailed insights about major and regional political parties in India.",
      extra: "Stay updated with party history, leadership, and policies.",
      route: "/parties",
    },
    {
      title: "Constituencies",
      desc: "Search for candidates and constituencies with detailed election results.",
      extra: "Track past election performance and demographic insights.",
      route: "/search",
    },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white">
      {/* Main Content */}
      <div className="flex-grow max-w-7xl mx-auto px-6 py-16">
        
        {/* Intro Section */}
        <div className="text-center mb-20 animate-fade">
          <h1 className="text-5xl md:text-6xl font-extrabold mb-6 drop-shadow-lg">
            Welcome to Election Insights 🗳️
          </h1>
          <p className="text-lg md:text-xl text-gray-200 max-w-3xl mx-auto leading-relaxed">
            Your one-stop platform to explore the 2024 Lok Sabha elections with the 
            power of Artificial Intelligence. From real-time sentiment analysis to 
            constituency insights, party symbol recognition, and detailed political 
            information – we make election data accessible, engaging, and insightful 
            for everyone.
          </p>
        </div>

        {/* Title */}
        <h2 className="text-center text-4xl md:text-5xl font-extrabold mb-14 animate-fade">
          Discover Our Features 🚀
        </h2>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {features.map((feature, index) => (
            <div
              key={index}
              onClick={() => navigate(feature.route)}
              className="cursor-pointer rounded-2xl bg-gradient-to-br from-purple-700 via-indigo-700 to-pink-700 
                         backdrop-blur-md border border-white/20 shadow-xl 
                         p-8 flex flex-col justify-between transition-all duration-500 
                         hover:scale-110 hover:shadow-2xl hover:from-purple-600 hover:via-indigo-600 hover:to-pink-600"
            >
              <h5 className="text-xl font-semibold text-white mb-4">
                {feature.title}
              </h5>
              <p className="text-sm text-gray-200 mb-4">{feature.desc}</p>
              <p className="text-xs text-gray-300 italic">{feature.extra}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-gray-300 py-6 mt-12">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center text-center md:text-left">
          <p className="text-sm">
            © {new Date().getFullYear()} Election Insights. All rights reserved.
          </p>
          <div className="flex gap-6 mt-4 md:mt-0">
            {/* ECI Link */}
            <a
              href="https://www.eci.gov.in/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition"
            >
              Election Commission of India
            </a>

            {/* Contact Email */}
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
