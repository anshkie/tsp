import React, { useState, useEffect } from "react";
import axios from "axios";
import { TailSpin } from "react-loader-spinner";

const Results = () => {
  const [results, setResults] = useState({});
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const fetchResults = async () => {
    try {
      const response = await axios.post(
        "https://localhost:3003/compute-tally",
        {},
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      setResults(response.data.results);
      setIsLoading(false);
    } catch (error) {
      console.error(
        "Full error details:",
        error.response ? error.response.data : error
      );
      setMessage(error.response?.data?.message || "Failed to fetch results");
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchResults();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-400 to-purple-500 flex items-center justify-center p-6">
      <div className="bg-white shadow-lg rounded-3xl p-10 w-full max-w-2xl transform transition-all hover:scale-105 ease-in-out duration-300">
        <h2 className="text-4xl font-extrabold text-center text-gray-900 mb-8 tracking-wide">
          Election Results
        </h2>
        {message && (
          <p className="bg-red-100 text-red-800 text-center py-3 rounded-lg mb-6 text-lg">
            {message}
          </p>
        )}
        {isLoading ? (
          <div className="flex justify-center items-center">
            <TailSpin color="#4B7BEC" height={50} width={50} />
          </div>
        ) : Object.keys(results).length ? (
          <ul className="space-y-4">
            {Object.entries(results).map(([candidate]) => (
              <li
                key={candidate}
                className="flex justify-between items-center bg-gray-100 p-4 rounded-lg transition-all duration-200 hover:bg-gray-200"
              >
                <span className="font-semibold text-xl text-gray-800">
                  {candidate}
                </span>
                <span className="text-indigo-600 font-bold text-lg">
                  Vote has been given to {candidate}
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-center text-gray-500 text-lg">
            Results not available yet.
          </p>
        )}
        {message && !isLoading && (
          <div className="text-center mt-6">
            <button
              onClick={fetchResults}
              className="bg-teal-500 text-white py-2 px-6 rounded-lg hover:bg-teal-600 transition duration-300"
            >
              Retry
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Results;
