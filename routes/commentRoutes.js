const express = require("express");
const {
  addComment,
  editComment,
  deleteComment,
} = require("../controllers/commentController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/posts/:postId/comments", authMiddleware, addComment);
router.put("/posts/:postId/comments/:commentId", authMiddleware, editComment);
router.delete(
  "/posts/:postId/comments/:commentId",
  authMiddleware,
  deleteComment
);

module.exports = router;
