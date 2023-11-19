import express from "express";
import { protectedController } from "../controllers";

const router = express.Router();

// Define your routes here...
router.get("/", protectedController.getCurrentUsersPosts);

export default router;
