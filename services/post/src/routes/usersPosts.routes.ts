import { Router } from "express";
import { protectedController } from "../controllers";
import mongoose from "mongoose";

const router = Router();

// CRUD Posts
router.get("/posts", protectedController.getCurrentUsersPosts);
router.post("/post", protectedController.createPost);
router.patch("/post/:postId", protectedController.updatePost);
router.delete("/post/:postId", protectedController.deletePost);

export default router;
