const { Router } = require("express");
const userRoutes = require("./userRoutes");
const adminRoutes = require("./adminRoute");
const moderatorRoutes = require("./moderatorRoute");

const appRouter = Router();
appRouter.use("/user", userRoutes);
appRouter.use("/admin",adminRoutes);
appRouter.use("/moderator",moderatorRoutes)

module.exports = appRouter;
