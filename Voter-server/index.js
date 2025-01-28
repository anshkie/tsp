const express = require("express");
const mongoose = require("mongoose");
const https = require("https");
const http = require("http");
const fs = require("fs");
const cors = require("cors");
const Voter = require("./Model/Voter");
const axios = require("axios");
const app = express();
app.use(express.json());
app.use(cors());

// MongoDB Connection
mongoose
  .connect(
    "mongodb+srv://shuklag868:118331@tsplab1.8ayne.mongodb.net/?retryWrites=true&w=majority&appName=TSPlab1"
  )
  .then(() => console.log("MongoDB connected successfully"))
  .catch((err) => console.error("Detailed MongoDB connection error:", err));

const httpsAgent = new https.Agent({
  ca: fs.readFileSync("../ssl/server.crt"), // Provide the self-signed certificate
});

app.post("/vote", async (req, res) => {
  const { voterId, vote } = req.body;

  if (!voterId || !vote) {
    return res.status(400).send("Invalid vote data");
  }

  try {
    // Send the vote to Tally Server for recording
    const response = await axios.post(
      "https://localhost:3003/record-vote",
      { voterId, vote },
      { httpsAgent } // Use custom HTTPS agent with certificate
    );

    res.status(200).send(response.data.message);
  } catch (error) {
    console.error("Error recording vote:", error.message);
    res.status(500).send("Failed to record vote.");
  }
});

// SSL Configuration
try {
  const sslOptions = {
    key: fs.readFileSync("../ssl/server.key"),
    cert: fs.readFileSync("../ssl/server.crt"),
  };

  https.createServer(sslOptions, app).listen(3001, () => {
    console.log("Voter Server running on https://localhost:3001");
  });
} catch (certError) {
  console.error("SSL Certificate Error:", certError);
  process.exit(1);
}
