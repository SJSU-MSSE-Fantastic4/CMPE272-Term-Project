import express from "express";
import {
    createPost,
    getUsersPosts,
    likePost,
    unlikePost,
    createComment,
    deleteComment,
    deletePost,
} from "../controllers/post.controller";

const router = express.Router();

// Define your routes here...
router.post("/", deletePost);
router.delete("/post/:postId", deletePost);

router.get("/", getUsersPosts);

router.get("/post/like/:id", likePost);
router.delete("/post/like/:id", unlikePost);

router.get("/post/comment/:id", createComment);
router.delete("/post/:postId/comment/:commentId", deleteComment);

export default router;
