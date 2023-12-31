import { WebSocketServer } from '@data/protocols';
import { SocketEvent, WebSocket } from '@domain/models';
import crypto from 'node:crypto';
import Event from 'node:events';
import http from 'node:http';
import type { Duplex } from 'node:stream';
import { kRooms, kSocketEvents, kSocketRooms } from './config';
import { constructFrame, parseFrame } from './helpers/frame';
import { Socket } from './socket';

export class WebsocketServerHttpAdapter implements WebSocketServer {
	#event = new Event();
	#users = new Map();
	[kRooms] = new Map();

	constructor(server: http.Server) {
		this.#initialize(server);
	}

	#initialize(server: http.Server) {
		server.on('upgrade', (req, socket) => {
			if (req.headers['upgrade'] !== 'websocket') {
				socket.end('HTTP/1.1 400 Bad Request');
				return;
			}

			const headers = this.#authHandshake(req, socket);
			if (!headers) return;

			socket.write(headers);
			this.#onConnection(socket);
		});
	}

	#authHandshake(req: http.IncomingMessage, socket: Duplex) {
		const protocol = req.headers['sec-websocket-protocol']?.split(', ')[0];
		const version = Number(req.headers['sec-websocket-version']) ?? 0;
		const key = req.headers['sec-websocket-key'];

		if (version < 13 || protocol !== 'chat') {
			socket.end('HTTP/1.1 400 Bad Request');
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

		return headers;
	}

	#onConnection(rawSocket: Duplex) {
		const socket = new Socket(rawSocket, this);

		rawSocket.on('data', this.#onSocketData(socket));
		rawSocket.on('error', this.#onSocketError(socket));
		rawSocket.on('end', this.#onSocketEnd(socket));

		this.#event.emit('connection', socket);
	}

	#onSocketData(socket: Socket) {
		return (frame: Buffer) => {
			try {
				const data = parseFrame(frame);

				if (!data) return;

				let { event, message } = JSON.parse(data);

				message = message.map((argument: any, i: number) =>
					argument == `${event}::callback:${i}`
						? (...args: unknown[]) => socket.emit(argument, ...args)
						: argument
				);

				this.#execEvent(socket, event, message);
			} catch (error) {
				console.error('Wrong event format!!', '\n', error);
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
			this.#users.delete(socket.id);
			this.#execEvent(socket, 'disconnect');
			this.#socketExitRooms(socket);
			socket.raw.end();
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

	#broadCast(target: string, data: Uint8Array) {
		const room = this[kRooms].get(target);

		for (const [_, user] of room) {
			user.raw.write(data);
		}
	}

	on(event: SocketEvent, fn: (socket: WebSocket) => void): void {
		this.#event.on(event, fn);
	}

	emit(to: string[], event: string, ...args: unknown[]): void {
		const data = constructFrame({ event, message: args });

		for (const target of to) {
			const user = this.#users.get(target);
			user ? user.raw.write(data) : this.#broadCast(target, data);
		}
	}
}