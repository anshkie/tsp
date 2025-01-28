// config/db.js
const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(
      "mongodb+srv://shuklag868:118331@qdorehome.zww7i.mongodb.net/?retryWrites=true&w=majority&appName=qdorehome"
    );
    console.log("Successfully connected to MongoDB");
  } catch (error) {
    console.error(`MongoDB connection error: ${error.message}`);
    // Exit process with failure
    process.exit(1);
  }
};

connectDB();
