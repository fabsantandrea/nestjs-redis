"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConfigModuleSetup = void 0;
const config_1 = require("@nestjs/config");
const Joi = require("joi");
const app_config_1 = require("./app.config");
const redis_config_1 = require("./redis.config");
exports.ConfigModuleSetup = config_1.ConfigModule.forRoot({
    envFilePath: '.env',
    load: [app_config_1.default, redis_config_1.default],
    isGlobal: true,
    validationSchema: Joi.object({
        PORT: Joi.number().default(3000),
        REDIS_URL: Joi.string().required(),
    }),
});
//# sourceMappingURL=config.module.js.map