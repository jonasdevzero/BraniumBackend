import { inject, injectable } from '@container';
import {
	CreateProfileRepository,
	FindProfileByIdRepository,
	FindProfileByUsernameRepository,
	UploadFileProvider,
} from '@data/protocols';
import { CreateProfileDTO } from '@domain/dtos/profile';
import { CreateProfile } from '@domain/use-cases/profile';
import { BadRequestError } from '@presentation/errors';
import { FileModel } from '@presentation/protocols';

@injectable()
export class DbCreateProfile implements CreateProfile {
	constructor(
		@inject('FindProfileByIdRepository')
		private readonly findProfileByIdRepository: FindProfileByIdRepository,

		@inject('FindProfileByUsernameRepository')
		private readonly findProfileByUsernameRepository: FindProfileByUsernameRepository,

		@inject('CreateProfileRepository')
		private readonly createProfileRepository: CreateProfileRepository,

		@inject('UploadFileProvider')
		private readonly uploadFileProvider: UploadFileProvider
	) {}

	async create(data: CreateProfileDTO, image: FileModel): Promise<void> {
		const { id, username } = data;

		const [existsId, existsUsername] = await Promise.all([
			this.findProfileByIdRepository.find(id),
			this.findProfileByUsernameRepository.find(username),
		]);

		if (existsId) {
			throw new BadRequestError('Profile already created');
		}

		if (existsUsername) {
			throw new BadRequestError('Username already in use');
		}

		if (!!image) {
			const key = await this.uploadFileProvider.upload(image);
			Object.assign(data, { image: key });
		}

		await this.createProfileRepository.create(data);
	}
}
