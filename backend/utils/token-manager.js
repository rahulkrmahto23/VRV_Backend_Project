const jwt = require("jsonwebtoken");
const { COOKIE_NAME } = require("./constrants");

const createToken = (id, email, role, expiresIn) => {
  const payload = { id, email, role };
  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn,
  });
  return token;
};

const verifyToken = async (req, res, next) => {
  const token = req.signedCookies[COOKIE_NAME];
  if (!token || token.trim() === "") {
    return res.status(401).json({ message: "Token Not Received" });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: "Token Expired" });
    }
    res.locals.jwtData = decoded;
    next();
  });
};

module.exports = {
  createToken,
  verifyToken,
};
