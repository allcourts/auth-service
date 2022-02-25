import { Logger, ValidationPipe, VersioningType } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { Environment } from './config/enum/environment.enum';
import { EnvConfig } from './config/base.config';

async function bootstrap() {
  const logger = new Logger('Main');
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe());
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: ['1'],
  });

  const configService = app.get<ConfigService>(ConfigService);
  const envConfig = configService.get<EnvConfig>('base');

  const isProduction = envConfig.env === Environment.Production;

  if (!isProduction) {
    const options = new DocumentBuilder()
      .setTitle(configService.get('npm_package_name'))
      .setDescription(configService.get('npm_package_description'))
      .setVersion(configService.get('npm_package_version'))
      .build();

    const document = SwaggerModule.createDocument(app, options);
    SwaggerModule.setup('docs', app, document);
  }

  await app.listen(envConfig.port, () =>
    logger.log(`Application listening to port ${envConfig.port}`),
  );
}

bootstrap();
