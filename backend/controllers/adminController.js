const User = require("../models/userSchema");
const ModeratorRequest = require("../models/moderatorRequestSchema");
const { hash } = require("bcrypt");

// Get all users (Admin only)
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    return res.status(200).json({ message: "OK", users });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "ERROR", cause: error.message });
  }
};

// Add a new user (Admin adding a client or another user)
const addUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).send("User already exists");

    const hashedPassword = await hash(password, 10);
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role: role || "CLIENT", // Default role is CLIENT
    });

    await newUser.save();
    return res.status(201).json({
      message: "User added successfully",
      user: { name: newUser.name, email: newUser.email, role: newUser.role },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "ERROR", cause: error.message });
  }
};

// Update user data
const updateUser = async (req, res) => {
  try {
    const { id } = req.params; // User ID to update
    const { name, email, password, role } = req.body;

    const user = await User.findById(id);
    if (!user) return res.status(404).send("User not found");

    // Update fields if provided
    if (name) user.name = name;
    if (email) user.email = email;
    if (password) user.password = await hash(password, 10); // Rehash password
    if (role) user.role = role;

    await user.save();
    return res.status(200).json({
      message: "User updated successfully",
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "ERROR", cause: error.message });
  }
};

// Delete a user
const deleteUser = async (req, res) => {
    try {
      const { id } = req.params; // User ID to delete
      const user = await User.findById(id);
      if (!user) return res.status(404).send("User not found");
  
      // Use deleteOne for the found user or use findByIdAndDelete directly
      await User.deleteOne({ _id: id });
  
      return res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "ERROR", cause: error.message });
    }
  };
  const verifyUser = async (req, res, next) => {
    try {
      const user = await User.findById(res.locals.jwtData.id);
      if (!user) {
        return res.status(401).send("User not registered OR Token malfunctioned");
      }
      if (user._id.toString() !== res.locals.jwtData.id) {
        return res.status(401).send("Permissions didn't match");
      }
      return res
        .status(200)
        .json({ message: "User Verified", name: user.name, email: user.email });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: "ERROR", cause: error.message });
    }
  };

  const getModeratorRequests = async (req, res) => {
    try {
      const requests = await ModeratorRequest.find().populate("moderatorId", "name email");
      return res.status(200).json({ message: "Requests fetched successfully", requests });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "ERROR", cause: error.message });
    }
  };
  
  const manageRequest = async (req, res) => {
    try {
      const { id } = req.params; // Request ID
      const { status, expiresIn } = req.body; // New status and optional expiration period
  
      const request = await ModeratorRequest.findById(id);
      if (!request) {
        return res.status(404).json({ message: "Request not found" });
      }
  
      if (status === "APPROVED") {
        request.status = "APPROVED";
        request.expiresAt = new Date(Date.now() + expiresIn * 60 * 1000); // expiresIn is in minutes
      } else if (status === "DENIED") {
        request.status = "DENIED";
      }
  
      await request.save();
      return res.status(200).json({ message: "Request updated", request });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "ERROR", cause: error.message });
    }
  };

module.exports = {
  getAllUsers,
  addUser,
  updateUser,
  deleteUser,
  verifyUser,
  getModeratorRequests,
  manageRequest,
};
