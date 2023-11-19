import { NextFunction, Request, Response } from "express";
import { PostModel, IPost } from "../models/post";
import { HttpException } from "../types";
import { CommentModel, LikeModel } from "../models";
import { postCreated } from "../rabbitmq";
import { validate as uuidValidate } from "uuid";
import logger from "../logger";
import { startSession } from "mongoose";

// Used to get Optional UUID from request. If not present, throws an error.
// This function is only required to get the UUID from the express request.
// If the keycloak middleware protected a route then the user/kauth should always
// be present in the request.
const getUUID = (req: Request): string => {
    let uuid;
    if (req.kauth) {
        uuid = req.kauth.grant.access_token.content.sub;
        if (!uuidValidate(uuid)) {
            throw new HttpException(400, "Invalid UUID");
        }
    } else {
        /* 
            500 Internal Server Error. This should never happen. 
            Controllers calling this method should be protected by Keycloak.
            Therefore the user should always be present in the request.
        */
        throw new HttpException(500, "Internal Server Error");
    }
    return uuid;
};

export const getCurrentUsersPosts = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        let uuid = getUUID(req);

        const posts = await PostModel.find({ authorId: uuid })
            .populate("comments")
            .populate("likes")
            .exec();
        res.status(201).send(posts);
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
        let uuid = getUUID(req);

        const post = new PostModel({
            content: content,
            authorId: uuid,
        });
        await post.save();
        res.status(201).send(post);
        logger.info(`Post successfully created with id ${post._id}`);

        // We do not need to wait for the message to be published to the Message Queue. We can do it asynchronously.
        try {
            postCreated(post._id, post.authorId);
            logger.info(`Post ${post._id} sent to message Queue`);
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
        let currentUserId = getUUID(req);
        const post = await PostModel.findOneAndUpdate(
            { _id: req.params.postId, authorId: currentUserId },
            { title: req.body.title, content: req.body.content },
            { upsert: true, new: true }
        );
        res.status(200).send(post);
        logger.info(`Post successfully updated with id ${post._id}`);
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

        let currentUserId = getUUID(req);

        let result = await PostModel.findOneAndDelete({
            _id: postId,
            authorId: currentUserId,
        });

        if (result) {
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
    // Using Session to ensure atomicity of the transaction
    const session = await startSession();
    session.startTransaction();

    try {
        let uuid = getUUID(req);
        const postId = req.params.postId;

        let post = await PostModel.findById(postId);
        if (!post) {
            throw new HttpException(404, `Post with id ${postId} not found`);
        }

        let like = await LikeModel.findOneAndUpdate(
            {
                likerId: uuid,
                postId: postId,
            },
            {
                likerId: uuid,
                postId: postId,
            },
            { upsert: true, new: true }
        );

        await PostModel.findByIdAndUpdate(postId, {
            $addToSet: { likes: like._id },
        });

        res.status(204).send();
        logger.info(`Post ${post._id} sucessfully liked by user ${uuid}`);
    } catch (error) {
        await session.abortTransaction();
        next(error);
    } finally {
        session.endSession();
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
        let uuid = getUUID(req);

        let post = await PostModel.findById(postId);
        if (!post) {
            throw new HttpException(404, `Post with id ${postId} not found`);
        }

        let like = await LikeModel.findOneAndDelete({
            likerId: uuid,
            postId: postId,
        });

        if (like) {
            await PostModel.findByIdAndUpdate(postId, {
                $pull: { likes: like._id },
            });
        }

        res.status(204).send();
        logger.info(`Post ${post._id} sucessfully unliked by user ${uuid}`);
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
    const session = await startSession();
    session.startTransaction();
    try {
        const postId = req.params.postId;
        let currentUserId = getUUID(req);

        let post = await PostModel.findById(postId);
        if (!post) {
            throw new HttpException(404, `Post with id ${postId} not found`);
        }

        let comment = new CommentModel({
            commenterId: currentUserId,
            content: req.body.content,
        });

        post.comments.push(comment);
        await comment.save();
        await post.save();

        res.status(201).send(comment);
    } catch (error) {
        await session.abortTransaction();
        next(error);
    } finally {
        session.endSession();
    }
};
