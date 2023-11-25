import { Module } from '@nestjs/common';
import { RabbitMQService } from './rabbitmq.service';
import { ConfigModule } from '@nestjs/config';
import rabbitMQConfig from '../config/rabbitmq.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [rabbitMQConfig],
    }),
  ],
  providers: [RabbitMQService],
  exports: [RabbitMQService],
})
export class RabbitMQModule {}
