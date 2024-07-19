import { Frame, WebSocketFrame } from './WebSocketFrame';

export class WebSocketFrameParser {
	private buffer: Buffer;
	private offset: number;

	constructor() {
		this.buffer = Buffer.alloc(0);
		this.offset = 0;
	}

	parse(data: Buffer): WebSocketFrame {
		this.buffer = Buffer.concat([this.buffer, data]);
		const frames: Frame[] = [];

		while (this.offset < this.buffer.length) {
			const frame = this.parseFrame();

			if (frame) frames.push(frame);
			else break;
		}
		const webSocketFrame = new WebSocketFrame(frames);

		this.offset = 0;
		if (webSocketFrame.complete) this.buffer = Buffer.alloc(0);

		return webSocketFrame;
	}

	private parseFrame(): Frame | null {
		if (this.buffer.length < 2) {
			return null; // Incomplete frame
		}

		const firstByte = this.buffer.readUInt8(this.offset++);
		const fin = (firstByte & 0x80) !== 0;
		const opcode = firstByte & 0x0f;

		const secondByte = this.buffer.readUInt8(this.offset++);
		const mask = (secondByte & 0x80) !== 0;
		let payloadLength = secondByte & 0x7f;

		if (payloadLength === 126) {
			if (this.buffer.length < this.offset + 2) {
				return null; // Incomplete frame
			}

			payloadLength = this.buffer.readUInt16BE(this.offset);
			this.offset += 2;
		} else if (payloadLength === 127) {
			if (this.buffer.length < this.offset + 8) {
				return null; // Incomplete frame
			}

			payloadLength =
				this.buffer.readUInt32BE(this.offset + 4) * Math.pow(2, 32) +
				this.buffer.readUInt32BE(this.offset);

			this.offset += 8;
		}

		let maskingKey: Buffer | undefined;

		if (mask) {
			if (this.buffer.length < this.offset + 4) {
				return null; // Incomplete frame
			}

			maskingKey = this.buffer.slice(this.offset, this.offset + 4);
			this.offset += 4;
		}

		if (this.buffer.length < this.offset + payloadLength) {
			return null; // Incomplete frame
		}

		const payloadData = this.buffer.slice(
			this.offset,
			this.offset + payloadLength
		);

		if (maskingKey) {
			for (let i = 0; i < payloadLength; i++) {
				payloadData[i] ^= maskingKey[i % 4];
			}
		}

		this.offset += payloadLength;

		return { fin, opcode, mask, payloadLength, payloadData };
	}
}
