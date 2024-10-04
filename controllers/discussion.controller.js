
import User from "../models/auth.model.js";
import Comment from "../models/discussion.model.js";

export const createComment = async (req, res, next) => {
  try {
    const { userId, comment, parent } = req.body;

    const user = await User.findById(userId);
    const parentComment = await Comment.findById(parent);

    if (!user) {
      return res.status(400).json({ error: "Unauthorized User" });
    }
    if (!comment) {
      return res.status(400).json({ error: "Message is Request" });
    }
    if (!parentComment && parent) {
      return res.status(400).json({ error: "Something Error" });
    }

    const newDiscussion = new Comment({ userId, comment, parent });
    const discussion = await newDiscussion.save();

    if (parentComment) {
      parentComment.child.push(discussion._id);
      parentComment.save();
    }
    return res.json(discussion);
  } catch (err) {
    console.log(err);
    return res.status(400).json({
      error: "Something wrong",
    });
  }
};

export const updateComment = async (req, res, next) => {
  try {
    const { userId, comment } = req.body;

    const user = await User.findById(userId);

    if (!comment) {
      return res.status(400).json({ error: "Message is Request" });
    }
    if (!user) {
      return res.status(400).json({ error: "Unauthorized User" });
    }
    let existComment = await Comment.findById(req.params.commentID)
    existComment=JSON.parse(JSON.stringify(existComment))
    if (!existComment) {
      return res.status(400).json({ error: "Comment not found" });
    }
    console.log(existComment,userId);
    if (existComment.userId !== userId) {
      return res.status(403).json({ error: "Forbidden" });
    }

    const discussion = await Comment.findByIdAndUpdate(
      req.params.commentID,
      {
        comment,
      },
      { new: true }
    );
    return res.json(discussion);
  } catch (err) {
    console.log(err);
    return res.status(400).json({
      error: "Something wrong",
    });
  }
};

export const getComment = async (req, res, next) => {
  try {
    const { parent } = req.query;
    const comments = await Comment.find(parent ? { parent } : {});

    return res.json(comments);
  } catch (err) {
    console.log(err);
    return res.status(400).json({
      error: "Something went wrong",
    });
  }
};

export const getCommentId = async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.params.commentID);

    if (!comment) {
      return res.status(404).json({ error: "Comment not found" });
    }

    return res.json(comment);
  } catch (err) {
    console.log(err);
    return res.status(400).json({
      error: "Something went wrong",
    });
  }
};

export const deleteCommentId = async (req, res, next) => {
  try {
    const { userId } = req.body;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(401).json({ error: "Unauthorized User" });
    }

    const comment = await Comment.findById(req.params.commentID);

    if (!comment) {
      return res.status(404).json({ error: "Comment not found" });
    }

    // Ensure only the comment's author can delete the comment
    if (comment.userId.toString() !== userId) {
      return res.status(403).json({ error: "Forbidden" });
    }

    await comment.remove();

    return res.json({ message: "Comment deleted successfully" });
  } catch (err) {
    console.log(err);
    return res.status(400).json({
      error: "Something went wrong",
    });
  }
};