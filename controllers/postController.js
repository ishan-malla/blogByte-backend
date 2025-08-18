const Post = require("../models/postModel");
const cloudinary = require("../config/cloudinary");
const fs = require("fs");

exports.createPost = async (req, res) => {
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

    const newPost = await Post.create({
      title: req.body.title,
      content: req.body.content,
      author: req.user.id,
      image: imageUrl,
    });

    res.status(201).json(newPost);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getPosts = async (req, res) => {
  try {
    const posts = await Post.find().populate("author", "username email");
    res.status(200).json(posts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
