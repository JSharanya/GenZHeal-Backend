import express from "express";
import {
  createComment,
  updateComment,
} from "../controllers/discussion.controller.js";

const router = express.Router();

router.post("/", createComment);
router.put("/:commentID", updateComment);

export default router;
