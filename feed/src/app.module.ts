import { Module } from '@nestjs/common';
import { RabbitMQModule } from './rabbitmq/rabbitmq.module';
import { FollowModule } from './follow/follow.module';
import { FeedModule } from './feed/feed.module';

@Module({
  imports: [RabbitMQModule, FollowModule, FeedModule],
})
export class AppModule {}
