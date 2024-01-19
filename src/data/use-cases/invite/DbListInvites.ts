import { inject, injectable } from '@container';
import { GetFileUrlProvider, ListInvitesRepository } from '@data/protocols';
import { ListInvitesDTO, ListInvitesResultDTO } from '@domain/dtos/invite';
import { ListInvites } from '@domain/use-cases/invite';

@injectable()
export class DbListInvites implements ListInvites {
	constructor(
		@inject('ListInvitesRepository')
		private readonly listInvitesRepository: ListInvitesRepository,

		@inject('GetFileUrlProvider')
		private readonly getFileUrlProvider: GetFileUrlProvider
	) {}

	async list(data: ListInvitesDTO): Promise<ListInvitesResultDTO> {
		const invites = await this.listInvitesRepository.list(data);

		await Promise.all(
			invites.content.map(async (invite) => {
				if (!invite.sender.image) return;

				const url = await this.getFileUrlProvider.get(invite.sender.image);
				Object.assign(invite.sender, { image: url });
			})
		);

		return invites;
	}
}
