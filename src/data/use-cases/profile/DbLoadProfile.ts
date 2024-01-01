import { inject, injectable } from '@container';
import { FindProfileByIdRepository, GetFileUrlProvider } from '@data/protocols';
import { Profile } from '@domain/models';
import { LoadProfile } from '@domain/use-cases/profile';
import { NotFoundError } from '@presentation/errors';

@injectable()
export class DbLoadProfile implements LoadProfile {
	constructor(
		@inject('FindProfileByIdRepository')
		private readonly findProfileByIdRepository: FindProfileByIdRepository,

		@inject('GetFileUrlProvider')
		private readonly getFileUrlProvider: GetFileUrlProvider
	) {}

	async load(id: string): Promise<Profile> {
		const profile = await this.findProfileByIdRepository.find(id);

		if (!profile) {
			throw new NotFoundError('profile');
		}

		if (profile.image) {
			const url = await this.getFileUrlProvider.get(profile.image);
			Object.assign(profile, { image: url });
		}

		return profile;
	}
}
