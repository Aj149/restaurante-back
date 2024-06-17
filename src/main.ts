import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SERVER_PORT } from './conf/constanst';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  app.useGlobalPipes(new ValidationPipe());
  const configService = app.get(ConfigService);
  // server port
  const port = +configService.get<number>(SERVER_PORT);
  await app.listen(port);
  console.log(`listening on port ${await app.getUrl()}`);
}
bootstrap();
