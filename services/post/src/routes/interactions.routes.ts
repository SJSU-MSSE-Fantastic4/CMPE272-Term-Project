import { Router } from "express";
import { protectedController } from "../controllers";
import mongoose from "mongoose";

const router = Router();

// Lik/Unlike Posts
router.post("/:postId/like/", protectedController.likePost);
router.delete("/:postId/like/", protectedController.unlikePost);

// Create Comment
router.post("/:postId/comment/", protectedController.createComment);
router.delete("/:postId/comment/:commentId", protectedController.deleteComment);

export default router;
