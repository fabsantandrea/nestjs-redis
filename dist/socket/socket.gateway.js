"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var SocketGateway_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SocketGateway = void 0;
const common_1 = require("@nestjs/common");
const websockets_1 = require("@nestjs/websockets");
const socket_io_1 = require("socket.io");
let SocketGateway = SocketGateway_1 = class SocketGateway {
    constructor() {
        this.logger = new common_1.Logger(SocketGateway_1.name);
    }
    afterInit() {
        this.logger.log('Initialized');
    }
    async handleConnection(socket) {
        const { sockets } = this.server.sockets;
        const userId = socket.handshake.query.userId;
        if (!userId || typeof userId !== 'string') {
            socket.emit('error', {
                message: 'Connection rejected: userId is missing in query',
            });
            setTimeout(() => {
                socket.disconnect(true);
            }, 100);
            this.logger.log(`Connection rejected for client ${socket.client.conn.remoteAddress}: userId is missing in query`);
            return;
        }
        socket.join(userId);
        socket.data.userId = userId;
        this.logger.log(`Client ${socket.client.conn.remoteAddress} with userId ${userId}: connected on instance ${process.env.NODE_INSTANCE_ID}`);
        socket.on('disconnect', () => {
            socket.leave(userId);
            this.logger.log(`Client ${socket.client.conn.remoteAddress} with userId ${userId} disconnected from instance: "${process.env.NODE_INSTANCE_ID}"`);
        });
        this.logger.log(`Number of connected clients: ${sockets.size}`);
    }
    async handleDisconnect() {
        const { sockets } = this.server.sockets;
        this.logger.log(`Number of connected clients: ${sockets.size}`);
    }
    handleRefresh(socket, data) {
        const { orderForm } = data;
        const { userId } = socket.data;
        console.log(orderForm);
        socket.broadcast.to(userId).emit('refresh', { orderForm });
        this.logger.log(`Client ${socket.client.conn.remoteAddress} with userId ${userId} connected on instance ${process.env.NODE_INSTANCE_ID}: sent refresh message for orderForm ${orderForm}`);
    }
};
exports.SocketGateway = SocketGateway;
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Server)
], SocketGateway.prototype, "server", void 0);
__decorate([
    (0, websockets_1.SubscribeMessage)('refresh'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", void 0)
], SocketGateway.prototype, "handleRefresh", null);
exports.SocketGateway = SocketGateway = SocketGateway_1 = __decorate([
    (0, websockets_1.WebSocketGateway)()
], SocketGateway);
//# sourceMappingURL=socket.gateway.js.map