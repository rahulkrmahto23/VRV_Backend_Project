const { roles } = require("../utils/constrants");
const ModeratorRequest = require("../models/moderatorRequestSchema");

const ensureAdmin = (req, res, next) => {
  const { role } = res.locals.jwtData;
  if (role === roles.admin) {
    return next();
  }
  return res.status(403).json({ message: "Access Denied: Admins Only" });
};

const ensureModerator = (req, res, next) => {
  const { role } = res.locals.jwtData;
  if (role === roles.admin || role === roles.moderator) {
    return next();
  }
  return res.status(403).json({ message: "Access Denied: Moderators Only" });
};

const ensureModeratorPermission = async (req, res, next) => {
  const { id: moderatorId } = res.locals.jwtData;
  const currentTime = new Date();

  const request = await ModeratorRequest.findOne({
    moderatorId,
    status: "APPROVED",
    expiresAt: { $gte: currentTime },
  });

  if (!request) {
    return res.status(403).json({
      message: "Access Denied: Moderator permission required or expired",
    });
  }

  next();
};

module.exports = {
  ensureAdmin,
  ensureModerator,
  ensureModeratorPermission
};
