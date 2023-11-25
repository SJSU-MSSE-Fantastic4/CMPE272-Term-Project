import { Schema, model } from 'mongoose';

export interface Comment extends Document {
  _id: string;
  commenterId: string; // Note: This refers to the user who made the comment
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

export const CommentSchema = new Schema<Comment>(
  {
    commenterId: { type: String, required: true },
    content: { type: String, required: true },
  },
  { timestamps: true },
);
