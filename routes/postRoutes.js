const express = require("express");
const multer = require("multer");
const { createPost, getPosts } = require("../controllers/postController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();
const upload = multer({ dest: "uploads/" });

router.post("/", authMiddleware, upload.single("image"), createPost);
router.get("/", getPosts);

module.exports = router;
