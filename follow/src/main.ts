import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app/app.module';
import { Logger } from '@nestjs/common';
import * as fs from 'fs';

async function bootstrap() {
  const logger = new Logger('bootstrap');
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('Follow Service API')
    .setDescription('The follow service API description')
    .setVersion('1.0')
    .addTag('follow')
    .addBearerAuth() // This line sets up Bearer token authentication in Swagger
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  // Save the generated document to a JSON file
  fs.writeFileSync(
    './follow-service-swagger.json',
    JSON.stringify(document, null, 2),
  );

  const port = process.env.PORT || 3000;
  await app.listen(port);
  logger.log(`Application listening on port ${port}`);
}
bootstrap();
