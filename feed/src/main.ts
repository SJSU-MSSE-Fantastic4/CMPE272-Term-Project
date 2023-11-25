import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Transport } from '@nestjs/microservices';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const logger = new Logger('RabbitMQBootstrap');
  const app = await NestFactory.create(AppModule);

  await app.listen(3001);
}
bootstrap();
