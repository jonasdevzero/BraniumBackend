import { inject, injectable } from '@container';
import {
	CreateMessageRepository,
	LoadContactRepository,
	UploadFileProvider,
} from '@data/protocols';
import { CreateContactMessageDTO } from '@domain/dtos/contact';
import { CreateMessageDTO } from '@domain/dtos/message';
import { CreateContactMessage } from '@domain/use-cases/contact/message';
import { BadRequestError, NotAuthorizedError } from '@presentation/errors';

@injectable()
export class DbCreateContactMessage implements CreateContactMessage {
	constructor(
		@inject('LoadContactRepository')
		private readonly loadContactRepository: LoadContactRepository,

		@inject('UploadFileProvider')
		private readonly uploadFileProvider: UploadFileProvider,

		@inject('CreateMessageRepository')
		private readonly createMessageRepository: CreateMessageRepository
	) {}

	async create(data: CreateContactMessageDTO): Promise<void> {
		await this.validateAll(data);
		await this.createMessage(data);
	}

	private async validateAll(data: CreateContactMessageDTO) {
		this.validateType(data);
		this.validateFiles(data);
		await this.validateContact(data);
	}

	private validateType(data: CreateContactMessageDTO) {
		const { type, message } = data;

		const isNotText =
			['TEXT', 'MIX'].includes(type) && typeof message !== 'string';

		const isNotFile =
			['FILE', 'IMAGE', 'AUDIO', 'VIDEO'].includes(type) &&
			typeof message === 'string';

		if (isNotText || isNotFile) {
			throw new BadRequestError('Invalidate message type');
		}
	}

	private validateFiles(data: CreateContactMessageDTO) {
		const { files, sender, receiver } = data;

		if (!files.length) return;

		for (const file of files) {
			const hasSender = file.users.some((u) => u.id === sender.id);
			const hasReceiver = file.users.some((u) => u.id === receiver.id);

			if (!hasSender || !hasReceiver) {
				throw new BadRequestError('Invalid file users');
			}
		}
	}

	private async validateContact(data: CreateContactMessageDTO) {
		const { sender, receiver } = data;

		const contact = await this.loadContactRepository.load({
			userId: sender.id,
			contactId: receiver.id,
		});

		if (!contact) {
			throw new NotAuthorizedError('You are not contacts');
		}

		if (contact.blocked) {
			throw new BadRequestError('This contact blocked you');
		}

		if (contact.youBlocked) {
			throw new BadRequestError('You blocked this contact');
		}
	}

	private async createMessage(data: CreateContactMessageDTO) {
		const { sender, receiver, files, ...rest } = data;

		const uploadedFiles = await Promise.all(
			files.map(async (f) => {
				const { file, type, users } = f;

				const key = await this.uploadFileProvider.upload(file);

				return { key, type, users };
			})
		);

		const message: CreateMessageDTO = {
			senderId: sender.id,
			...rest,
			users: [sender, receiver],
			files: uploadedFiles,
		};

		await this.createMessageRepository.create(message);
	}
}
