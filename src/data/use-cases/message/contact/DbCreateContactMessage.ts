import { inject, injectable } from '@container';
import {
	CreateMessageRepository,
	ExistsContactMessageRepository,
	LoadContactRepository,
	UploadFileProvider,
} from '@data/protocols';
import { CreateContactMessageDTO } from '@domain/dtos/message/contact';
import { CreateMessageDTO } from '@domain/dtos/message';
import { CreateContactMessage } from '@domain/use-cases/message/contact';
import {
	BadRequestError,
	NotAuthorizedError,
	NotFoundError,
} from '@presentation/errors';

@injectable()
export class DbCreateContactMessage implements CreateContactMessage {
	constructor(
		@inject('LoadContactRepository')
		private readonly loadContactRepository: LoadContactRepository,

		@inject('ExistsContactMessageRepository')
		private readonly existsContactMessageRepository: ExistsContactMessageRepository,

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
		await Promise.all([this.validateContact(data), this.validateReply(data)]);
	}

	private validateType(data: CreateContactMessageDTO) {
		const { type, message, files } = data;

		const isNotText =
			['TEXT', 'MIX'].includes(type) && typeof message !== 'string';

		const isNotFile =
			['FILE', 'IMAGE', 'AUDIO', 'VIDEO'].includes(type) &&
			(typeof message === 'string' || !files.length);

		const hasNoContent = typeof message == 'undefined' && files.length === 0;

		if (isNotText || isNotFile || hasNoContent) {
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

		Object.assign(sender, { contactId: receiver.id });
		Object.assign(receiver, { contactId: sender.id });
	}

	private async validateReply(data: CreateContactMessageDTO) {
		const { replyId, sender, receiver } = data;

		if (!replyId) return;

		const exists = await this.existsContactMessageRepository.exists({
			messageId: replyId,
			userId: sender.id,
			contactId: receiver.id,
		});

		if (!exists) {
			throw new NotFoundError('reply message');
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
