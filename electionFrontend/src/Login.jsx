import React, { useState, useEffect } from "react";
import { Lock, CheckCircle, XCircle } from "lucide-react";
import { TailSpin } from "react-loader-spinner";
import axios from "axios"; // Import axios for API call

const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Track if logged in
  const [voteResults, setVoteResults] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!username || !password) {
      setMessage("Please complete all required fields");
      return;
    }

    // Dummy authentication logic (replace with real authentication)
    if (username === "gaurav" && password === "gaurav") {
      setMessage("Login successful");
      setIsLoggedIn(true); // Mark as logged in
      fetchResults(); // Fetch results from MongoDB
      fetchBlockchainData(); // Fetch blockchain data and log it
    } else {
      setMessage("Invalid credentials");
    }
  };

  const fetchResults = async () => {
    setIsLoading(true);
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
      setVoteResults(response.data.results); // Set vote results
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching results:", error);
      setMessage("Failed to fetch results");
      setIsLoading(false);
    }
  };

  const fetchBlockchainData = async () => {
    try {
      // Fetch blockchain data
      const response = await axios.get("https://localhost:3003/blockchain", {
        headers: {
          "Content-Type": "application/json",
        },
      });

      // Log blockchain data in terminal
      console.log("Blockchain Data:", response.data);
    } catch (error) {
      console.error("Error fetching blockchain:", error);
      setMessage("Failed to fetch blockchain data");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-black flex items-center justify-center p-6">
      <div className="relative bg-gray-800 border-2 border-gray-700 shadow-2xl rounded-3xl p-10 w-full max-w-md transform transition-all hover:scale-105 ease-in-out duration-300">
        <div className="absolute top-4 right-4">
          <Lock className="text-gray-500 w-8 h-8" />
        </div>
        <h2 className="text-4xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-blue-600 mb-8 tracking-wide">
          Login to Secure Voting
        </h2>
        {!isLoggedIn ? (
          <>
            <form onSubmit={handleLogin} className="space-y-6">
              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-6 py-4 bg-gray-700 text-white border-2 border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all placeholder-gray-500"
              />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-6 py-4 bg-gray-700 text-white border-2 border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all placeholder-gray-500"
              />
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-teal-600 to-blue-700 text-white py-4 rounded-lg hover:opacity-90 transition-all font-semibold tracking-wider flex items-center justify-center space-x-2"
              >
                <span>Login</span>
              </button>
            </form>
            {message && (
              <div className="mt-6 flex items-center justify-center space-x-2">
                {message.includes("Invalid") ? (
                  <XCircle className="text-red-500 w-6 h-6" />
                ) : (
                  <CheckCircle className="text-green-500 w-6 h-6" />
                )}
                <p
                  className={`text-center py-3 rounded-lg ${
                    message.includes("Invalid")
                      ? "text-red-400"
                      : "text-green-400"
                  }`}
                >
                  {message}
                </p>
              </div>
            )}
          </>
        ) : (
          // After successful login, show vote results with total vote count for each candidate
          <div className="space-y-4">
            <h3 className="text-3xl font-bold text-center text-gray-900 mb-6">
              Vote Tally
            </h3>
            {isLoading ? (
              <div className="flex justify-center items-center">
                <TailSpin color="#4B7BEC" height={50} width={50} />
              </div>
            ) : Object.keys(voteResults).length ? (
              <ul className="space-y-4">
                {Object.entries(voteResults).map(([candidate, votes]) => (
                  <li
                    key={candidate}
                    className="flex justify-between items-center bg-gray-100 p-4 rounded-lg transition-all duration-200 hover:bg-gray-200"
                  >
                    <span className="font-semibold text-xl text-gray-800">
                      {candidate}
                    </span>
                    <span className="text-indigo-600 font-bold text-lg">
                      Total Votes: {votes}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-center text-gray-500 text-lg">
                Results not available yet.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default LoginPage;
