const express = require("express");
const {
  addOrUpdateRating,
  getAverageRating,
  deleteRating,
} = require("../controllers/ratingController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/:postId/ratings", authMiddleware, addOrUpdateRating);

router.get("/:postId/ratings", getAverageRating);

router.delete("/:postId/ratings", authMiddleware, deleteRating);

module.exports = router;
