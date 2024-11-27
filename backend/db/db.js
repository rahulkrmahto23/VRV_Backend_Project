const mongoose = require("mongoose");

const mongoURL = process.env.MONGO_URL_LOCAL;

console.log("Mongo URL:", mongoURL); // Add this line to check if the URL is loaded

if (!mongoURL) {
  console.error("MongoDB connection URL is missing.");
  process.exit(1); // Exit the application if the URL is not set
}

mongoose.connect(mongoURL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;

db.on("connected", () => {
  console.log("Connected to MongoDB server");
});

db.on("error", (err) => {
  console.error("MongoDB connection error:", err);
});

db.on("disconnected", () => {
  console.log("MongoDB disconnected");
});

module.exports = db;
