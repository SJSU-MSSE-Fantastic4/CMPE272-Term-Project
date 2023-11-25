import { Schema, model } from 'mongoose';

export interface Like {
  _id: string;
  postId: string; // This refers to the user who liked the post
  likerId: string; // This refers to the user who liked the post
  createdAt: Date;
  updatedAt: Date;
}

export const LikeSchema = new Schema<Like>(
  {
    postId: { type: String, required: true },
    likerId: { type: String, required: true },
  },
  { timestamps: true },
);
LikeSchema.index({ postId: 1, likerId: 1 }, { unique: true });
