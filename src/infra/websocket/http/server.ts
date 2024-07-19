import { WebSocketServer } from '@data/protocols';
import { SocketEvent, WebSocket } from '@domain/models';
import crypto from 'node:crypto';
import Event from 'node:events';
import http from 'node:http';
import type { Duplex } from 'node:stream';
import { authenticateConnection } from './authentication';
import { kRooms, kSocketEvents, kSocketRooms } from './config';
import { Socket } from './socket';
import { Opcode, WebSocketFrameBuilder, WebSocketFrameParser } from './utils';

export class WebsocketServerHttpAdapter implements WebSocketServer {
	#event = new Event();
	[kRooms] = new Map();

	initialize(server: http.Server) {
		server.on('upgrade', async (req, socket) => {
			if (req.headers['upgrade'] !== 'websocket') {
				socket.end('HTTP/1.1 400 Bad Request');
				return;
			}

			const auth = await this.#authHandshake(req, socket);
			if (!auth) return;

			const { headers, userId } = auth;

			socket.write(headers);
			this.#onConnection(socket, userId);
		});
	}

	async #authHandshake(req: http.IncomingMessage, socket: Duplex) {
		const protocol = req.headers['sec-websocket-protocol']?.split(', ')[0];
		const version = Number(req.headers['sec-websocket-version']) ?? 0;
		const key = req.headers['sec-websocket-key'];

		if (version < 13 || protocol !== 'chat') {
			socket.end('HTTP/1.1 400 Bad Request');
			return;
		}

		const cookie = req.headers['cookie'];

		if (!cookie) {
			socket.end('HTTP/1.1 401 Cookie header is required');
			return;
		}

		const cookies = cookie.split('; ').map((c) => c.split('='));
		const access = cookies.find(([name]) => name === 'access');

		if (!access) {
			socket.end('HTTP/1.1 401 Unauthorized');
			return;
		}

		const userId = await authenticateConnection(access[1]);

		if (!userId) {
			socket.end('HTTP/1.1 401 Unauthorized');
			return;
		}

		const accept = crypto
			.createHash('sha1')
			.update(key + '258EAFA5-E914-47DA-95CA-C5AB0DC85B11')
			.digest('base64');

		const headers = [
			'HTTP/1.1 101 Web Socket Protocol Handshake',
			'Upgrade: WebSocket',
			'Connection: Upgrade',
			'Sec-Websocket-Protocol: ' + protocol,
			'Sec-Websocket-Accept: ' + accept,
			'',
		]
			.map((line) => line.concat('\r\n'))
			.join('');

		return { headers, userId };
	}

	#onConnection(rawSocket: Duplex, userId: string) {
		const socket = new Socket(rawSocket, this, userId);

		rawSocket.on('data', this.#onSocketData(socket));
		rawSocket.on('error', this.#onSocketError(socket));
		rawSocket.on('end', this.#onSocketEnd(socket));

		this.#event.emit('connection', socket);
	}

	#onSocketData(socket: Socket) {
		const parser = new WebSocketFrameParser();

		return (buffer: Buffer) => {
			try {
				const webSocketFrame = parser.parse(buffer);

				if (!webSocketFrame.complete) return;

				if (webSocketFrame.close) {
					socket.raw.end();
					return;
				}

				const payload = webSocketFrame.text;

				const { event, message } = JSON.parse(payload);

				const processedMessage = message.map((argument: any, i: number) =>
					argument === `${event}::callback:${i}`
						? (...args: unknown[]) => socket.emit(argument, ...args)
						: argument
				);

				this.#execEvent(socket, event, processedMessage);
			} catch (error) {
				console.log('error', error);
			}
		};
	}

	#onSocketError(socket: Socket) {
		return (err: any) => {
			if (err?.code === 'ECONNRESET') {
				this.#onSocketEnd(socket)();
			}

			// ...
		};
	}

	#onSocketEnd(socket: Socket) {
		return () => {
			this.#execEvent(socket, 'disconnect');
			this.#socketExitRooms(socket);
		};
	}

	#execEvent(socket: Socket, event: string, message: unknown[] = []) {
		const eventFunction = socket[kSocketEvents].get(event) || function () {};
		eventFunction(...message);
	}

	#socketExitRooms(socket: Socket) {
		const rooms = socket[kSocketRooms];

		for (const room of rooms) {
			const usersOnRoom = this[kRooms].get(room);
			usersOnRoom ? usersOnRoom.delete(socket.id) : null;
			this[kRooms].set(room, usersOnRoom);
		}
	}

	#broadCast(target: string, frame: Uint8Array) {
		const room: Map<string, Socket> = this[kRooms].get(target);

		if (!room || !room.size) return;

		for (const [_, user] of room) {
			user.raw.write(frame);
		}
	}

	on(event: SocketEvent, fn: (socket: WebSocket) => void): void {
		this.#event.on(event, fn);
	}

	emit(to: string[], event: string, ...args: unknown[]): void {
		const frame = WebSocketFrameBuilder.build({ event, message: args });

		for (const target of to) this.#broadCast(target, frame);
	}
}
