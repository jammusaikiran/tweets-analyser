import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const NationalParties = () => {
  const [showList, setShowList] = useState(false);
  const [parties, setParties] = useState([]);
  const [selectedParty, setSelectedParty] = useState(null);

  useEffect(() => {
    fetch(
      "https://raw.githubusercontent.com/jammusaikiran/jigad/main/parties.json"
    )
      .then((response) => response.json())
      .then((data) => setParties(data))
      .catch((error) =>
        console.error("Error fetching the party data:", error)
      );
  }, []);

  const handlePartyClick = (party) => {
    setSelectedParty(party);
    setShowList(false); // ✅ closes drawer after selection
  };

  return (
    <div className="w-screen min-h-screen flex flex-col bg-gradient-to-r from-indigo-100 via-blue-50 to-cyan-100 font-sans">
      <div className="flex flex-grow w-full mt-[52px] md:mt-[60px] h-[calc(100vh-60px)]">
        {/* Sidebar (Desktop only) */}
        <div className="hidden md:flex flex-col w-1/4 lg:w-1/5 border-r bg-white shadow-lg overflow-y-auto h-full">
          <h2 className="text-xl font-semibold p-4 border-b border-gray-200 sticky top-0 bg-white z-10">
            National Parties
          </h2>
          <ul>
            {parties.map((party) => (
              <li
                key={party.name}
                className={`px-4 py-3 cursor-pointer transition-all duration-200 ${
                  selectedParty?.name === party.name
                    ? "bg-indigo-600 text-white font-medium"
                    : "hover:bg-indigo-100 text-gray-800"
                }`}
                onClick={() => handlePartyClick(party)}
              >
                {party.name}
              </li>
            ))}
          </ul>
        </div>

        {/* Right Panel */}
        <div className="flex-1 p-6 md:p-8 flex items-center justify-center relative">
          {/* Mobile Hamburger Button */}
          <button
            className="absolute top-2 left-2 md:hidden p-2 bg-white rounded-lg shadow-md"
            onClick={() => setShowList(true)}
          >
            {/* 3-line hamburger icon */}
            <div className="w-6 h-0.5 bg-gray-800 mb-1"></div>
            <div className="w-6 h-0.5 bg-gray-800 mb-1"></div>
            <div className="w-6 h-0.5 bg-gray-800"></div>
          </button>

          <AnimatePresence mode="wait">
            {selectedParty ? (
              <motion.div
                key={selectedParty.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
                className="bg-white shadow-xl rounded-2xl p-6 md:p-10 max-w-4xl w-full flex flex-col items-center"
              >
                <h2 className="text-2xl md:text-3xl font-bold mb-4 text-indigo-700 text-center">
                  {selectedParty.name}
                </h2>
                <img
                  src={selectedParty.symbol}
                  alt={`${selectedParty.name} symbol`}
                  className="w-48 h-48 md:w-64 md:h-64 object-contain rounded-lg shadow-md border border-gray-200 mb-6"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src =
                      "https://via.placeholder.com/200x200?text=No+Image";
                  }}
                />
                <p className="text-gray-700 text-lg leading-relaxed text-justify w-full">
                  {selectedParty.details}
                </p>
              </motion.div>
            ) : (
              <div className="flex justify-center items-center h-full text-gray-500 italic animate-pulse p-4 text-center">
                Select a party from the sidebar to view details.
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {showList && (
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 bg-black bg-opacity-40"
            onClick={() => setShowList(false)}
          >
            <div
              className="absolute left-0 top-0 bottom-0 w-64 bg-white shadow-lg overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center px-4 py-3 border-b border-gray-200 sticky top-0 bg-white z-10">
                <h2 className="font-semibold text-lg">National Parties</h2>
                <button
                  className="text-xl"
                  onClick={() => setShowList(false)}
                >
                  ✕
                </button>
              </div>
              <ul>
                {parties.map((party) => (
                  <li
                    key={party.name}
                    className={`px-4 py-3 cursor-pointer transition-all duration-200 ${
                      selectedParty?.name === party.name
                        ? "bg-indigo-600 text-white font-medium"
                        : "hover:bg-indigo-100 text-gray-800"
                    }`}
                    onClick={() => handlePartyClick(party)} // ✅ closes drawer after click
                  >
                    {party.name}
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NationalParties;
