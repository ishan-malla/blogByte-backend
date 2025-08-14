const mongoose = require("mongoose");

mongoose
  .connect("mongodb://localhost:27017/blogByte")
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Error connecting to MongoDB:", err));

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    required: true,
    enum: ["user", "admin"],
    default: "user",
  },
  token: {
    type: String,
  },
});

const Collection = mongoose.model("UserCollection", userSchema);

module.exports = Collection;
