import { inject, injectable } from '@container';
import {
	CreateMessageRepository,
	ExistsContactMessageRepository,
	GetFileUrlProvider,
	LoadContactRepository,
	LoadMessageRepository,
	UploadFileProvider,
	WebSocketServer,
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
		private readonly createMessageRepository: CreateMessageRepository,

		@inject('LoadMessageRepository')
		private readonly loadMessageRepository: LoadMessageRepository,

		@inject('GetFileUrlProvider')
		private readonly getFileUrlProvider: GetFileUrlProvider,

		@inject('WebSocketServer')
		private readonly ws: WebSocketServer
	) {}

	async create(data: CreateContactMessageDTO): Promise<void> {
		await this.validateAll(data);
		const messageId = await this.createMessage(data);

		await this.emitMessage(messageId, data.receiver.id, data.sender.id);
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

		return this.createMessageRepository.create(message);
	}

	private async emitMessage(
		messageId: string,
		userId: string,
		contactId: string
	) {
		const message = await this.loadMessageRepository.load({
			messageId,
			userId,
		});

		if (!message) return;

		if (message.sender.image) {
			const url = await this.getFileUrlProvider.get(message.sender.image);
			Object.assign(message.sender, { image: url });
		}

		this.ws.emit([userId], 'contact:message:new', { contactId, message });
	}
}
