import type { Server } from 'node:http';
import { WebSocketServer } from '@data/protocols';
import { WebSocket } from '@domain/models';
import { container } from './container';
import { Call } from '@domain/types';

export function connectWS(server: Server) {
	const ws = container.get<WebSocketServer>('WebSocketServer');

	if (!ws) {
		throw new Error('WebSocket Server not injected');
	}

	ws.initialize(server);

	ws.on('connection', onConnection(ws));
}

function onConnection(ws: WebSocketServer) {
	return (socket: WebSocket) => {
		socket.join(socket.id);

		socket.on('call:start', ({ connection, media }: Call.Start) => {
			ws.emit([connection.id], 'call:income', {
				from: socket.id,
				media,
				signal: connection.signal,
			});
		});

		socket.on('call:cancel', (users: string[]) => {
			for (const id of users) {
				ws.emit([id], 'call:canceled', socket.id);
			}
		});

		socket.on('call:accept', ({ id, signal }: Call.Connection) =>
			ws.emit([id], 'call:accepted', { id: socket.id, signal })
		);

		socket.on('call:decline', (to: string) =>
			ws.emit([to], 'call:declined', socket.id)
		);

		socket.on('call:list-users', ({ id, users }: Call.ListUsers) => {
			ws.emit([id], 'call:list-users', { id: socket.id, users });
		});

		socket.on('call:connect', ({ id, signal }: Call.Connection) => {
			ws.emit([id], 'call:connection', { id: socket.id, signal });
		});

		socket.on('call:ice-candidate', ({ id, candidate }: Call.IceCandidate) =>
			ws.emit([id], 'call:ice-candidate', { id: socket.id, candidate })
		);

		socket.on('call:leave', (users: string[]) => {
			ws.emit(users, 'call:leave', socket.id);
		});

		socket.on('disconnect', () => socket.leave(socket.id));
	};
}
