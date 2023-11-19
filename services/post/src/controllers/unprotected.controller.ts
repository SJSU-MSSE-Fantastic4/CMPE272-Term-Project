import { NextFunction, Request, Response } from "express";
import { PostModel, IPost } from "../models/post";
import { BadQueryException, HttpException } from "../types";

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
        const posts = await PostModel.find({ _id: { $in: ids } });
        let postsArray: IPost[] = [];
        for (let post of posts) {
            postsArray.push(post.toObject());
        }
        res.status(200).send(postsArray);
    } catch (error) {
        next(error);
    }
};
