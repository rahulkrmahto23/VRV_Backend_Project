const mongoose = require("mongoose");

const moderatorRequestSchema = new mongoose.Schema({
  moderatorId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  action: { type: String, required: true },
  status: { type: String, enum: ["PENDING", "APPROVED", "DENIED"], default: "PENDING" },
  expiresAt: { type: Date }, // Expiration time for approved requests
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("ModeratorRequest", moderatorRequestSchema);
