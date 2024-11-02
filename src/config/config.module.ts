import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';
import appConfig from './app.config';
import redisConfig from './redis.config';

export const ConfigModuleSetup = ConfigModule.forRoot({
  envFilePath: '.env',
  load: [appConfig, redisConfig],
  isGlobal: true,
  validationSchema: Joi.object({
    PORT: Joi.number().default(3000)
  }),
});
