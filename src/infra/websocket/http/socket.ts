import { SocketFn, WebSocket } from '@domain/models';
import { Duplex } from 'node:stream';
import { kRooms, kSocketEvents, kSocketRooms } from './config';
import { constructFrame } from '../../../../temp/code/frame';
import { WebsocketServerHttpAdapter } from './server';
import { randomUUID } from 'node:crypto';

export class Socket implements WebSocket {
	#server;
	raw: Duplex;
	id: string;
	sessionId = randomUUID();
	[kSocketEvents] = new Map();
	[kSocketRooms]: string[] = [];

	constructor(raw: Duplex, server: WebsocketServerHttpAdapter, id: string) {
		this.raw = raw;
		this.#server = server;
		this.id = id;
	}

	on(event: string, fn: SocketFn) {
		this[kSocketEvents].set(event, fn);
		return this;
	}

	once(event: string, fn: SocketFn) {
		this[kSocketEvents].set(event, (...args: unknown[]) => {
			fn(...args);
			this[kSocketEvents].delete(event);
		});

		return this;
	}

	emit(event: string, ...args: unknown[]) {
		args = args.map((m, i) => {
			if (typeof m == 'function') {
				const callbackEvent = `${event}::callback:${i}`;
				this.once(callbackEvent, (message: unknown) => m(message));
				return callbackEvent;
			}

			return m;
		});

		const data = constructFrame({ event, message: args });

		this.raw.write(data);
		return this;
	}

	join(room: string) {
		const usersOnRoom = this.#server[kRooms].get(room) ?? new Map();
		usersOnRoom.set(this.sessionId, this);
		this.#server[kRooms].set(room, usersOnRoom);

		this[kSocketRooms].filter((r) => r !== room).push(room);

		return this;
	}

	leave(room: string) {
		const usersOnRoom = this.#server[kRooms].get(room);
		usersOnRoom ? usersOnRoom.delete(this.sessionId) : null;
		this.#server[kRooms].set(room, usersOnRoom);

		this[kSocketRooms].filter((r) => r !== room);

		return this;
	}
}
