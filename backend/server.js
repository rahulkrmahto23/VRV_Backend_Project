require('dotenv').config(); // Load environment variables from .env

const express = require("express");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const appRouter = require("./routes/AppRoute");
const app = express();


// Check and log MongoDB connection URL
const mongoURL = process.env.MONGO_URL_LOCAL;
console.log("Mongo URL:", mongoURL);

if (!mongoURL) {
  console.error("MongoDB connection URL is missing.");
  process.exit(1); // Exit if MongoDB URL is not provided
}

// Connect to MongoDB
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

// Middleware
app.use(express.json());
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use("/api/v1", appRouter);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something went wrong!");
});


// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
