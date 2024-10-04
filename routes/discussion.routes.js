import express from "express";
import {
  createComment,
  deleteCommentId,
  getComment,
  getCommentId,
  updateComment,
} from "../controllers/discussion.controller.js";

const router = express.Router();

router.post("/", createComment);
router.put("/:commentID", updateComment);
router.get("/", getComment);
router.get("/:commentID", getCommentId);
router.delete("/:commentID", deleteCommentId);


export default router;
