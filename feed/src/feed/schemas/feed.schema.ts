import * as mongoose from 'mongoose';

export const FeedSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true, unique: true },
    posts: [{ type: String, default: [] }],
  },
  { timestamps: true },
);

export interface Feed extends mongoose.Document {
  userId: string;
  posts: string[];
}
