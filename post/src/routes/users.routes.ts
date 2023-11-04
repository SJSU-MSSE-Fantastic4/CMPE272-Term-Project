import express from "express";
import {
    createPost,
    getUsersPosts,
    likePost,
    unlikePost,
    createComment,
    deleteComment,
    deletePost,
    updatePost,
} from "../controllers/post.controller";

const router = express.Router();

// Define your routes here...
router.get("/", getUsersPosts);

router.post("/", createPost);
router.put("/post/:postId", updatePost);
router.delete("/post/:postId", deletePost);

router.get("/post/like/:id", likePost);
router.delete("/post/like/:id", unlikePost);

router.get("/post/comment/:id", createComment);
router.put("/post/:postId/comment/:commentId", deleteComment);
router.delete("/post/:postId/comment/:commentId", deleteComment);

export default router;
