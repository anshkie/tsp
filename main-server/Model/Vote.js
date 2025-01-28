const mongoose = require("mongoose");

const VoteSchema = new mongoose.Schema({
  voterId: { type: String, required: true },
  vote: { type: String, required: true },
});

module.exports = mongoose.model("Vote", VoteSchema);
