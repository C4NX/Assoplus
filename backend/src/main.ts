import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module';
import { Logger, VersioningType } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { INestApplication } from '@nestjs/common';

function setupSwagger(app: INestApplication) {
  const config = new DocumentBuilder()
    .setTitle('NestJS API')
    .setDescription('API description')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs ', app, document);
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const logger = new Logger('Bootstrap');

  const env = configService.get<string>('NODE_ENV') || 'development';
  const port = configService.get<number>('PORT') || 4000;

  // Enable versioning
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  });

  // Enable CORS
  app.enableCors({
    origin: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: [
      'Content-Type',
      'Origin',
      'X-Requested-With',
      'Accept',
      'Authorization',
    ],
  });

  // Enable swagger in development mode
  if (env === 'development') {
    logger.log('Swagger enabled');
    setupSwagger(app);
  }

  await app.listen(port);
}

bootstrap().catch((error) => console.error(error));
