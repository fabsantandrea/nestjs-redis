import { Test } from '@nestjs/testing';
import { SocketGateway } from './socket.gateway';
import { INestApplication } from '@nestjs/common';
import { Socket, io } from 'socket.io-client';

async function createNestApp(...gateways: any): Promise<INestApplication> {
  const testingModule = await Test.createTestingModule({
    providers: gateways,
  }).compile();
  return testingModule.createNestApplication();
}

describe('SocketGateway', () => {
  let gateway: SocketGateway;
  let app: INestApplication;

  beforeAll(async () => {
    app = await createNestApp(SocketGateway);
    gateway = app.get<SocketGateway>(SocketGateway);
    app.listen(3000);
  });

  afterAll(async () => {
    await app.close();
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });

  it('should connect a client with a valid userId', async () => {
    const ioClient = io('http://localhost:3000?userId=12345678', {
      autoConnect: false,
      transports: ['websocket', 'polling'],
    });

    ioClient.connect();

    await new Promise<void>((resolve) => {
      ioClient.on('connect', () => {
        resolve();
      });
    });

    ioClient.disconnect();
  });

  it('should disconnect a client without a valid userId', async () => {
    const ioClient = io('http://localhost:3000', {
      autoConnect: false,
      transports: ['websocket', 'polling'],
    });

    ioClient.connect();

    await new Promise<void>((resolve) => {
      ioClient.on('error', () => {
        resolve();
      });
    });

    ioClient.disconnect();
  });

  it('should emit "refresh" to all clients with same userId when a client emit refresh', async () => {
    const ioClientA = io('http://localhost:3000?userId=12345678', {
      transports: ['websocket', 'polling'],
    });

    const ioClientB = io('http://localhost:3000?userId=12345678', {
      transports: ['websocket', 'polling'],
    });

    const jsonMessage = { userId: '12345678', orderForm: 'A1234B5678' };

    const testCase = new Promise<void>((resolve) => {
      ioClientA.connect();
      ioClientB.connect();

      ioClientB.on('refresh', (data) => {
        expect(data).toHaveProperty('orderForm');
        expect(data.orderForm).toBe(jsonMessage.orderForm);
        resolve();
      });
    });

    setTimeout(() => {
      ioClientA.emit('refresh', jsonMessage);
    }, 500);

    await testCase;

    ioClientA.disconnect();
    ioClientB.disconnect();
  });
});
