import { inject, injectable } from '@container';
import { CountInvitesRepository } from '@data/protocols';
import { CountInvites } from '@domain/use-cases/invite';

@injectable()
export class DbCountInvites implements CountInvites {
	constructor(
		@inject('CountInvitesRepository')
		private readonly countInvitesRepository: CountInvitesRepository
	) {}

	async count(profileId: string): Promise<number> {
		return await this.countInvitesRepository.count(profileId);
	}
}
