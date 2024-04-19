import { inject, injectable } from '@container';
import {
	EditMessageRepository,
	FindMessageByIdRepository,
	ListAllMessageUsersRepository,
	WebSocketServer,
} from '@data/protocols';
import { EditMessageDTO } from '@domain/dtos/message';
import { Message } from '@domain/models';
import { EditMessage } from '@domain/use-cases/message';
import { NotAuthorizedError, NotFoundError } from '@presentation/errors';

@injectable()
export class DbEditMessage implements EditMessage {
	constructor(
		@inject('FindMessageByIdRepository')
		private readonly findMessageByIdRepository: FindMessageByIdRepository,

		@inject('EditMessageRepository')
		private readonly editMessageRepository: EditMessageRepository,

		@inject('ListAllMessageUsersRepository')
		private readonly listAllMessageUsersRepository: ListAllMessageUsersRepository,

		@inject('WebSocketServer')
		private readonly ws: WebSocketServer
	) {}

	async edit(data: EditMessageDTO, profileId: string): Promise<void> {
		const messageId = data.id;

		const message = await this.findMessageByIdRepository.find(messageId);

		if (!message || message.deleted) {
			throw new NotFoundError('message');
		}

		if (message.senderId !== profileId) {
			throw new NotAuthorizedError('You cant edit this message');
		}

		const type = message.type !== 'TEXT' ? 'MIX' : undefined;

		await this.editMessageRepository.edit({
			id: messageId,
			message: data.message,
			type,
		});

		await this.emitEvent(message, data.message);
	}

	private async emitEvent(message: Message, editedText?: string) {
		const users = await this.listAllMessageUsersRepository.list(message.id);

		if (!users.length) return;

		this.ws.emit(users, 'message:edit', {
			messageId: message.id,
			text: editedText || '',
			updatedAt: new Date(),
		});
	}
}
