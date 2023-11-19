import express, { Express, Request, Response } from "express";
import {
    followController,
    unfollowController,
    getFollowersController,
    getFollowingController,
} from "./controllers";

const router = express.Router();

import { keycloak } from "./server";
router.use(keycloak.middleware());

router.post("/me/follow/:followeeId", keycloak.protect(), followController);
router.delete("/me/follow/:followeeId", keycloak.protect(), unfollowController);
router.get("/:userId/followers", getFollowersController);
router.get("/:userId/following", getFollowingController);

export default router;
