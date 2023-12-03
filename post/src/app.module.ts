import { Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';

import { RabbitMQModule } from './rabbitmq/rabbitmq.module';
import { PostsModule } from './posts/posts.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import mongoConfig from './config/mongo.config';
import rabbitMQConfig from './config/rabbitmq.config';
import authConfig from './config/auth.config';

@Module({
  imports: [
    CacheModule.register({
      ttl: 300, // seconds - time to live
      max: 100, // maximum number of items in cache
    }),
    RabbitMQModule,
    PostsModule,
    AuthModule,
    ConfigModule.forRoot({
      load: [mongoConfig, rabbitMQConfig, authConfig],
    }),
  ],
})
export class AppModule {}
