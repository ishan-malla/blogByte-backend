const express = require("express");
const userCollection = require("./userSchema");
require("dotenv").config();
const jwt = require("jsonwebtoken");
const bcryptjs = require("bcryptjs");
const cors = require("cors");
const postRoutes = require("./postRoutes");
const mongoose = require("mongoose");

const secret = process.env.JWT_SECRET;
const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());
app.use("/posts", postRoutes);

mongoose
  .connect("mongodb://localhost:27017/blogByte")
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Error connecting to MongoDB:", err));

async function hashPass(pass) {
  const salt = await bcryptjs.genSalt(10);
  return await bcryptjs.hash(pass, salt);
}

async function compare(userPass, hashPass) {
  return await bcryptjs.compare(userPass, hashPass);
}

app.post("/register", async (req, res) => {
  try {
    const { username, email, password, role } = req.body;

    if (role && !["user", "admin"].includes(role)) {
      return res
        .status(400)
        .json({ error: "Role must be either 'user' or 'admin'" });
    }

    const existingUser = await userCollection.findOne({
      $or: [{ username }, { email }],
    });
    if (existingUser)
      return res.status(400).json({ error: "User already exists" });

    const hashedPassword = await hashPass(password);
    const newUser = await userCollection.create({
      username,
      email,
      password: hashedPassword,
      role: role || "user",
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
});

app.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await userCollection.findOne({ username });
    if (!user) return res.status(400).send("User not found");

    const isMatch = await compare(password, user.password);
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
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
