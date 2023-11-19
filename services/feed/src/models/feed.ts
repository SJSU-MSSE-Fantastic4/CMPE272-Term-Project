import { Schema, model } from "mongoose";

export interface ILike {
    _id: string;
    postId: string; // This refers to the user who liked the post
    likerId: string; // This refers to the user who liked the post
    createdAt: Date;
    updatedAt: Date;
}

export interface IComment {
    _id: string;
    likerId: string; // Note: This refers to the user who made the comment
    content: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface IPost {
    _id: string;
    title: string;
    content: string;
    authorId: string; // Should be a UUID
    comments: IComment[];
    likes: ILike[];
    createdAt: Date;
    updatedAt: Date;
}

export interface IFeed {
    _id: string;
    userId: string;
    posts: string[];
    createdAt: Date;
    updatedAt: Date;
}

const feedSchema = new Schema<IFeed>(
    {
        userId: { type: String, required: true, unique: true },
        posts: [{ type: String, default: [] }],
    },
    { timestamps: true }
);

export const FeedModel = model<IFeed>("Feed", feedSchema);
