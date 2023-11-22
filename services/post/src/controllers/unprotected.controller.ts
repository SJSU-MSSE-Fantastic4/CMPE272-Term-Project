import { NextFunction, Request, Response } from "express";
import { PostModel, IPost } from "../connections/database/models/post";
import PostOperations from "../connections/database/operations/post";
import { BadQueryException, HttpException } from "../types";
import logger from "../logger";

export const getSeveralPosts = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        if (!req.query.ids) {
            throw new BadQueryException();
        }

        const ids = (req.query.ids as string).split(",");
        const posts = await PostOperations.getPostsByIds(ids);
        let postsArray: IPost[] = [];
        for (let post of posts) {
            postsArray.push(post);
        }
        res.status(200).send(postsArray);
    } catch (error) {
        next(error);
    }
};

export const getPostById = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        if (!req.params.postId) {
            throw new HttpException(
                400,
                "Bad Request, no postId provided in params"
            );
        }
        let postId = req.params.postId;
        const posts = await PostOperations.getPostById(postId);
        res.status(200).send(posts);
    } catch (error) {
        next(error);
    }
};
