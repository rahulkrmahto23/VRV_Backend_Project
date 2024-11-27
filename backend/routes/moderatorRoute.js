const { Router } = require("express");
const {
  getUserById,
  updateUser,
  requestPermission,
  getRequestStatus,
} = require("../controllers/moderatorController");
const { verifyToken } = require("../utils/token-manager");
const { ensureModerator } = require("../middleware/rbac");
const { ensureModeratorPermission } = require("../middleware/rbac");

const moderatorRoutes = Router();

// Request admin permission for an action
moderatorRoutes.post(
  "/request-permission",
  verifyToken,
  ensureModerator,
  requestPermission
);
//Request status for an action
moderatorRoutes.get(
  "/request-status",
  verifyToken,
  ensureModerator,
  getRequestStatus
);
// Get user details (requires permission)
moderatorRoutes.get(
  "/users/:id",
  verifyToken,
  ensureModeratorPermission,
  getUserById
);

// Update user details (requires permission)
moderatorRoutes.put(
  "/update-user/:id",
  verifyToken,
  ensureModeratorPermission,
  updateUser
);

module.exports = moderatorRoutes;
