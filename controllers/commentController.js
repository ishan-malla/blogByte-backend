const Post = require("../models/postModel");

exports.addComment = async (req, res) => {
  try {
    const { postId } = req.params;
    const { text } = req.body;

    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ message: "Post not found" });

    post.comments.push({ user: req.user.id, text });
    post.commentCount = post.comments.length;
    await post.save();

    const updatedPost = await Post.findById(postId)
      .populate("author", "username email")
      .populate("comments.user", "username email");

    res.status(201).json(updatedPost);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.editComment = async (req, res) => {
  try {
    const { postId, commentId } = req.params;
    const { text } = req.body;

    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ message: "Post not found" });

    const comment = post.comments.id(commentId);
    if (!comment) return res.status(404).json({ message: "Comment not found" });

    if (comment.user.toString() !== req.user.id)
      return res.status(403).json({ message: "Not authorized" });

    comment.text = text;
    await post.save();

    const updatedPost = await Post.findById(postId)
      .populate("author", "username email")
      .populate("comments.user", "username email");

    res.json(updatedPost);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteComment = async (req, res) => {
  try {
    const { postId, commentId } = req.params;

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const comment = post.comments.id(commentId);
    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    if (comment.user.toString() !== req.user.id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    post.comments.pull(commentId);

    post.commentCount = post.comments.length;

    await post.save();

    const updatedPost = await Post.findById(postId)
      .populate("author", "username email")
      .populate("comments.user", "username email");

    res.json(updatedPost);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
