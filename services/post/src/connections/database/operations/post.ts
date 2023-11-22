import mongoose, { Model, Document } from "mongoose";
import { PostModel, IPost } from "../models/post";
import { LikeModel, ILike, CommentModel, IComment } from "../models";
import { startSession } from "mongoose";

const PostOperations = {
    // Function to create a post
    createPost: async (
        authorId: string,
        content: string
    ): Promise<Document<unknown, {}, IPost>> => {
        // Save the post to the database
        const newPost = new PostModel({
            content: content,
            authorId: authorId,
        });
        await newPost.save();

        return newPost;
    },

    updatePost: async (
        postId: string,
        authorId: string,
        content: string
    ): Promise<IPost | null> => {
        const post = await PostModel.findOneAndUpdate(
            { _id: postId, authorId: authorId },
            { content: content },
            { new: true }
        );
        return post;
    },

    deletePost: async (postId: string) => {
        let result = await PostModel.deleteOne({
            _id: postId,
        });
        return result;
    },

    likePost: async (postId: string, likerId: string) => {
        const session = await startSession();
        session.startTransaction();
        try {
            let like = await LikeModel.findOne(
                {
                    likerId: likerId,
                    postId: postId,
                },
                null
            );
            if (!like) {
                like = new LikeModel({ likerId: likerId, postId: postId });
                await like.save();

                await PostModel.findByIdAndUpdate(postId, {
                    $addToSet: { likes: like._id },
                });
            }
            await session.commitTransaction();
            return like;
        } catch (error) {
            await session.abortTransaction();
            throw error;
        } finally {
            session.endSession();
        }
    },

    unlikePost: async (postId: string, likerId: string) => {
        const session = await startSession();
        session.startTransaction();
        try {
            let like = await LikeModel.findOneAndDelete({
                likerId: likerId,
                postId: postId,
            });

            if (like) {
                await PostModel.findByIdAndUpdate(postId, {
                    $pull: { likes: like._id },
                });
            }
            await session.commitTransaction();
            return like;
        } catch (error) {
            await session.abortTransaction();
            throw error;
        } finally {
            session.endSession();
        }
    },

    createComment: async (
        postId: string,
        commenterId: string,
        content: string
    ): Promise<[IPost | null, IComment]> => {
        // Using Session to ensure atomicity of the transaction
        const session = await startSession();
        session.startTransaction();
        try {
            let post = await PostModel.findById(postId);

            let comment = new CommentModel({
                commenterId: commenterId,
                content: content,
            });
            await comment.save();

            await PostModel.findByIdAndUpdate(postId, {
                $addToSet: { comments: comment._id },
            });

            await session.commitTransaction();
            return [post, comment];
        } catch (error) {
            await session.abortTransaction();
            throw error;
        } finally {
            session.endSession();
        }
    },

    deleteComment: async (postId: string, commentId: string) => {
        // Using Session to ensure atomicity of the transaction
        const session = await startSession();
        session.startTransaction();
        try {
            let deleteResult = await CommentModel.findByIdAndDelete(commentId);
            await PostModel.findByIdAndUpdate(postId, {
                $pull: { comments: commentId },
            });

            await session.commitTransaction();
            return deleteResult;
        } catch (error) {
            await session.abortTransaction();
            throw error;
        } finally {
            session.endSession();
        }
    },

    isCommentAuthor: async (commentId: string, userId: string) => {
        const comment = await CommentModel.findById(commentId);
        return [comment, comment?.commenterId === userId];
    },

    getUsersPosts: async (authorId: string) => {
        const result = await PostModel.aggregate([
            { $match: { authorId: authorId } }, // Match the post by its ID
            {
                $project: {
                    content: 1, // include other fields of the post as needed
                    authorId: 1,
                    createdAt: 1,
                    updatedAt: 1,
                    commentsCount: { $size: "$comments" },
                    likesCount: { $size: "$likes" },
                    // Exclude the actual comments and likes arrays from the output
                },
            },
        ]);

        return result;
    },

    getPostsByIds: async (ids: string[]) => {
        const objectIdArray = ids.map((s) => new mongoose.Types.ObjectId(s));
        const result = await PostModel.aggregate([
            { $match: { _id: { $in: objectIdArray } } }, // Match the post by its ID
            {
                $project: {
                    content: 1, // include other fields of the post as needed
                    authorId: 1,
                    createdAt: 1,
                    updatedAt: 1,
                    commentsCount: { $size: "$comments" },
                    likesCount: { $size: "$likes" },
                    // Exclude the actual comments and likes arrays from the output
                },
            },
        ]);
        return result;
    },

    getPostById: async (postId: string) => {
        // Find the post by its ID
        const result = await PostModel.findById(postId)
            .populate("comments")
            .populate("likes")
            .exec();
        return result;
    },
};

export default PostOperations;
