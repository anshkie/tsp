import React, { useState, useEffect } from "react";
import axios from "axios";
import { TailSpin } from "react-loader-spinner";
import EC from "elliptic";
import { Buffer } from 'buffer';

// Use Buffer in your code as usual
const buff = Buffer.from('some data');
const ec = new EC.ec("p256");
const privateKey = ec.keyFromPrivate("1");

// Function to decrypt the vote
const decryptVote = (ciphertext) => {
  const { c1, c2 } = ciphertext;  // Extract c1 and c2 from the ciphertext
  
  // Decode the elliptic curve points from hex
  const c1Point = ec.curve.decodePoint(Buffer.from(c1, 'hex'));
  const c2Point = ec.curve.decodePoint(Buffer.from(c2, 'hex'));

  // Use the private key (k) to decrypt
  const k = ec.keyFromPrivate(privateKey); // Assuming privateKey is the user's private key
  
  // Compute v = c2 - k * c1
  const decryptedPoint = c2Point.add(c1Point.mul(-k.priv));  // k * c1 is negated and added
  
  // The result is a point on the elliptic curve. To extract the message, you need to map it back to an integer.
  // In many cases, the x-coordinate of the point is used as the plaintext message.
  const decryptedVote = decryptedPoint.getX().toString(10);  // Use the x-coordinate for the vote
  
  return decryptedVote; // Return the decrypted vote as a string (or number)
};


const Results = () => {
  const [results, setResults] = useState({});
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchResults = async () => {
    try {
      const response = await axios.get("https://localhost:3001/get-votes");
      console.log("Full response:", response.data); // Log the entire response to check its structure
  
      // Check if the response contains an array and iterate through it
      if (Array.isArray(response.data)) {
        const decryptedResults = {};
  
        // Loop through the array and extract vote data
        response.data.forEach((item) => {
          if (item.vote) {
            console.log("Vote data for voter:", item.voterId, item.vote); // Log the vote for each voter
  
            // Assuming 'vote' is an object, you can now decrypt and process it
            const encryptedVote = item.vote;  // Assuming it contains the structure { c1: 'value', c2: 'value' }
  
            // Extract c1 and c2 separately
            const c1 = encryptedVote.c1;
            const c2 = encryptedVote.c2;
  
            
  
            // Now, pass c1 and c2 into the decrypt function
            const decryptedVote = decryptVote({ c1, c2 });
            console.log(decryptedVote)
            // Assuming decryptedVote returns a candidate name or ID
            if (decryptedVote) {
              if (!decryptedResults[decryptedVote]) {
                decryptedResults[decryptedVote] = 0;
              }
  
              decryptedResults[decryptedVote] += 1;  // Increment vote count for the decrypted candidate
            }
          }
        });
  
        // Set decrypted results
        setResults(decryptedResults);
        setIsLoading(false); // Stop loading when data is fetched
      } else {
        setError("No results available");
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Error fetching votes:", error);
      //setError("Error fetching results");
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
        ) : error ? (
          <p className="text-red-600 text-center text-lg">{error}</p>
        ) : Object.keys(results).length ? (
          <ul className="space-y-4">
            {Object.entries(results).map(([candidate, count]) => (
              <li
                key={candidate}
                className="flex justify-between items-center bg-gray-100 p-4 rounded-lg transition-all duration-200 hover:bg-gray-200"
              >
                <span className="font-semibold text-xl text-gray-800">
                  {candidate}
                </span>
                <span className="text-indigo-600 font-bold text-lg">
                  {count} {count === 1 ? "vote" : "votes"}
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-center text-gray-500 text-lg">
            Results not available yet.
          </p>
        )}

        {!isLoading && error && (
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
