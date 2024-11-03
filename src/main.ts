import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';
// import { RedisIoAdapter } from './redis-io.adapter';
import * as crypto from 'crypto';

async function bootstrap() {
  process.env.NODE_INSTANCE_ID = crypto.randomBytes(16).toString('hex');

  const app = await NestFactory.create(AppModule);
  // const redisIoAdapter = new RedisIoAdapter(app);
  // await redisIoAdapter.connectToRedis();

  // app.useWebSocketAdapter(redisIoAdapter);

  const configService = app.get(ConfigService);
  const port = configService.get<number>('port');
  app.enableCors({
   origin: '*'
  })
  await app.listen(3000, '0.0.0.0');
}
bootstrap();
