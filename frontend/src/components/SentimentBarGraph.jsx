import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { motion } from "framer-motion";
import Loader from "./Loader";

const API_BASE = import.meta.env?.VITE_API_BASE || "http://localhost:5000";

const SentimentBarGraph = () => {
  const [tweetInput, setTweetInput] = useState("");
  const [chartData, setChartData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [positivePieData, setPositivePieData] = useState([]);
  const [negativePieData, setNegativePieData] = useState([]);
  const [partyInFavour, setPartyInFavour] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleInputChange = useCallback((event) => {
    setTweetInput(event.target.value);
  }, []);

  const fetchChartData = useCallback(async () => {
    try {
      setIsLoading(true);
      const { data } = await axios.get(`${API_BASE}/get_sentiment_data`);
      setChartData(data || []);

      const posPie = (data || []).map((p) => ({
        name: p.name,
        value: p.positive,
      }));
      const negPie = (data || []).map((p) => ({
        name: p.name,
        value: p.negative,
      }));
      setPositivePieData(posPie);
      setNegativePieData(negPie);

      if ((data || []).length > 0) {
        const fav = data.reduce(
          (best, cur) =>
            cur.positive > (best?.positive ?? -1) ? cur : best,
          null
        );
        setPartyInFavour(fav?.name || "");
      } else {
        setPartyInFavour("");
      }
    } catch (error) {
      console.error("Error fetching chart data:", error);
      setErrorMessage("Unable to load sentiment data.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    if (!tweetInput.trim()) return;

    try {
      setIsLoading(true);
      setErrorMessage("");
      const resp = await axios.post(`${API_BASE}/add_tweets`, {
        tweets: [tweetInput.trim()],
      });
      if (resp.status === 200) {
        setTweetInput("");
        await fetchChartData();
      }
    } catch (error) {
      setErrorMessage(
        error.response?.data?.error ||
          "Error adding tweet. Please try again later."
      );
      console.error("Error adding tweet:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchChartData();
  }, [fetchChartData]);

  const COLORS = [
    "#0088FE",
    "#00C49F",
    "#FFBB28",
    "#FF8042",
    "#A28DFF",
    "#FF69B4",
    "#7FDBFF",
    "#2ECC40",
    "#FF4136",
    "#B10DC9",
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center p-6">
      <motion.div
        className="w-[95%] md:w-[90%] max-w-6xl bg-white/80 backdrop-blur-lg p-8 rounded-2xl shadow-2xl"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h1 className="text-center text-3xl font-bold text-indigo-700 mb-6">
          Sentiment Analysis
        </h1>

        {/* Input Form */}
        <motion.form
          onSubmit={handleFormSubmit}
          className="flex flex-wrap justify-center items-center gap-3 mb-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <input
            type="text"
            value={tweetInput}
            onChange={handleInputChange}
            placeholder="Enter a tweet about a party..."
            className="w-72 md:w-96 p-3 border border-gray-300 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
          <button
            type="submit"
            className="px-5 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition duration-300 transform hover:scale-105"
          >
            Add Tweet
          </button>
        </motion.form>

        {/* Error */}
        {errorMessage && (
          <p className="text-center text-red-600 mb-4">{errorMessage}</p>
        )}

        {isLoading ? (
          <Loader />
        ) : (
          <>
            {/* 📊 Bar Graph */}
            <motion.div
              className="w-full h-[350px] md:h-[400px]"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={chartData}
                  margin={{ top: 20, right: 10, left: -10, bottom: 10 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="positive" fill="#75C1C1" barSize={18} />
                  <Bar dataKey="neutral" fill="#999" barSize={18} />
                  <Bar dataKey="negative" fill="#FF6384" barSize={18} />
                </BarChart>
              </ResponsiveContainer>
            </motion.div>

            {/* 🥧 Pie Charts */}
            <div className="flex flex-wrap justify-center gap-8 mt-10">
              {/* Positive Pie */}
              <motion.div
                className="w-[90%] md:w-[40%]"
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <h2 className="text-center text-lg font-semibold text-gray-700 mb-3">
                  Positive Sentiments
                </h2>
                <ResponsiveContainer width="100%" height={260}>
                  <PieChart>
                    <Pie
                      data={positivePieData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      label
                    >
                      {positivePieData.map((entry, index) => (
                        <Cell
                          key={`pos-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </motion.div>

              {/* Negative Pie */}
              <motion.div
                className="w-[90%] md:w-[40%]"
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                <h2 className="text-center text-lg font-semibold text-gray-700 mb-3">
                  Negative Sentiments
                </h2>
                <ResponsiveContainer width="100%" height={260}>
                  <PieChart>
                    <Pie
                      data={negativePieData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      label
                    >
                      {negativePieData.map((entry, index) => (
                        <Cell
                          key={`neg-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </motion.div>
            </div>

            {/* ✅ Party in Favor */}
            <motion.h3
              className="text-center mt-6 text-xl font-semibold text-green-600"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              Party in Favor: {partyInFavour || "—"}
            </motion.h3>
          </>
        )}
      </motion.div>
    </div>
  );
};

export default SentimentBarGraph;
