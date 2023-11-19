import { Router } from "express";
import { protectedController } from "../controllers";
import mongoose from "mongoose";

import { checkSchema } from "express-validator";
import { validateSchema } from "../middleware/validation.middleware";
import { InvalidObjectIdException } from "../types";

const router = Router();

const contentSchema = {
    errorMessage: "Content is required",
    isString: true,
    notEmpty: true,
    isLength: {
        options: { max: 280 },
        errorMessage: "Content must not exceed 280 characters",
    },
};

const postIdSchema = {
    errorMessage: "postId is required",
    isString: true,
    notEmpty: true,
    custom: {
        options: (id: string) => {
            if (!mongoose.Types.ObjectId.isValid(id))
                throw new InvalidObjectIdException(
                    `${id} is not a valid ObjectId`
                );
            return true;
        },
    },
};

// Define your routes here...
router.get("/", protectedController.getCurrentUsersPosts);

router.post(
    "/",
    checkSchema({
        content: contentSchema,
    }),
    validateSchema,
    protectedController.createPost
);

router.put(
    "/post/:postId",
    checkSchema({
        content: contentSchema,
        postId: postIdSchema,
    }),
    validateSchema,
    protectedController.updatePost
);

router.delete(
    "/post/:postId",
    checkSchema({
        postId: postIdSchema,
    }),
    validateSchema,
    protectedController.deletePost
);

router.get(
    "/post/like/:postId",
    checkSchema({
        postId: postIdSchema,
    }),
    validateSchema,
    protectedController.likePost
);
router.delete(
    "/post/like/:postId",
    checkSchema({
        postId: postIdSchema,
    }),
    validateSchema,
    protectedController.unlikePost
);

router.post(
    "/post/comment/:postId",
    checkSchema({
        postId: postIdSchema,
        content: contentSchema,
    }),
    validateSchema,
    protectedController.createComment
);

export default router;
