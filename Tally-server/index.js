const https = require("https");

const express = require("express");

const fs = require("fs");

const bodyParser = require("body-parser");

const cors = require("cors");

const mongoose = require("mongoose");
const axios = require("axios");
// const { ethers } = require("ethers");
const Voter = require("../Voter-server/Model/Voter");
const app = express();
app.use(bodyParser.json());

app.use(cors());




const httpsAgent = new https.Agent({
  rejectUnauthorized: false, // Bypasses SSL certificate validation
});

axios({
  method: 'get',
  url: 'https://localhost:3001/get-votes', // Ensure using HTTPS
  httpsAgent: httpsAgent,                   // Use the agent here
})
.then(response => {
  console.log(response.data);
  const votes = response.data
})
.catch(error => {
  console.error('Error fetching votes:', error.message);
});


mongoose

  .connect(
    // "mongodb+srv://shuklag868:118331@tsplab1.8ayne.mongodb.net/?retryWrites=true&w=majority&appName=TSPlab1"
    "mongodb+srv://anshnew41:Swatigupta02@cluster0.wuvi1.mongodb.net/votingDB?retryWrites=true&w=majority"
  )

  .then(() => console.log("Connected to MongoDB"))

  .catch((err) => console.error(err));

 

  app.get("/compute-tally", async (req, res) => {
    try {
      // Add a timeout option
      const response = await axios.get("https://localhost:3001/get-votes", {
        //timeout: 10000, // 5 seconds
      });
      const votes = response.data;
  
      if (!votes.length) {
        return res.status(404).json({ message: "No votes found" });
      }
  
      // Process votes
      const results = votes.reduce((acc, curr) => {
        const voteKey = curr.vote;
        acc[voteKey] = (acc[voteKey] || 0) + 1;
        return acc;
      }, {});
  
      res.json({ results });
    } catch (error) {
      console.error("Error fetching votes:", error.message);
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

    // const tx = await contract.recordVote(voterId, vote);

    // console.log("Transaction sent:", tx.hash);

    // Wait for the transaction to be mined

  //   const receipt = await tx.wait();

  //   console.log("Transaction mined:", receipt);

  //   res.status(200).json({
  //     message: "Vote successfully recorded in Ethereum blockchain.",

  //     transactionReceipt: receipt,
  //   });
  } catch (error) {
    console.error("Error recording vote:", error);

    res.status(500).json({ error: "Internal server error." });
  }
});

// app.get("/blockchain", async (req, res) => {
//   try {
//     const votesCount = await contract.getVotesCount();

//     const votes = [];

//     for (let i = 0; i < votesCount; i++) {
//       const [voterId, vote] = await contract.getVote(i);

//       votes.push({ voterId, vote });
//     }

//     res.status(200).json(votes);
//   } catch (error) {
//     console.error("Error fetching blockchain data:", error);

//     res.status(500).json({ error: "Internal server error." });
//   }
// });

const sslOptions = {
  key: fs.readFileSync("../ssl/server.key"),

  cert: fs.readFileSync("../ssl/server.crt"),
};

https.createServer(sslOptions, app).listen(3003, () => {
  console.log("Tally Server running on https://localhost:3003");
});
