const { Router } = require("express");
const {
  getAllUsers,
  userSignup,
  userLogin,
  userLogout
} = require("../controllers/userControllers");
const { validate, signupValidator, loginValidator } = require("../utils/validator");
const { verifyToken } = require("../utils/token-manager");
const { ensureAdmin, ensureModerator } = require("../middleware/rbac");

const userRoutes = Router();

userRoutes.get("/", verifyToken, ensureAdmin, getAllUsers);
userRoutes.post("/signup", validate(signupValidator), userSignup);
userRoutes.post("/login", validate(loginValidator), userLogin);
userRoutes.get("/logout", verifyToken, userLogout);

module.exports = userRoutes;
