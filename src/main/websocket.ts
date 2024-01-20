import type { Server } from 'node:http';
import { WebSocketServer } from '@data/protocols';
import { WebSocket } from '@domain/models';
import { container } from './container';

export function connectWS(server: Server) {
	const ws = container.get<WebSocketServer>('WebSocketServer');

	if (!ws) {
		throw new Error('WebSocket Server not injected');
	}

	ws.initialize(server);

	ws.on('connection', onConnection());
}

function onConnection() {
	return (socket: WebSocket) => {
		socket.join(socket.id);

		socket.on('disconnect', () => socket.leave(socket.id));
	};
}
