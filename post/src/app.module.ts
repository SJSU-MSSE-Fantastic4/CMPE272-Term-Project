import { Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';

import { RabbitMQModule } from './rabbitmq/rabbitmq.module';
import { PostsModule } from './posts/posts.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import mongoConfig from './config/mongo.config';
import rabbitMQConfig from './config/rabbitmq.config';
import authConfig from './config/auth.config';
import * as redisStore from 'cache-manager-redis-store';

@Module({
  imports: [
    CacheModule.register({
      ttl: 300, // seconds - time to live
      max: 100, // maximum number of items in cache
      isGlobal: true,
      store: redisStore,
      host: process.env.REDIS_HOST || 'localhost',
      port: process.env.REDIS_PORT || 6379,
      auth_pass: process.env.REDIS_PASS || '',
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
