import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { connect, Connection, Channel, ConsumeMessage } from 'amqplib';
import * as amqp from 'amqplib';
import { Logger } from '@nestjs/common';
import { FollowService } from 'src/follow/follow.service';
import { FeedService } from 'src/feed/feed.service';

interface PostEvent {
  postId: string;
  authorId: string;
}

@Injectable()
export class RabbitMQService implements OnModuleInit, OnModuleDestroy {
  private readonly url = process.env.AMQP_URL || 'amqp://localhost';

  private connection: Connection;
  private channel: Channel;
  private readonly logger = new Logger(RabbitMQService.name);

  constructor(
    private readonly followService: FollowService,
    private readonly feedService: FeedService,
  ) {}

  async onModuleInit(): Promise<void> {
    this.connection = await amqp.connect(this.url);
    this.channel = await this.connection.createChannel();

    const exchange = 'posts_exchange';
    const routingKey = 'post.created';
    const queue = `posts_queue_${routingKey}`;

    await this.channel.assertExchange(exchange, 'topic', { durable: false });
    await this.channel.assertQueue(queue, { durable: false });
    await this.channel.bindQueue(queue, exchange, routingKey);

    this.channel.consume(queue, async (msg) => {
      if (msg) {
        const message: PostEvent = JSON.parse(msg.content.toString());
        this.channel.ack(msg);

        let followers = await this.followService.getFollowers(message.authorId);

        for (let followerId of followers) {
          // Feed Service / MongoDB service to add post to follower's feed
          this.feedService.addToUserFeed(followerId, message.postId);
        }
      }
    });
  }

  async onModuleDestroy(): Promise<void> {
    try {
      await this.channel.close();
      await this.connection.close();
    } catch (error) {
      console.log(error);
    }
  }
}
