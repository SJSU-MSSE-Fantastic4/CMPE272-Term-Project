import { Controller, OnModuleInit, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { RabbitMQService } from './rabbitmq/rabbitmq.service';

interface PostEvent {
  postId: string;
  authorId: string;
}

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
