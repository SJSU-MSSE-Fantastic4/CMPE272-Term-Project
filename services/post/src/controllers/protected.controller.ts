import { NextFunction, Request, Response } from "express";
import { HttpException } from "../types";
import { postCreated } from "../connections/rabbitmq/rabbitmq";
import logger from "../logger";
import { startSession } from "mongoose";
import PostOperations from "../connections/database/operations/post";

const getUser = (req: Request): Express.User => {
    let user;
    if (req.user) {
        user = req.user;
    } else {
        /* 
            500 Internal Server Error. This should never happen. 
            Controllers calling this method should be protected by Keycloak.
            Therefore the user should always be present in the request.
        */
        throw new HttpException(500, "Internal Server Error");
    }
    return user;
};

const getUserId = (req: Request): string => {
    return getUser(req).sub;
};

export const getCurrentUsersPosts = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        let uuid = getUserId(req);
        const posts = await PostOperations.getUsersPosts(uuid);

        res.status(200).send(posts);
    } catch (error) {
        next(error);
    }
};

export const createPost = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const content = req.body.content;
    try {
        let uuid = getUserId(req);
        let newPost = (
            await PostOperations.createPost(uuid, content)
        ).toObject();
        newPost.commentsCount = 0;
        newPost.likesCount = 0;
        res.status(201).send(newPost);
        logger.info(`Post ${newPost._id} created`);

        // We do not need to wait for the message to be published to the Message Queue. We can do it asynchronously.
        try {
            postCreated(newPost._id, newPost.authorId);
            logger.info(`Post ${newPost._id} sent to message Queue`);
        } catch {
            //Do Nothing
        }
    } catch (error) {
        next(error);
    }
};

//Updates a post or creates a new one if it does not exist
export const updatePost = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const postId = req.params.postId;
        let currentUserId = getUserId(req);
        const post = await PostOperations.updatePost(
            postId,
            currentUserId,
            req.body.content
        );
        if (post) {
            res.status(200).send(post);
            logger.info(`Post successfully updated with id ${post._id}`);
        } else {
            throw new HttpException(404, `Post with id ${postId} not found`);
        }
    } catch (error) {
        next(error);
    }
};

export const deletePost = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const postId = req.params.postId;
        let currentUserId = getUserId(req);

        let deleteResult = await PostOperations.deletePost(postId);
        if (deleteResult.deletedCount > 0) {
            res.status(200).send();
            logger.info(`Post successfully deleted with id ${postId}`);
        } else {
            throw new HttpException(404, `Post with id ${postId} not found`);
        }
    } catch (error) {
        next(error);
    }
};

export const likePost = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        let uuid = getUserId(req);
        const postId = req.params.postId;

        let like = await PostOperations.likePost(postId, uuid);
        if (like) {
            res.status(204).send();
            logger.info(`Post ${postId} liked by user ${uuid}`);
        } else {
            throw new HttpException(
                500,
                `An internal error occured when liking post ${postId}`
            );
        }
    } catch (error) {
        next(error);
    }
};

export const unlikePost = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    // Using Session to ensure atomicity of the transaction
    const session = await startSession();
    session.startTransaction();

    try {
        const postId = req.params.postId;
        let uuid = getUserId(req);

        let like = await PostOperations.unlikePost(postId, uuid);
        if (like) {
            res.status(204).send();
            logger.info(`Post ${postId} unliked by user ${uuid}`);
        } else {
            throw new HttpException(
                404,
                `Post with id ${postId} is not currently liked by user ${uuid}`
            );
        }
    } catch (error) {
        await session.abortTransaction();
        next(error);
    } finally {
        session.endSession();
    }
};

export const createComment = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    // Using Session to ensure atomicity of the transaction

    try {
        const postId = req.params.postId;
        let currentUserId = getUserId(req);

        let response = await PostOperations.createComment(
            postId,
            currentUserId,
            req.body.content
        );

        let [post, comment] = response;
        if (!post) {
            throw new HttpException(404, `Post with id ${postId} not found`);
        }

        res.status(201).send(comment);
        logger.info(
            `User ${currentUserId} created comment ${comment._id} on post ${postId}`
        );
    } catch (error) {
        next(error);
    }
};

export const deleteComment = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const commentId = req.params.commentId;
        const postId = req.params.postId;

        let currentUserId = getUserId(req);

        let [comment, isAuthor] = await PostOperations.isCommentAuthor(
            commentId,
            currentUserId
        );
        if (isAuthor) {
            let deleteResult = await PostOperations.deleteComment(
                postId,
                commentId
            );
            if (deleteResult) {
                res.status(200).send();
                logger.info(
                    `Comment ${commentId} deleted by user ${currentUserId}`
                );
            } else {
                throw new HttpException(
                    404,
                    `Comment with id ${commentId} not found`
                );
            }
        } else {
            if (comment) {
                throw new HttpException(
                    403,
                    `User ${currentUserId} is not the author of comment ${commentId}`
                );
            } else {
                throw new HttpException(
                    404,
                    `Comment ${commentId} does not exist`
                );
            }
        }
    } catch (error) {
        next(error);
    }
};
