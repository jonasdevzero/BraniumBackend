import { inject, injectable } from '@container';
import {
	DeleteFileProvider,
	DeleteMessageFileUserRepository,
	DeleteMessageRepository,
	DeleteMessageUserRepository,
	ExistsMessageUserRepository,
	FindMessageByIdRepository,
	ListMessageFilesRepository,
} from '@data/protocols';
import { MessageFile } from '@domain/models';
import { DeleteMessage } from '@domain/use-cases/message';
import { NotAuthorizedError, NotFoundError } from '@presentation/errors';

@injectable()
export class DbDeleteMessage implements DeleteMessage {
	constructor(
		@inject('FindMessageByIdRepository')
		private readonly findMessageByIdRepository: FindMessageByIdRepository,

		@inject('ExistsMessageUserRepository')
		private readonly existsMessageUserRepository: ExistsMessageUserRepository,

		@inject('ListMessageFilesRepository')
		private readonly listMessageFilesRepository: ListMessageFilesRepository,

		@inject('DeleteMessageRepository')
		private readonly deleteMessageRepository: DeleteMessageRepository,

		@inject('DeleteMessageUserRepository')
		private readonly deleteMessageUserRepository: DeleteMessageUserRepository,

		@inject('DeleteMessageFileUserRepository')
		private readonly deleteMessageFileUserRepository: DeleteMessageFileUserRepository,

		@inject('DeleteFileProvider')
		private readonly deleteFileProvider: DeleteFileProvider
	) {}

	async delete(profileId: string, messageId: string): Promise<void> {
		const [message, existsUserMessage, files] = await Promise.all([
			this.findMessageByIdRepository.find(messageId),
			this.existsMessageUserRepository.exists({ messageId, userId: profileId }),
			this.listMessageFilesRepository.list(messageId),
		]);

		if (!message || message.deleted) {
			throw new NotFoundError('message');
		}

		if (!existsUserMessage) {
			throw new NotAuthorizedError('You cant delete this message');
		}

		if (message.senderId !== profileId) {
			await Promise.all([
				this.deleteMessageUserRepository.delete({
					messageId,
					userId: profileId,
				}),
				...files.map((file) =>
					this.deleteMessageFileUserRepository.delete({
						userId: profileId,
						fileId: file.id,
					})
				),
			]);

			return;
		}

		await this.deleteMessageRepository.delete(messageId);
		this.deleteFiles(files);
	}

	private async deleteFiles(files: MessageFile[]) {
		await Promise.all(
			files.map((file) => this.deleteFileProvider.delete(file.key))
		);
	}
}
