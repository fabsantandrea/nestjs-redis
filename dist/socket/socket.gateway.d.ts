import { OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { SocketRefreshPayload } from './socket.constant';
export declare class SocketGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
    private readonly logger;
    server: Server;
    afterInit(): void;
    handleConnection(socket: Socket): Promise<void>;
    handleDisconnect(): Promise<void>;
    handleRefresh(socket: Socket, data: SocketRefreshPayload): void;
}
