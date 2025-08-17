import React, { useState } from "react";
import axios from "axios";

const ImageUpload = () => {
  const [file, setFile] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const API_BASE = import.meta.env.VITE_API_BASE;

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    setResult(null);
    setError(null);
    setImageUrl(null);

    if (selectedFile) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageUrl(reader.result);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setError("⚠️ Please select a file");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    setIsLoading(true);

    try {
      const response = await axios.post(`${API_BASE}/upload`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setResult(response.data.result);
      setError(null);
    } catch (err) {
      setError("❌ Error uploading file. Please try again.");
      setResult(null);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-white to-pink-100 flex flex-col items-center justify-start p-6 space-y-10">
      
      {/* Upload + Preview */}
      <div className="w-full max-w-4xl grid md:grid-cols-2 gap-8">
        
        {/* Upload Section */}
        <div className="bg-white shadow-2xl rounded-2xl p-8 hover:shadow-indigo-300 transition duration-300">
          <h2 className="text-2xl font-bold text-indigo-700 text-center mb-6">
            Upload Political Party Image
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="file"
              onChange={handleFileChange}
              className="w-full border border-indigo-300 text-sm rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <button
              type="submit"
              className="w-full py-3 rounded-lg text-white font-semibold bg-indigo-600 hover:bg-indigo-700 transition duration-300"
              disabled={isLoading}
            >
              {isLoading ? "⏳ Analyzing..." : "📤 Upload & Analyze"}
            </button>
          </form>

          {/* Error */}
          {error && (
            <div className="mt-4 text-red-600 bg-red-100 p-3 rounded-lg text-sm">
              {error}
            </div>
          )}
        </div>

        {/* Preview Section */}
        <div className="flex flex-col items-center justify-center">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt="Uploaded Preview"
              className="rounded-2xl shadow-2xl max-h-[400px] object-contain border-4 border-indigo-200"
            />
          ) : (
            <p className="text-gray-500 italic">No image selected yet. 📷</p>
          )}
        </div>
      </div>

      {/* Full Width Result Section */}
      {result && (
        <div className="w-full max-w-6xl bg-white shadow-xl rounded-2xl p-8 mt-6">
          <h4 className="text-xl font-bold text-gray-700 mb-4">
            ✅ Analysis Result
          </h4>
          <ul className="grid md:grid-cols-2 gap-4">
            {result.map((item, index) => (
              <li
                key={index}
                className="p-4 bg-indigo-50 rounded-lg text-gray-800 shadow-sm hover:bg-indigo-100 transition"
              >
                {item}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
