export interface WebSocket {
	id: string;
	sessionId: string;

	on(event: string, fn: SocketFn): void;
	once(event: string, fn: SocketFn): void;

	emit(event: string, ...args: unknown[]): void;

	join(room: string): void;
	leave(room: string): void;
}

export type SocketFn = (...args: unknown[]) => void;

export type SocketEvent = 'connection';
