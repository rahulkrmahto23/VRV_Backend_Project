const User = require("../models/userSchema"); // Assuming the User schema exists
const ModeratorRequest = require("../models/moderatorRequestSchema");
const { hash } = require("bcrypt");

// Get User Details by ID
const getUserById = async (req, res) => {
  try {
    const { id } = req.params; // User ID from request params
    const user = await User.findById(id);
    if (!user) return res.status(404).send("User not found");

    return res.status(200).json({ message: "User fetched successfully", user });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "ERROR", cause: error.message });
  }
};

// Update User Information
const updateUser = async (req, res) => {
  try {
    const { id } = req.params; // User ID to update
    const { name, email, password, role } = req.body;

    const user = await User.findById(id);
    if (!user) return res.status(404).send("User not found");

    // Update fields if provided
    if (name) user.name = name;
    if (email) user.email = email;
    if (password) user.password = await hash(password, 10); // Hash new password
    if (role) user.role = role;

    await user.save(); // Save updated user

    return res.status(200).json({ message: "User updated successfully", user });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "ERROR", cause: error.message });
  }
};

// Request Permission (Moderator Action)
const requestPermission = async (req, res) => {
  try {
    const { id } = res.locals.jwtData; // Moderator ID from JWT
    const { action } = req.body;

    const existingRequest = await ModeratorRequest.findOne({
      moderatorId: id,
      status: "PENDING",
    });

    if (existingRequest) {
      return res.status(400).json({ message: "Existing request already pending" });
    }

    const newRequest = new ModeratorRequest({
      moderatorId: id,
      action,
      status: "PENDING", // Default status
    });

    await newRequest.save();
    return res.status(201).json({ message: "Request submitted", request: newRequest });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "ERROR", cause: error.message });
  }
};

// Check Moderator Request Status
const getRequestStatus = async (req, res) => {
  try {
    const { id } = res.locals.jwtData; // Moderator ID from JWT

    const request = await ModeratorRequest.findOne({ moderatorId: id }).sort({ createdAt: -1 });

    if (!request) {
      return res.status(404).json({ message: "No request found" });
    }

    return res.status(200).json({
      message: "Request status fetched successfully",
      request: {
        id: request._id,
        action: request.action,
        status: request.status,
        createdAt: request.createdAt,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "ERROR", cause: error.message });
  }
};

module.exports = {
  getUserById,
  updateUser,
  requestPermission,
  getRequestStatus, // Export the new function
};
