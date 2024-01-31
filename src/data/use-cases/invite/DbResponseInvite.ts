import { inject, injectable } from '@container';
import {
	CreateContactRepository,
	DeleteInviteRepository,
	FindInviteByIdRepository,
	GetFileUrlProvider,
	WebSocketServer,
} from '@data/protocols';
import { ResponseInviteDTO } from '@domain/dtos/invite';
import { ResponseInvite } from '@domain/use-cases/invite';
import { NotAuthorizedError, NotFoundError } from '@presentation/errors';

@injectable()
export class DbResponseInvite implements ResponseInvite {
	constructor(
		@inject('FindInviteByIdRepository')
		private readonly findInviteByIdRepository: FindInviteByIdRepository,

		@inject('DeleteInviteRepository')
		private readonly deleteInviteRepository: DeleteInviteRepository,

		@inject('CreateContactRepository')
		private readonly createContactRepository: CreateContactRepository,

		@inject('GetFileUrlProvider')
		private readonly getFileUrlProvider: GetFileUrlProvider,

		@inject('WebSocketServer')
		private readonly ws: WebSocketServer
	) {}

	async response(data: ResponseInviteDTO): Promise<void> {
		const { inviteId, profileId, accept } = data;

		const invite = await this.findInviteByIdRepository.find(inviteId);

		if (!invite) {
			throw new NotFoundError('Invite');
		}

		if (invite.receiverId !== profileId) {
			throw new NotAuthorizedError('This invite is not your');
		}

		if (!accept) {
			await this.deleteInviteRepository.delete(inviteId);
			return;
		}

		const [contacts] = await Promise.all([
			this.createContactRepository.create([
				{ userId: invite.senderId, contactId: invite.receiverId },
				{ userId: invite.receiverId, contactId: invite.senderId },
			]),
			this.deleteInviteRepository.delete(inviteId),
		]);

		await Promise.all(
			contacts.map(async (contact) => {
				if (contact.image) {
					const url = await this.getFileUrlProvider.get(contact.image);
					Object.assign(contact, { image: url });
				}

				const to =
					invite.senderId === contact.id ? invite.receiverId : invite.senderId;

				this.ws.emit([to], 'contact:new', contact);
			})
		);
	}
}
