import type { Server } from 'node:http';
import { WebSocketServer } from '@infra/websocket';
import { WebSocket } from '@domain/models';

export function connectWS(server: Server) {
	const ws = new WebSocketServer(server);

	ws.on('connection', onConnection(ws));
}

function onConnection(ws: WebSocketServer) {
	return (socket: WebSocket) => {
		socket.join('global');
		socket.emit('connect', socket.id);

		socket.on('message', (message) => {
			ws.emit(['global'], 'message', message);
		});

		socket.on('disconnect', () => {
			// ...
		});
	};
}
