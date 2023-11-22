import express, { Express, Request, Response } from "express";
import { authMiddleware } from "./connections/auth/oidc-client";

import {
    followController,
    unfollowController,
    getFollowersController,
    getFollowingController,
    getCurrentUserFollowersController,
    getCurrentUserFollowingController,
} from "./controllers";

const router = express.Router();

router.post("/me/follow/:followeeId", authMiddleware, followController);
router.delete("/me/follow/:followeeId", authMiddleware, unfollowController);

router.get("/me/followers", authMiddleware, getCurrentUserFollowersController);
router.get("/me/following", authMiddleware, getCurrentUserFollowingController);

router.get("/:userId/followers", getFollowersController);
router.get("/:userId/following", getFollowingController);

export default router;
