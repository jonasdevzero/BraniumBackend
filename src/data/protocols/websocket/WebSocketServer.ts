import { Server } from 'node:http';
import { SocketEvent, WebSocket } from '@domain/models';
import { WebSocketEmitEvents } from './events';

export interface WebSocketServer {
	initialize(server: Server): void;
	on(event: SocketEvent, fn: (socket: WebSocket) => void): void;
	emit<K extends keyof WebSocketEmitEvents>(
		to: string[],
		event: K,
		data: WebSocketEmitEvents[K]
	): void;
}
