import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RabbitMQModule } from './rabbitmq/rabbitmq.module';
import { FollowModule } from './follow/follow.module';

@Module({
  imports: [RabbitMQModule, FollowModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
