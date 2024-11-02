import { INestApplication } from '@nestjs/common';
import { IoAdapter } from '@nestjs/platform-socket.io';
import { ServerOptions } from 'socket.io';
export declare class RedisIoAdapter extends IoAdapter {
    private app;
    private adapterConstructor;
    private configService;
    constructor(app: INestApplication);
    createIOServer(port: number, options?: ServerOptions): any;
    connectToRedis(): Promise<void>;
}
