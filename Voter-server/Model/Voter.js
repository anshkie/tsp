const mongoose = require("mongoose");

const VoterSchema = new mongoose.Schema({
  voterId: { type: String, required: true, unique: true },
  vote: { 
    type: Object,  // Change from String to Object
    required: true 
  },
});

module.exports = mongoose.model("Voter", VoterSchema);
