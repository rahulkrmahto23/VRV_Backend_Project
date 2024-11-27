const User = require("../models/userSchema");
const { hash, compare } = require("bcrypt");
const { createToken } = require("../utils/token-manager");
const { COOKIE_NAME } = require("../utils/constrants");

const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find();
    return res.status(200).json({ message: "OK", users });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "ERROR", cause: error.message });
  }
};

const userSignup = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(401).send("User already registered");

    const hashedPassword = await hash(password, 10);
    const user = new User({
      name,
      email,
      password: hashedPassword,
      role: role || "CLIENT",
    });
    await user.save();

    const token = createToken(user._id.toString(), user.email, user.role, "7d");
    res.cookie(COOKIE_NAME, token, {
      httpOnly: true,
      signed: true,
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });

    return res
      .status(201)
      .json({ message: "User Registered", name: user.name, email: user.email });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "ERROR", cause: error.message });
  }
};

const userLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(401).send("User not registered");

    const isPasswordCorrect = await compare(password, user.password);
    if (!isPasswordCorrect) return res.status(403).send("Incorrect Password");

    const token = createToken(user._id.toString(), user.email, user.role, "7d");
    res.cookie(COOKIE_NAME, token, {
      httpOnly: true,
      signed: true,
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });

    return res.status(200).json({ message: "Login Successful" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "ERROR", cause: error.message });
  }
};

const userLogout = async (req, res, next) => {
  res.clearCookie(COOKIE_NAME);
  return res.status(200).json({ message: "Successfully Logged Out" });
};

module.exports = {
  getAllUsers,
  userSignup,
  userLogin,
  userLogout,
};
