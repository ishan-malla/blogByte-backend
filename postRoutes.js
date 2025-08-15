const express = require("express");
const router = express.Router();
const multer = require("multer");
const fs = require("fs");
const cloudinary = require("./cloudinary");
const postSchema = require("./postSchema");
const authMiddleware = require("./authmiddleware");

const upload = multer({ dest: "uploads/" });

router.post("/", authMiddleware, upload.single("image"), async (req, res) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Access denied. Admins only." });
  }

  try {
    let imageUrl = null;

    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "posts",
      });
      imageUrl = result.secure_url;
      fs.unlinkSync(req.file.path);
    }

    const newPost = await postSchema.create({
      title: req.body.title,
      content: req.body.content,
      author: req.user.id,
      image: imageUrl,
    });

    res.status(201).json(newPost);
  } catch (err) {
    console.error("Error creating post:", err);
    res.status(500).json({ error: err.message });
  }
});

router.get("/", async (req, res) => {
  try {
    const posts = await postSchema.find().populate("author", "username email");
    res.status(200).json(posts);
  } catch (err) {
    console.error("Error fetching posts:", err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
