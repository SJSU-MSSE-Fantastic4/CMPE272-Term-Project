import { NextFunction, Request, Response, RequestHandler } from "express";
import { PostModel, IPost } from "../models/post";
import {
    BadParamsException,
    BadQueryException,
    Empty,
    EmptyQuery,
    HttpException,
    KeycloakRequest,
    Pagination,
    ParamId,
} from "../types";
import mongoose, { ObjectId } from "mongoose";
import { CommentModel, LikeModel } from "../models";

export const createPost: RequestHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const title = req.body.title;
    const content = req.body.content;

    const keycloakReq = req as KeycloakRequest;
    const uuid = keycloakReq.kauth.grant.access_token.content.sub;

    try {
        const post = new PostModel({
            title: title,
            content: content,
            authorId: uuid,
        });
        await post.save();
        res.status(201).send(post);
    } catch (error) {
        res.status(500).send(error);
    }
};

export const updatePost: RequestHandler<
    { postId: string },
    Empty,
    { title: string; content: string },
    EmptyQuery,
    Empty
> = async (req: Request, res: Response, next: NextFunction) => {
    const postId = req.params.postId;

    const title = req.body.title;
    const content = req.body.content;

    const keycloakReq = req as KeycloakRequest;
    const uuid = keycloakReq.kauth.grant.access_token.content.sub;

    try {
        const post = await PostModel.findOneAndUpdate(
            { _id: postId, authorId: uuid },
            { title: title, content: content },
            { upsert: true, new: true }
        );
        res.status(200).send(post);
    } catch (error) {
        res.status(500).send(error);
    }
};

export const getUsersPosts: RequestHandler = async (req, res, next) => {
    const keycloakReq = req as KeycloakRequest;
    const uuid = keycloakReq.kauth.grant.access_token.content.sub;

    try {
        const posts = await PostModel.find({ authorId: uuid })
            .populate("comments")
            .populate("likes")
            .exec();
        res.status(201).send(posts);
    } catch (error) {
        res.status(500).send(error);
    }
};

export const getSeveralPosts: RequestHandler<
    Empty,
    IPost[],
    Empty,
    { ids?: string },
    {}
> = async (req, res, next) => {
    try {
        if (!req.query.ids) {
            throw new BadQueryException();
        }

        const ids = req.query.ids.split(",");
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

export const likePost: RequestHandler<
    ParamId,
    Empty,
    Empty,
    EmptyQuery,
    Empty
> = async (req: Request, res: Response, next: NextFunction) => {
    const keycloakReq = req as KeycloakRequest;
    const uuid = keycloakReq.kauth.grant.access_token.content.sub;

    const postId = req.params.id;

    try {
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

        res.status(201).send();
    } catch (error) {
        next(error);
    }
};

export const unlikePost: RequestHandler<
    ParamId,
    Empty,
    Empty,
    EmptyQuery,
    Empty
> = async (req: Request, res: Response, next: NextFunction) => {
    const keycloakReq = req as KeycloakRequest;
    const uuid = keycloakReq.kauth.grant.access_token.content.sub;

    const postId = req.params.id;

    try {
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
    } catch (error) {
        next(error);
    }
};

export const createComment: RequestHandler<
    ParamId,
    Empty,
    Empty,
    EmptyQuery,
    Empty
> = async (req: Request, res: Response, next: NextFunction) => {
    const keycloakReq = req as KeycloakRequest;
    const uuid = keycloakReq.kauth.grant.access_token.content.sub;

    const postId = req.params.id;

    try {
        let post = await PostModel.findById(postId);
        if (!post) {
            throw new HttpException(404, `Post with id ${postId} not found`);
        }

        let comment = new CommentModel({
            likerId: uuid,
            content: req.body.content,
        });

        await comment.save();
        post.comments.push(comment);
        await post.save();

        res.status(201).send(comment);
    } catch (error) {
        next(error);
    }
};

export const deleteComment: RequestHandler<
    { postId: string; commentId: string },
    Empty,
    Empty,
    EmptyQuery,
    Empty
> = async (req: Request, res: Response, next: NextFunction) => {
    const keycloakReq = req as KeycloakRequest;
    const uuid = keycloakReq.kauth.grant.access_token.content.sub;

    const postId = req.params.postId;
    const commentId = req.params.commentId;

    try {
        let comment = await CommentModel.findById(commentId);
        if (!comment) {
            throw new HttpException(
                404,
                `Comment with id ${commentId} not found`
            );
        }
        let post = await PostModel.findById(postId);
        if (!post) {
            throw new HttpException(404, `Post with id ${postId} not found`);
        }

        if (comment && comment.likerId === uuid) {
            await PostModel.findByIdAndUpdate(postId, {
                $pull: { comments: comment._id },
            });

            // Delete the comment
            await CommentModel.deleteOne({ _id: comment._id });
        }

        res.status(201).send(comment);
    } catch (error) {
        next(error);
    }
};

export const deletePost: RequestHandler<
    { postId: string },
    Empty,
    Empty,
    EmptyQuery,
    Empty
> = async (req: Request, res: Response, next: NextFunction) => {
    const keycloakReq = req as KeycloakRequest;
    const uuid = keycloakReq.kauth.grant.access_token.content.sub;

    const postId = req.params.postId;

    try {
        let post = await PostModel.findById(postId);
        if (!post) {
            throw new HttpException(404, `Post with id ${postId} not found`);
        }

        if (post && post.authorId === uuid) {
            // Delete the Post
            await PostModel.deleteOne({ _id: post._id });
        }

        res.status(200).send();
    } catch (error) {
        next(error);
    }
};
