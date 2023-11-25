import { Schema, model } from 'mongoose';
import { Comment } from './comment.schema';
import { Like } from './like.schema';

export const PostSchema = new Schema<Post>(
  {
    //Validate content is 1-280 characters
    content: {
      type: String,
      required: true,
      maxlength: 280,
    },
    // Users auth0 id
    authorId: {
      type: String,
      required: true,
    },
    comments: [{ type: Schema.Types.ObjectId, ref: 'Comment', default: [] }],
    likes: [{ type: Schema.Types.ObjectId, ref: 'Like', default: [] }],
  },
  { timestamps: true },
);

export interface Post extends Document {
  _id: string;
  content: string;
  authorId: string; // Should be a UUID
  comments: Comment[];
  likes: Like[];
  createdAt: Date;
  updatedAt: Date;
  commentsCount?: number;
  likesCount?: number;
}
