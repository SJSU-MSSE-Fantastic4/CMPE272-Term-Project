import {
  Injectable,
  Inject,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model, startSession } from 'mongoose';
import { Post } from './schemas/post.schema';
import { Like } from './schemas/like.schema';
import { Comment } from './schemas/comment.schema';

@Injectable()
export class PostsService {
  constructor(
    @Inject('POST_MODEL') private postModel: Model<Post>,
    @Inject('LIKE_MODEL') private likeModel: Model<Like>,
    @Inject('COMMENT_MODEL') private commentModel: Model<Comment>,
  ) {}

  async getPostById(postId: string): Promise<Post> {
    const result = await this.postModel
      .findById(postId)
      .populate('comments')
      .populate('likes')
      .exec();
    return result;
  }

  async getPostsByIds(ids: string[]) {
    const objectIdArray = ids.map((s) => new mongoose.Types.ObjectId(s));
    const result = await this.postModel.aggregate([
      { $match: { _id: { $in: objectIdArray } } }, // Match the post by its ID
      {
        $project: {
          content: 1, // include other fields of the post as needed
          authorId: 1,
          createdAt: 1,
          updatedAt: 1,
          commentsCount: { $size: '$comments' },
          likesCount: { $size: '$likes' },
          // Exclude the actual comments and likes arrays from the output
        },
      },
    ]);
    return result;
  }

  async getUsersPosts(authorId: string) {
    const result = await this.postModel.aggregate([
      { $match: { authorId: authorId } }, // Match the post by its ID
      {
        $project: {
          content: 1, // include other fields of the post as needed
          authorId: 1,
          createdAt: 1,
          updatedAt: 1,
          commentsCount: { $size: '$comments' },
          likesCount: { $size: '$likes' },
          // Exclude the actual comments and likes arrays from the output
        },
      },
    ]);

    return result;
  }

  async createPost(authorId: string, content: string) {
    // Save the post to the database
    const newPost = new this.postModel({
      content: content,
      authorId: authorId,
    });
    await newPost.save();

    return newPost;
  }

  async updatePost(postId: string, authorId: string, content: string) {
    const post = await this.postModel.findOneAndUpdate(
      { _id: postId, authorId: authorId },
      { content: content },
      { new: true },
    );
    return post;
  }

  async deletePost(postId: string, authorId: string) {
    let result = await this.postModel.deleteOne({
      _id: postId,
      authorId: authorId,
    });
    return result;
  }

  async createComment(postId: string, commenterId: string, content: string) {
    // Using Session to ensure atomicity of the transaction
    const session = await startSession();
    session.startTransaction();
    try {
      let post = await this.postModel.findById(postId);
      if (!post) {
        throw new NotFoundException(`Post with ID ${postId} not found`);
      }

      let comment = new this.commentModel({
        commenterId: commenterId,
        content: content,
      });
      await comment.save();

      await this.postModel.findByIdAndUpdate(postId, {
        $addToSet: { comments: comment._id },
      });

      await session.commitTransaction();
      return comment;
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  }

  async deleteComment(postId: string, commentId: string, commentorId: string) {
    // Using Session to ensure atomicity of the transaction
    const session = await startSession();
    session.startTransaction();
    try {
      let deletedComment = await this.commentModel.findOneAndDelete({
        _id: commentId,
        commenterId: commentorId,
      });
      await this.postModel.findByIdAndUpdate(postId, {
        $pull: { comments: commentId },
      });

      await session.commitTransaction();
      return deletedComment;
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  }

  async findLikeByUser(postId: string, userId: string) {
    let like = await this.likeModel.findOne({
      likerId: userId,
      postId: postId,
    });
    return like;
  }

  async likePost(postId: string, likerId: string) {
    const session = await startSession();
    session.startTransaction();
    try {
      let like = new this.likeModel({ likerId: likerId, postId: postId });
      try {
        await like.save();
      } catch (error) {
        throw new ConflictException(
          `User ${likerId} already liked post ${postId}`,
        );
      }

      let post = await this.postModel.findByIdAndUpdate(postId, {
        $addToSet: { likes: like._id },
      });
      if (!post)
        throw new NotFoundException(`Post with ID ${postId} not found`);

      await session.commitTransaction();
      return like;
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  }

  async unlikePost(postId: string, likerId: string) {
    const session = await startSession();
    session.startTransaction();
    try {
      //Find the like and delete it
      let like = await this.likeModel.findOneAndDelete({
        likerId: likerId,
        postId: postId,
      });

      // If the like exists, remove it from the post
      if (like) {
        await this.postModel.findByIdAndUpdate(postId, {
          $pull: { likes: like._id },
        });
      } else {
        throw new NotFoundException(
          `User ${likerId} did not like post ${postId}`,
        );
      }
      await session.commitTransaction();
      return like;
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  }
}
