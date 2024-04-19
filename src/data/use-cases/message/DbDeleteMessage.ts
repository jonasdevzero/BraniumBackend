import { inject, injectable } from '@container';
import {
	DeleteFileProvider,
	DeleteMessageFileUserRepository,
	DeleteMessageRepository,
	DeleteMessageUserRepository,
	ExistsMessageUserRepository,
	FindMessageByIdRepository,
	ListAllMessageUsersRepository,
	ListMessageFilesRepository,
	WebSocketServer,
} from '@data/protocols';
import { MessageFile } from '@domain/models';
import { DeleteMessage } from '@domain/use-cases/message';
import { NotAuthorizedError, NotFoundError } from '@presentation/errors';

@injectable()
export class DbDeleteMessage implements DeleteMessage {
	constructor(
		@inject('FindMessageByIdRepository')
		private readonly findMessageByIdRepository: FindMessageByIdRepository,

		@inject('ListMessageFilesRepository')
		private readonly listMessageFilesRepository: ListMessageFilesRepository,

		@inject('DeleteMessageRepository')
		private readonly deleteMessageRepository: DeleteMessageRepository,

		@inject('DeleteMessageUserRepository')
		private readonly deleteMessageUserRepository: DeleteMessageUserRepository,

		@inject('DeleteMessageFileUserRepository')
		private readonly deleteMessageFileUserRepository: DeleteMessageFileUserRepository,

		@inject('DeleteFileProvider')
		private readonly deleteFileProvider: DeleteFileProvider,

		@inject('ListAllMessageUsersRepository')
		private readonly listAllMessageUsersRepository: ListAllMessageUsersRepository,

		@inject('WebSocketServer')
		private readonly ws: WebSocketServer
	) {}

	async delete(profileId: string, messageId: string): Promise<void> {
		const [message, users, files] = await Promise.all([
			this.findMessageByIdRepository.find(messageId),
			this.listAllMessageUsersRepository.list(messageId),
			this.listMessageFilesRepository.list(messageId),
		]);

		if (!message || message.deleted) {
			throw new NotFoundError('message');
		}

		const existsUserMessage = users.some((id) => profileId === id);

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

			this.ws.emit([profileId], 'message:delete', messageId);

			return;
		}

		await this.deleteMessageRepository.delete(messageId);
		Promise.all([this.deleteFiles(files), this.emitEvent(messageId, users)]);
	}

	private async deleteFiles(files: MessageFile[]) {
		await Promise.all(
			files.map((file) => this.deleteFileProvider.delete(file.key))
		);
	}

	private async emitEvent(messageId: string, users: string[]) {
		if (!users.length) return;

		this.ws.emit(users, 'message:delete', messageId);
	}
}
