import { Module } from '@nestjs/common';

import { RabbitMQModule } from './rabbitmq/rabbitmq.module';
import { PostsModule } from './posts/posts.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import mongoConfig from './config/mongo.config';
import rabbitMQConfig from './config/rabbitmq.config';
import authConfig from './config/auth.config';

@Module({
  imports: [
    RabbitMQModule,
    PostsModule,
    AuthModule,
    ConfigModule.forRoot({
      load: [mongoConfig, rabbitMQConfig, authConfig],
    }),
  ],
})
export class AppModule {}
