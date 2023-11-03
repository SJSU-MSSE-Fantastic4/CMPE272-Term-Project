import { Schema, model } from "mongoose";

export interface IComment {
    _id: string;
    likerId: string; // Note: This refers to the user who made the comment
    content: string;
    createdAt: Date;
    updatedAt: Date;
}

const commentSchema = new Schema<IComment>(
    {
        likerId: { type: String, required: true },
        content: { type: String, required: true },
    },
    { timestamps: true }
);

export const CommentModel = model<IComment>("Comment", commentSchema);
