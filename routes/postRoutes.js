const express = require("express");
const multer = require("multer");
const {
  createPost,
  getPosts,
  getPostById,
  updatePost,
  deletePost,
} = require("../controllers/postController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();
const upload = multer({ dest: "uploads/" });

router.post("/posts", authMiddleware, upload.single("image"), createPost);

router.get("/posts", getPosts);

router.get("/posts/:id", getPostById);

router.put("/posts/:id", authMiddleware, upload.single("image"), updatePost);

router.delete("/posts/:id", authMiddleware, deletePost);

module.exports = router;
