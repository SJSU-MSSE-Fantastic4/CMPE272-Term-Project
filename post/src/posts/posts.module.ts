import { Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { postsProviders } from './posts.providers';
import { DatabaseModule } from '../database/database.module';
import { AuthModule } from 'src/auth/auth.module';
import { RabbitMQModule } from 'src/rabbitmq/rabbitmq.module';

@Module({
  imports: [DatabaseModule, AuthModule, RabbitMQModule],
  providers: [PostsService, ...postsProviders],
  controllers: [PostsController],
})
export class PostsModule {}
