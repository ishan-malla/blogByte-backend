const Post = require("../models/postModel");

exports.addOrUpdateRating = async (req, res) => {
  try {
    const { score } = req.body;
    const { postId } = req.params;

    if (!score || score < 1 || score > 5) {
      return res.status(400).json({ message: "Score must be between 1 and 5" });
    }

    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ message: "Post not found" });

    const existingRating = post.ratings.find(
      (r) => r.user.toString() === req.user.id
    );

    if (existingRating) {
      existingRating.score = score;
    } else {
      post.ratings.push({ user: req.user.id, score });
    }

    await post.save();
    console.log("Request body:", req.body);

    res
      .status(200)
      .json({ message: "Rating added/updated", ratings: post.ratings });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getAverageRating = async (req, res) => {
  try {
    const { postId } = req.params;
    const post = await Post.findById(postId).populate(
      "ratings.user",
      "username"
    );

    if (!post) return res.status(404).json({ message: "Post not found" });

    const totalRatings = post.ratings.length;
    const avg =
      totalRatings > 0
        ? post.ratings.reduce((sum, r) => sum + r.score, 0) / totalRatings
        : 0;

    res.status(200).json({
      averageRating: avg.toFixed(2),
      totalRatings,
      ratings: post.ratings,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteRating = async (req, res) => {
  try {
    const { postId } = req.params;
    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ message: "Post not found" });

    post.ratings = post.ratings.filter(
      (r) => r.user.toString() !== req.user.id
    );

    await post.save();
    res.status(200).json({ message: "Rating deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
