import React, { useState } from "react";
import { Lock, CheckCircle, XCircle } from "lucide-react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import axios from "axios";

const VotingForm = () => {
  const [voterId, setVoterId] = useState("");
  const [vote, setVote] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate(); // Use the navigate hook

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!voterId || !vote) {
      setMessage("Please complete all required fields");
      return;
    }

    try {
      const response = await axios.post("https://localhost:3001/vote", {
        voterId,
        vote,
      });

      setMessage(response.data);
      setTimeout(
        () => navigate("/results"),
        2000 // Redirect to /results page after 2 seconds
      );
    } catch (error) {
      console.error("Error submitting vote:", error);
      setMessage("Voting process encountered an error");
    }
  };

  const handleResultsRedirect = () => {
    navigate("/results"); // Redirect to /results page
  };

  // Handle the Login button click
  const handleLoginRedirect = () => {
    navigate("/login"); // Redirect to /login page
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-black flex items-center justify-center p-6">
      <div className="relative bg-gray-800 border-2 border-gray-700 shadow-2xl rounded-3xl p-10 w-full max-w-md transform transition-all hover:scale-105 ease-in-out duration-300">
        <div className="absolute top-4 right-4">
          <Lock className="text-gray-500 w-8 h-8" />
        </div>
        <h2 className="text-4xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-blue-600 mb-8 tracking-wide">
          Secure Voting Portal
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <input
            type="text"
            placeholder="Voter Authentication ID"
            value={voterId}
            onChange={(e) => setVoterId(e.target.value)}
            className="w-full px-6 py-4 bg-gray-700 text-white border-2 border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all placeholder-gray-500"
          />
          <select
            value={vote}
            onChange={(e) => setVote(e.target.value)}
            className="w-full px-6 py-4 bg-gray-700 text-white border-2 border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all"
          >
            <option value="" className="bg-gray-800">
              Select Candidate
            </option>
            <option value="Candidate A" className="bg-gray-800">
              Candidate A
            </option>
            <option value="Candidate B" className="bg-gray-800">
              Candidate B
            </option>
            <option value="Candidate C" className="bg-gray-800">
              Candidate C
            </option>
          </select>
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-teal-600 to-blue-700 text-white py-4 rounded-lg hover:opacity-90 transition-all font-semibold tracking-wider flex items-center justify-center space-x-2"
          >
            <span>Submit Secure Vote</span>
          </button>
        </form>

        {/* Login Button */}
        <button
          onClick={handleLoginRedirect}
          className="mt-4 w-full bg-gradient-to-r from-yellow-500 to-yellow-600 text-white py-4 rounded-lg hover:opacity-90 transition-all font-semibold tracking-wider"
        >
          Go to Login Page
        </button>

        {message && (
          <div className="mt-6 flex items-center justify-center space-x-2">
            {message.includes("Failed") ? (
              <XCircle className="text-red-500 w-6 h-6" />
            ) : (
              <CheckCircle className="text-green-500 w-6 h-6" />
            )}
            <p
              className={`text-center py-3 rounded-lg ${
                message.includes("Failed") ? "text-red-400" : "text-green-400"
              }`}
            >
              {message}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default VotingForm;
