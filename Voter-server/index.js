const express = require("express");
const mongoose = require("mongoose");
const https = require("https");
const fs = require("fs");
const cors = require("cors");
const Voter = require("./Model/Voter");
const axios = require("axios");

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors());

// MongoDB Connection
mongoose
  .connect("mongodb+srv://anshnew41:Swatigupta02@cluster0.wuvi1.mongodb.net/votingDB?retryWrites=true&w=majority")
  .then(() => console.log("MongoDB connected successfully"))
  .catch((err) => console.error("Detailed MongoDB connection error:", err));

// Create HTTPS Agent
const agent = new https.Agent({
  ca: fs.readFileSync("../ssl/server.crt"), // Provide the self-signed certificate
});
axios({
  method: 'get',
  url: 'https://localhost:3001/get-votes', // Make sure the protocol is 'https'
  httpsAgent: agent,
})
.then(response => {
  console.log(response.data);
})
.catch(error => {
  console.error('Error fetching votes:',error);
});
app.get("/get-votes", async (req, res) => {
  try {
    const votes = await Voter.find().limit(1000); // Limit to 1000 records
    res.json(votes);
  } catch (error) {
    console.error("Error fetching votes from database:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.post("/vote", async (req, res) => {
  const { voterId, vote } = req.body;

  if (!voterId || !vote) {
    return res.status(400).send("Missing voterId or vote");
  }

  try {
    console.log("Vote received:", { voterId, vote });

    const savedVote = await Voter.create({ voterId, vote });

    console.log("Vote saved successfully:", savedVote);

    res.status(200).send("Vote successfully recorded");
  } catch (err) {
    console.error("Error processing vote:", err);
    res.status(500).send("Internal Server Error");
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
