const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const { hashPass, comparePass } = require("../utils/hash");

const secret = process.env.JWT_SECRET;

exports.register = async (req, res) => {
  try {
    const { username, email, password, role } = req.body;

    if (role && !["user", "admin"].includes(role)) {
      return res
        .status(400)
        .json({ error: "Role must be either 'user' or 'admin'" });
    }

    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser)
      return res.status(400).json({ error: "User already exists" });

    const hashedPassword = await hashPass(password);
    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
      role,
    });

    const token = jwt.sign(
      { id: newUser._id, username, email, role: newUser.role },
      secret,
      { expiresIn: "1h" }
    );

    res
      .status(201)
      .json({ message: "User registered successfully", access_token: token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username });
    if (!user) return res.status(400).send("User not found");

    const isMatch = await comparePass(password, user.password);
    if (!isMatch) return res.status(400).send("Invalid password");

    const token = jwt.sign(
      {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
      secret,
      { expiresIn: "1h" }
    );

    res.status(200).json({ message: "Login successful", access_token: token });
  } catch (error) {
    res.status(500).send("Something went wrong");
  }
};
