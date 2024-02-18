import {
	GetFileUrlProvider,
	LoadMessageRepository,
	WebSocketServer,
} from '@data/protocols';
import { EmitMessageDTO } from '@domain/dtos/message';
import { EmitMessage } from '@domain/use-cases/message';
import { inject, injectable } from '@main/container';

@injectable()
export class DbEmitMessage implements EmitMessage {
	constructor(
		@inject('LoadMessageRepository')
		private readonly loadMessageRepository: LoadMessageRepository,

		@inject('GetFileUrlProvider')
		private readonly getFileUrlProvider: GetFileUrlProvider,

		@inject('WebSocketServer')
		private readonly ws: WebSocketServer
	) {}

	async emit(data: EmitMessageDTO): Promise<void> {
		await Promise.all(data.map((message) => this.emitOne(message)));
	}

	private async emitOne(data: EmitMessageDTO[number]) {
		const { messageId, userId, ...rest } = data;

		const message = await this.loadMessageRepository.load({
			messageId,
			userId,
		});

		if (!message) return;

		if (message.sender.image) {
			const url = await this.getFileUrlProvider.get(message.sender.image);
			Object.assign(message.sender, { image: url });
		}

		this.ws.emit([userId], 'message:new', { message, ...rest });
	}
}
