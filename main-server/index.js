const https = require("https");
const express = require("express");
const fs = require("fs");
const bodyParser = require("body-parser");
const cors = require("cors");

const mongoose = require("mongoose");
const Vote = require("./Model/Vote");

const app = express();
app.use(bodyParser.json());
app.use(cors());

mongoose
  .connect(
    "mongodb+srv://shuklag868:118331@tsplab1.8ayne.mongodb.net/?retryWrites=true&w=majority&appName=TSPlab1",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => {
    console.log("Connected to MongoDB (Voter Server)");
  })
  .catch((err) => console.error(err));

const votes = [];

// Route to receive votes
app.post("/receive-vote", async (req, res) => {
  const { voterId, vote } = req.body;

  if (!voterId || !vote) {
    return res.status(400).send("Invalid vote data");
  }

  try {
    const newVote = new Vote({ voterId, vote });
    await newVote.save(); // Save to MongoDB

    console.log(`Vote from voter ${voterId} recorded.`);
    res.send("Vote recorded");
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Error saving vote");
  }
});

// Route to send votes to the Tally Server
app.get("/send-tally", async (req, res) => {
  try {
    const votes = await Vote.find(); // Retrieve all votes
    res.json({ votes });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Error retrieving votes");
  }
});

const sslOptions = {
  key: fs.readFileSync("../ssl/server.key"),
  cert: fs.readFileSync("../ssl/server.crt"),
};

https.createServer(sslOptions, app).listen(3002, () => {
  console.log("Main Server running on https://localhost:3002");
});
