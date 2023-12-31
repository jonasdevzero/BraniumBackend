import { SocketFn, WebSocket } from '@domain/models';
import { randomUUID } from 'node:crypto';
import { Duplex } from 'node:stream';
import { kRooms, kSocketEvents, kSocketRooms } from './config';
import { constructFrame } from './helpers/frame';
import { WebsocketServerHttpAdapter } from './server';

export class Socket implements WebSocket {
	#server;
	raw: Duplex;
	id = randomUUID();
	[kSocketEvents] = new Map();
	[kSocketRooms]: string[] = [];

	constructor(raw: Duplex, server: WebsocketServerHttpAdapter) {
		this.raw = raw;
		this.#server = server;
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
		usersOnRoom.set(this.id, this);
		this.#server[kRooms].set(room, usersOnRoom);

		this[kSocketRooms].filter((r) => r !== room).push(room);

		return this;
	}

	leave(room: string) {
		const usersOnRoom = this.#server[kRooms].get(room);
		usersOnRoom ? usersOnRoom.delete(this.id) : null;
		this.#server[kRooms].set(room, usersOnRoom);

		this[kSocketRooms].filter((r) => r !== room);

		return this;
	}
}
