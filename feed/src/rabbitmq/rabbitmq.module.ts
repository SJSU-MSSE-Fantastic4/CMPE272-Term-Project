import { Module } from '@nestjs/common';
import { RabbitMQService } from './rabbitmq.service';
import { FollowModule } from 'src/follow/follow.module';
import { FeedModule } from 'src/feed/feed.module';

@Module({
  imports: [FollowModule, FeedModule],
  providers: [RabbitMQService],
})
export class RabbitMQModule {}
