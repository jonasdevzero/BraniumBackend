import { inject, injectable } from '@container';
import {
	EditMessageRepository,
	FindMessageByIdRepository,
} from '@data/protocols';
import { EditContactMessageDTO } from '@domain/dtos/contact';
import { EditContactMessage } from '@domain/use-cases/contact/message';
import { NotAuthorizedError, NotFoundError } from '@presentation/errors';

@injectable()
export class DbEditContactMessage implements EditContactMessage {
	constructor(
		@inject('FindMessageByIdRepository')
		private readonly findMessageByIdRepository: FindMessageByIdRepository,

		@inject('EditMessageRepository')
		private readonly editMessageRepository: EditMessageRepository
	) {}

	async edit(data: EditContactMessageDTO): Promise<void> {
		const { messageId, profileId } = data;

		const message = await this.findMessageByIdRepository.find(messageId);

		if (!message) {
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
