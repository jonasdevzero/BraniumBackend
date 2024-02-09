import { inject, injectable } from '@container';
import {
	EditMessageRepository,
	FindMessageByIdRepository,
} from '@data/protocols';
import { EditMessageDTO } from '@domain/dtos/message';
import { EditMessage } from '@domain/use-cases/message';
import { NotAuthorizedError, NotFoundError } from '@presentation/errors';

@injectable()
export class DbEditMessage implements EditMessage {
	constructor(
		@inject('FindMessageByIdRepository')
		private readonly findMessageByIdRepository: FindMessageByIdRepository,

		@inject('EditMessageRepository')
		private readonly editMessageRepository: EditMessageRepository
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
	}
}
