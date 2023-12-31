import { SocketEvent, WebSocket } from '@domain/models';

export interface WebSocketServer {
	on(event: SocketEvent, fn: (socket: WebSocket) => void): void;
	emit(to: string[], event: string, ...args: unknown[]): void;
}
