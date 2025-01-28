const https = require("https");

const express = require("express");

const fs = require("fs");

const bodyParser = require("body-parser");

const cors = require("cors");

const mongoose = require("mongoose");

const { ethers } = require("ethers");
const Voter = require("../Voter-server/Model/Voter");
const app = express();
app.use(bodyParser.json());

app.use(cors());

// Your contract ABI and address (use actual deployed values)

const contractABI = [
  "function recordVote(string memory voterId, string memory vote) public",

  "function getVotesCount() public view returns (uint)",

  "function getVote(uint index) public view returns (string memory, string memory)",
];

const contractAddress = "0x8701ebD1d8E659d7C623b2f64F475cfA0Cc96A7d"; // Replace with your contract's address

// Setup Ethereum provider and signer (using MetaMask or another provider)

const provider = new ethers.JsonRpcProvider(
  "https://eth-sepolia.g.alchemy.com/v2/2RAstjDVy4b5ylTR3Lkhz01ROhjByYw_"
); // Replace with your Ethereum node provider URL

const signer = new ethers.Wallet(
  "bf06ba3c792c92cbe98d28019ba28a495df89183044a11f0acfb96b07056c00f",

  provider
); // Use your private key or MetaMask

// Create contract instance

const contract = new ethers.Contract(contractAddress, contractABI, signer);

// MongoDB connection (optional, if you still want to save to MongoDB)

mongoose

  .connect(
    "mongodb+srv://shuklag868:118331@tsplab1.8ayne.mongodb.net/?retryWrites=true&w=majority&appName=TSPlab1"
  )

  .then(() => console.log("Connected to MongoDB"))

  .catch((err) => console.error(err));

app.post("/compute-tally", async (req, res) => {
  try {
    const votes = await Voter.find();
    if (!votes.length) {
      return res.status(404).json({ message: "No votes found" });
    }

    const results = votes.reduce((acc, curr) => {
      acc[curr.vote] = (acc[curr.vote] || 0) + 1;
      return acc;
    }, {});

    res.json({ results });
  } catch (error) {
    console.error("Error fetching votes:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.post("/record-vote", async (req, res) => {
  const { voterId, vote } = req.body;

  if (!voterId || !vote) {
    return res.status(400).json({ error: "Voter ID and vote are required." });
  }

  try {
    // 1. Save vote in MongoDB (optional, if you still want to persist in DB)

    // If you're still storing votes in MongoDB:

    const newVote = new Voter({ voterId, vote });

    await newVote.save();

    // 2. Record vote in Ethereum blockchain

    const tx = await contract.recordVote(voterId, vote);

    console.log("Transaction sent:", tx.hash);

    // Wait for the transaction to be mined

    const receipt = await tx.wait();

    console.log("Transaction mined:", receipt);

    res.status(200).json({
      message: "Vote successfully recorded in Ethereum blockchain.",

      transactionReceipt: receipt,
    });
  } catch (error) {
    console.error("Error recording vote:", error);

    res.status(500).json({ error: "Internal server error." });
  }
});

app.get("/blockchain", async (req, res) => {
  try {
    const votesCount = await contract.getVotesCount();

    const votes = [];

    for (let i = 0; i < votesCount; i++) {
      const [voterId, vote] = await contract.getVote(i);

      votes.push({ voterId, vote });
    }

    res.status(200).json(votes);
  } catch (error) {
    console.error("Error fetching blockchain data:", error);

    res.status(500).json({ error: "Internal server error." });
  }
});

const sslOptions = {
  key: fs.readFileSync("../ssl/server.key"),

  cert: fs.readFileSync("../ssl/server.crt"),
};

https.createServer(sslOptions, app).listen(3003, () => {
  console.log("Tally Server running on https://localhost:3003");
});
