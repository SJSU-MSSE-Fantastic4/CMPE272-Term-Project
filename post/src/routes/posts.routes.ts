import express from "express";
import {
    createPost,
    getSeveralPosts,
    getUsersPosts,
} from "../controllers/post.controller";

const router = express.Router();

// Define your routes here...
router.get("/", getSeveralPosts);

export default router;
