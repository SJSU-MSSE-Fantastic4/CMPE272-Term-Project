import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { connect, Connection, Channel, ConsumeMessage } from 'amqplib';
import * as amqp from 'amqplib';
import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

interface PostEvent {
  postId: string;
  authorId: string;
}

@Injectable()
export class RabbitMQService implements OnModuleInit, OnModuleDestroy {
  private readonly url = this.configService.get<string>('amqp.url');

  private connection: Connection;
  private channel: Channel;
  private readonly logger = new Logger(RabbitMQService.name);

  constructor(private configService: ConfigService) {}

  async onModuleInit(): Promise<void> {
    try {
      this.connection = await amqp.connect(this.url);
      this.channel = await this.connection.createChannel();
    } catch (error) {
      this.logger.error('Failed to establish connection with RabbitMQ', error);
      throw error;
    }
  }

  async publishInQueue(queue: string, message: string) {
    await this.channel.assertQueue(queue, { durable: false });
    this.channel.sendToQueue(queue, Buffer.from(message));
  }

  async publishPostEvent(event: PostEvent, routingKey: string) {
    const exchange = 'posts_exchange';
    await this.channel.assertExchange(exchange, 'topic', { durable: false });

    const messageBuffer = Buffer.from(JSON.stringify(event));
    this.channel.publish(exchange, routingKey, messageBuffer);
  }

  async postCreated(postId: string, authorId: string) {
    const postEvent: PostEvent = {
      postId: postId,
      authorId: authorId,
    };
    const routingKey = 'post.created';

    await this.publishPostEvent(postEvent, routingKey);
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
