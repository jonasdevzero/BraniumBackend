import { inject, injectable } from '@container';
import {
	GetFileUrlProvider,
	ListContactMessagesRepository,
} from '@data/protocols';
import { ListContactMessagesDTO } from '@domain/dtos/contact';
import { LoadedMessage } from '@domain/models';
import { ListContactMessages } from '@domain/use-cases/contact/message';

@injectable()
export class DbListContactMessages implements ListContactMessages {
	constructor(
		@inject('ListContactMessagesRepository')
		private readonly listContactMessagesRepository: ListContactMessagesRepository,

		@inject('GetFileUrlProvider')
		private readonly getFileUrlProvider: GetFileUrlProvider
	) {}

	async list(data: ListContactMessagesDTO): Promise<LoadedMessage[]> {
		const messages = await this.listContactMessagesRepository.list(data);

		await Promise.all(
			messages.map(async (message) => {
				await Promise.all([
					(async () => {
						if (!message.sender.image) return;

						const url = await this.getFileUrlProvider.get(
							message.sender.image as string
						);

						Object.assign(message.sender, { image: url });
					})(),
					...message.files.map(async (file) => {
						const url = await this.getFileUrlProvider.get(file.url);
						Object.assign(file, { url });
					}),
				]);
			})
		);

		return messages;
	}
}
