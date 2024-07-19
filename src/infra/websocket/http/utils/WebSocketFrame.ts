export enum Opcode {
	Continuation = 0x0,
	Text = 0x1,
	Binary = 0x2,
	Close = 0x8,
	Ping = 0x9,
	Pong = 0xa,
}

export interface Frame {
	fin: boolean;
	opcode: Opcode;
	mask: boolean;
	payloadLength: number;
	payloadData: Buffer;
}

export class WebSocketFrame {
	readonly frames: Frame[];

	constructor(frames: Frame[]) {
		this.frames = frames;
	}

	get complete() {
		return this.frames.some((frame) => frame.fin);
	}

	get text() {
		let buffer = '';

		for (const frame of this.frames) {
			if (frame.opcode === Opcode.Text) buffer += frame.payloadData;
		}

		return buffer;
	}

	get close() {
		return this.frames[0].opcode === Opcode.Close;
	}
}
