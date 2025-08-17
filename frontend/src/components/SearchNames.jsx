import React, { useState, useEffect } from "react";
import Papa from "papaparse";
import axios from "axios";

const SearchNames = () => {
  const [csvData, setCsvData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [suggestions, setSuggestions] = useState([]);

  // Fetch CSV data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "https://raw.githubusercontent.com/jammusaikiran/Candidate-details/main/election_2024_data.csv"
        );
        const results = Papa.parse(response.data, { header: true });
        setCsvData(results.data);
      } catch (error) {
        console.error("Error fetching CSV data:", error);
      }
    };
    fetchData();
  }, []);

  // Handle search
  const handleSearch = () => {
    const query = searchQuery.trim().toUpperCase();
    if (!query) return;

    const candidate = csvData.find(
      (row) => row.Candidate && row.Candidate.toUpperCase() === query
    );

    if (candidate) {
      setSearchResults([candidate]);
    } else {
      const filteredData = csvData.filter(
        (row) => row.constituency && row.constituency.toUpperCase() === query
      );
      setSearchResults(filteredData);
    }
  };

  // Handle input change & suggestions
  const handleInputChange = (e) => {
    const value = e.target.value.toUpperCase();
    setSearchQuery(value);

    if (value) {
      const filteredSuggestions = csvData
        .filter(
          (row) =>
            (row.Candidate && row.Candidate.toUpperCase().includes(value)) ||
            (row.constituency &&
              row.constituency.toUpperCase().includes(value))
        )
        .map((row) => `${row.Candidate} (${row.constituency})`);

      setSuggestions(Array.from(new Set(filteredSuggestions)));
    } else {
      setSuggestions([]);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    const selectedValue = suggestion.split(" (")[0].toUpperCase();
    setSearchQuery(selectedValue);
    setSuggestions([]);
    handleSearch();
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSearch();
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 p-6 text-white">
      <h1 className="text-3xl md:text-4xl font-extrabold text-center mb-8 animate-fade">
        🔎 Search Candidate or Constituency
      </h1>

      {/* Search Input */}
      <div className="relative max-w-2xl mx-auto mb-6">
        <div className="flex shadow-lg rounded-lg overflow-hidden">
          <input
            type="text"
            className="flex-grow px-4 py-3 text-black focus:outline-none text-base"
            placeholder="Enter candidate name or constituency"
            value={searchQuery}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
          />
          <button
            className="px-6 bg-pink-600 hover:bg-pink-700 transition text-white font-semibold"
            onClick={handleSearch}
          >
            Search
          </button>
        </div>

        {/* Suggestions Dropdown */}
        {suggestions.length > 0 && (
          <ul className="absolute w-full mt-2 bg-white text-black rounded-lg shadow-lg max-h-60 overflow-y-auto z-50">
            {suggestions.map((suggestion, index) => (
              <li
                key={index}
                className="px-4 py-2 hover:bg-gray-200 cursor-pointer text-sm"
                onClick={() => handleSuggestionClick(suggestion)}
              >
                {suggestion}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Results Table */}
      {searchResults.length > 0 ? (
        <div className="overflow-x-auto bg-white/10 backdrop-blur-md rounded-2xl shadow-xl p-6 max-w-6xl mx-auto">
          <h3 className="text-2xl font-semibold text-center mb-6">
            Search Results
          </h3>
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white text-left text-sm md:text-base">
                <th className="px-4 py-2">Constituency</th>
                <th className="px-4 py-2">State</th>
                <th className="px-4 py-2">Image</th>
                <th className="px-4 py-2">Status</th>
                <th className="px-4 py-2">Vote</th>
                <th className="px-4 py-2">Margin</th>
                <th className="px-4 py-2">Candidate</th>
                <th className="px-4 py-2">Party</th>
              </tr>
            </thead>
            <tbody>
              {searchResults.map((row, index) => (
                <tr
                  key={index}
                  className="odd:bg-white/5 even:bg-white/10 hover:bg-white/20 transition text-sm md:text-base"
                >
                  <td className="px-4 py-3">{row.constituency}</td>
                  <td className="px-4 py-3">{row.state}</td>
                  <td className="px-4 py-3">
                    <img
                      src={row.Image}
                      alt={row.Candidate}
                      className="w-14 h-14 object-cover rounded-lg border"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src =
                          "https://via.placeholder.com/60x60?text=No+Image";
                      }}
                    />
                  </td>
                  <td className="px-4 py-3">{row.status}</td>
                  <td className="px-4 py-3">{row.Vote}</td>
                  <td className="px-4 py-3">{row.Margin}</td>
                  <td className="px-4 py-3 font-semibold">
                    {row.Candidate}
                  </td>
                  <td className="px-4 py-3">{row.Party}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        searchQuery && (
          <p className="text-center text-gray-200 mt-6">
            No results found for "{searchQuery}"
          </p>
        )
      )}
    </div>
  );
};

export default SearchNames;
