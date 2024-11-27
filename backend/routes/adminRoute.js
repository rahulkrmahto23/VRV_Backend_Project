const { Router } = require("express");
const {
  getAllUsers,
  addUser,
  updateUser,
  deleteUser,
  verifyUser,
  getModeratorRequests,
  manageRequest,
} = require("../controllers/adminController");
const { verifyToken } = require("../utils/token-manager");
const { ensureAdmin } = require("../middleware/rbac");

const adminRoutes = Router();

// Admin routes
adminRoutes.get("/users", verifyToken, ensureAdmin, getAllUsers); // List all users
adminRoutes.post("/add-user", verifyToken, ensureAdmin, addUser); // Add new user
adminRoutes.put("/update-user/:id", verifyToken, ensureAdmin, updateUser); // Update user by ID
adminRoutes.delete("/delete-user/:id", verifyToken, ensureAdmin, deleteUser); // Delete user by ID
adminRoutes.get("/auth-status", verifyToken, verifyUser);//get the active status


// Manage moderator requests
adminRoutes.get("/moderator-requests", verifyToken, ensureAdmin, getModeratorRequests);
adminRoutes.put("/manage-request/:id", verifyToken, ensureAdmin, manageRequest);

module.exports = adminRoutes;
