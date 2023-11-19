import { Schema, model } from "mongoose";

export interface ILike {
    _id: string;
    postId: string; // This refers to the user who liked the post
    likerId: string; // This refers to the user who liked the post
    createdAt: Date;
    updatedAt: Date;
}

const likeSchema = new Schema<ILike>(
    {
        postId: { type: String, required: true },
        likerId: { type: String, required: true },
    },
    { timestamps: true }
);
likeSchema.index({ postId: 1, likerId: 1 }, { unique: true });

export const LikeModel = model<ILike>("Like", likeSchema);
