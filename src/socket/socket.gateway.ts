import { Logger } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { SocketRefreshPayload } from './socket.constant';

@WebSocketGateway()
export class SocketGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  private readonly logger = new Logger(SocketGateway.name);
  @WebSocketServer()
  server: Server;

  afterInit() {
    this.logger.log('Initialized');
  }

  async handleConnection(socket: Socket) {
    const { sockets } = this.server.sockets;
    const userId = socket.handshake.query.userId;

    if (!userId || typeof userId !== 'string') {
      socket.emit('error', {
        message: 'Connection rejected: userId is missing in query',
      });

      setTimeout(() => {
        socket.disconnect(true);
      }, 100);

      this.logger.log(
        `Connection rejected for client ${socket.client.conn.remoteAddress}: userId is missing in query`,
      );
      return;
    }

    socket.join(userId);
    socket.data.userId = userId;

    this.logger.log(
      `Client ${socket.client.conn.remoteAddress} with userId ${userId}: connected on instance ${process.env.NODE_INSTANCE_ID}`,
    );

    socket.on('disconnect', () => {
      socket.leave(userId);
      this.logger.log(
        `Client ${socket.client.conn.remoteAddress} with userId ${userId} disconnected from instance: "${process.env.NODE_INSTANCE_ID}"`,
      );
    });

    this.logger.log(`Number of connected clients: ${sockets.size}`);
  }

  async handleDisconnect() {
    const { sockets } = this.server.sockets;
    this.logger.log(`Number of connected clients: ${sockets.size}`);
  }

  @SubscribeMessage('refresh')
  handleRefresh(
    @ConnectedSocket() socket: Socket,
    @MessageBody() data: SocketRefreshPayload,
  ): void {
    const { orderForm } = data;
    const { userId } = socket.data;

    console.log(orderForm)
    socket.broadcast.to(userId).emit('refresh', { orderForm });

    this.logger.log(
      `Client ${socket.client.conn.remoteAddress} with userId ${userId} connected on instance ${process.env.NODE_INSTANCE_ID}: sent refresh message for orderForm ${orderForm}`,
    );
  }
}
