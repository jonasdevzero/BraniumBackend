import { inject, injectable } from '@container';
import { GetFileUrlProvider, ListProfilesRepository } from '@data/protocols';
import { ListProfilesDTO, ListProfilesResultDTO } from '@domain/dtos/profile';
import { ListProfiles } from '@domain/use-cases/profile';

@injectable()
export class DbListProfiles implements ListProfiles {
	constructor(
		@inject('ListProfilesRepository')
		private readonly listProfilesRepository: ListProfilesRepository,

		@inject('GetFileUrlProvider')
		private readonly getFileUrlProvider: GetFileUrlProvider
	) {}

	async list(data: ListProfilesDTO): Promise<ListProfilesResultDTO> {
		const profiles = await this.listProfilesRepository.list(data);

		await Promise.all(
			profiles.content.map(async (profile) => {
				if (!profile.image) return;

				const url = await this.getFileUrlProvider.get(profile.image);
				Object.assign(profile, { image: url });
			})
		);

		return profiles;
	}
}
