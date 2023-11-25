import { Injectable, Inject } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Feed } from './schemas/feed.schema';
@Injectable()
export class FeedService {
  constructor(@Inject('FEED_MODEL') private feedModel: Model<Feed>) {}

  async addToUserFeed(userId: string, postId: string) {
    const feed = await this.feedModel.findOneAndUpdate(
      { userId: userId },
      { $push: { posts: postId } },
      { upsert: true, new: true },
    );

    return feed;
  }

  async getFeed(userId: string) {
    const feed = await this.feedModel.findOne({ userId: userId });
    return feed;
  }
}
